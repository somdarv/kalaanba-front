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
 * `<AuthShell>` — the split auth layout.
 *
 * Desktop (`lg`): one large panel centred on the page ground — form left,
 * image inset right, roughly 40/60 so the art carries the screen. The radius
 * maths is exact: `--radius-panel` (28px) outside, `p-2` (8px) of ground, so
 * the inset lands on `--radius-card` (20px).
 *
 * The panel is the **floating** tier of DESIGN_LANGUAGE §2.4 applied at the
 * `lg` breakpoint. It cannot use the `.elev-floating` class directly — that
 * class is unconditional, and on mobile this same element is a full-bleed
 * column with no ground or shadow of its own — so the tokens are applied
 * responsively instead of re-derived.
 *
 * **Deviation from §2.4, by product decision (2026-08-19):** the recipe's
 * `--border-strong` hairline is dropped. At L 0.600 against paper it reads as
 * a hard drawn box. §4.3 says the border carries depth before the shadow
 * does, so something has to take over that job: on `lg` the page ground steps
 * back to `--surface` while the card stays paper, and the tier is carried by
 * ground separation + `--shadow-lg` rather than by a line.
 *
 * Why `--surface-overlay` and not `--surface` for the card itself: the light
 * ladder *descends*. `--surface` (L 0.972) is the recessed tone for inline and
 * inset regions; raised and floating both stay paper (L 1.000) and earn their
 * tier from shadow. A floating card painted `--surface` reads as a grey slab
 * on white — which is exactly what it did.
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
        "relative flex min-h-dvh flex-col bg-bg lg:bg-surface",
        "lg:items-center lg:justify-center lg:p-8 2xl:p-12",
        className,
      )}
    >
      {/* The panel: a full-bleed column on a phone, a large paper card on a
          desk — no border, the ground steps back instead. */}
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col",
          "lg:h-[min(52rem,92dvh)] lg:max-w-[90rem] lg:flex-none lg:flex-row-reverse",
          "lg:rounded-panel lg:bg-surface-overlay lg:p-2",
          "lg:shadow-[var(--highlight-inset),var(--shadow-lg)]",
        )}
      >
        {/* Image half — top band on mobile, the larger inset on desktop.
            Deliberately short on mobile: every dvh spent here is a dvh the
            sheet cannot use, and the sheet has to hold a 56px CTA above the
            safe area. */}
        <div
          className={cn(
            "relative h-[32dvh] max-h-72 min-h-40 w-full shrink-0 overflow-hidden",
            "lg:h-full lg:max-h-none lg:w-[58%] lg:rounded-card",
          )}
        >
          {hero}
        </div>

        {/* Form half — rises over the image on mobile. */}
        <div
          className={cn(
            "relative z-10 -mt-8 flex min-h-0 flex-1 flex-col rounded-t-panel bg-bg",
            "lg:mt-0 lg:w-[42%] lg:overflow-y-auto lg:rounded-none lg:bg-transparent",
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
                // `my-auto` rather than `justify-center` on the parent: auto
                // margins collapse to 0 when the content outgrows the card, so
                // a tall step stays scrollable instead of losing its head.
                "lg:my-auto lg:max-w-[27rem] lg:flex-none lg:py-8",
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
