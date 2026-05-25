"use client";

import { cn } from "@/lib/cn";

/**
 * `<Progress>` — linear progress indicator.
 *
 * Port of the legacy `KxProgress` recipe (kalaanba-front/src/components/_archive/
 * showcase/primitives.tsx, line 406):
 *
 *   track:       h-2 rounded-full bg-surface-2 overflow-hidden
 *   fill:        bg-primary transition-[width] duration-700 ease-out
 *   indeterminate: a shimmer overlay animated via the `kx-progress` keyframes
 *                  declared in globals.css.
 *
 * Determinate progress is the canonical use. Indeterminate is for "we don't
 * know how long this takes" states. We never use it to fake activity.
 *
 * A11y: `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and
 * `aria-valuenow` (omitted when indeterminate, per WAI-ARIA).
 */

export type ProgressSize = "sm" | "md" | "lg";

export type ProgressProps = {
  /** Current value (0 → `max`). Ignored when `indeterminate` is true. */
  value?: number;
  /** Upper bound. Defaults to 100. */
  max?: number;
  /** Show an indeterminate shimmer instead of a fixed fill. */
  indeterminate?: boolean;
  size?: ProgressSize;
  /** Accessible label when no visible label exists. */
  "aria-label"?: string;
  /** Bind to a visible label by id. Preferred over `aria-label` when possible. */
  "aria-labelledby"?: string;
  className?: string;
};

const SIZE_HEIGHT: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  max = 100,
  indeterminate,
  size = "md",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const pct = indeterminate
    ? 100
    : Math.min(100, Math.max(0, ((value ?? 0) / safeMax) * 100));

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-surface-2",
        SIZE_HEIGHT[size],
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-primary",
          // Smooth fill animation for determinate progress — width transition,
          // not transform. Width is safe; translate is reserved for the
          // indeterminate shimmer below.
          "transition-[width] duration-700 ease-out",
        )}
        style={{ width: `${pct}%` }}
      />
      {indeterminate ? (
        <div
          aria-hidden
          className="absolute inset-y-0 w-1/3 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--on-pink) 70%, transparent), transparent)",
            animation: "kx-progress 1.4s ease-in-out infinite",
          }}
        />
      ) : null}
    </div>
  );
}
