"use client";

import { X } from "@phosphor-icons/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { Overlay } from "./overlay";

/**
 * `<BottomSheet>` — the canonical mobile modal surface.
 *
 * Behaviour:
 *   - **Mobile (<sm)**: anchored to the bottom, full-width, rounded top
 *     corners, drag-to-dismiss via the grab handle.
 *   - **Desktop (≥sm)**: becomes a centered dialog. Same component, the
 *     `<Overlay>` parent already centers on `sm+`.
 *
 * Safe-area: the sheet adds `padding-bottom: env(safe-area-inset-bottom)` so
 * content never lands under the home indicator on notched devices.
 *
 * Motion:
 *   - Backdrop entrance is opacity-only (delegated to `<Overlay>`).
 *   - The sheet itself fades in (opacity-only) too — no synthetic translate.
 *   - **Drag** is real translateY because it tracks the user's finger 1:1.
 *     This is direct user input, not synthetic motion, so it's the one
 *     exception to the "no translate" rule. On release:
 *       - dragged > 35% of sheet height OR velocity > 0.6 → dismiss
 *       - otherwise → snap back to 0
 *
 * A11y: built on `<Overlay>` which provides the focus trap, scroll lock,
 * Escape handler, and ARIA. We add the visible heading (`<h2>` linked via
 * `aria-labelledby`) and the optional description.
 */

export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  /** Hide the visual close button. The sheet is still dismissible. */
  hideCloseButton?: boolean;
  /** Disable drag-to-dismiss (e.g. for destructive confirmation). */
  disableDrag?: boolean;
  /** Disable backdrop click + Escape (e.g. while a request is in flight). */
  dismissible?: boolean;
  children: ReactNode;
  /** Extra classes for the sheet card. */
  className?: string;
};

const DISMISS_THRESHOLD_PCT = 0.35;
const VELOCITY_THRESHOLD = 0.6; // px per ms

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  hideCloseButton,
  disableDrag,
  dismissible = true,
  children,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragState = useRef<{
    startY: number;
    startTime: number;
    height: number;
  } | null>(null);
  const titleId = useRef(`sheet-title-${Math.random().toString(16).slice(2, 8)}`);
  const descId = useRef(`sheet-desc-${Math.random().toString(16).slice(2, 8)}`);

  // Opacity-only entrance for the sheet body, mirroring the backdrop.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!open) {
      setShown(false);
      setDragY(0);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disableDrag) return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragState.current = {
        startY: e.clientY,
        startTime: performance.now(),
        height: sheet.getBoundingClientRect().height,
      };
    },
    [disableDrag],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragState.current;
      if (!s) return;
      // Only allow dragging downward; resist upward pull.
      const delta = Math.max(0, e.clientY - s.startY);
      setDragY(delta);
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const s = dragState.current;
      dragState.current = null;
      if (!s) return;
      const delta = Math.max(0, e.clientY - s.startY);
      const elapsed = Math.max(1, performance.now() - s.startTime);
      const velocity = delta / elapsed;
      const dismissed =
        delta > s.height * DISMISS_THRESHOLD_PCT ||
        velocity > VELOCITY_THRESHOLD;
      if (dismissed) {
        onOpenChange(false);
      } else {
        // Snap back.
        setDragY(0);
      }
    },
    [onOpenChange],
  );

  return (
    <Overlay
      open={open}
      onOpenChange={onOpenChange}
      dismissOnBackdrop={dismissible}
      dismissOnEscape={dismissible}
      aria-labelledby={titleId.current}
      aria-describedby={description ? descId.current : undefined}
      // Override the default narrow content width — the sheet is responsive.
      className="w-full sm:max-w-lg"
    >
      <div
        ref={sheetRef}
        className={cn(
          "relative mx-auto w-full bg-surface text-fg shadow-lg",
          // Rounded top on mobile (bottom-anchored), full radius on desktop.
          "rounded-t-card sm:rounded-card",
          // Safe-area padding for notched devices.
          "pb-[env(safe-area-inset-bottom)]",
          // Slide-up entrance: opacity + translateY. The sheet arrives
          // from below the viewport — spatial motion, not synthetic feel.
          // (When dragging, the inline `transform` below overrides this.)
          "transition-[opacity,transform] duration-deliberate ease-entrance",
          shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          className,
        )}
        style={{
          // Drag translateY is 1:1 finger input — when present it takes
          // precedence over the class-based entrance transform.
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragState.current ? "none" : undefined,
        }}
      >
        {/* Grab handle — also the drag-to-dismiss surface on mobile. */}
        <div
          className="flex h-7 cursor-grab items-center justify-center active:cursor-grabbing sm:hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden
        >
          <span className="h-1 w-10 rounded-pill bg-border-strong" />
        </div>

        {/* Header: title + (optional) description + close. */}
        <div className="flex items-start gap-3 px-5 pb-3 pt-2 sm:pt-5">
          <div className="min-w-0 flex-1">
            <h2
              id={titleId.current}
              className="text-base font-semibold text-fg"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descId.current}
                className="mt-1 text-sm text-fg-muted"
              >
                {description}
              </p>
            ) : null}
          </div>
          {hideCloseButton ? null : (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-pill text-fg-muted transition-colors hover:bg-surface-elev hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5 sm:max-h-[60vh]">
          {children}
        </div>
      </div>
    </Overlay>
  );
}
