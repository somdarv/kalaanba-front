"use client";

import { RadioGroup } from "@/components/ui";

import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 5 — availability (Player & Affiliation §12).
 *
 * Each option states its own consequence, because this signal is not for the
 * player: it aggregates into club readiness, and a signal nobody understands
 * is a signal answered carelessly. Both the label and the consequence line
 * come from config — §12 explicitly anticipates an admin relabelling
 * "Available" to "Ready to Go".
 *
 * Rendered with the shared `<RadioGroup>` rather than the bespoke
 * `<ChoiceCard>` stack. It is the same question shape the rest of the app
 * already answers with radios, and the selected card was a solid brand fill
 * that shouted louder than the primary CTA underneath it (§4.3: one primary
 * action per viewport). The radio's tint plus dot says "chosen" without
 * competing, and the dot means colour is not the only signal (§6).
 *
 * Unlike the earlier single-tap steps this one does not auto-advance. It is
 * the last question, so advancing means submitting, and a write should follow
 * a deliberate press rather than a timer.
 */
export function AvailabilityStep({ wizard, meta }: StepProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = wizard.form;

  const current = watch("availability_status");

  return (
    <>
      <StepHeading
        lead="Step 5 of 5"
        note="Clubs picking a squad see this. You can change it any time."
      >
        Are you free to play?
      </StepHeading>

      <StepStagger index={1}>
        <RadioGroup
          value={current || null}
          onChange={(key) =>
            setValue("availability_status", key, { shouldValidate: true })
          }
          options={meta.availability.map((option) => ({
            value: option.key,
            label: option.label,
            hint: option.description ?? undefined,
          }))}
          error={errors.availability_status?.message}
        />
      </StepStagger>
    </>
  );
}
