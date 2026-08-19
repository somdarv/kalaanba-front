"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase, tapExpand } from "./pressable";
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
    "hover:bg-primary-hover",
    "active:bg-primary-pressed active:shadow-[var(--shadow-pressed)]",
  ),
  secondary: cn(
    "bg-surface-elev text-fg border border-border",
    "hover:border-border-strong hover:bg-[var(--secondary-hover)]",
    "active:bg-[var(--secondary-active)] active:shadow-[var(--shadow-pressed)]",
  ),
  accent: cn(
    "bg-accent text-on-accent shadow-[var(--shadow-sm)]",
    "hover:bg-accent-hover",
    "active:bg-accent-pressed active:shadow-[var(--shadow-pressed)]",
  ),
  ghost: cn(
    "bg-transparent text-fg",
    "hover:bg-[var(--hover-overlay)]",
    "active:bg-[var(--hover-overlay-strong)] active:shadow-[var(--shadow-pressed)]",
  ),
  danger: cn(
    "bg-danger text-on-danger shadow-[var(--shadow-sm)]",
    "hover:bg-danger-hover",
    "active:bg-danger-pressed active:shadow-[var(--shadow-pressed)]",
  ),
  success: cn(
    "bg-success text-on-success shadow-[var(--shadow-sm)]",
    "hover:bg-success-hover",
    "active:bg-success-pressed active:shadow-[var(--shadow-pressed)]",
  ),
};

const SIZE: Record<IconButtonSize, string> = {
  /**
   * `xs` / `sm` — compact icon affordances for dense toolbars and inline
   * rows. The visual box shrinks; the touch target does not. Both carry
   * `tapExpand`, which grows the pointer area back to 44×44 with a
   * pseudo-element (DESIGN_LANGUAGE §9.1: "visual size may be smaller;
   * the hit area is padded out with invisible space").
   */
  xs: cn("h-7 w-7 min-h-7 min-w-7 rounded-pill [&_svg]:h-3.5 [&_svg]:w-3.5", tapExpand),
  sm: cn("h-9 w-9 min-h-9 min-w-9 rounded-pill", tapExpand),
  md: "h-11 w-11 rounded-pill",
  lg: "h-12 w-12 rounded-pill",
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
