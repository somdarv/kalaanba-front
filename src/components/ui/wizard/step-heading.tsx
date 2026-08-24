"use client";

import type { ReactNode } from "react";

import { StepStagger } from "./step-transition";

/**
 * The question at the top of a step in a guided flow.
 *
 * One question per screen, at display scale.
 *
 * **Type spec, from a supplied design (WP-20260824-setup-surface): Sora Bold,
 * 44 / 1.0 / tracking 0.** This is the ONE display role in the product that
 * sets flat; DESIGN_LANGUAGE §2.6 now records it as an explicit exception to
 * its own "tight tracking is non-negotiable", rather than this file quietly
 * disagreeing with the doc.
 *
 * The 44 is a `clamp`, not a breakpoint pair, because 44 is the *drawn* size
 * and the only thing that should reduce it is genuinely not having the room.
 * The column here is 80% of the viewport (§9.2 `flowGutter`), so a 360px phone
 * offers 288px and a 26-character question would set on three lines at 44px.
 * `clamp(2rem, 8.8vw, 2.75rem)` holds 44 from about 500px up and floors at 32,
 * which is still above the 30.4 this heading used to set at on a phone.
 *
 * **The step count is gone from here.** It lives in `<WizardStepper>` at the
 * top of the column, derived once. Twelve steps across two flows each used to
 * print their own "Step 3 of 7", five of them as literals.
 *
 * Rhythm (2026-08-19): the question is the loudest thing here, so its own two
 * lines have to read as one object. `leading-tight` is 1.25, which at 30px put
 * ~8px of air between "What do they call you" and "on the pitch?" and split
 * the sentence in half. It is now 1.05. The lead sits close above it and the
 * note drops further below, so the eye gets question first, detail second,
 * instead of three evenly spaced strangers.
 */

export type StepHeadingProps = {
  /** The question itself. Keep it to a single sentence. */
  children: ReactNode;
  /** Rendered under the question — a hint about what the answer is used for. */
  note?: ReactNode;
};

export function StepHeading({ children, note }: StepHeadingProps) {
  return (
    <StepStagger index={0}>
      <div>
        <h1 className="font-display text-fg text-[clamp(2rem,8.8vw,2.75rem)] leading-none font-bold tracking-normal text-balance">
          {children}
        </h1>
        {note ? (
          <p className="text-fg-muted mt-3 text-sm leading-relaxed">{note}</p>
        ) : null}
      </div>
    </StepStagger>
  );
}
