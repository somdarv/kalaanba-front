"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * `pressableBase` — the canonical interaction recipe that every clickable
 * thing in the app composes. Per DESIGN_LANGUAGE §3.1 (revised 2026-05),
 * pressables stay anchored in space (no slide/lift/jiggle on hover) but
 * they DO compress under the press — a 1% scale-down is 1:1 with the
 * user's physical intent and reads as tactile, not synthetic. Color,
 * border, shadow, and the press-scale all transition through
 * `--dur-quick` / `--ease-out` so state changes feel soft and considered.
 *
 * - 44×44 floor (touch hit target)
 * - focus-visible ring
 * - `dur-quick` ease-out cross-fade on color / shadow / border / transform
 * - `active:scale-[0.99]` tactile press
 * - `touch-action: manipulation` to kill 300ms tap delay
 *
 * The focus ring is its own hue (`--ring`, hue 200) rather than the brand.
 * v2 used pink at 35% alpha, which put a pink ring on the pink primary
 * button — 1.00:1 against its own fill, i.e. invisible exactly where it
 * mattered most. Paired with `outline-offset-2` the ring lands on the
 * ground behind the control (10.8:1 on `--bg`) and never overlaps the fill.
 *
 * A primitive that renders visually smaller than 44px must add
 * `kx-tap-expand` rather than lowering `min-h-*` — see `.kx-tap-expand`
 * in globals.css for why zeroing the floor silently defeated it.
 */
export const pressableBase = cn(
  "relative inline-flex items-center justify-center select-none",
  "min-h-11 min-w-11", // 44px floor — DESIGN_LANGUAGE §9.1
  "touch-manipulation",
  "transition-[background-color,color,box-shadow,border-color,opacity,transform]",
  "duration-quick ease-out",
  "active:scale-[0.99]",
  "outline-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:active:scale-100",
);

/**
 * Opt-in hit-area expander for primitives whose *visual* box is under 44px
 * (dense toolbars, filter chips, inline row actions). Keeps the look,
 * restores the target. Never apply to a control that wraps other
 * interactive elements.
 */
export const tapExpand = "kx-tap-expand";

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
