"use client";

import type { ReactNode } from "react";
import { CaretLeft } from "@phosphor-icons/react";

import {
  IconButton,
  KeyboardFooter,
  flowColumn,
  flowGutter,
} from "@/components/ui";

import { StepTransition } from "./step-transition";
import { WizardStepper } from "./wizard-stepper";

/**
 * Chrome for a guided flow: a back affordance, a title, a progress line, the
 * animated step region, and a sticky CTA.
 *
 * Promoted out of `player/setup/` in WP-20260823 when club creation became the
 * second caller. It knows nothing about what is being set up; a flow brings its
 * own state machine, its own steps and its own footer.
 *
 * Layout follows DESIGN_LANGUAGE §9.2 — `min-h-dvh` (never `100vh`), edge
 * padding that respects the safe-area insets, and a scroll region that
 * contains its own overscroll (§9.5) so a rubber-band at the end of a step
 * cannot leak into the page behind it. The CTA sits in `<KeyboardFooter>`
 * so it rides above the on-screen keyboard on the typing steps (§9.3).
 *
 * Width and rhythm (2026-08-20): the column is `flowGutter` (80% of the
 * viewport, see `ui/flow-column`) and the step starts well below the bar
 * rather than tucked under it. One question per screen only reads as one
 * question if the question has room around it.
 *
 * Progress is `<WizardStepper>` and it sits at the TOP OF THE COLUMN, not in
 * the bar (WP-20260824-setup-surface). The hairline `<Progress>` it replaces
 * was pinned under the sticky header, full-bleed, where it read as a loading
 * indicator for the page rather than as a position in a flow. Beads want to
 * line up with the question they belong to, so they take the column's own left
 * edge and scroll with it. The bar keeps the back control and the flow's name,
 * which are the two things that genuinely have to stay reachable.
 *
 * The ground texture comes from `<body>` (`.kx-ground-pattern`), so this shell
 * paints no background of its own — a `bg-bg` here only repeated the body
 * colour and covered the layer up.
 *
 * Presentational only — it holds no wizard state.
 */

export type WizardShellProps = {
  /** Small centred title in the top bar. */
  title: string;
  /** 0-based index of the current step. */
  stepIndex: number;
  stepCount: number;
  /** Distinguishes the steps for the transition. */
  stepKey: string;
  direction: 1 | -1;
  onBack: () => void;
  /** Accessible name for the back control — it changes on the first step. */
  backLabel: string;
  children: ReactNode;
  /** The CTA row. Exactly one primary action (§4.3). */
  footer: ReactNode;
  /**
   * What the stepper's pill says. Defaults to "Step 3 of 7".
   *
   * A flow with named steps passes its own word; one that has not settled on
   * names gets the count, which is what every step used to print for itself.
   */
  stepLabel?: string;
  /** Spinner in the pill: this step is working. Usually `isSubmitting`. */
  busy?: boolean;
};

export function WizardShell({
  title,
  stepIndex,
  stepCount,
  stepKey,
  direction,
  onBack,
  backLabel,
  children,
  footer,
  stepLabel,
  busy,
}: WizardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-bg/95 sticky top-0 z-20 backdrop-blur-md">
        <div className="relative flex min-h-14 items-center justify-center px-2">
          <IconButton
            className="absolute left-1"
            intent="ghost"
            size="md"
            label={backLabel}
            icon={<CaretLeft size={20} weight="bold" />}
            onClick={onBack}
          />
          <p className="text-fg-muted text-sm font-medium select-none">
            {title}
          </p>
        </div>
      </header>

      <main
        className={`flex-1 overscroll-contain ${flowGutter} pt-10 pb-6 sm:pt-12`}
      >
        <div className={flowColumn}>
          <WizardStepper
            stepIndex={stepIndex}
            stepCount={stepCount}
            label={stepLabel}
            busy={busy}
            className="mb-9 sm:mb-10"
          />
          <StepTransition stepKey={stepKey} direction={direction}>
            {children}
          </StepTransition>
        </div>
      </main>

      <KeyboardFooter bordered={false} className={`bg-bg/95 ${flowGutter}`}>
        <div className={flowColumn}>{footer}</div>
      </KeyboardFooter>
    </div>
  );
}
