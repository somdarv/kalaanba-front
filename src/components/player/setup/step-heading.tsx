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
 *
 * Rhythm (2026-08-19): the question is the loudest thing here, so its own two
 * lines have to read as one object. `leading-tight` is 1.25, which at 30px put
 * ~8px of air between "What do they call you" and "on the pitch?" and split
 * the sentence in half. It is now 1.05. The lead sits close above it and the
 * note drops further below, so the eye gets question first, detail second,
 * instead of three evenly spaced strangers.
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
      <div>
        {lead ? (
          <p className="mb-1.5 text-sm font-medium text-primary-ink">{lead}</p>
        ) : null}
        <h1 className="font-display text-[1.9rem] leading-[1.05] font-bold tracking-tight text-balance text-fg sm:text-[2.35rem]">
          {children}
        </h1>
        {note ? (
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{note}</p>
        ) : null}
      </div>
    </StepStagger>
  );
}
