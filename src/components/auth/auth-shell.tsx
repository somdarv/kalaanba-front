"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";

import { cn } from "@/lib/cn";
import { AUTH_BACKDROP_SRC } from "./auth-hero";

/**
 * `<AuthShell>` — the split auth layout.
 *
 * Desktop (`lg`): one panel floating on a thrown-out-of-focus copy of the hero
 * art — form on the left, image inset on the right. It is the `floating`
 * elevation recipe (DESIGN_LANGUAGE §2.4: ground + `--border-strong` +
 * `--shadow-lg`) at page scale rather than at popover scale. The radius maths
 * is exact: `--radius-panel` (28px) outside, `p-2` (8px) of ground, so the
 * inset lands on `--radius-card` (20px).
 *
 * Mobile (§9, mobile-first): the image takes the top third and the form sheet
 * rises over its bottom edge with a rounded lip (BottomSheet language). The
 * sheet is a *bounded* flex column — header and fields scroll inside it while
 * the CTA sits on the floor of the viewport (see `<AuthStep>`). That is what
 * puts the primary action in the thumb zone instead of wherever the content
 * happens to end.
 *
 * Motion: Framer is lazy-loaded here (per-route, never at root — §3.3/§9.6)
 * via `LazyMotion` + `m`. The panel does one soft entrance (opacity + y,
 * GPU-only per §3.4) on the canonical `--ease-out` curve, honouring
 * `prefers-reduced-motion` (§3.6).
 */
export type AuthShellProps = {
  /** The full-bleed visual half (usually `<AuthHero>`). */
  hero: ReactNode;
  /** The form half — normally an `<AuthStep>`. */
  children: ReactNode;
  className?: string;
};

export function AuthShell({ hero, children, className }: AuthShellProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative isolate flex min-h-dvh flex-col bg-bg",
        "lg:items-center lg:justify-center lg:p-8",
        className,
      )}
    >
      <AuthBackdrop />

      {/* The panel: a full-bleed column on a phone, a floating card on a desk. */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-1 flex-col",
          "lg:h-[min(46rem,88dvh)] lg:max-w-6xl lg:flex-none lg:flex-row-reverse",
          "lg:rounded-panel lg:border lg:border-border-strong lg:bg-surface lg:p-2",
          "lg:shadow-[var(--shadow-lg)]",
        )}
      >
        {/* Image half — top band on mobile, right inset on desktop. Deliberately
            short on mobile: every dvh spent here is a dvh the sheet cannot use,
            and the sheet has to hold a 56px CTA above the safe area. */}
        <div
          className={cn(
            "relative h-[32dvh] max-h-72 min-h-40 w-full shrink-0 overflow-hidden",
            "lg:h-full lg:max-h-none lg:w-1/2 lg:rounded-card",
          )}
        >
          {hero}
        </div>

        {/* Form half — rises over the image on mobile. */}
        <div
          className={cn(
            "relative z-10 -mt-8 flex min-h-0 flex-1 flex-col rounded-t-panel bg-bg",
            "lg:mt-0 lg:w-1/2 lg:overflow-y-auto lg:rounded-none lg:bg-transparent",
          )}
        >
          {/* Sheet grabber — mobile affordance only. */}
          <span
            aria-hidden
            className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border-strong lg:hidden"
          />

          <LazyMotion features={domAnimation} strict>
            <m.div
              // `initial` MUST be identical on server + client to avoid a
              // hydration mismatch — do not branch it on `useReducedMotion()`
              // (false on the server, possibly true on the client). Reduced
              // motion is honoured via the transition duration instead.
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col pt-3",
                // `my-auto` rather than `justify-center` on the parent: auto margins
                // collapse to 0 when the content outgrows the card, so a tall step
                // stays scrollable instead of having its head clipped off.
                "lg:my-auto lg:max-w-[26rem] lg:flex-none lg:py-8",
              )}
            >
              {children}
            </m.div>
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}

/**
 * The hero art again, thrown out of focus behind the panel — the depth cue
 * that makes the card read as *floating* rather than as a box on a flat page.
 *
 * Desktop-only, and `hidden` rather than conditionally rendered: `next/image`
 * is lazy by default and a lazy image inside `display: none` never enters the
 * viewport, so no phone pays for a second download.
 */
function AuthBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      <Image
        src={AUTH_BACKDROP_SRC}
        alt=""
        fill
        sizes="100vw"
        className="scale-110 object-cover blur-2xl"
      />
      {/* Ground veil — keeps the panel's border and shadow legible against
          whatever the photograph is doing behind it. */}
      <div className="absolute inset-0 bg-bg/75" />
    </div>
  );
}
