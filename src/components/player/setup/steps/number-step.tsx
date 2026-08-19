"use client";

import { useState } from "react";

import { TextField } from "@/components/ui";

import { NumberTile, TextTile } from "../choice-controls";
import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 3 — preferred shirt number (Player & Affiliation §3; optional per the
 * create contract).
 *
 * The quick picks, and the range behind "Other", both come from config
 * (`player.profile.preferred_number_quick_picks`, `..._min` / `..._max`) —
 * ADR-0007. A tap on a tile confirms and moves on; typing a number does not,
 * because the player is mid-thought and being yanked forward mid-keystroke is
 * the fastest way to make an animated flow feel hostile.
 */
export function NumberStep({ wizard, meta }: StepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = wizard.form;

  const { min, max, quick_picks: quickPicks } = meta.preferred_number;
  const current = watch("preferred_number");
  const isQuickPick = quickPicks.some((pick) => String(pick) === current);
  const [showCustom, setShowCustom] = useState(
    current !== "" && !isQuickPick,
  );

  return (
    <>
      <StepHeading
        lead="Optional — pick one now or leave it."
        note="Your preference across clubs. A competition can still assign you a different squad number."
      >
        Pick your number.
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            {quickPicks.map((pick) => (
              <NumberTile
                key={pick}
                value={pick}
                selected={String(pick) === current && !showCustom}
                onSelect={() => {
                  setShowCustom(false);
                  wizard.chooseAndAdvance("preferred_number", String(pick));
                }}
              />
            ))}
          </div>

          <TextTile
            label="Another number"
            selected={showCustom}
            onSelect={() => {
              setShowCustom(true);
              if (isQuickPick) {
                setValue("preferred_number", "", { shouldValidate: false });
              }
            }}
            className="h-12"
          />

          {showCustom ? (
            <TextField
              label={`Your number (${min}–${max})`}
              purpose="integer"
              placeholder={String(min)}
              maxLength={String(max).length}
              error={errors.preferred_number?.message}
              {...register("preferred_number")}
            />
          ) : errors.preferred_number?.message ? (
            <p role="alert" className="text-sm text-danger-ink">
              {errors.preferred_number.message}
            </p>
          ) : null}
        </div>
      </StepStagger>
    </>
  );
}
