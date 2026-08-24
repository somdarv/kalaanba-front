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

/*
 * `stepLead()` lived here and is gone (WP-20260824-setup-surface). It existed
 * because each step carried its own "Step 3 of 7" literal and they went stale
 * the moment the badge step was inserted; deriving it fixed the lying, but it
 * still printed the count above every question. `<WizardStepper>` in the shell
 * now carries it once, for both flows, so the steps say nothing about where
 * they sit in the order.
 */
