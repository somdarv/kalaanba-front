"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * `pressableBase` — the canonical interaction recipe that every clickable
 * thing in the app composes. Per DESIGN_LANGUAGE §3.1, the surface itself
 * never moves out of position; it changes *state*: background, border,
 * inset shadow. No translate, no scale.
 *
 * - 44×44 floor (touch hit target)
 * - focus-visible ring
 * - `dur-quick` cross-fade on color / shadow / border
 * - `touch-action: manipulation` to kill 300ms tap delay
 */
export const pressableBase = cn(
  "relative inline-flex items-center justify-center select-none",
  "min-h-11 min-w-11", // 44px floor
  "touch-manipulation",
  "transition-[background-color,color,box-shadow,border-color,opacity]",
  "duration-[var(--dur-quick)] ease-[var(--ease-out)]",
  "outline-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
  "disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
);

export type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/**
 * Headless `<Pressable>` — renders a button with the canonical recipe and
 * no visual styling beyond it. Use it directly for "the entire card is
 * clickable" cases; for branded controls, prefer `<Button>`.
 */
export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(
  function Pressable({ className, type = "button", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(pressableBase, className)}
        {...rest}
      />
    );
  },
);
