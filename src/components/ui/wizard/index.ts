/**
 * Guided-flow chrome: the shell a multi-step flow sits in, the transitions
 * between its steps, the question at the top of one, and the option controls
 * a step offers.
 *
 * Pure presentation. Nothing here fetches, validates or knows what is being
 * set up — a flow supplies its own state machine and steps. Promoted out of
 * `player/setup/` in WP-20260823 when club creation became the second caller;
 * `ui/` is the flavor engineering-standards §3 reserves for exactly this.
 */
export { WizardShell } from "./wizard-shell";
export type { WizardShellProps } from "./wizard-shell";
export { StepTransition, StepStagger, RevealBeat } from "./step-transition";
export { WizardStepper } from "./wizard-stepper";
export type { WizardStepperProps } from "./wizard-stepper";
export { FlowAnnouncement, ANNOUNCEMENT_HOLD_MS } from "./flow-announcement";
export type { FlowAnnouncementProps } from "./flow-announcement";
export { StepHeading } from "./step-heading";
export type { StepHeadingProps } from "./step-heading";
export { NumberTile, TextTile, ChoiceCard } from "./choice-controls";
export type {
  NumberTileProps,
  TextTileProps,
  ChoiceCardProps,
} from "./choice-controls";
