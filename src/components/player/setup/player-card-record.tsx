"use client";

import { StatValue } from "@/components/ui";
import { IS_SEED_ENABLED } from "@/lib/env";
import type { VerifiedRecord } from "@/lib/api/player";
import { cn } from "@/lib/cn";

/**
 * The record band on a player card (Player & Affiliation §13).
 *
 * Split out of `player-card.tsx` because the two answer different questions —
 * that file lays out a card, this one decides which numbers a player is judged
 * on — and because together they cleared the 400-line limit.
 *
 * **Three lead, the rest follow.** Which three is a position question: a
 * centre-back is not judged on goals and a keeper is not judged on assists, so
 * one fixed trio misrepresents most of the pitch. The mapping comes from
 * `player.card.featured_stats` through `/players/meta` (Law 2) — this file
 * holds no opinion about which position leads with what, only about how a
 * lead stat looks next to a secondary one.
 *
 * Nothing is hidden by the choice. Every counter the record carries appears;
 * featuring decides billing, not visibility.
 */

export const CARD_STAT_KEYS = [
  "appearances",
  "starts",
  "goals",
  "assists",
  "minutes",
  "clean_sheets",
] as const;

export type CardStatKey = (typeof CARD_STAT_KEYS)[number];

/**
 * Short enough to sit under a number on a 360px screen, and the words a player
 * already uses. "Games", not "Appearances".
 */
const STAT_LABELS: Record<CardStatKey, string> = {
  appearances: "Games",
  starts: "Starts",
  goals: "Goals",
  assists: "Assists",
  minutes: "Minutes",
  clean_sheets: "Clean sheets",
};

/** §15 names these three by name, so they are the fallback when config is silent. */
const DEFAULT_FEATURED: ReadonlyArray<CardStatKey> = [
  "appearances",
  "goals",
  "assists",
];

const isCardStatKey = (key: string): key is CardStatKey =>
  (CARD_STAT_KEYS as ReadonlyArray<string>).includes(key);

/**
 * Resolve the lead three for a position.
 *
 * Falls back whole rather than partially. A config list that has been edited
 * down to two keys is a mistake, and filling the gap from the default would
 * produce a trio nobody chose and hide the mistake from whoever made it.
 */
export function featuredStatsFor(
  position: string | null | undefined,
  map: Record<string, ReadonlyArray<string>> | undefined,
): ReadonlyArray<CardStatKey> {
  const configured = position ? map?.[position] : undefined;
  const valid = configured?.filter(isCardStatKey) ?? [];
  return valid.length === 3 ? valid : DEFAULT_FEATURED;
}

export type PlayerCardRecordProps = {
  record: VerifiedRecord;
  featured: ReadonlyArray<CardStatKey>;
  /** Shared with the card head so the two labels stay one decision. */
  labelClassName: string;
};

export function PlayerCardRecord({
  record,
  featured,
  labelClassName,
}: PlayerCardRecordProps) {
  const secondary = CARD_STAT_KEYS.filter(
    (key) => !featured.includes(key) && record[key] != null,
  );

  const yellows = record.yellow_cards;
  const reds = record.red_cards;
  const hasCards = yellows > 0 || reds > 0;

  return (
    <div className="pb-5">
      {/* Load-bearing, not decoration. Under `IS_SEED_ENABLED` these figures
          are invented (`seed/player-store.ts`) and this is the object a player
          screenshots to a club. It stops a fabricated stat line from ever
          being read as a record. */}
      {IS_SEED_ENABLED ? (
        <p className={cn(labelClassName, "text-on-card/70 mb-3 text-center")}>
          Demo data
        </p>
      ) : null}

      <dl className="grid grid-cols-3 gap-2">
        {featured.map((key) => (
          <div key={key} className="flex flex-col items-center gap-1.5">
            <dd className="order-2">
              <StatValue
                size="lg"
                className="text-on-card leading-none font-bold tracking-normal"
              >
                {record[key] ?? 0}
              </StatValue>
            </dd>
            {/* `order` rather than source order: the number is the answer and
                should come first to a screen reader, while the eye reads the
                label above it as a column heading. */}
            <dt
              className={cn(
                labelClassName,
                "text-on-card/70 order-1 text-center",
              )}
            >
              {STAT_LABELS[key]}
            </dt>
          </div>
        ))}
      </dl>

      {secondary.length > 0 || hasCards ? (
        <dl className="border-on-card/15 mt-4 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 border-t pt-3">
          {secondary.map((key) => (
            <div key={key} className="flex items-baseline gap-1.5">
              <dt className="text-on-card/65 text-xs">{STAT_LABELS[key]}</dt>
              <dd className="text-on-card/95 kx-numeric text-xs font-semibold">
                {record[key]}
              </dd>
            </div>
          ))}

          {/* One disciplinary line, never two counters. Yellows and reds are
              read together or not at all, and a card that spends two of its
              slots on a player's bookings is not a card anyone shares. */}
          {hasCards ? (
            <div className="flex items-baseline gap-1.5">
              <dt className="text-on-card/65 text-xs">Cards</dt>
              <dd className="text-on-card/95 kx-numeric text-xs font-semibold">
                {yellows}Y, {reds}R
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {/* §15 allows badges, and this is the only one backed by verified data:
          a Trust-cleared match award, never a Fan Buzz signal (Law 8/9). Full
          width and squared off, because a pill reads as a status chip and this
          is the one line on the card a player earned rather than filled in. */}
      {record.player_of_the_match ? (
        <p className="border-on-card/30 bg-on-card/10 rounded-row mt-4 flex items-baseline justify-center gap-2 border px-3 py-2.5">
          <span className="kx-numeric text-on-card text-sm font-bold">
            {record.player_of_the_match}x
          </span>
          <span className="text-on-card/90 text-[0.6875rem] leading-none font-semibold tracking-[0.16em] uppercase">
            Player of the match
          </span>
        </p>
      ) : null}
    </div>
  );
}
