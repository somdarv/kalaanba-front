"use client";

import { ChoiceCard } from "../choice-controls";
import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 5 — availability (Player & Affiliation §12).
 *
 * Each option states its own consequence, because this signal is not for the
 * player: it aggregates into club readiness, and a signal nobody understands
 * is a signal answered carelessly. Both label and consequence line come from
 * config — §12 explicitly anticipates an admin relabelling "Available" to
 * "Ready to Go".
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
        lead="Last one."
        note="Clubs building a squad see this. You can change it any time."
      >
        Are you free to play?
      </StepHeading>

      <StepStagger index={1}>
        <div
          role="group"
          aria-label="Availability"
          className="flex flex-col gap-2"
        >
          {meta.availability.map((option) => (
            <ChoiceCard
              key={option.key}
              label={option.label}
              description={option.description}
              selected={option.key === current}
              onSelect={() =>
                setValue("availability_status", option.key, {
                  shouldValidate: true,
                })
              }
            />
          ))}
          {errors.availability_status?.message ? (
            <p role="alert" className="text-sm text-danger-ink">
              {errors.availability_status.message}
            </p>
          ) : null}
        </div>
      </StepStagger>
    </>
  );
}
