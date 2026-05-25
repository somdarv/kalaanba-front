"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * `<BottomNav>` — thumb-zone primary navigation for mobile.
 *
 * Behaviour:
 *   - Fixed to the bottom edge, full-width.
 *   - Each tap target is at least 44×44 px.
 *   - Adds `padding-bottom: env(safe-area-inset-bottom)` for notched
 *     devices.
 *   - **Hidden on `lg+`** (≥ 1024 px) where top/side navigation takes
 *     over.
 *
 * The component is intentionally minimal — it gives you the rail and the
 * item recipe; *which* items appear and how routing works is the caller's
 * problem. Pair this with `next/link` or a router-aware wrapper at the app
 * layer.
 *
 * A11y: rendered as a `<nav>` landmark with `aria-label`. Items are
 * buttons with `aria-current="page"` when active.
 */

export type BottomNavItem<T extends string = string> = {
  value: T;
  label: string;
  icon: ReactNode;
  /** Show a small dot/count badge over the icon. */
  badge?: number | true;
};

export type BottomNavProps<T extends string = string> = {
  items: BottomNavItem<T>[];
  value: T;
  onChange: (next: T) => void;
  "aria-label"?: string;
  className?: string;
};

export function BottomNav<T extends string = string>({
  items,
  value,
  onChange,
  "aria-label": ariaLabel = "Primary",
  className,
}: BottomNavProps<T>) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        // Hide on large screens — desktop uses a different chrome.
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "border-t border-border bg-surface/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map((it) => {
          const active = it.value === value;
          return (
            <li key={it.value} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(it.value)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative mx-auto flex min-h-11 min-w-11 w-full flex-col items-center justify-center gap-0.5 px-2 py-1.5",
                  "transition-colors duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active ? "text-primary" : "text-fg-muted hover:text-fg",
                )}
              >
                <span
                  className="relative inline-flex items-center justify-center"
                  aria-hidden
                >
                  {it.icon}
                  {it.badge ? (
                    <span
                      className={cn(
                        "absolute -right-1.5 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-on-danger",
                      )}
                    >
                      {it.badge === true ? "" : it.badge}
                    </span>
                  ) : null}
                </span>
                <span className="text-[11px] font-medium leading-none">
                  {it.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
