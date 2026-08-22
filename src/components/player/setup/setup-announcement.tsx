"use client";

import { Check } from "@phosphor-icons/react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/**
 * "Profile created" — the moment, not the screen.
 *
 * This holds the top of the reveal on its own for a beat and then leaves, and
 * the profile takes the space it was using. It is deliberately transient:
 * DESIGN_LANGUAGE §1.1 (Solid) wants confirmation the write landed, and §4.3
 * wants one thing asking for attention at a time. A permanent "Profile
 * created" banner satisfies the first and breaks the second, because it sits
 * over the card competing with it forever. A moment satisfies both.
 *
 * The mark stamps in on `--ease-entrance` (§3.2 — the arrival easing, with its
 * hint of overshoot) before the words arrive, because a tick is read faster
 * than a sentence. Only `transform` and `opacity` move (§3.4).
 *
 * `role="status"` so the confirmation reaches a screen reader rather than
 * being a purely visual event. Reduced motion skips the whole act (§3.6) —
 * the caller unmounts this immediately and goes straight to the profile.
 */

const DURATION_S = 0.24;
const MARK_DELAY_S = 0.1;
const WORDS_DELAY_S = 0.3;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_ENTRANCE = [0.16, 1.05, 0.4, 1] as const;

/** How long the moment holds before it hands the screen over, in ms. */
export const ANNOUNCEMENT_HOLD_MS = 1500;

export function SetupAnnouncement() {
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : DURATION_S;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        role="status"
        className="flex flex-col items-center gap-4 py-8 text-center"
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration, ease: EASE_OUT }}
      >
        <m.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration,
            delay: reduce ? 0 : MARK_DELAY_S,
            ease: EASE_ENTRANCE,
          }}
          className="bg-primary text-on-primary inline-flex size-16 items-center justify-center rounded-full"
        >
          <Check size={32} weight="bold" />
        </m.span>

        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: reduce ? 0 : WORDS_DELAY_S,
            ease: EASE_OUT,
          }}
          className="font-display text-fg text-2xl font-bold tracking-tight"
        >
          Profile created
        </m.p>
      </m.div>
    </LazyMotion>
  );
}
