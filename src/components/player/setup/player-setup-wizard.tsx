"use client";

import type { FormEvent, ReactElement } from "react";
import { ArrowRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui";
import type { PlayerMeta } from "@/lib/api/player";
import {
  usePlayerSetupWizard,
  type PlayerSetupValues,
  type WizardStepId,
} from "@/hooks/use-player-setup-wizard";

import { SetupReveal } from "./setup-reveal";
import { WizardShell } from "./wizard-shell";
import { AvailabilityStep } from "./steps/availability-step";
import { IdentityStep } from "./steps/identity-step";
import { NumberStep } from "./steps/number-step";
import { PositionStep } from "./steps/position-step";
import { StageNameStep } from "./steps/stage-name-step";
import type { StepProps } from "./steps/step-props";

/**
 * Player-profile setup as a guided flow (WP-20260819-player-setup-wizard).
 *
 * Composes the shell, the steps and the reveal; all state lives in
 * `usePlayerSetupWizard`. The six fields it collects are exactly the V1 set in
 * Player & Affiliation §6 — nothing here may ask for a field the create
 * contract does not accept.
 *
 * Wrapped in a real `<form>` so the on-screen keyboard's action key advances
 * the step, which is what makes the typing steps usable one-handed.
 */

const STEP_COMPONENTS: Record<
  WizardStepId,
  (props: StepProps) => ReactElement
> = {
  identity: IdentityStep,
  stage_name: StageNameStep,
  number: NumberStep,
  position: PositionStep,
  availability: AvailabilityStep,
};

/** Steps whose field is optional in the contract, and so may be passed over. */
const SKIPPABLE: Partial<Record<WizardStepId, keyof PlayerSetupValues>> = {
  number: "preferred_number",
  position: "primary_position",
};

export type PlayerSetupWizardProps = {
  meta: PlayerMeta;
  /** Prefill from the Identity account name (§3 — a different engine's field). */
  defaults?: { firstName?: string; lastName?: string };
  /** Back out of the flow from the first step. */
  onExit: () => void;
  /** Continue to club discovery once the profile exists. */
  onFindClub: () => void;
  /** Leave the flow once the profile exists, without picking a club. */
  onGoHome: () => void;
};

export function PlayerSetupWizard({
  meta,
  defaults,
  onExit,
  onFindClub,
  onGoHome,
}: PlayerSetupWizardProps) {
  const wizard = usePlayerSetupWizard({ meta, defaults });

  if (wizard.player) {
    return (
      <SetupReveal
        player={wizard.player}
        meta={meta}
        onFindClub={onFindClub}
        onGoHome={onGoHome}
      />
    );
  }

  const Step = STEP_COMPONENTS[wizard.step];
  const skippableField = SKIPPABLE[wizard.step];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void wizard.goNext();
  };

  const skip = () => {
    if (!skippableField) return;
    wizard.form.setValue(skippableField, "", { shouldValidate: false });
    void wizard.goNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <WizardShell
        title="Player profile"
        stepIndex={wizard.stepIndex}
        stepCount={wizard.stepCount}
        stepKey={wizard.step}
        direction={wizard.direction}
        onBack={wizard.isFirstStep ? onExit : wizard.goBack}
        backLabel={wizard.isFirstStep ? "Leave setup" : "Previous step"}
        footer={
          <div className="flex flex-col gap-2">
            {wizard.submitError ? (
              <p role="alert" className="text-danger-ink text-center text-sm">
                {wizard.submitError}
              </p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={wizard.isSubmitting}
              loadingText="Creating your profile"
              trailingIcon={<ArrowRight size={18} weight="bold" />}
            >
              {wizard.isLastStep ? "Create my profile" : "Next step"}
            </Button>
            {skippableField ? (
              <Button intent="ghost" fullWidth onClick={skip}>
                Skip for now
              </Button>
            ) : null}
          </div>
        }
      >
        <Step wizard={wizard} meta={meta} />
      </WizardShell>
    </form>
  );
}
