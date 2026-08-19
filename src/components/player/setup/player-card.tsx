"use client";

import { Avatar, Eyebrow, StatValue } from "@/components/ui";
import { labelFor, type LabelledOption, type Player } from "@/lib/api/player";
import { cn } from "@/lib/cn";

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
 */

export type PlayerCardProps = {
  player: Player;
  positions: ReadonlyArray<LabelledOption>;
  marketStatuses: ReadonlyArray<LabelledOption>;
  className?: string;
};

export function PlayerCard({
  player,
  positions,
  marketStatuses,
  className,
}: PlayerCardProps) {
  const positionLabel = labelFor(positions, player.primary_position);
  const marketLabel = labelFor(marketStatuses, player.market_status);
  const fullName = `${player.first_name} ${player.last_name}`.trim();

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-panel bg-primary p-5 text-on-primary",
        "shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Eyebrow className="text-on-primary/70">Player card</Eyebrow>
        {player.preferred_number != null ? (
          <StatValue
            size="xl"
            className="leading-none text-on-primary/90"
            aria-label={`Preferred number ${player.preferred_number}`}
          >
            {player.preferred_number}
          </StatValue>
        ) : null}
      </div>

      <div className="mt-6 flex items-end gap-4">
        <Avatar
          size="lg"
          name={player.stage_name}
          src={player.headshot_url ?? undefined}
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
 * background from a state colour, and a success-green pill on the pink card
 * would read as a status signal rather than a label (DESIGN_LANGUAGE §4.3).
 */
function CardTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-pill border border-on-primary/25 bg-on-primary/10 px-3 py-1 text-xs font-semibold text-on-primary">
      {children}
    </span>
  );
}
