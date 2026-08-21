"use client";

import { Card, Crest, Divider, Skeleton, StatValue } from "@/components/ui";
import { useTopScorers, useZoneTable } from "@/lib/api/hooks/use-fixtures";

/**
 * The two ranked lists on the home: the zone table and the top scorers.
 *
 * Both display values the backend produced and derive nothing (Law 3). No
 * position is computed here, no points are added up, and the goal counts are
 * taken as given rather than counted from results.
 *
 * The table is cut to three columns. The reference dashboards carry eight
 * (Pts W L D GF GA GD Last 5), which at 360px is either a horizontal scroll
 * nobody discovers or numerals nobody can read. Played, goal difference and
 * points is what decides a table; the rest belongs on the competition page.
 */

const COLUMNS = "grid-cols-[1.5rem_1fr_2rem_2.5rem_2.5rem]";

export function ZoneTableSection() {
  const { data: rows, isLoading } = useZoneTable();

  if (isLoading) return <Skeleton className="rounded-card h-64 w-full" />;
  if (!rows || rows.length === 0) return null;

  return (
    <Card tone="flat" size="md">
      <div
        className={`text-fg-subtle grid ${COLUMNS} gap-2 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase`}
      >
        <span aria-hidden />
        <span>Club</span>
        <span className="text-right">P</span>
        <span className="text-right">GD</span>
        <span className="text-right">Pts</span>
      </div>
      <Divider />
      {rows.map((row) => (
        <div
          key={row.club}
          className={`grid ${COLUMNS} items-center gap-2 py-2 text-sm`}
        >
          <span className="text-fg-subtle kx-numeric text-xs">
            {row.position}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Crest name={row.club} size="xs" decorative />
            <span className="truncate">{row.club}</span>
          </span>
          <span className="text-fg-muted kx-numeric text-right text-xs">
            {row.played}
          </span>
          <span className="text-fg-muted kx-numeric text-right text-xs">
            {row.goalDifference > 0
              ? `+${row.goalDifference}`
              : row.goalDifference}
          </span>
          <span className="kx-numeric text-right font-semibold">
            {row.points}
          </span>
        </div>
      ))}
    </Card>
  );
}

export function TopScorersSection() {
  const { data: scorers, isLoading } = useTopScorers();

  if (isLoading) return <Skeleton className="rounded-card h-56 w-full" />;
  if (!scorers || scorers.length === 0) return null;

  return (
    <Card tone="flat" size="md">
      {scorers.map((scorer, index) => (
        <div key={scorer.playerId}>
          {index > 0 ? <Divider /> : null}
          <div className="flex items-center gap-3 py-2.5">
            <span className="text-fg-subtle kx-numeric w-4 text-xs">
              {index + 1}
            </span>
            <Crest name={scorer.club} size="sm" decorative />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {scorer.stageName}
              </p>
              <p className="text-fg-subtle truncate text-xs">{scorer.club}</p>
            </div>
            <StatValue size="md">{scorer.goals}</StatValue>
          </div>
        </div>
      ))}
    </Card>
  );
}
