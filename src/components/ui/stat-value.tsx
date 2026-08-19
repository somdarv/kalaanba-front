/**
 * StatValue / StatBlock — the numeric display primitives.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.6 ("Numeric: tabular-nums +
 *    stylistic set on score/stat components only")
 *  - docs/design-system/DESIGN_LANGUAGE.md §4.1 ("`<StatBlock>` — numeric
 *    display with tabular-nums")
 *
 * Why this exists: §2.6 specified a numeric treatment in May and nothing
 * implemented it. Ten components reached for Tailwind's `tabular-nums`
 * independently — ten chances to forget, and no way to add `cv11`/`ss01`
 * later without touching all ten. `.kx-numeric` in globals.css is now the
 * single implementation and this primitive is its owner.
 *
 * Constitution Law 3 — the backend owns truth. These components format and
 * display a value that arrives as a prop. They never compute one.
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

export type StatValueSize = "sm" | "md" | "lg" | "xl" | "score";
export type StatValueTone = "default" | "muted" | "primary" | "success" | "danger" | "live";

/**
 * Display sizes. `score` is deliberately far larger than the rest — on a
 * football surface the scoreline is the hero object, not a data point, and
 * the reference material (Premier League, broadcast lower-thirds) sets it
 * at display scale with tight negative tracking.
 */
const SIZES: Record<StatValueSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl tracking-[-0.02em]",
  xl: "text-4xl tracking-[-0.03em]",
  score: "text-5xl sm:text-6xl tracking-[-0.04em] leading-[0.9]",
};

const TONES: Record<StatValueTone, string> = {
  default: "text-fg",
  muted: "text-fg-muted",
  primary: "text-primary-ink",
  success: "text-success-ink",
  danger: "text-danger-ink",
  live: "text-live-ink",
};

export type StatValueProps = HTMLAttributes<HTMLSpanElement> & {
  /** The already-computed value. Formatted upstream, never here. */
  children: ReactNode;
  size?: StatValueSize;
  tone?: StatValueTone;
  /** Use the display face rather than the body face. Default for lg and up. */
  display?: boolean;
};

export function StatValue({
  children,
  size = "md",
  tone = "default",
  display,
  className,
  ...rest
}: StatValueProps) {
  const useDisplay = display ?? size !== "sm";
  return (
    <span
      className={cn(
        "kx-numeric font-semibold",
        useDisplay && "font-display",
        SIZES[size],
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export type StatBlockProps = HTMLAttributes<HTMLDivElement> & {
  /** Short uppercase label — "Goals", "Clean sheets", "Shots per hour". */
  label: ReactNode;
  /** The value itself. */
  value: ReactNode;
  /**
   * Optional secondary line: a delta, a rank, a denominator. Supplied as a
   * string by the caller — this component does not calculate change.
   */
  hint?: ReactNode;
  size?: StatValueSize;
  tone?: StatValueTone;
  /** Right-align for use inside a numeric column. */
  align?: "start" | "end";
};

export function StatBlock({
  label,
  value,
  hint,
  size = "lg",
  tone = "default",
  align = "start",
  className,
  ...rest
}: StatBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "end" && "items-end text-right",
        className,
      )}
      {...rest}
    >
      <Eyebrow>{label}</Eyebrow>
      <StatValue size={size} tone={tone}>
        {value}
      </StatValue>
      {hint ? (
        <span className="kx-numeric text-fg-subtle text-xs">{hint}</span>
      ) : null}
    </div>
  );
}
