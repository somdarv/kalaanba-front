"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase, tapExpand } from "./pressable";
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
 *   default → hover (lighter fill) → active (deeper fill + inset "press")
 * Per DESIGN_LANGUAGE §3.1 the button never moves; it changes state.
 *
 * Hover and press are dedicated tokens that move OKLCH lightness only
 * (+0.030 / −0.050) with hue and chroma held. v2 mixed toward white, which
 * desaturated the brand into chalk on hover and — because the mix landed at
 * L 0.72 — dropped the white label to 3.8:1. Every state below clears AA:
 * primary 5.23 / 4.61 / 6.50, accent 5.23 / 4.61 / 6.50, success 5.18 /
 * 4.57 / 6.42, danger 5.25 / 4.62 / 6.52.
 */
const INTENT: Record<ButtonIntent, string> = {
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

const SIZE: Record<ButtonSize, string> = {
  // `sm` stays visually compact for inline contexts but keeps a 44px target
  // via `tapExpand` — DESIGN_LANGUAGE §9.1 allows the smaller box, not the
  // smaller hit area. v2 shipped 36px targets on Accept/Decline actions.
  // It still takes the §9.2 density split: 40px in the hand, 36px under a
  // mouse, where `sm` actually belongs (dense tables, inline row actions).
  sm: cn(
    "h-10 min-h-10 lg:h-9 lg:min-h-9 px-4 text-sm rounded-pill gap-1.5",
    tapExpand,
  ),
  // `md` is the everyday action. COMPONENT_INVENTORY §1.1 specs it at `h-12`;
  // the code shipped `h-11`, the bare §9.1 floor. The doc wins
  // (design-system-mandatory), and 48px is what §9.1 calls "preferred".
  md: "h-12 min-h-12 px-5 text-[0.95rem] rounded-pill gap-2",
  // `lg` is the single-purpose form CTA (auth, checkout, OTP). COMPONENT_INVENTORY
  // §1.1 specs it at `h-14`; the code shipped `h-12`. The doc wins
  // (design-system-mandatory) and 56px is the thumb-zone size a login screen
  // wants — DESIGN_LANGUAGE §9.1 ("48 x 48 preferred for primary actions").
  lg: "h-14 min-h-14 px-7 text-base rounded-pill gap-2.5",
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

/**
 * The button's visual recipe, in one place so a control that is semantically a
 * link can wear it without re-deriving it.
 *
 * DESIGN_LANGUAGE §4.2 says compose the class, never restate it, and
 * engineering-standards §5 says internal navigation is `next/link` and never a
 * click handler. Those two rules together mean a filled CTA that navigates
 * needs the recipe as a value. `<ButtonLink>` is the only consumer; everything
 * that is actually a button keeps using `<Button>`.
 */
export function buttonRecipe({
  intent = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  intent?: ButtonIntent;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    pressableBase,
    "group font-medium whitespace-nowrap",
    INTENT[intent],
    SIZE[size],
    fullWidth && "w-full",
    className,
  );
}

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
      className={buttonRecipe({ intent, size, fullWidth, className })}
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
              /* Nudge on hover. Was an inline 550ms + raw cubic-bezier —
                 both outside the token set (DESIGN_LANGUAGE §2.5). Now rides
                 --dur-graceful / --ease-out like every other transition. */
              <span
                aria-hidden
                className={cn(
                  "inline-flex transition-transform duration-graceful ease-out",
                  "motion-reduce:transition-none",
                  "group-hover:translate-x-1.25",
                )}
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
