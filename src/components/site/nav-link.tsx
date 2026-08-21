"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import type { NavItem } from "./nav-items";

/**
 * One destination in the nav, in whichever of its three states it is in:
 * current, available, or designed-but-not-built.
 *
 * The third state is the interesting one. An item with `href: null` renders as
 * text with `aria-disabled`, not as a link, so it can never 404 and a screen
 * reader is told it is unavailable rather than being handed a dead control. It
 * keeps its place in the row because the shape of the nav is what tells a first
 * time visitor what Kalaanba is for.
 *
 * The current item is marked with `aria-current="page"` and an underline, not
 * with colour alone (§6 — colour is never the only signal).
 */

export type NavLinkProps = {
  item: NavItem;
  /** Stacked list in the mobile sheet vs. inline row on desktop. */
  variant?: "row" | "stacked";
  onNavigate?: () => void;
};

export function NavLink({
  item,
  variant = "row",
  onNavigate,
}: NavLinkProps) {
  // `usePathname` is typed `string` but returns null outside an app-router
  // render (a test harness, a portal mounted early). Defaulting here keeps a
  // nav item from taking the whole page down over a highlight.
  const pathname = usePathname() ?? "";
  const isCurrent = item.href != null && pathname.startsWith(item.href);

  const base = cn(
    "relative inline-flex items-center font-medium",
    "transition-colors duration-quick ease-out",
    variant === "row"
      ? "min-h-11 px-1 text-[0.95rem]"
      : "min-h-12 w-full px-1 text-base",
  );

  if (item.href == null) {
    return (
      <span
        aria-disabled
        className={cn(base, "cursor-not-allowed text-fg-subtle")}
      >
        {item.label}
        <span className="ml-2 rounded-pill bg-surface-elev px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          Soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        base,
        "rounded-row",
        isCurrent ? "text-fg" : "text-fg-muted hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
      )}
    >
      {item.label}
      {isCurrent ? (
        <span
          aria-hidden
          className={cn(
            "absolute bg-primary",
            variant === "row"
              ? "inset-x-0 -bottom-0.5 h-0.5 rounded-pill"
              : "top-1/2 -left-3 h-5 w-0.5 -translate-y-1/2 rounded-pill",
          )}
        />
      ) : null}
    </Link>
  );
}
