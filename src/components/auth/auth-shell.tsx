"use client";

import type { ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";

import { cn } from "@/lib/cn";

/**
 * `<AuthShell>` — the hero-split auth layout.
 *
 * Mobile (DESIGN_LANGUAGE.md §9, mobile-first): hero fills ~2/3 of the
 * viewport; the form sheet rises over its bottom edge with a rounded lip
 * (BottomSheet language). Desktop (`lg`): hero on the left half, form
 * centered on the right.
 *
 * Motion: Framer is lazy-loaded here (per-route, never at root — §3.3/§9.6)
 * via `LazyMotion` + `m`. The panel does one soft entrance (opacity + y,
 * GPU-only per §3.4) on the canonical `--ease-out` curve, honouring
 * `prefers-reduced-motion` (§3.6).
 */
export type AuthShellProps = {
  /** The full-bleed visual half (usually `<AuthHero>`). */
  hero: ReactNode;
  /** The form half. */
  children: ReactNode;
  className?: string;
};

export function AuthShell({ hero, children, className }: AuthShellProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col bg-bg lg:flex-row",
        className,
      )}
    >
      {/* Hero — 2/3 on mobile, left half on desktop. */}
      <div className="relative h-[62dvh] w-full shrink-0 lg:h-dvh lg:w-1/2 lg:shrink">
        {hero}
      </div>

      {/* Form panel — rises over the hero on mobile, right half on desktop. */}
      <div
        className={cn(
          "relative z-10 -mt-7 flex flex-1 flex-col rounded-t-[2rem] bg-bg",
          "lg:mt-0 lg:w-1/2 lg:items-center lg:justify-center lg:overflow-y-auto lg:rounded-none",
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
              "mx-auto flex w-full max-w-sm flex-1 flex-col gap-6",
              "px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
              "lg:max-w-md lg:flex-none lg:py-12",
            )}
          >
            {children}
          </m.div>
        </LazyMotion>
      </div>
    </div>
  );
}
