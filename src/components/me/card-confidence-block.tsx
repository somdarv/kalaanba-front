"use client";

import { Chip, Progress } from "@/components/ui";
import {
  labelFor,
  type CardConfidence,
  type PlayerMeta,
} from "@/lib/api/player";

import { MeSection } from "./me-section";

/**
 * Card confidence (Player & Affiliation §14).
 *
 * §14 keeps numeric player ratings out of V1 — a rating without minutes, role
 * and opposition context goes unfair fast — and puts confidence labels in their
 * place. This block is that decision made visible.
 *
 * It also does the job an empty stat grid cannot: it explains a blank card.
 * "Provisional, 0 matches confirmed" states the truth, where six tiles reading
 * zero imply a record OF nothing rather than the absence of one.
 *
 * The tier is a stable internal key resolved backend-side (Law 3/4). Nothing
 * here compares a count to a threshold: the thresholds are effective-dated
 * config, so only the server knows which ones applied when.
 *
 * `first-letter:uppercase` rather than `capitalize`: when the label map has not
 * shipped yet, `labelFor` falls back to the raw key ("growing") and a bare
 * lowercase word in a chip reads as a bug. Capitalising only the first letter
 * degrades a missing label gracefully without mangling a real multi-word one
 * into Title Case.
 */

export type CardConfidenceBlockProps = {
  confidence: CardConfidence;
  meta: PlayerMeta;
};

export function CardConfidenceBlock({
  confidence,
  meta,
}: CardConfidenceBlockProps) {
  const { tier, confirmed_matches, matches_to_next_tier } = confidence;
  const tierLabel = labelFor(meta.card_confidence ?? [], tier) ?? tier;

  const toNext = matches_to_next_tier ?? null;
  const hasNext = toNext !== null && toNext > 0;

  // Presentation only. The denominator is "matches in this step of the ladder",
  // which the server has already reduced to a remainder — this turns two given
  // numbers into a bar, it does not compute a tier.
  const stepTotal = hasNext ? confirmed_matches + toNext : confirmed_matches;
  const percent =
    stepTotal > 0 ? Math.round((confirmed_matches / stepTotal) * 100) : 0;

  return (
    <MeSection
      title="Your card"
      note={
        <Chip intent="primary" size="sm" className="first-letter:uppercase">
          {tierLabel}
        </Chip>
      }
    >
      <p className="text-fg-muted text-sm">
        {confirmed_matches === 0
          ? "Your card gets stronger with every match we confirm."
          : `${confirmed_matches} ${confirmed_matches === 1 ? "match" : "matches"} confirmed so far.`}
      </p>

      {hasNext ? (
        <div className="mt-3.5 flex flex-col gap-1.5">
          <Progress
            value={percent}
            aria-label={`Progress to the next card level, ${percent} percent`}
          />
          <p className="text-fg-subtle text-xs">
            {toNext} more to reach the next level.
          </p>
        </div>
      ) : null}
    </MeSection>
  );
}
