"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Popover — minimal anchored panel.
 *
 * Renders absolutely positioned below its parent (parent must be
 * `position: relative`). Matches the parent's width by default — the
 * popover is **the same width as the trigger above it**, which is the
 * pattern the legacy date picker followed and the user asked us to keep.
 *
 * Handles:
 *  - ESC to close.
 *  - Click-outside (anything not inside the popover or `anchorRef.current`).
 *
 * DESIGN_LANGUAGE.md §2.4 elevation: floating recipe (surface-elev +
 * border-border + soft shadow). §3.5 interaction recipe: focusable
 * content, motion uses --dur-quick / --ease-out.
 */
export type PopoverProps = {
  open: boolean;
  onClose: () => void;
  /** The trigger element. Clicks on it must NOT count as outside. */
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  /** Match the trigger's width. Default true. */
  matchTriggerWidth?: boolean;
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      open,
      onClose,
      anchorRef,
      children,
      className,
      matchTriggerWidth = true,
    },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const setRef = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    useEffect(() => {
      if (!open) return;

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      };
      const onPointer = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (!target) return;
        if (innerRef.current?.contains(target)) return;
        if (anchorRef.current?.contains(target)) return;
        onClose();
      };

      document.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onPointer, true);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("pointerdown", onPointer, true);
      };
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    return (
      <div
        ref={setRef}
        role="dialog"
        className={cn(
          "absolute top-full left-0 z-50 mt-2",
          matchTriggerWidth ? "right-0" : undefined,
          "rounded-card border border-border bg-surface-elev shadow-lg",
          className,
        )}
        style={{
          // Soft entrance — opacity + a 4px lift. Spatial: the panel
          // arrives from somewhere relative to its anchor.
          animation: "kx-pop-in var(--dur-graceful) var(--ease-entrance)",
        }}
      >
        {children}
      </div>
    );
  },
);
