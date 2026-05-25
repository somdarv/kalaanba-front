"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";
import { Spinner } from "./spinner";

export type IconButtonIntent =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "danger"
  | "success";

export type IconButtonSize = "xs" | "sm" | "md" | "lg";

const INTENT: Record<IconButtonIntent, string> = {
  primary: cn(
    "bg-primary text-on-primary shadow-[var(--shadow-sm)]",
    "hover:bg-[color-mix(in_oklab,var(--primary)_86%,white_14%)] hover:shadow-[var(--shadow-md)]",
    "active:bg-primary-pressed active:shadow-[var(--shadow-pressed)]",
  ),
  secondary: cn(
    "bg-surface-2 text-fg border border-border",
    "hover:border-border-strong hover:bg-[var(--secondary-hover)]",
    "active:bg-[var(--secondary-active)] active:shadow-[var(--shadow-pressed)]",
  ),
  accent: cn(
    "bg-accent text-on-accent shadow-[var(--shadow-sm)]",
    "hover:bg-[color-mix(in_oklab,var(--accent)_86%,white_14%)] hover:shadow-[var(--shadow-md)]",
    "active:bg-[color-mix(in_oklab,var(--accent)_88%,black_12%)] active:shadow-[var(--shadow-pressed)]",
  ),
  ghost: cn(
    "bg-transparent text-fg",
    "hover:bg-[var(--hover-overlay)]",
    "active:bg-[var(--hover-overlay-strong)] active:shadow-[var(--shadow-pressed)]",
  ),
  danger: cn(
    "bg-danger text-on-danger shadow-[var(--shadow-sm)]",
    "hover:bg-[color-mix(in_oklab,var(--danger)_86%,white_14%)] hover:shadow-[var(--shadow-md)]",
    "active:bg-[color-mix(in_oklab,var(--danger)_88%,black_12%)] active:shadow-[var(--shadow-pressed)]",
  ),
  success: cn(
    "bg-success text-on-success shadow-[var(--shadow-sm)]",
    "hover:bg-[color-mix(in_oklab,var(--success)_86%,white_14%)] hover:shadow-[var(--shadow-md)]",
    "active:bg-[color-mix(in_oklab,var(--success)_88%,black_12%)] active:shadow-[var(--shadow-pressed)]",
  ),
};

const SIZE: Record<IconButtonSize, string> = {
  /**
   * `xs` — compact icon affordance for dense toolbars / inline rows
   * (e.g. table-row actions, chip-adjacent triggers). Relaxes the 44px
   * touch floor; use only inside contexts where a parent row already
   * supplies the touch target.
   */
  xs: "h-7 w-7 min-h-7 min-w-7 rounded-full [&_svg]:h-3.5 [&_svg]:w-3.5",
  sm: "h-9 w-9 min-h-9 min-w-9 rounded-full",
  md: "h-11 w-11 rounded-full",
  lg: "h-12 w-12 rounded-full",
};

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: IconButtonIntent;
  size?: IconButtonSize;
  /** REQUIRED — icon buttons must announce themselves. */
  label: string;
  /** The icon element. Will be sized via CSS, you supply the glyph. */
  icon: ReactNode;
  loading?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      intent = "ghost",
      size = "md",
      label,
      icon,
      loading = false,
      disabled,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          pressableBase,
          INTENT[intent],
          SIZE[size],
          "p-0",
          className,
        )}
        {...rest}
      >
        {loading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : icon}
      </button>
    );
  },
);
