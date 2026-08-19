"use client";

import { useMemo } from "react";

import { ChipToggle, TextField } from "@/components/ui";

import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 2 — the stage / jersey name (Player & Affiliation §3).
 *
 * This is the name that leads on cards, lineups and goal alerts, so it gets a
 * screen to itself. The suggestion chips are built from the name the player
 * just typed: no network, no backend truth, purely a way to make the common
 * case one tap instead of one more keyboard.
 */
export function StageNameStep({ wizard }: StepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = wizard.form;

  const current = watch("stage_name");
  const firstName = watch("first_name");
  const lastName = watch("last_name");

  const suggestions = useMemo(() => {
    const candidates = [lastName, firstName]
      .map((part) => part.trim().toUpperCase())
      .filter((part) => part.length > 0);
    return Array.from(new Set(candidates));
  }, [firstName, lastName]);

  return (
    <>
      <StepHeading
        lead="Now the one that matters."
        note="This leads on your player card, in lineups, and on goal alerts."
      >
        What do they call you on the pitch?
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-3">
          <TextField
            label="Football name"
            purpose="name"
            placeholder="Kaka"
            error={errors.stage_name?.message}
            {...register("stage_name")}
          />

          {suggestions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-fg-muted">Or use</span>
              {suggestions.map((suggestion) => (
                <ChipToggle
                  key={suggestion}
                  pressed={current.trim().toUpperCase() === suggestion}
                  onClick={() =>
                    setValue("stage_name", suggestion, {
                      shouldValidate: true,
                    })
                  }
                >
                  {suggestion}
                </ChipToggle>
              ))}
            </div>
          ) : null}
        </div>
      </StepStagger>
    </>
  );
}
