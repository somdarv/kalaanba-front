"use client";

import type { ReactElement, ReactNode } from "react";
import {
  cloneElement,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

/**
 * `<Tooltip>` — small label that appears on hover/focus of its single
 * child.
 *
 * Anatomy:
 *   <Tooltip label="Refresh">
 *     <Button aria-label="Refresh"><Icon /></Button>
 *   </Tooltip>
 *
 * Behaviour:
 *   - Shows on `mouseenter` / `focus` (keyboard), hides on
 *     `mouseleave` / `blur` / Escape.
 *   - Opacity-only fade (no translate).
 *   - `side`: `top` | `bottom` | `left` | `right`. Default `top`.
 *   - The child receives `aria-describedby` pointing to the tooltip, so
 *     screen readers announce the label after the child's accessible
 *     name.
 *
 * Constraints:
 *   - This is a *label tooltip*, not a popover. Don't put interactive
 *     content inside — use `Dialog` or `BottomSheet` for that.
 *   - Always pair with an `aria-label` on the child when the child is an
 *     icon-only control. The tooltip is supplementary, not the only
 *     label.
 */

export type TooltipProps = {
  label: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** Show delay in ms. Defaults to 200. */
  delay?: number;
  /** Force the tooltip open (debugging / always-on labels). */
  open?: boolean;
  children: ReactElement<{
    "aria-describedby"?: string;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
  }>;
  className?: string;
};

const SIDE_POSITION: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export function Tooltip({
  label,
  side = "top",
  delay = 200,
  open: forceOpen,
  children,
  className,
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  const isOpen = forceOpen ?? visible;

  const child = cloneElement(children, {
    "aria-describedby": isOpen ? id : children.props["aria-describedby"],
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      hide();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      children.props.onKeyDown?.(e);
      if (e.key === "Escape") hide();
    },
  });

  return (
    <span className="relative inline-flex">
      {child}
      <span
        id={id}
        role="tooltip"
        aria-hidden={!isOpen}
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs font-medium text-bg shadow-md",
          "transition-opacity duration-150 ease-out",
          isOpen ? "opacity-100" : "opacity-0",
          SIDE_POSITION[side],
          className,
        )}
      >
        {label}
      </span>
    </span>
  );
}
