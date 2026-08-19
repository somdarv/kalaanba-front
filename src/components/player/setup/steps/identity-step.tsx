"use client";

import { TextField } from "@/components/ui";

import { StepHeading } from "../step-heading";
import { StepStagger } from "../step-transition";
import type { StepProps } from "./step-props";

/**
 * Step 1 — the formal name (Player & Affiliation §3: "Formal registration,
 * admin, search, legal/trust contexts").
 *
 * It leads because it is already prefilled from the Identity account, so the
 * flow opens with the player confirming rather than typing. The player name is
 * a different engine's field from the account name, which is why it is
 * editable here rather than mirrored.
 */
export function IdentityStep({ wizard }: StepProps) {
  const {
    register,
    formState: { errors },
  } = wizard.form;

  return (
    <>
      <StepHeading lead="Let us put you on the register.">
        First, what&apos;s your name?
      </StepHeading>

      <StepStagger index={1}>
        <div className="flex flex-col gap-4">
          <TextField
            label="First name"
            purpose="given-name"
            hint={"From your account — change it if it's not quite right."}
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <TextField
            label="Last name"
            purpose="family-name"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>
      </StepStagger>
    </>
  );
}
