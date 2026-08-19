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
    formState: { errors },
  } = wizard.form;

  return (
    <>
      <StepHeading
        lead="Optional — but clubs search on it."
        note="Where you play most. Secondary positions come later."
      >
        Where do you play?
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-2">
          <PitchPicker
            legend="Primary position"
            options={meta.positions}
            value={watch("primary_position")}
            onChange={(key) =>
              wizard.chooseAndAdvance("primary_position", key)
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
