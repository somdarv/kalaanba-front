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
        lead="Step 3 of 5"
        note="The number you like. A club can still give you another one."
      >
        Pick your number
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-3">
          {/* One mode at a time. The grid and the free-entry field used to sit
              on screen together, so the player was asked to pick a number and
              to type a number in the same breath. Choosing "Write your own
              number" now replaces the grid instead of appending to it. */}
          {showCustom ? (
            <>
              <TextField
                label="Your number"
                hint={`Any number from ${min} to ${max}.`}
                purpose="integer"
                inputMode="numeric"
                placeholder={String(min)}
                maxLength={String(max).length}
                autoFocus
                error={errors.preferred_number?.message}
                {...register("preferred_number")}
              />
              <TextTile
                label="Back to the quick picks"
                selected={false}
                onSelect={() => {
                  setShowCustom(false);
                  setValue("preferred_number", "", { shouldValidate: false });
                }}
                className="h-12"
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2">
                {quickPicks.map((pick) => (
                  <NumberTile
                    key={pick}
                    value={pick}
                    selected={String(pick) === current}
                    onSelect={() => {
                      setShowCustom(false);
                      wizard.chooseAndAdvance("preferred_number", String(pick));
                    }}
                  />
                ))}
              </div>

              <TextTile
                label="Write your own number"
                selected={false}
                onSelect={() => {
                  setShowCustom(true);
                  if (isQuickPick) {
                    setValue("preferred_number", "", { shouldValidate: false });
                  }
                }}
                className="h-12"
              />

              {errors.preferred_number?.message ? (
                <p role="alert" className="text-sm text-danger-ink">
                  {errors.preferred_number.message}
                </p>
              ) : null}
            </>
          )}
        </div>
      </StepStagger>
    </>
  );
}
