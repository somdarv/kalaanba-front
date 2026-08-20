"use client";

import type { ReactNode } from "react";
import { CaretLeft } from "@phosphor-icons/react";

import {
  IconButton,
  KeyboardFooter,
  Progress,
  flowColumn,
  flowGutter,
} from "@/components/ui";

import { StepTransition } from "./step-transition";

/**
 * Chrome for the player-setup flow: a back affordance, a title, a progress
 * line, the animated step region, and a sticky CTA.
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
}: WizardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-md">
        <div className="relative flex min-h-14 items-center justify-center px-2">
          <IconButton
            className="absolute left-1"
            intent="ghost"
            size="md"
            label={backLabel}
            icon={<CaretLeft size={20} weight="bold" />}
            onClick={onBack}
          />
          <p className="text-sm font-medium text-fg-muted select-none">
            {title}
          </p>
        </div>
        <Progress
          size="sm"
          value={stepIndex + 1}
          max={stepCount}
          className="rounded-none bg-transparent"
          aria-label={`Step ${stepIndex + 1} of ${stepCount}`}
        />
      </header>

      <main className={`flex-1 overscroll-contain ${flowGutter} pt-12 pb-6 sm:pt-14`}>
        <div className={flowColumn}>
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
