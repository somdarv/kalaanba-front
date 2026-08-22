"use client";

import Image from "next/image";

import { Avatar, StatValue } from "@/components/ui";
import { Wordmark } from "@/components/ui/wordmark";
import {
  labelFor,
  type LabelledOption,
  type Player,
  type VerifiedRecord,
} from "@/lib/api/player";
import { cn } from "@/lib/cn";

import { CARD_GRAIN, type PlayerCardPattern } from "./player-card-patterns";
import {
  featuredStatsFor,
  PlayerCardRecord,
} from "./player-card-record";
import { variantFor, type PlayerCardVariant } from "./player-card-variants";

/**
 * The player card (Player & Affiliation §15).
 *
 * §15 names what may appear here: "preferred number, primary position, club
 * badge, photo, verified appearances, goals, assists, and badges", and §13
 * lists the wider verified set — starts, minutes, yellow and red cards. This
 * shows the ones that have a source today. Nothing else: §14 keeps numeric
 * ratings out of V1, so a rating on this card would be inventing a fact rather
 * than reporting one (Constitution Law 3).
 *
 * Status strings come from the config-served label maps (ADR-0007) — the card
 * never compiles "Free agent" into the bundle.
 *
 * **Portrait format, and why.** Tall is not a style choice. It is the only
 * shape that leaves room for a standing figure beside the record (§7 reserves
 * the half-body portrait for "player card front"), and it is the shape a share
 * image wants — a 4:5 still is the tallest a chat client will show without
 * cropping it to a tap-to-open thumbnail.
 *
 * **`min-h`, not `aspect-[4/5]`.** The ratio was the first attempt and it
 * clipped the meta bar off the bottom of every card. `min-height: auto` only
 * lets a flex box grow past its preferred size while `overflow` is `visible`;
 * with `overflow-hidden` the automatic minimum is 0, so the ratio won and the
 * surplus was cut. A minimum height holds the proportion at the sizes the card
 * actually renders at and can never hide content, which on a surface whose
 * whole job is reporting a record is the property that matters.
 *
 * **`--radius-card`, not `--radius-panel`.** DESIGN_LANGUAGE §2.3 puts hero and
 * feature panels on the generous end of the shape scale at 28px and cards at
 * 20px. This is a card. It sat on the panel radius while it was a short banner
 * near the top of a page; at full height that corner reads as soft, and a
 * shareable object wants an edge with more authority.
 *
 * **Four layers under the content**, in order: gradient wash, pattern, light
 * source, grain. Each is `-z-10` and decorative. The gradient alone reads as a
 * swatch at this size; the pattern gives it a weave and the grain gives it a
 * material. See `player-card-patterns.ts`.
 *
 * **The portrait is a layer, not a column.** It is absolutely positioned and
 * masked, so the content layout is identical with it and without it. A card
 * that reflows around a photo is a card that looks broken for every player who
 * has not uploaded one, and today that is all of them: `headshot_url` is a
 * tight face crop (§7 assigns it to "small avatars, lineups, team sheets") and
 * is deliberately NOT wired in here. The slot waits for a real portrait.
 *
 * **The look is derived from the player's own key**, and the pattern comes with
 * it. Each gradient wears one chosen artwork rather than a separately hashed
 * one: a drawing that sings on the pink is not automatically right on the blue.
 */

export type PlayerCardProps = {
  player: Player;
  positions: ReadonlyArray<LabelledOption>;
  marketStatuses: ReadonlyArray<LabelledOption>;
  /** Availability label map. Omit and the meta bar drops that item. */
  availability?: ReadonlyArray<LabelledOption>;
  /**
   * Verified counters (§13). Every figure comes from a match with
   * `result_confirmed = true`. Omit on surfaces that have not read them; pass
   * an all-zero record and the band correctly renders the gate instead.
   */
  record?: VerifiedRecord | null;
  /**
   * `player.card.featured_stats` from `/players/meta`: which three counters
   * lead, keyed by position (Law 2). Absent, the card falls back to the three
   * §15 names.
   */
  featuredStats?: Record<string, ReadonlyArray<string>>;
  /**
   * Half-body portrait (§7). NOT the headshot: a face crop dropped into a slot
   * shaped for a standing figure reads as a mistake. No field feeds this yet.
   */
  portraitUrl?: string | null;
  /** Force a look. Design preview only — real cards derive it from the player. */
  variant?: PlayerCardVariant;
  /** Force a pattern. Design preview only. */
  pattern?: PlayerCardPattern;
  className?: string;
};

/**
 * The stat label style. 10px uppercase at NORMAL tracking.
 *
 * `<Eyebrow>` and the rest of the system letterspace uppercase at 0.14em, which
 * is right for a label announcing a section and wrong here: under a number, the
 * tracking pulls the word wider than the figure above it and the pair stops
 * reading as one unit. Tight and small lets the number carry the row.
 */
const CARD_LABEL =
  "text-[0.625rem] leading-none font-semibold tracking-normal uppercase";

