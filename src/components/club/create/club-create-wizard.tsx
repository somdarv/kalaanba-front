"use client";

import type { FormEvent, ReactElement } from "react";
import { ArrowRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui";
import { WizardShell } from "@/components/ui/wizard";
import { PROFESSIONAL_TIER, type ClubMeta } from "@/lib/api/club";
import {
  useClubCreateWizard,
  type ClubStepId,
} from "@/hooks/use-club-create-wizard";

import { CreateOutcome } from "./create-outcome";
import { AreaStep } from "./steps/area-step";
import { CrestStep } from "./steps/crest-step";
import { HubStep } from "./steps/hub-step";
import { NameStep } from "./steps/name-step";
import { ReviewStep } from "./steps/review-step";
import type { ClubStepProps } from "./steps/step-props";
import { TierStep } from "./steps/tier-step";
import { TypeStep } from "./steps/type-step";

/**
 * Club creation as a guided flow (WP-20260823-club-creation).
 *
 * Composes the shared wizard chrome, the six steps and the outcome; all state
 * lives in `useClubCreateWizard`. The fields it collects are exactly Club §5's
 * V1 set minus the two the doc marks optional — crest ("allow later
 * completion") and co-founder, which needs a phone-invite mechanism no engine
 * ships yet.
 *
 * Wrapped in a real `<form>` so the on-screen keyboard's action key advances
 * the name step, which is what makes it usable one-handed.
 */

const STEP_COMPONENTS: Record<
  ClubStepId,
  (props: ClubStepProps) => ReactElement
> = {
  tier: TierStep,
  type: TypeStep,
  name: NameStep,
  crest: CrestStep,
  hub: HubStep,
  area: AreaStep,
  review: ReviewStep,
};

export type ClubCreateWizardProps = {
  meta: ClubMeta;
  /** Back out of the flow from the first step. */
  onExit: () => void;
  /** Open the club once it exists. */
  onManage: (clubId: string) => void;
  /** Leave the flow once the club exists. */
  onGoHome: () => void;
};

export function ClubCreateWizard({
  meta,
  onExit,
  onManage,
  onGoHome,
}: ClubCreateWizardProps) {
  const wizard = useClubCreateWizard({ meta });

  if (wizard.club) {
    return (
      <CreateOutcome
        club={wizard.club}
        meta={meta}
        onManage={() => onManage(wizard.club!.id)}
        onGoHome={onGoHome}
      />
    );
  }

  const Step = STEP_COMPONENTS[wizard.step];
  const isProfessional = wizard.tier?.key === PROFESSIONAL_TIER;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void wizard.goNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <WizardShell
        title="Start a club"
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
              loadingText={
                isProfessional ? "Sending for checking" : "Creating your club"
              }
              trailingIcon={
                wizard.isLastStep ? undefined : (
                  <ArrowRight size={18} weight="bold" />
                )
              }
            >
              {wizard.isLastStep
                ? isProfessional
                  ? "Send for checking"
                  : "Create club"
                : "Continue"}
            </Button>
          </div>
        }
      >
        <Step meta={meta} wizard={wizard} />
      </WizardShell>
    </form>
  );
}
