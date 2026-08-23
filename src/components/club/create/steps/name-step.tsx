"use client";

import { TextField } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";

import { PROFESSIONAL_TIER } from "@/lib/api/club";

import { stepLead, type ClubStepProps } from "./step-props";

/**
 * Step 3 — the club name (Club §5 step 1, §11).
 *
 * The bounds come from `club.profile.name_min_length` / `_max_length` through
 * the vocabulary, not from literals here (ADR-0007 §3).
 *
 * **This step deliberately cannot tell you a name is taken until you submit.**
 * A local club may not use a name that belongs to a real one, but the list of
 * those names is config that changes without a deploy, the verdict is backend
 * truth (Law 3), and shipping the list to the client would publish the map for
 * routing around it (ADR-0017 §4). So the check happens on submit and the
 * answer comes back to this field. One round trip is the price.
 *
 * The note under the question warns an official claimant before they type,
 * because for them the same name means a review rather than a refusal, and
 * being told that after submitting reads as a rejection.
 */
export function NameStep({ meta, wizard }: ClubStepProps) {
  const {
    register,
    formState: { errors },
  } = wizard.form;

  const isProfessional = wizard.tier?.key === PROFESSIONAL_TIER;

  return (
    <>
      <StepHeading
        lead={stepLead(wizard)}
        note={
          isProfessional
            ? "Use the club's real name. We check it before the club goes live."
            : "You can change this later."
        }
      >
        What is your club called?
      </StepHeading>

      <StepStagger index={1}>
        <TextField
          label="Club name"
          purpose="name"
          autoFocus
          maxLength={meta.name.max_length}
          error={errors.name?.message}
          {...register("name")}
        />
      </StepStagger>
    </>
  );
}
