"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SignOut } from "@phosphor-icons/react";

import { Avatar, Divider, Popover } from "@/components/ui";
import type { CurrentUser } from "@/lib/api/auth";
import { cn } from "@/lib/cn";

import { ACCOUNT_LINKS, useSignOut } from "./account-actions";

/**
 * "Me" — the signed-in half of the nav's right cluster, on desktop.
 *
 * The phone does not render this at all. Its bar carries the logo, search and
 * the menu, and the account lives inside the sheet, so a 360px bar spends its
 * width on navigation rather than on identity.
 *
 * No chevron. The avatar is the affordance: a face or a coloured initial in the
 * top corner is already read as "you, tap for your account", and a caret beside
 * it is a second hint for something nobody was unsure about. It also spent a
 * third element in the tightest cluster on the bar to say nothing.
 *
 * The trigger and the panel share a `relative` wrapper: `<Popover>` is
 * absolutely positioned and anchors to the nearest positioned ancestor, so
 * without one it pins itself to the page and opens against the left edge of
 * the window. It is right-aligned because this sits at the right end of the bar.
 */

export function AccountMenu({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { signOut, isPending } = useSignOut();

  const firstName = (user.name ?? "").trim().split(/\s+/)[0] || "You";

  return (
    <span className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Your account, ${firstName}`}
        className={cn(
          "kx-chrome duration-quick ease-out inline-flex min-h-11 items-center gap-2 rounded-pill px-1 transition-colors",
          "hover:bg-[var(--hover-overlay)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        )}
      >
        {/* Brand fill, not the default. `bg-surface-elev` is pure white in the
            light theme, so a photoless avatar was a white circle on a white
            bar: invisible, with the initial floating on nothing. */}
        <Avatar
          src={user.avatar_url}
          name={user.name}
          size="sm"
          alt=""
          className="bg-primary text-on-primary"
        />
        <span
          aria-hidden
          className="hidden max-w-24 truncate text-sm font-medium text-fg sm:inline"
        >
          {firstName}
        </span>
      </button>

      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={triggerRef}
        matchTriggerWidth={false}
        className="right-0 left-auto min-w-56 p-1"
      >
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
          <p className="text-xs text-fg-subtle">Signed in</p>
        </div>
        <Divider />
        <ul role="menu" aria-label="Your account">
          {ACCOUNT_LINKS.map((link) => (
            <li key={link.href} role="none">
              <Link
                role="menuitem"
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-row duration-quick ease-out flex min-h-11 items-center px-3 text-sm font-medium text-fg transition-colors hover:bg-[var(--hover-overlay)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Divider />
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setIsOpen(false);
            void signOut();
          }}
          disabled={isPending}
          className="rounded-row duration-quick ease-out flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm font-medium text-fg transition-colors hover:bg-[var(--hover-overlay)] disabled:opacity-50"
        >
          <SignOut size={16} weight="bold" aria-hidden />
          {isPending ? "Signing out" : "Sign out"}
        </button>
      </Popover>
    </span>
  );
}
