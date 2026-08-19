"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";

// Per DESIGN_LANGUAGE §2.2 + §icon-button: outlined icon-button surface is
// `--surface-2` with a `--border` ring — same as IconButton `secondary` intent.
// Brand pink is reserved for the unread badge so the badge pops, the button rests.

/** Bell glyph — 18×18, 1.8-stroke, matches the icon system weight. */
function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10.5 21a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

/**
 * Count badge — `bg-primary` (brand pink) not danger-red.
 * The badge adapts width: circle for single digits, pill for 10+ and "99+".
 * Sits on a `ring-bg` halo so it floats cleanly over the button edge.
 */
function CountBadge({ count }: { count: number }) {
  const display = count >= 100 ? "99+" : String(count);
  const isWide = count >= 10; // double-digit or "99+" need extra horizontal room

  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5",
        "grid place-items-center",
        "min-h-4.5 min-w-4.5",
        "rounded-pill bg-primary text-on-primary",
        "text-[10px] font-semibold leading-none tabular-nums",
        "ring-2 ring-bg",
        isWide && "px-1",
      )}
      aria-hidden
    >
      {display}
    </span>
  );
}

export type NotificationBellProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Number of unread notifications.
   * - `0` or `undefined` → no badge shown
   * - `1`–`99`           → numeric pill badge
   * - `≥ 100`            → "99+" badge (capped per `notification.inbox.unread_badge_cap` config key)
   */
  unreadCount?: number;
};

/**
 * `NotificationBell` — icon button with four badge states.
 *
 * Uses the standard outlined icon-button surface (`--surface-2` + `--border`,
 * same as `IconButton intent="secondary"`) so it sits cleanly next to avatars
 * and other chrome.  Brand pink is reserved for the unread badge.
 *
 * Usage:
 * ```tsx
 * <NotificationBell unreadCount={3} onClick={() => setOpen(true)} />
 * ```
 */
export const NotificationBell = forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(function NotificationBell(
  {
    unreadCount = 0,
    className,
    type = "button",
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const hasUnread = unreadCount > 0;
  const countLabel =
    unreadCount >= 100 ? "99+" : unreadCount > 0 ? String(unreadCount) : "";
  const defaultLabel = hasUnread
    ? `Notifications, ${countLabel} unread`
    : "Notifications";

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel ?? defaultLabel}
      className={cn(
        pressableBase,
        "relative h-11 w-11 rounded-pill",
        // Outlined icon-button surface — matches IconButton `secondary`.
        "bg-surface-elev text-fg border border-border",
        "hover:border-border-strong hover:bg-(--secondary-hover)",
        "active:bg-(--secondary-active) active:shadow-(--shadow-pressed)",
        className,
      )}
      {...rest}
    >
      <BellIcon />
      {hasUnread ? <CountBadge count={unreadCount} /> : null}
    </button>
  );
});
