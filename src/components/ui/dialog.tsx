"use client";

import { X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { Overlay } from "./overlay";

/**
 * `<Dialog>` — centered modal surface, all viewports.
 *
 * Difference from `<BottomSheet>`:
 *   - Always centered (never bottom-anchored).
 *   - No drag-to-dismiss.
 *   - Stronger background blur — the world *outside* the dialog card is
 *     heavily blurred so the dialog sits in front of an out-of-focus
 *     scene. Implemented via `backdrop-blur-xl` on the Overlay's
 *     backdrop, which we render here directly instead of using
 *     `<Overlay>`'s default backdrop styling (since Overlay's default is
 *     `backdrop-blur-sm` which is intentionally subtle for sheets).
 *
 * For an icon-only / destructive variant pass `tone="danger"` — the icon
 * pip in the header tints red instead of pink.
 */

export type DialogProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Optional footer slot — usually action buttons. */
  footer?: ReactNode;
  /** Hide the close (X) button. The dialog is still dismissible. */
  hideCloseButton?: boolean;
  /** Disable backdrop click + Escape (e.g. during a request). */
  dismissible?: boolean;
  /** Max card width. Defaults to `max-w-md`. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  hideCloseButton,
  dismissible = true,
  size = "md",
  className,
}: DialogProps) {
  const titleId = useRef(`dialog-title-${Math.random().toString(16).slice(2, 8)}`);
  const descId = useRef(`dialog-desc-${Math.random().toString(16).slice(2, 8)}`);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <Overlay
      open={open}
      onOpenChange={onOpenChange}
      dismissOnBackdrop={dismissible}
      dismissOnEscape={dismissible}
      aria-labelledby={titleId.current}
      aria-describedby={description ? descId.current : undefined}
      className={cn("w-[calc(100%-1.5rem)]", SIZE[size])}
    >
      {/* Heavy backdrop blur — Dialog wants the world outside the card to
          be unmistakably out of focus. We layer this on top of the
          Overlay's default `backdrop-blur-sm` backdrop. Since this lives
          inside the Overlay's content wrapper (z-10) but BEFORE the card
          in DOM order, the card draws on top of it naturally. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-black/30 backdrop-blur-xl"
      />

      <div
        className={cn(
          "relative bg-surface text-fg shadow-lg rounded-card",
          // Soft entrance: opacity + a hint of scale. The dialog arrives
          // from "behind" the screen and settles into place. Eased with
          // `--ease-entrance` so it overshoots subtly before resting.
          "transition-[opacity,transform] duration-graceful ease-entrance",
          shown ? "opacity-100 scale-100" : "opacity-0 scale-95",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pb-3 pt-5">
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
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 pb-4">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </Overlay>
  );
}
