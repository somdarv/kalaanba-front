"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase, tapExpand } from "./pressable";

export type ChipIntent = "neutral" | "primary" | "accent" | "success" | "warning" | "danger";
export type ChipSize = "sm" | "md";

/**
 * Tinted chips read as *ink on a wash*, so both the label and the wash come
 * from the `-ink` role, never the fill role. v2 used `text-primary-ink` here —
 * with the fill tuned to carry a white label (L 0.56) that same value as
 * text on a dark surface measures ~3.9:1. The ink variants clear 7:1+.
 */
const INTENT_STATIC: Record<ChipIntent, string> = {
  neutral: "bg-surface-elev text-fg border border-border",
  primary: "bg-[color-mix(in_oklab,transparent,var(--primary-ink)_16%)] text-primary-ink border border-[color-mix(in_oklab,transparent,var(--primary-ink)_28%)]",
  accent: "bg-[color-mix(in_oklab,transparent,var(--accent-ink)_16%)] text-accent-ink border border-[color-mix(in_oklab,transparent,var(--accent-ink)_28%)]",
  success: "bg-[color-mix(in_oklab,transparent,var(--success-ink)_16%)] text-success-ink border border-[color-mix(in_oklab,transparent,var(--success-ink)_28%)]",
  warning: "bg-[color-mix(in_oklab,transparent,var(--warning-ink)_16%)] text-warning-ink border border-[color-mix(in_oklab,transparent,var(--warning-ink)_28%)]",
  danger: "bg-[color-mix(in_oklab,transparent,var(--danger-ink)_16%)] text-danger-ink border border-[color-mix(in_oklab,transparent,var(--danger-ink)_28%)]",
};

const INTENT_PRESSED: Record<ChipIntent, string> = {
  neutral: "bg-fg text-bg border border-transparent",
  primary: "bg-primary text-on-primary border border-transparent",
  accent: "bg-accent text-on-accent border border-transparent",
  success: "bg-success text-on-success border border-transparent",
  warning: "bg-warning text-on-warning border border-transparent",
  danger: "bg-danger text-on-danger border border-transparent",
};

const SIZE: Record<ChipSize, string> = {
  sm: "h-7 min-h-7 px-2.5 text-xs gap-1",
  md: "h-8 min-h-8 px-3 text-sm gap-1.5",
};

/** Interactive chips keep the compact box but recover a 44×44 target. */
const TOGGLE_SIZE: Record<ChipSize, string> = {
  sm: cn(SIZE.sm, tapExpand),
  md: cn(SIZE.md, tapExpand),
};

// ---- Static chip (display-only) ----

export type ChipProps = {
  intent?: ChipIntent;
  size?: ChipSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Chip({
  intent = "neutral",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  children,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill font-medium whitespace-nowrap",
        INTENT_STATIC[intent],
        SIZE[size],
        className,
      )}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </span>
  );
}

// ---- Toggle chip (interactive — composes Pressable) ----

export type ChipToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: ChipIntent;
  size?: ChipSize;
  pressed: boolean;
  leadingIcon?: ReactNode;
  children: ReactNode;
};

export const ChipToggle = forwardRef<HTMLButtonElement, ChipToggleProps>(
  function ChipToggle(
    {
      intent = "primary",
      size = "md",
      pressed,
      leadingIcon,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={pressed}
        className={cn(
          pressableBase,
          // The chip is intentionally smaller than 44px. It drops the
          // min-height floor but recovers the touch target through
          // `tapExpand` in TOGGLE_SIZE — v2 dropped the floor and stopped
          // there, shipping 28px targets (DESIGN_LANGUAGE §9.1).
          "min-h-0 min-w-0 rounded-pill font-medium",
          TOGGLE_SIZE[size],
          pressed
            ? cn(
                INTENT_PRESSED[intent],
                "active:shadow-(--shadow-pressed)",
              )
            : cn(
                INTENT_STATIC[intent],
                "hover:bg-[color-mix(in_oklab,transparent,var(--fg)_8%)]",
                "active:shadow-(--shadow-pressed)",
              ),
          className,
        )}
        {...rest}
      >
        {leadingIcon}
        {children}
      </button>
    );
  },
);
