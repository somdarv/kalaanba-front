"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";
import { Spinner } from "./spinner";

export type ButtonIntent =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Intent recipes — pure state changes, no positional motion.
 *   default → hover (color shift) → active (deeper bg + inset shadow "press")
 * Per DESIGN_LANGUAGE §3.1 the button never moves; it changes state.
 */
const INTENT: Record<ButtonIntent, string> = {
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

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 min-h-9 px-4 text-sm rounded-full gap-1.5", // sm relaxes 44px floor for inline contexts; IconButton keeps 44.
  md: "h-11 px-5 text-[0.95rem] rounded-full gap-2",
  lg: "h-12 px-6 text-base rounded-full gap-2.5",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: ButtonIntent;
  size?: ButtonSize;
  /** Show a spinner and disable. Width is preserved (no jump). */
  loading?: boolean;
  /**
   * Optional label to show next to the spinner while `loading` is true.
   * When provided, the spinner renders inline alongside this text (replacing
   * `children`). When omitted, the spinner overlays and `children` hold the
   * button's width — the default "no jump" behaviour.
   */
  loadingText?: ReactNode;
  /** Icon shown before children. */
  leadingIcon?: ReactNode;
  /** Icon shown after children. Nudges right on hover (no width change). */
  trailingIcon?: ReactNode;
  /** Expand to fill parent. */
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = "primary",
    size = "md",
    loading = false,
    loadingText,
    leadingIcon,
    trailingIcon,
    fullWidth,
    disabled,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const inlineLoading = loading && loadingText !== undefined;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cn(
        pressableBase,
        "group font-medium whitespace-nowrap",
        INTENT[intent],
        SIZE[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {/* Overlay spinner: only when loading and no loadingText was supplied. */}
      {loading && !inlineLoading ? (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <Spinner size={size === "lg" ? "md" : "sm"} />
        </span>
      ) : null}
      <span
        className={cn(
          "inline-flex items-center gap-[inherit]",
          loading && !inlineLoading && "opacity-0",
        )}
      >
        {inlineLoading ? (
          <>
            <Spinner size={size === "lg" ? "md" : "sm"} />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {leadingIcon}
            {children}
            {trailingIcon ? (
              <span
                aria-hidden
                style={{
                  transitionProperty: "transform",
                  transitionDuration: "550ms",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="inline-flex motion-reduce:transition-none group-hover:translate-x-[5px]"
              >
                {trailingIcon}
              </span>
            ) : null}
          </>
        )}
      </span>
    </button>
  );
});
