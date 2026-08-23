"use client";

import { RadioGroup } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";

import { stepLead, type ClubStepProps } from "./step-props";

/**
 * Step 2 — what kind of team, within the tier already chosen (Club §3).
 *
 * The list is filtered to the chosen door by `club.types.tier`, so a local team
 * is never offered "Registered club" and an official one is never offered
 * "Friends or crew". Filtering rather than disabling: an option that cannot be
 * picked, sitting greyed out under a heading, only invites a tap that does
 * nothing.
 */
export function TypeStep({ wizard }: ClubStepProps) {
  const {
    watch,
    formState: { errors },
  } = wizard.form;

  const current = watch("club_type");

  return (
    <>
      <StepHeading lead={stepLead(wizard)} note="Pick the closest one.">
        What kind of team?
      </StepHeading>

      <StepStagger index={1}>
        <RadioGroup
          value={current || null}
          onChange={(key) => wizard.choose("club_type", key)}
          options={wizard.typesForTier.map((type) => ({
            value: type.key,
            label: type.label,
            hint: type.description ?? undefined,
          }))}
          error={errors.club_type?.message}
        />
      </StepStagger>
    </>
  );
}
