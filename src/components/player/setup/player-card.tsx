"use client";

import { Avatar, StatValue } from "@/components/ui";
import { Wordmark } from "@/components/ui/wordmark";
import { labelFor, type LabelledOption, type Player } from "@/lib/api/player";
import { cn } from "@/lib/cn";

import {
  variantFor,
  type PlayerCardVariant,
} from "./player-card-variants";

/**
 * The player card (Player & Affiliation §15) as it stands the moment the
 * profile is created.
 *
 * Everything on it is a field the backend just returned — Constitution Law 3.
 * There are deliberately no stats, no rating and no confidence tier: §13 gates
 * stats behind confirmed matches and §14 keeps numeric ratings out of V1, so a
 * brand-new card showing "0 goals" would be inventing a fact rather than
 * reporting one. It shows identity, and identity is enough.
 *
 * Status strings are resolved from the config-served label maps (ADR-0007) —
 * the card never compiles "Free agent" into the bundle.
 *
 * **No "PLAYER CARD" caption.** A card that has to announce it is a card is
 * not one. The wordmark sits top-left where a badge belongs and does that job
 * without spending a line on it.
 *
 * **One of three looks, derived from the player's own key.** See
 * `player-card-variants.ts` for why it is derived rather than random.
 */

export type PlayerCardProps = {
  player: Player;
  positions: ReadonlyArray<LabelledOption>;
  marketStatuses: ReadonlyArray<LabelledOption>;
  /** Force a look. Design preview only — real cards derive it from the player. */
  variant?: PlayerCardVariant;
  className?: string;
};

export function PlayerCard({
  player,
  positions,
  marketStatuses,
  variant,
  className,
}: PlayerCardProps) {
  const positionLabel = labelFor(positions, player.primary_position);
  const marketLabel = labelFor(marketStatuses, player.market_status);
  const fullName = `${player.first_name} ${player.last_name}`.trim();
  const look = variant ?? variantFor(player.id ?? player.stage_name);

  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-panel p-5 text-on-primary",
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
      {/* Light source. Decorative, sits over the wash and under everything
          else, which is what stops a flat gradient reading as a swatch. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: look.glow }}
      />

      {/* Head: the mark, then the number. Both are identity, neither is copy. */}
      <div className="flex items-start justify-between gap-4">
        <Wordmark size="sm" className="h-5 opacity-80" />
        {player.preferred_number != null ? (
          <StatValue
            size="xl"
            className="leading-none text-on-primary/95"
            aria-label={`Shirt number ${player.preferred_number}`}
          >
            {player.preferred_number}
          </StatValue>
        ) : null}
      </div>

      <div className="mt-7 flex items-end gap-4">
        {/* `xl` and `shrink-0`. At `lg` with no shrink guard the avatar was
            the only flexible thing in the row, so a long stage name squeezed
            it into a sliver. It is the player's face: it holds its size and
            the name wraps instead. */}
        <Avatar
          size="xl"
          name={player.stage_name}
          src={player.headshot_url ?? undefined}
          className="shrink-0 ring-2 ring-on-primary/40 shadow-[var(--shadow-sm)]"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-3xl leading-none font-bold tracking-tight break-words text-on-primary">
            {player.stage_name}
          </h2>
          <p className="mt-1.5 truncate text-sm text-on-primary/75">
            {fullName}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {positionLabel ? <CardTag>{positionLabel}</CardTag> : null}
        {marketLabel ? <CardTag>{marketLabel}</CardTag> : null}
      </div>
    </article>
  );
}

/**
 * Pill on the brand fill. Not `<Badge>`: every Badge intent paints its own
 * background from a state colour, and a success-green pill on the card would
 * read as a status signal rather than a label (DESIGN_LANGUAGE §4.3).
 */
function CardTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-pill border border-on-primary/25 bg-on-primary/10 px-3 py-1 text-xs font-semibold text-on-primary backdrop-blur-sm">
      {children}
    </span>
  );
}
