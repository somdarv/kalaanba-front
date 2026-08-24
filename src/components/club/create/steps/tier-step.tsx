"use client";

import { RadioGroup } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";

import { PROFESSIONAL_TIER } from "@/lib/api/club";

import { type ClubStepProps } from "./step-props";

/**
 * Step 1 — what kind of club this is (ADR-0017 §2).
 *
 * **The first question, and the one every later step depends on.** It decides
 * which club types are offered, whether a name belonging to a real club is
 * refused or routed to review, and whether the club is live the moment it is
 * created. Asking it here turns one hard question ("may this person use this
 * name?") into two easy ones.
 *
 * Both options come from `club.tiers` with their labels and their consequence
 * lines (Law 4) — including the line that says an official club does not go
 * live on submit. Someone who learns that after filling in five more steps has
 * been misled by omission.
 *
 * Rendered as radios rather than bespoke cards, following the availability
 * step: a solid brand fill on a selected card shouts louder than the primary
 * CTA under it, and the radio dot means colour is not the only signal
 * (DESIGN_LANGUAGE §4.3, §6).
 *
 * **The professional door is shown but not yet open.** The API creates such a club
 * held at `verification_state = pending`, which is correct, but the document
 * upload and the admin review that clear it ship in
 * WP-20260823-club-verification. Letting someone submit a claim now would put
 * their club in a state no one can release, and tell them we are checking it
 * when nobody can. Rendered disabled with the reason rather than dropped, the
 * `nav-items.ts` precedent: showing the shape of the product with the
 * unfinished part visibly unfinished. Turning it on is deleting a constant.
 */
const PROFESSIONAL_REVIEW_IS_LIVE = false;

export function TierStep({ meta, wizard }: ClubStepProps) {
  const {
    watch,
    formState: { errors },
  } = wizard.form;

  const current = watch("tier");

  return (
    <>
      <StepHeading note="This changes what we ask for next.">
        What kind of club is this?
      </StepHeading>

      <StepStagger index={1}>
        <RadioGroup
          value={current || null}
          onChange={(key) => wizard.choose("tier", key)}
          options={meta.tiers.map((tier) => {
            const isGated =
              tier.key === PROFESSIONAL_TIER && !PROFESSIONAL_REVIEW_IS_LIVE;

            return {
              value: tier.key,
              label: tier.label,
              hint: isGated
                ? "Not open yet. We are still building the checks."
                : (tier.description ?? undefined),
              disabled: isGated,
            };
          })}
          error={errors.tier?.message}
        />
      </StepStagger>
    </>
  );
}
