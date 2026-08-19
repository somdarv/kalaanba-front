"use client";

/**
 * LiveIndicator — the in-play signal.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.2 (`--live` is a semantic role,
 *    not a decorative accent)
 *  - docs/design-system/DESIGN_LANGUAGE.md §3.6 (reduced motion: the pulse is
 *    decoration, so it collapses; the label carries the meaning)
 *  - docs/design-system/DESIGN_LANGUAGE.md §6 ("Color is never the only
 *    signal — pair with icon, label, or shape")
 *
 * This is the ONLY component permitted to use `--live`. The colour is
 * rationed on purpose: one electric hue in an otherwise restrained system
 * reads as "something is happening right now" precisely because nothing else
 * competes with it. Spend it on a decorative accent and it stops meaning
 * anything.
 *
 * The minute is a prop. Constitution Law 3 — the backend owns match state;
 * this renders what it is told.
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LiveIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Display label. Configurable per Law 4 — logic keys on the internal
   * `live` status elsewhere; this string is what the user reads.
   */
  label?: ReactNode;
  /** Current minute, e.g. "67'" or "HT". Rendered tabular. */
  minute?: ReactNode;
  /** `pill` for standalone use, `inline` inside a dense row. */
  variant?: "pill" | "inline";
};

export function LiveIndicator({
  label = "Live",
  minute,
  variant = "pill",
  className,
  ...rest
}: LiveIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold whitespace-nowrap",
        variant === "pill"
          ? cn(
              "rounded-pill px-2.5 py-1 text-xs",
              "bg-[color-mix(in_oklab,transparent,var(--live)_16%)]",
              "text-live-ink",
              "border border-[color-mix(in_oklab,transparent,var(--live)_30%)]",
            )
          : "text-live-ink text-xs",
        className,
      )}
      {...rest}
    >
      <span className="relative inline-flex size-2 shrink-0" aria-hidden="true">
        {/* The pip is decoration. `.kx-alive` is deliberately NOT applied —
            §3.6's reduced-motion blanket should collapse this, because the
            label beside it already carries the meaning without motion. */}
        <span className="bg-live absolute inset-0 animate-[kx-live-pip_1.8s_ease-in-out_infinite] rounded-pill" />
      </span>
      <span>{label}</span>
      {minute ? (
        <span className="kx-numeric text-live-ink/85 tabular-nums">{minute}</span>
      ) : null}
    </span>
  );
}
