"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

/**
 * `<Overlay>` — the foundation for every full-screen surface
 * (`BottomSheet`, `Dialog`, `Drawer`).
 *
 * Responsibilities:
 *   1. Render to a portal on `document.body` so stacking is predictable.
 *   2. Lock body scroll while open (`overflow: hidden` + `overscroll-behavior:
 *      contain`) and restore the prior values on close.
 *   3. Trap Tab / Shift+Tab focus inside the overlay.
 *   4. Restore focus to the previously focused element on close.
 *   5. Close on Escape and (optionally) backdrop click.
 *   6. Entrance is **opacity-only** for the backdrop — no translate.
 *
 * This is a low-level primitive. Most callers want `BottomSheet` or `Dialog`.
 *
 * SSR: returns `null` until `document` is available, so `createPortal` is
 * safe to call.
 */

export type OverlayProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  children: ReactNode;
  /** Backdrop click closes the overlay. Defaults to true. */
  dismissOnBackdrop?: boolean;
  /** Escape key closes the overlay. Defaults to true. */
  dismissOnEscape?: boolean;
  /** Extra classes for the **content wrapper** (not the backdrop). */
  className?: string;
  /** Accessible label for the dialog landmark. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Overlay({
  open,
  onOpenChange,
  children,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: OverlayProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // ── scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";
    return () => {
      body.style.overflow = prevOverflow;
      body.style.overscrollBehavior = prevOverscroll;
    };
  }, [open]);

  // ── focus management ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current =
      (document.activeElement as HTMLElement | null) ?? null;

    // Focus the content wrapper (or first focusable inside) after mount.
    const id = requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      const first = el.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? el).focus();
    });

    return () => {
      cancelAnimationFrame(id);
      // Restore focus to whatever the user had before opening.
      const prev = previouslyFocused.current;
      if (prev && document.contains(prev)) {
        prev.focus();
      }
    };
  }, [open]);

  // ── escape ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !dismissOnEscape) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissOnEscape, onOpenChange]);

  // ── tab trap ──────────────────────────────────────────────────────────
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = contentRef.current;
    if (!root) return;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => !el.hasAttribute("data-overlay-skip"));
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="presentation"
    >
      {/* Backdrop — opacity-only entrance, no translate. */}
      <div
        aria-hidden
        onClick={() => {
          if (dismissOnBackdrop) onOpenChange(false);
        }}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-300 ease-out",
          // The portal mounts at open=true; CSS handles the fade-in via the
          // browser's first frame. Closing is also instant — callers can
          // sequence a fade-out if needed by gating `open` themselves.
        )}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          "relative z-10 outline-none",
          // Default content positioning — callers usually replace this.
          "w-full max-w-md",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
