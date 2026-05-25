"use client";

/**
 * `AppShell` + `SiteHeader` — Tier 5 structural primitives.
 *
 * `AppShell` is the persistent layout chassis that wraps every page —
 * sticky header at top, optional sticky / floating BottomNav anchored to
 * the bottom on mobile, main content area that adapts its bottom-padding
 * so the BottomNav doesn't clip the last row of content.
 *
 * `SiteHeader` is the pre-composed default header (logo / wordmark left,
 * primary nav centre on md+, NotificationBell + Avatar right). It is
 * just a sensible default — callers can pass any node into
 * `<AppShell header={...}>`.
 *
 * Design intent (DESIGN_LANGUAGE §4.1 chrome, §3.4 elevation):
 *   - Header chrome uses `bg-bg/80 backdrop-blur-md` + `border-b
 *     border-divider`. Same recipe as the showcase header so the system
 *     reads as one.
 *   - BottomNav slot is fixed at bottom + respects `env(safe-area-inset-
 *     bottom)`.
 *   - Main content area: max-width container, responsive horizontal
 *     padding, and dynamic bottom padding when a BottomNav is present
 *     (`pb-20` mobile, `pb-0` md+).
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "./avatar";
import { NotificationBell } from "./notification-bell";

/* ============================================ AppShell ========================================== */

export type AppShellProps = {
  /** Top chrome — usually `<SiteHeader>`, but any sticky node works. */
  header?: ReactNode;
  /**
   * Bottom mobile nav. Hidden on `md+` automatically via the wrapper.
   * Caller is responsible for the BottomNav's own visibility logic
   * (e.g. `<BottomNav className="md:hidden">`).
   */
  bottomNav?: ReactNode;
  /** Page content. */
  children: ReactNode;
  /** Override the max-width container class for `<main>`. */
  contentClassName?: string;
  /** Override the outer wrapper class. */
  className?: string;
};

/**
 * `<AppShell>` — page layout chassis. Drop once at the top of each
 * route. Header + BottomNav are slots; main content is `children`.
 */
export function AppShell({
  header,
  bottomNav,
  children,
  contentClassName,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-full flex-col bg-bg text-fg",
        className,
      )}
    >
      {header ? (
        <div className="sticky top-0 z-30">{header}</div>
      ) : null}

      <main
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6",
          // Leave room for the fixed BottomNav on mobile; collapse on md+.
          bottomNav ? "pb-24 md:pb-8" : "pb-8",
          "pt-6",
          contentClassName,
        )}
      >
        {children}
      </main>

      {bottomNav ? (
        <div
          className="fixed inset-x-0 bottom-0 z-30 md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {bottomNav}
        </div>
      ) : null}
    </div>
  );
}

/* ========================================== SiteHeader ========================================== */

export type SiteHeaderProps = {
  /** Brand mark — text wordmark, logo, or both. */
  brand?: ReactNode;
  /** Primary navigation cluster (md+ only). Pass `<HStack>` of `LinkButton`s. */
  nav?: ReactNode;
  /**
   * Right-side action cluster. Defaults to a notification bell +
   * placeholder avatar.
   */
  actions?: ReactNode;
  /** Override the wrapper class. */
  className?: string;
};

/**
 * `<SiteHeader>` — pre-composed default header. Sticky, blurred chrome.
 * Pass into `<AppShell header={<SiteHeader … />}>`.
 */
export function SiteHeader({
  brand,
  nav,
  actions,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-divider bg-bg/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {brand ?? <DefaultBrand />}
        </div>
        {nav ? (
          <nav className="hidden flex-1 items-center justify-center md:flex">
            {nav}
          </nav>
        ) : null}
        <div className="flex items-center gap-2">
          {actions ?? <DefaultActions />}
        </div>
      </div>
    </header>
  );
}

function DefaultBrand() {
  return (
    <>
      <span className="font-display text-lg font-semibold">Kalaanba</span>
      <span className="hidden text-sm text-fg-muted sm:inline">
        Seeds of Play
      </span>
    </>
  );
}

function DefaultActions() {
  return (
    <>
      <NotificationBell />
      <Avatar size="sm" name="Kwame Mensah" />
    </>
  );
}
