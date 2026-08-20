"use client";

import { PitchPicker } from "../pitch-picker";
import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 4 — primary position (Player & Affiliation §6; optional at creation).
 *
 * Rendered as a pitch rather than a select — see `PitchPicker` for why. The
 * option set and its order are config (`player.positions`), so this component
 * knows nothing about goalkeepers.
 */
export function PositionStep({ wizard, meta }: StepProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = wizard.form;

  return (
    <>
      <StepHeading
        lead="Step 4 of 5"
        note="Pick the one spot you play most."
      >
        Where do you play?
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-2">
          <PitchPicker
            legend="Your position"
            options={meta.positions}
            value={watch("primary_position")}
            // Sets the answer and stops there. The other single-tap steps
            // auto-advance, and that is right when the tap IS the answer, but
            // here the tap is the start of one: the player wants to read the
            // line that appears under the pitch and check they picked the
            // right spot. Yanking the screen away mid-thought is the fastest
            // way to make a flow feel hostile. "Next step" moves on.
            onChange={(key) =>
              setValue("primary_position", key, { shouldValidate: true })
            }
          />
          {errors.primary_position?.message ? (
            <p role="alert" className="text-sm text-danger-ink">
              {errors.primary_position.message}
            </p>
          ) : null}
        </div>
      </StepStagger>
    </>
  );
}
