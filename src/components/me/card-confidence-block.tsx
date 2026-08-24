"use client";

import { Eyebrow } from "@/components/ui";
import {
  CARD_STAT_KEYS,
  statLabelFor,
} from "@/components/player/setup/player-card-stats";
import {
  type CardConfidence,
  type PlayerMeta,
  type VerifiedRecord,
} from "@/lib/api/player";

import { MeMeter } from "./me-meter";
import { MeSection } from "./me-section";

/**
 * Card confidence (Player & Affiliation §14).
 *
 * §14 keeps numeric player ratings out of V1 — a rating without minutes, role
 * and opposition context goes unfair fast — and puts confidence labels in their
 * place. This block is that decision made visible.
 *
 * It also does the job an empty stat grid cannot: it explains a blank card.
 * A count of confirmed matches states the truth, where six tiles reading zero
 * imply a record OF nothing rather than the absence of one.
 *
 * **The tier chip is gone; the ladder is shown by the bar.** "Provisional" beside
 * the heading was a verdict on a card the player has not had a chance to fill
 * yet, and it was the second pink thing on a surface DESIGN_LANGUAGE §4.3 gives
 * one accent to. The progress bar and the count carry the same fact without
 * labelling the player.
 *
 * **The tracked list is names only, never numbers, and only while the record is
 * empty.** It answers "what does this card measure" for a player who has
 * nothing on it yet. Rendering the counters here would restate what
 * `<PlayerCard>` already bills six inches above, and a column of zeroes is
 * exactly the impression §14 exists to avoid. Once a match is confirmed the
 * card bills the real figures and this list retires, because naming a counter
 * next to a card already showing it is saying the same thing twice.
 *
 * The vocabulary comes from `/players/meta` (Law 4) with the card's own
 * defaults as the fallback, so this list and the card cannot end up calling one
 * counter two different names.
 *
 * Nothing here compares a count to a threshold: the thresholds are
 * effective-dated config, so only the server knows which ones applied when.
 */

export type CardConfidenceBlockProps = {
  confidence: CardConfidence;
  /** Read to decide whether the card already bills real figures. */
  record: VerifiedRecord;
  meta: PlayerMeta;
};

export function CardConfidenceBlock({
  confidence,
  record,
  meta,
}: CardConfidenceBlockProps) {
  const { confirmed_matches, matches_to_next_tier } = confidence;

  // Narrowed to a positive number or nothing in one place, so the branch below
  // can render it without a second null check the compiler cannot follow.
  const toNext =
    matches_to_next_tier != null && matches_to_next_tier > 0
      ? matches_to_next_tier
      : null;

  // Presentation only. The denominator is "matches in this step of the ladder",
  // which the server has already reduced to a remainder — this turns two given
  // numbers into a bar, it does not compute a tier.
  const stepTotal =
    toNext !== null ? confirmed_matches + toNext : confirmed_matches;
  const percent =
    stepTotal > 0 ? Math.round((confirmed_matches / stepTotal) * 100) : 0;

  // Keyed on the RECORD, not on the match count: this list retires the moment
  // the card has a figure to bill, and those are two different reads of the
  // same truth. A record can carry minutes from a match still being confirmed.
  const hasRecord = CARD_STAT_KEYS.some((key) => (record[key] ?? 0) > 0);
  const tracked = hasRecord
    ? []
    : CARD_STAT_KEYS.map((key) => ({
        key,
        label: statLabelFor(key, meta.card_stat_labels).label,
      }));

  return (
    <MeSection
      title="Your card"
      description={
        confirmed_matches === 0
          ? "These fill up as we confirm your matches."
          : `${confirmed_matches} ${confirmed_matches === 1 ? "match" : "matches"} confirmed.`
      }
    >
      {tracked.length > 0 ? (
        <ul className="flex flex-wrap gap-x-2 gap-y-2">
          {tracked.map((stat) => (
            <li
              key={stat.key}
              className="rounded-pill bg-surface border-border border px-3 py-2"
            >
              {/* Tracked uppercase, the way the reference panel writes every
                  counter label it carries. At sentence case and 12px these
                  read as four loose words; as micro-labels they read as the
                  columns of a record that has not started yet. */}
              <Eyebrow tone="muted">{stat.label}</Eyebrow>
            </li>
          ))}
        </ul>
      ) : null}

      {toNext !== null ? (
        <div className={tracked.length > 0 ? "mt-4" : undefined}>
          {/* The reading is the count, never the percentage. On a card with
              nothing confirmed yet the percentage is 0, and a 0 at any size on
              this surface is the §13 error one level down. "3 to go" states
              the same step forward and cannot read as a verdict. */}
          <MeMeter
            label="Next level"
            value={`${toNext} to go`}
            percent={percent}
            srLabel={`Progress to the next card level, ${percent} percent`}
          />
        </div>
      ) : null}
    </MeSection>
  );
}
