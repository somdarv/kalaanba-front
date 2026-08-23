import type { ClubMeta } from "@/lib/api/club";
import type { UseClubCreateWizard } from "@/hooks/use-club-create-wizard";

/**
 * What every step of the club-creation flow receives. Steps render one
 * question and read their answer off the shared form; none of them fetches,
 * validates or submits.
 */
export type ClubStepProps = {
  meta: ClubMeta;
  wizard: UseClubCreateWizard;
};

/**
 * "Step 3 of 7", derived rather than written.
 *
 * Each step used to carry its own literal, which went stale the moment the
 * badge step was inserted between the name and the location and every heading
 * after it started lying by one.
 */
export function stepLead(wizard: UseClubCreateWizard): string {
  return `Step ${wizard.stepIndex + 1} of ${wizard.stepCount}`;
}
