"use client";

import Image from "next/image";

import {
  type Player,
  type PositionOption,
  type VerifiedRecord,
} from "@/lib/api/player";
import { IS_SEED_ENABLED } from "@/lib/env";
import { cn } from "@/lib/cn";

import { PlayerCardAward, PlayerCardIdentity } from "./player-card-identity";
import { buildPlayerCardModel } from "./player-card-model";
import { CARD_GRAIN, type PlayerCardPattern } from "./player-card-patterns";
import { PlayerCardRecord } from "./player-card-record";
import type { CardStatLabel } from "./player-card-stats";
import type { PlayerCardVariant } from "./player-card-variants";

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
 * **Two bands, and one earned line between them.** Identity (who they are),
 * then record (what they have done), with the player-of-the-match award
 * centred in the gap. There used to be a third band at the foot repeating
 * position, market status and availability below the numbers, which put the
 * facts that decide which numbers matter after the numbers themselves.
 *
 * Market status and availability are off the card entirely now: §15 does not
 * list either, and they were bloating the name block with facts nobody reads
 * off a card. Position moved up beside the legal name, where a team sheet
 * writes it. The card ends on its record.
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
 * has not uploaded one. The headshot is separate and always has been: §7
 * assigns it to "small avatars, lineups, team sheets", which on this card is
 * the round photo beside the name.
 *
 * **The look is derived from the player's own key**, and the pattern comes with
 * it. Each gradient wears one chosen artwork rather than a separately hashed
 * one: a drawing that sings on the pink is not automatically right on the blue.
 */

export type PlayerCardProps = {
  player: Player;
  positions: ReadonlyArray<PositionOption>;
  /**
   * Verified counters (§13). Every figure comes from a match with
   * `result_confirmed = true`. Omit on surfaces that have not read them; pass
   * an all-zero record and the band correctly renders the gate instead.
   */
  record?: VerifiedRecord | null;
  /**
   * `player.card.featured_stats` from `/players/meta`: the ORDERED billing
   * priority per position key (Law 2). The lead row takes the first three the
   * player has something in, so a striker with no goals yet leads with what he
   * does have rather than with a zero. Absent, a sensible default order
   * applies. See `player-card-stats.ts`.
   */
  featuredStats?: Record<string, ReadonlyArray<string>>;
  /** `player.card.stat_labels` from `/players/meta`. Absent, defaults apply. */
  statLabels?: Record<string, Partial<CardStatLabel>>;
  /**
   * Half-body portrait (§7). NOT the headshot: a face crop dropped into a slot
   * shaped for a standing figure reads as a mistake. No field feeds this yet.
   */
  portraitUrl?: string | null;
  /**
   * Turns the photo into a control. Owner surfaces only — pass it and the
   * avatar becomes a button; omit it and the card stays presentational (§4.2),
   * which is what lets the same component render for a stranger.
   */
  onEditPhoto?: () => void;
  isPhotoPending?: boolean;
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
  record,
  featuredStats,
  statLabels,
  portraitUrl,
  onEditPhoto,
  isPhotoPending,
  variant,
  pattern,
  className,
}: PlayerCardProps) {
  const {
    look,
    texture,
    positionAbbreviation,
    lead,
    secondary,
    // A record of zeroes is the absence of a record, not a record of nothing.
    hasRecord,
    playerOfTheMatch,
  } = buildPlayerCardModel({
    player,
    positions,
    record,
    featuredStats,
    variant,
    pattern,
  });

  return (
    <article
      className={cn(
        "group text-on-card rounded-card relative isolate flex min-h-[29rem] flex-col overflow-hidden sm:min-h-[32rem]",
        "shadow-[var(--shadow-md)]",
        // Deepens on hover, never moves. §3.5 is explicit that surfaces stay
        // anchored, and a shadow change says "alive" without the 1px jump that
        // sticks on touch after a tap. Tailwind v4 already wraps `hover:` in
        // `(hover: hover)`, so no manual media guard is needed.
        "duration-graceful transition-shadow ease-out motion-reduce:transition-none",
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

      <div className="relative flex  flex-1 flex-col px-5 pt-2 pb-7 sm:px-6 sm:pt-7">
        <PlayerCardIdentity
          player={player}
          positionAbbreviation={positionAbbreviation}
          isRecordEmpty={!hasRecord}
          onEditPhoto={onEditPhoto}
          isPhotoPending={isPhotoPending}
        />

        {/* The middle. It pushes the record to the foot of the card, so the
            numbers sit where a reader's eye lands last, and it is the only
            place with air on all four sides — which is why the one earned
            badge lives here rather than crowding the mark above or being
            mistaken for a seventh statistic below.

            The minimum keeps the gap honest on a card whose content already
            fills the height, where a pure `flex-1` collapses to nothing. */}
        <div className="flex min-h-12 flex-1 items-center justify-center py-4">
          {playerOfTheMatch > 0 ? (
            <PlayerCardAward
              count={playerOfTheMatch}
              labelClassName={CARD_LABEL}
            />
          ) : null}
        </div>

        {hasRecord && record ? (
          <PlayerCardRecord
            record={record}
            lead={lead}
            secondary={secondary}
            statLabels={statLabels}
            labelClassName={CARD_LABEL}
          />
        ) : (
          <p className="text-on-card/75 text-center text-sm">
            Your stats show up when a match you played in is confirmed.
          </p>
        )}
      </div>

      {/* The only thing left at the foot, and only in seeded builds. Under
          `IS_SEED_ENABLED` the figures above are invented
          (`seed/player-store.ts`) and this is the object a player screenshots
          to a club, so the stamp is load-bearing: it stops a fabricated stat
          line from ever being read as a record.

          A real card has no foot bar at all. Position and status moved up
          beside the name where they belong, and the confidence tier
          deliberately stays off the card and in its own block (JOURNAL
          2026-08-21) — on the card it read as a caveat on figures that carry
          none, since only confirmed matches reach a record in the first
          place. */}
      {IS_SEED_ENABLED ? (
        <div className="border-on-card/20 bg-on-card/[0.07] relative flex items-center border-t px-5 py-3.5 sm:px-6">
          <span className={cn(CARD_LABEL, "text-on-card/70")}>Demo data</span>
        </div>
      ) : null}
    </article>
  );
}
