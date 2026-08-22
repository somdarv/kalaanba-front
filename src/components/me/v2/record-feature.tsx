"use client";

import { Chip, Progress, StatValue } from "@/components/ui";
import {
  labelFor,
  type CardConfidence,
  type PlayerMeta,
} from "@/lib/api/player";

import { TreeList, type TreeItem } from "./index-group";

/**
 * Card confidence, as the one featured item in the index (Player & Affiliation
 * §14).
 *
 * §14 keeps numeric player ratings out of V1 — a rating without minutes, role
 * and opposition context goes unfair fast — and puts confidence labels in
 * their place. This is that decision given the loudest spot on the surface.
 *
 * It is also the only brand-washed tile on the page. §4.3 allows one primary
 * moment per viewport, and this is it: everything else here is a row.
 *
 * **It does the job an empty stat grid cannot.** "Provisional, 0 confirmed"
 * states the truth, where six tiles reading zero imply a record OF nothing
 * rather than the absence of one.
 *
 * **Nothing here is duplicated by the card beside it.** The card carries the
 * verified counters (§13); this carries the ladder those counters climb, and
 * the two sets never overlap. v1 learned that lesson the other way round and
 * deleted a whole record block for repeating the card's six numbers.
 *
 * The tier is a stable internal key resolved backend-side (Law 3/4). Nothing
 * here compares a count to a threshold: the thresholds are effective-dated
 * config, so only the server knows which ones applied when.
 *
 * `first-letter:uppercase` rather than `capitalize`: when the label map has not
 * shipped, `labelFor` falls back to the raw key ("growing") and a bare
 * lowercase word in a chip reads as a bug. Capitalising the first letter alone
 * degrades gracefully without mangling a real multi-word label into Title Case.
 */

export type RecordFeatureProps = {
  confidence: CardConfidence;
  meta: PlayerMeta;
};

export function RecordFeature({ confidence, meta }: RecordFeatureProps) {
  const { tier, next_tier, confirmed_matches, matches_to_next_tier } =
    confidence;

  const levels = meta.card_confidence ?? [];
  const tierLabel = labelFor(levels, tier) ?? tier;

  const toNext = matches_to_next_tier ?? null;
  const hasNext = toNext !== null && toNext > 0;

  // Presentation only. The denominator is "matches in this step of the
  // ladder", which the server has already reduced to a remainder — this turns
  // two given numbers into a bar, it does not compute a tier.
  const stepTotal = hasNext ? confirmed_matches + toNext : confirmed_matches;
  const percent =
    stepTotal > 0 ? Math.round((confirmed_matches / stepTotal) * 100) : 0;

  const branches: TreeItem[] = [];
  if (hasNext) {
    const nextLabel = next_tier
      ? (labelFor(levels, next_tier) ?? next_tier)
      : null;
    if (nextLabel) {
      branches.push({
        key: "next",
        label: "Next level",
        value: <span className="first-letter:uppercase">{nextLabel}</span>,
      });
    }
    branches.push({ key: "to-go", label: "Matches to go", value: toNext });
  }

  return (
    <>
      <div className="rounded-card bg-brand-wash mt-1 border border-[color-mix(in_oklab,transparent,var(--primary-ink)_28%)] p-4">
        {/* One row, not two. The group heading above already names this
            "Card level", so an eyebrow repeating it inside the tile spent a
            line saying nothing. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
          <p className="flex items-baseline gap-2">
            <StatValue size="lg" tone="default">
              {confirmed_matches}
            </StatValue>
            <span className="text-fg-muted text-sm">
              {confirmed_matches === 1
                ? "match confirmed"
                : "matches confirmed"}
            </span>
          </p>

          <Chip intent="primary" size="sm" className="first-letter:uppercase">
            {tierLabel}
          </Chip>
        </div>

        {hasNext ? (
          <Progress
            className="mt-3"
            value={percent}
            aria-label={`Progress to the next card level, ${percent} percent`}
          />
        ) : null}

        {confirmed_matches === 0 ? (
          <p className="text-fg-subtle mt-3 text-xs">
            Every match we confirm makes it stronger.
          </p>
        ) : null}
      </div>

      {branches.length > 0 ? <TreeList items={branches} /> : null}
    </>
  );
}
