"use client";

import type { ReactNode } from "react";

import { StepStagger } from "./step-transition";

/**
 * The question at the top of every setup step.
 *
 * One question per screen, at display scale with the tight tracking
 * DESIGN_LANGUAGE §2.6 calls "the single biggest premium signal". The optional
 * `lead` above it carries the *why* — the Proactive principle (§1.2) is the
 * difference between a form that interrogates and one that explains itself.
 */

export type StepHeadingProps = {
  /** Short context line above the question. Optional. */
  lead?: ReactNode;
  /** The question itself. Keep it to a single sentence. */
  children: ReactNode;
  /** Rendered under the question — a hint about what the answer is used for. */
  note?: ReactNode;
};

export function StepHeading({ lead, children, note }: StepHeadingProps) {
  return (
    <StepStagger index={0}>
      <div className="space-y-2">
        {lead ? <p className="text-sm text-fg-muted">{lead}</p> : null}
        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance text-fg sm:text-4xl">
          {children}
        </h1>
        {note ? <p className="text-sm text-fg-muted">{note}</p> : null}
      </div>
    </StepStagger>
  );
}
