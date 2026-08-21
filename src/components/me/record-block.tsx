"use client";

import { Badge, EmptyState, StatBlock } from "@/components/ui";
import { IS_SEED_ENABLED } from "@/lib/env";
import type { VerifiedRecord } from "@/lib/api/player";

import { MeSection } from "./me-section";

/**
 * The verified record (Player & Affiliation §13).
 *
 * §13 is a locked rule: official player stats come only from confirmed match
 * records, and claimed stats never appear in profile totals. Match/Fixture has
 * no endpoints yet, so in an honest build every counter here is 0.
 *
 * **The empty state names the gate rather than apologising for it.** "Nothing
 * on your record yet" plus one line on what fills it tells a player something
 * true about how Kalaanba works. Six tiles reading 0 would imply a record of
 * nothing rather than the absence of one, which is the same category error §13
 * exists to prevent.
 *
 * **The demo chip is load-bearing.** When `IS_SEED_ENABLED`, these numbers are
 * invented (see `seed/player-store.ts`) and this is the page a player
 * screenshots and sends to a club. The chip is what stops a fabricated stat
 * line from ever being mistaken for a record, and it is deliberately a
 * `warning` badge rather than a neutral one.
 *
 * Note the branch: the LAYOUT keys off whether a record exists, not off the
 * seed flag. The flag only adds the warning. A real record of zeros and a
 * seed-off build render identically, which is correct — they are the same fact.
 */

export type RecordBlockProps = {
  record: VerifiedRecord;
};

const ROWS: ReadonlyArray<{ key: keyof VerifiedRecord; label: string }> = [
  { key: "appearances", label: "Games" },
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "minutes", label: "Minutes" },
  { key: "yellow_cards", label: "Yellows" },
  { key: "red_cards", label: "Reds" },
];

export function RecordBlock({ record }: RecordBlockProps) {
  const hasRecord = ROWS.some(({ key }) => record[key] > 0);

  return (
    <MeSection
      title="Your record"
      note={
        hasRecord && IS_SEED_ENABLED ? (
          <Badge intent="warning" size="sm">
            Demo data
          </Badge>
        ) : null
      }
    >
      {hasRecord ? (
        <dl className="grid grid-cols-3 gap-x-3 gap-y-5">
          {ROWS.map(({ key, label }) => (
            <StatBlock key={key} label={label} value={record[key]} />
          ))}
        </dl>
      ) : (
        <EmptyState
          size="sm"
          title="Nothing on your record yet"
          description="Your stats show up when a match you played in is confirmed."
        />
      )}
    </MeSection>
  );
}
