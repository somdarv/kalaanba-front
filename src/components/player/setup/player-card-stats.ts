/**
 * Which counters a player card bills, and in what order.
 *
 * Split out of `player-card-record.tsx` so the decision is testable without a
 * DOM: this file answers "which numbers does this player get judged on", that
 * one answers "what does a billed number look like next to a secondary one".
 * Pure functions, no React, no fetching.
 *
 * **The card never leads with a zero.** A striker who has not scored yet is not
 * a striker with "0" as his headline — that is the same category error §13
 * exists to prevent, one level down. So the position mapping is an ordered
 * PRIORITY list rather than a fixed trio, and the lead row takes the first
 * three counters the player actually has something in. A keeper with no clean
 * sheets leads with minutes; the clean sheet drops to the strip below and comes
 * back the week he keeps one.
 *
 * **Nothing is hidden by the choice.** Every counter the record carries still
 * appears. Billing changes, visibility does not — the same promise
 * `player.card.featured_stats` has made since it was written.
 *
 * The mapping comes from `/players/meta` (Law 2). This file holds no opinion
 * about which position leads with what; it only knows how to read a priority
 * list and how to keep a zero out of the top row.
 */

import type { VerifiedRecord } from "@/lib/api/player";

export const CARD_STAT_KEYS = [
  "appearances",
  "starts",
  "goals",
  "assists",
  "minutes",
  "clean_sheets",
] as const;

export type CardStatKey = (typeof CARD_STAT_KEYS)[number];

/** How many counters the lead row bills. The row is a three-up grid. */
export const LEAD_STAT_COUNT = 3;

/**
 * The two registers a stat name is written in.
 *
 * `short` is the lead row: 10px uppercase under a display-size figure, in a
 * column a third of a 360px card wide. `label` is the strip below: 12px beside
 * its own value, with a whole column to sit in.
 *
 * "CLN SHTS" is the reason this is a pair rather than one string. At 10px in a
 * third of a card, "Clean sheets" wraps to two lines and pulls the row out of
 * alignment with the two beside it; at 12px in the strip, spelling it out is
 * both legible and kinder. Same counter, two slots, two lengths.
 */
export type CardStatLabel = { label: string; short: string };

/**
 * Fallback vocabulary, used until `/players/meta` serves
 * `player.card.stat_labels`.
 *
 * The words a player already uses. "Games", not "Appearances".
 */
export const CARD_STAT_LABEL_DEFAULTS: Record<CardStatKey, CardStatLabel> = {
  appearances: { label: "Games", short: "GAMES" },
  starts: { label: "Starts", short: "STARTS" },
  goals: { label: "Goals", short: "GOALS" },
  assists: { label: "Assists", short: "ASSISTS" },
  minutes: { label: "Minutes", short: "MINS" },
  clean_sheets: { label: "Clean sheets", short: "CLN SHTS" },
};

/**
 * The order used when config is silent, and the order missing keys are
 * appended in. Runs from the counter every position is read on down to the one
 * fewest positions care about.
 */
const DEFAULT_PRIORITY: ReadonlyArray<CardStatKey> = [
  "appearances",
  "goals",
  "assists",
  "minutes",
  "starts",
  "clean_sheets",
];

const isCardStatKey = (key: string): key is CardStatKey =>
  (CARD_STAT_KEYS as ReadonlyArray<string>).includes(key);

/** Present means the API sent the field. A present 0 is a fact; absent is not. */
const isPresent = (record: VerifiedRecord, key: CardStatKey): boolean =>
  record[key] != null;

const isScoring = (record: VerifiedRecord, key: CardStatKey): boolean =>
  (record[key] ?? 0) > 0;

/**
 * Resolve the display names for a stat key.
 *
 * Falls back per FIELD rather than per key or whole-map, because the two
 * registers fail differently: a config entry that supplies `label` and forgets
 * `short` should still get a lead row, not a blank one.
 */
export function statLabelFor(
  key: CardStatKey,
  map: Record<string, Partial<CardStatLabel>> | undefined,
): CardStatLabel {
  const fallback = CARD_STAT_LABEL_DEFAULTS[key];
  const configured = map?.[key];
  return {
    label: configured?.label?.trim() || fallback.label,
    short: configured?.short?.trim() || fallback.short,
  };
}

