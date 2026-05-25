"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * `<KeyboardFooter>` — sticky CTA bar that stays above the on-screen
 * keyboard.
 *
 * Why it exists:
 *   - On mobile, the on-screen keyboard covers the bottom of the viewport.
 *     A floating CTA pinned to the *layout viewport* gets hidden.
 *   - Setting `interactiveWidget=resizes-content` on the viewport meta tells
 *     the browser to **shrink** the layout viewport when the keyboard
 *     appears, so `position: sticky` / `position: fixed` elements get
 *     pushed up naturally.
 *   - This component provides the styled container. The caller mounts it at
 *     the bottom of a form scroll area.
 *
 * Required viewport meta (set once in `app/layout.tsx`):
 *
 *   <meta name="viewport"
 *         content="width=device-width, initial-scale=1, viewport-fit=cover,
 *                  interactive-widget=resizes-content" />
 *
 * Without that meta tag the keyboard will still cover this bar on some
 * browsers — the JS-only fallback is `visualViewport` events, which we
 * don't bother with here.
 *
 * Safe-area: `padding-bottom: env(safe-area-inset-bottom)` so the bar
 * never lands under the home indicator when the keyboard is closed.
 */

export type KeyboardFooterProps = {
  children: ReactNode;
  /** Add a faint top divider. Defaults to true. */
  bordered?: boolean;
  /** Use `position: fixed` instead of `sticky`. Defaults to sticky. */
  fixed?: boolean;
  className?: string;
};

export function KeyboardFooter({
  children,
  bordered = true,
  fixed,
  className,
}: KeyboardFooterProps) {
  return (
    <div
      className={cn(
        fixed
          ? "fixed inset-x-0 bottom-0 z-40"
          : "sticky bottom-0 z-30",
        "bg-surface/95 backdrop-blur-md",
        "px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]",
        bordered && "border-t border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
