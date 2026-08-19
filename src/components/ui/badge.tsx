/**
 * Badge — compact status indicator chip.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §4.1 ("Badge — variants tied to
 *    state colors")
 *  - docs/design-system/DESIGN_LANGUAGE.md §3.1 (color-pair semantics:
 *    every fill token has an `--on-X` partner for the foreground)
 *  - docs/design-system/REBUILD_PLAN.md §2.5 (variants:
 *    `neutral | primary | success | warning | danger`)
 *
 * Badge is intentionally non-interactive (no hover/press). When you need a
 * clickable tag, use `<Chip>` instead. Interactive badges (e.g. "view all")
 * must be wrapped in a full-size `<button>` / `<Link>` so touch targets are ≥ 44px.
 */

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeIntent =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type BadgeSize = "sm" | "md";

/**
 * Each intent maps to a pair:
 *   background (semi-transparent tint of the semantic color)
 *   foreground (the semantic color itself at full intensity, or its `--on-X`
 *              equivalent for filled variants)
 *
 * Soft tint avoids overwhelming dense lists while still conveying state.
 */
const INTENT: Record<BadgeIntent, string> = {
  neutral: "bg-surface-elev text-fg-muted border border-border",
  primary: "bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-primary-ink",
  success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success-ink",
  warning: "bg-[color-mix(in_oklab,var(--warning)_20%,transparent)] text-warning-ink",
  danger:  "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-danger-ink",
};

const SIZE: Record<BadgeSize, string> = {
  sm: "text-[0.6875rem] leading-none px-2 py-1 gap-1",
  md: "text-xs leading-none px-2.5 py-1 gap-1.5",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  intent?: BadgeIntent;
  size?: BadgeSize;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent = "neutral", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        "font-medium rounded-pill whitespace-nowrap",
        INTENT[intent],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