/**
 * The full billing order for a position, longest to shortest priority.
 *
 * Three rules, in this order:
 *
 *  1. Unknown keys are dropped and duplicates collapse. A typo in config must
 *     not put a blank column on every card in the country.
 *  2. A list left with fewer than `LEAD_STAT_COUNT` usable keys is discarded
 *     WHOLE rather than topped up from the default. A config list edited down
 *     to two is a mistake, and quietly completing it would produce an order
 *     nobody chose and hide the mistake from whoever made it.
 *  3. Counters the list never named are appended in default order. The key
 *     decides billing, never visibility — an admin who forgets `starts` must
 *     not thereby delete it from every card.
 */
export function statPriorityFor(
  position: string | null | undefined,
  map: Record<string, ReadonlyArray<string>> | undefined,
): ReadonlyArray<CardStatKey> {
  const configured = position ? map?.[position] : undefined;
  const named: CardStatKey[] = [];

  for (const key of configured ?? []) {
    if (isCardStatKey(key) && !named.includes(key)) named.push(key);
  }

  const base = named.length >= LEAD_STAT_COUNT ? named : [...DEFAULT_PRIORITY];
  const missing = DEFAULT_PRIORITY.filter((key) => !base.includes(key));

  return [...base, ...missing];
}

/**
 * The counters the lead row bills: the first three in priority order that the
 * player has something in.
 *
 * Tops up from the merely-present when fewer than three are scoring, so the
 * three-up grid is never left with a hole. A record that is entirely zero
 * therefore still returns three keys — the card decides separately that a
 * record of zeroes is no record at all and renders the gate instead
 * (`hasAnyStat`).
 */
export function leadStatsFor(
  priority: ReadonlyArray<CardStatKey>,
  record: VerifiedRecord,
): ReadonlyArray<CardStatKey> {
  const present = priority.filter((key) => isPresent(record, key));
  const lead = present
    .filter((key) => isScoring(record, key))
    .slice(0, LEAD_STAT_COUNT);

  if (lead.length === LEAD_STAT_COUNT) return lead;

  const topUp = present.filter((key) => !lead.includes(key));
  return [...lead, ...topUp].slice(0, LEAD_STAT_COUNT);
}

/** Everything the lead row did not take, still in priority order. */
export function secondaryStatsFor(
  priority: ReadonlyArray<CardStatKey>,
  lead: ReadonlyArray<CardStatKey>,
  record: VerifiedRecord,
): ReadonlyArray<CardStatKey> {
  return priority.filter(
    (key) => !lead.includes(key) && isPresent(record, key),
  );
}

/**
 * How many columns the strip under the lead row takes.
 *
 * Two, or one when there is only a single item. Never three.
 *
 * The strip sets each item justified — label hard left, value hard right,
 * filling its column — because that is what makes a column of figures scannable
 * rather than a centred cluster with a ragged seam down the middle. Justifying
 * needs width: at three columns on a 360px card the label and value collide,
 * and the alignment stops meaning anything.
 *
 * Two columns also means the count must be even, which is what `balanceStrip`
 * enforces. One orphaned item on a half-empty last row is the single thing that
 * makes an object built to be screenshotted look unfinished, and the extra
 * dropped is the lowest-priority one on a strip that exists to be extra.
 */
export function stripColumns(count: number): 1 | 2 {
  return count <= 1 ? 1 : 2;
}

/**
 * Assemble the strip so it fills whole rows of two.
 *
 * `stats` is in priority order; `cards` is the single disciplinary line, or
 * null when there is nothing to report.
 *
 * When the total is odd something has to go, and the trim comes off the STATS,
 * never off the cards line. A red card is the more notable fact — it is the one
 * figure on the strip a club asks about — while the counters that matter are
 * already billed at display scale above. Starts is the kind of thing this gives
 * up instead.
 *
 * Shared by the screen card and the share graphic so the picture and the page
 * can never end on a different line.
 */
export function balanceStrip<T>(stats: ReadonlyArray<T>, cards: T | null): T[] {
  const total = stats.length + (cards ? 1 : 0);
  const kept = total % 2 === 0 ? [...stats] : stats.slice(0, -1);

  return cards ? [...kept, cards] : kept;
}

/**
 * Whether the record says anything at all.
 *
 * Every counter, not just the billed ones: a keeper whose only figure is a
 * clean sheet has a record, and asking only about the lead trio would have told
 * him he did not. Three zeroes on the object a player screenshots is the exact
 * category error §13 exists to prevent.
 */
export function hasAnyStat(record: VerifiedRecord | null | undefined): boolean {
  if (!record) return false;
  if (CARD_STAT_KEYS.some((key) => isScoring(record, key))) return true;
  return (record.player_of_the_match ?? 0) > 0;
}
