"use client";

import type { ReactNode } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";

/**
 * Direction-aware step swap for the setup flow.
 *
 * Per DESIGN_LANGUAGE §3.4 only `transform` and `opacity` move — the step
 * slides on the axis the player is travelling, so forward and back feel like
 * different actions rather than one generic fade. §3.2 caps small-screen
 * motion at 240ms; `mode="wait"` keeps the two steps from overlapping, which
 * at this scale reads as a shuffle rather than a hand-off.
 *
 * Framer is lazy-loaded here rather than at the root (§3.3, §9.6), and
 * `prefers-reduced-motion` collapses the duration to zero (§3.6).
 */

const SLIDE_PX = 24;
const DURATION_S = 0.24;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * SLIDE_PX }),
  settled: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -SLIDE_PX }),
};

export type StepTransitionProps = {
  /** Changing this key is what triggers the swap. */
  stepKey: string;
  direction: 1 | -1;
  children: ReactNode;
};

export function StepTransition({
  stepKey,
  direction,
  children,
}: StepTransitionProps) {
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : DURATION_S;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <m.div
          key={stepKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="settled"
          exit="exit"
          transition={{ duration, ease: EASE_OUT }}
          className="flex flex-col gap-8 sm:gap-9"
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}

/**
 * Staggered arrival for the pieces inside a step. The question lands first and
 * the controls follow a beat behind, which is what makes a step read as being
 * *presented* rather than swapped in (DESIGN_LANGUAGE §3.1 — soft arrival,
 * confident settle).
 */
export function StepStagger({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : DURATION_S,
          delay: reduce ? 0 : index * 0.05,
          ease: EASE_OUT,
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
