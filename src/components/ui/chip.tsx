"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";

export type ChipIntent = "neutral" | "primary" | "accent" | "success" | "warning" | "danger";
export type ChipSize = "sm" | "md";

const INTENT_STATIC: Record<ChipIntent, string> = {
  neutral: "bg-surface-2 text-fg border border-border",
  primary: "bg-[color-mix(in_oklab,transparent,var(--primary)_18%)] text-primary border border-[color-mix(in_oklab,transparent,var(--primary)_30%)]",
  accent: "bg-[color-mix(in_oklab,transparent,var(--accent)_18%)] text-accent border border-[color-mix(in_oklab,transparent,var(--accent)_30%)]",
  success: "bg-[color-mix(in_oklab,transparent,var(--success)_18%)] text-success border border-[color-mix(in_oklab,transparent,var(--success)_30%)]",
  warning: "bg-[color-mix(in_oklab,transparent,var(--warning)_18%)] text-warning border border-[color-mix(in_oklab,transparent,var(--warning)_30%)]",
  danger: "bg-[color-mix(in_oklab,transparent,var(--danger)_18%)] text-danger border border-[color-mix(in_oklab,transparent,var(--danger)_30%)]",
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
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
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
          // Override the 44 floor — chips are intentionally smaller.
          "min-h-0 min-w-0 rounded-full font-medium",
          SIZE[size],
          pressed
            ? cn(
                INTENT_PRESSED[intent],
                "active:shadow-[var(--shadow-pressed)]",
              )
            : cn(
                INTENT_STATIC[intent],
                "hover:bg-[color-mix(in_oklab,transparent,var(--fg)_8%)]",
                "active:shadow-[var(--shadow-pressed)]",
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
