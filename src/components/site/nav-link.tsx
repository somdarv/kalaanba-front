"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { tapExpand } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { NavItem } from "./nav-items";

/**
 * One destination in the nav.
 *
 * An item with `href: null` has no route built yet. It renders as ordinary nav
 * text, identical to its neighbours, and simply does not navigate. It carries
 * no "Soon" badge: the nav is the product's table of contents, and annotating
 * it with build status turns a masthead into a roadmap.
 *
 * `aria-disabled` still marks it for a screen reader, because a control that
 * looks actionable and is not must at least say so to the people who cannot
 * see that nothing happened.
 *
 * The current item is marked with `aria-current="page"` and an underline, not
 * with colour alone (§6 — colour is never the only signal).
 */

export type NavLinkProps = {
  item: NavItem;
  /**
   * `row` — the primary desktop row. `utility` — the quieter row above it.
   * `stacked` — the mobile sheet.
   *
   * A variant rather than a `className`: the size lives on the element that
   * renders the text, so wrapping this in a sized span does nothing. That is
   * exactly how the utility row stayed at 16px through two attempts to shrink
   * it from the outside.
   */
  variant?: "row" | "utility" | "stacked";
  onNavigate?: () => void;
};

/** Per-variant box and type. `utility` is under 44px, so it buys the target back. */
const VARIANT: Record<NonNullable<NavLinkProps["variant"]>, string> = {
  row: "min-h-11 text-base",
  utility: cn("min-h-8 text-xs", tapExpand),
  stacked: "min-h-12 w-full text-base",
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
    "duration-quick ease-out transition-colors",
    VARIANT[variant],
  );

  if (item.href == null) {
    return (
      <span aria-disabled className={cn(base, "text-fg-muted")}>
        {item.label}
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
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
      )}
    >
      {item.label}
      {isCurrent ? (
        <span
          aria-hidden
          className={cn(
            "absolute bg-primary",
            variant === "stacked"
              ? "top-1/2 -left-3 h-5 w-0.5 -translate-y-1/2 rounded-pill"
              : "inset-x-0 -bottom-1.5 h-0.5 rounded-pill",
          )}
        />
      ) : null}
    </Link>
  );
}
