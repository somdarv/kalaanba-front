"use client";

import { StatValue } from "@/components/ui";
import type { VerifiedRecord } from "@/lib/api/player";
import { cn } from "@/lib/cn";

import {
  balanceStrip,
  statLabelFor,
  stripColumns,
  type CardStatKey,
  type CardStatLabel,
} from "./player-card-stats";

/**
 * The record band on a player card (Player & Affiliation §13).
 *
 * Split from `player-card.tsx` because the two answer different questions —
 * that file lays out a card, this one renders a record — and because together
 * they cleared the 400-line limit. Which counters get billed is a third
 * question again, and lives in `player-card-stats.ts`.
 *
 * **Two registers, two rows.** The lead row is three figures at display scale
 * under 10px uppercase abbreviations: the numbers a player is judged on, read
 * from across a room. The strip below is a two-column grid at 12px: the numbers
 * that give the top row context, read only by someone who has already stopped
 * to look.
 *
 * **The strip is justified, the lead row is centred, and the difference is the
 * point.** Three big figures want to be centred under their labels — they are
 * a headline. A column of small figures wants label hard left and value hard
 * right, filling the column, because that is what puts the values in a straight
 * line the eye can run down. Centring them instead left a ragged seam through
 * the middle of the block and nothing to scan against.
 *
 * **The strip always fills whole rows.** One line, or whole lines, never a line
 * and a half — an orphaned last item on an object built to be screenshotted
 * reads as something that failed to load. Two columns, so an odd count sheds
 * its lowest-priority stat.
 */

/** Grid classes, written out because Tailwind cannot see a computed name. */
const COLUMN_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
} as const;

export type PlayerCardRecordProps = {
  record: VerifiedRecord;
  /** Billed by `leadStatsFor` — three counters the player has something in. */
  lead: ReadonlyArray<CardStatKey>;
  /** Everything else the record carries, in priority order. */
  secondary: ReadonlyArray<CardStatKey>;
  /** `player.card.stat_labels` from `/players/meta`. Absent, defaults apply. */
  statLabels?: Record<string, Partial<CardStatLabel>>;
  /** Shared with the card head so the two labels stay one decision. */
  labelClassName: string;
};

type StripItem = { key: string; label: string; value: string };

/**
 * Build the strip.
 *
 * Yellows and reds are one item, never two. They are read together or not at
 * all, and a card that spends two of its slots on a player's bookings is not a
 * card anyone shares. The line only appears when there is something to report,
 * which is also what keeps a clean record from advertising its own cleanliness.
 */
function buildStrip(
  record: VerifiedRecord,
  secondary: ReadonlyArray<CardStatKey>,
  statLabels: PlayerCardRecordProps["statLabels"],
): StripItem[] {
  const stats: StripItem[] = secondary.map((key) => ({
    key,
    label: statLabelFor(key, statLabels).label,
    value: String(record[key] ?? 0),
  }));

  const yellows = record.yellow_cards;
  const reds = record.red_cards;
  const cards: StripItem | null =
    yellows > 0 || reds > 0
      ? { key: "cards", label: "Cards", value: `${yellows}Y, ${reds}R` }
      : null;

  return balanceStrip(stats, cards);
}

export function PlayerCardRecord({
  record,
  lead,
  secondary,
  statLabels,
  labelClassName,
}: PlayerCardRecordProps) {
  const strip = buildStrip(record, secondary, statLabels);

  return (
    <div>
      <dl className="grid my-2 grid-cols-3 gap-x-2 gap-y-2">
        {lead.map((key) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <dd className="order-2">
              <StatValue
                size="lg"
                className="text-on-card leading-non font-bold tracking-normal"
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
              {statLabelFor(key, statLabels).short}
            </dt>
          </div>
        ))}
      </dl>

      {strip.length > 0 ? (
        <dl
          className={cn(
            "border-on-card/15 mt-6 grid gap-x-8 gap-y-3 border-t pt-5",
            COLUMN_CLASS[stripColumns(strip.length)],
          )}
        >
          {strip.map((item) => (
            // Justified: label hard left, value hard right, filling the column.
            // `shrink-0` on the value and `truncate` on the label decide who
            // gives way when a long label meets a four-figure number — the
            // number never wraps, because a number that wraps is unreadable.
            <div
              key={item.key}
              className="flex items-baseline justify-between gap-2"
            >
              <dt className="text-on-card/65 truncate text-xs">{item.label}</dt>
              <dd className="text-on-card/95 kx-numeric shrink-0 text-xs font-semibold">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