export function PlayerCard({
  player,
  positions,
  marketStatuses,
  availability,
  record,
  featuredStats,
  portraitUrl,
  variant,
  pattern,
  className,
}: PlayerCardProps) {
  const positionLabel = labelFor(positions, player.primary_position);
  const marketLabel = labelFor(marketStatuses, player.market_status);
  const availabilityLabel = availability
    ? labelFor(availability, player.availability_status)
    : null;

  const fullName = `${player.first_name} ${player.last_name}`.trim();
  const seed = player.id ?? player.stage_name;
  const look = variant ?? variantFor(seed);
  const texture = pattern ?? look.pattern;
  const featured = featuredStatsFor(player.primary_position, featuredStats);

  // A record of zeroes is the absence of a record, not a record of nothing.
  // Three zeroes on the object a player screenshots is the exact category
  // error §13 exists to prevent.
  const hasRecord = record
    ? featured.some((key) => (record[key] ?? 0) > 0)
    : false;

  const meta = [positionLabel, marketLabel, availabilityLabel].filter(
    (label): label is string => Boolean(label),
  );

  return (
    <article
      className={cn(
        "group text-on-card rounded-card relative isolate flex min-h-[27rem] flex-col overflow-hidden sm:min-h-[30rem]",
        "shadow-[var(--shadow-md)]",
        // Deepens on hover, never moves. §3.5 is explicit that surfaces stay
        // anchored, and a shadow change says "alive" without the 1px jump that
        // sticks on touch after a tap. Tailwind v4 already wraps `hover:` in
        // `(hover: hover)`, so no manual media guard is needed.
        "transition-shadow duration-graceful ease-out motion-reduce:transition-none",
        "hover:shadow-[var(--shadow-lg)]",
        className,
      )}
      style={{ backgroundImage: look.background }}
    >
      {/* Weave. Shape from the mask, colour from currentColor, so the pattern
          names no colour of its own and sits on all three grounds. Dense
          artwork blends `soft-light` so it lifts the gradient rather than
          laying flat white over it; sparse geometry reads cleaner without. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-current"
        style={{
          maskImage: texture.mask,
          WebkitMaskImage: texture.mask,
          maskSize: texture.size,
          WebkitMaskSize: texture.size,
          maskRepeat: texture.repeat,
          WebkitMaskRepeat: texture.repeat,
          maskPosition: "center",
          WebkitMaskPosition: "center",
          mixBlendMode: texture.blend,
          opacity: texture.opacity,
        }}
      />

      {/* Light source, over the wash and under the content. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: look.glow }}
      />

      {/* Grain. Blended rather than laid on top: grain that adds its own colour
          is a grey veil, grain that modulates what is under it is a material. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-overlay"
        style={{
          backgroundImage: CARD_GRAIN.image,
          backgroundSize: CARD_GRAIN.scale,
          opacity: CARD_GRAIN.opacity,
        }}
      />

      {portraitUrl ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[72%] w-[62%]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 42%), linear-gradient(to top, transparent 0%, black 18%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 42%), linear-gradient(to top, transparent 0%, black 18%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Image
            src={portraitUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 60vw, 240px"
            className="object-contain object-bottom"
          />
        </span>
      ) : null}

      <div className="relative flex flex-1 flex-col px-5 pt-5 sm:px-6 sm:pt-6">
        {/* Head: the mark, then the number. Both identity, neither is copy. */}
        <div className="flex items-start justify-between gap-4">
          <Wordmark size="sm" className="h-5 opacity-80" />
          {player.preferred_number != null ? (
            <StatValue
              size="xl"
              className="text-on-card leading-none"
              aria-label={`Shirt number ${player.preferred_number}`}
            >
              {player.preferred_number}
            </StatValue>
          ) : null}
        </div>

        <div className="relative mt-8">
          {/* The name again at poster scale, knocked back until it is texture
              rather than text.

              Centred and growing outward from the middle, so a long name loses
              the same amount at each edge and stays symmetrical about the card
              rather than trailing off one side. Clipping is the intent, not a
              failure: `whitespace-nowrap` plus the panel's clip is also what
              stops a long name from breaking the layout. */}
          <span
            aria-hidden
            className="text-on-card/[0.09] font-display pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-[3.75rem] leading-none font-bold tracking-[-0.04em] whitespace-nowrap uppercase select-none sm:text-[4.5rem]"
          >
            {player.stage_name}
          </span>

          {/* `items-center`: the two names read as one block set against the
              avatar, which only works when their combined mass is centred on
              it. Baseline-aligned they sat low and the avatar looked dropped. */}
          <div className="relative flex items-center gap-4">
            {/* `shrink-0`. With no shrink guard the avatar is the only flexible
                thing in the row, so a long stage name squeezes it into a
                sliver. It is the player's face: it holds its size and the name
                wraps instead. */}
            <Avatar
              size="xl"
              name={player.stage_name}
              src={player.headshot_url ?? undefined}
              className="ring-on-card/40 shrink-0 shadow-[var(--shadow-sm)] ring-2"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-on-card font-display text-3xl leading-none font-bold tracking-tight break-words">
                {player.stage_name}
              </h2>
              <p className="text-on-card/80 mt- truncate text-sm">
                {fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Pushes the record to the foot of the card, so the middle breathes
            and the numbers sit where a reader's eye lands last. */}
        <div className="flex-1" aria-hidden />

        {hasRecord && record ? (
          <PlayerCardRecord
            record={record}
            featured={featured}
            labelClassName={CARD_LABEL}
          />
        ) : (
          <p className="text-on-card/75 pb-5 text-center text-sm">
            Your stats show up when a match you played in is confirmed.
          </p>
        )}
      </div>

      {meta.length > 0 ? (
        <div className="border-on-card/20 bg-on-card/[0.07] relative flex flex-wrap items-center gap-x-2 gap-y-1 border-t px-5 py-3.5 sm:px-6">
          {meta.map((label, index) => (
            <span key={label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-on-card/40">
                  ·
                </span>
              ) : null}
              <span className="text-on-card/90 text-sm font-medium">
                {label}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
