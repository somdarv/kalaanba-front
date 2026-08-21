"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CaretDown, SignOut } from "@phosphor-icons/react";

import { Avatar, Divider, Popover } from "@/components/ui";
import { useLogout } from "@/lib/api/hooks/use-auth";
import type { CurrentUser } from "@/lib/api/auth";
import { cn } from "@/lib/cn";

/**
 * "Me" — the signed-in half of the nav's right cluster.
 *
 * Replaces Sign in / Get started rather than joining them. A nav that offers
 * both an account and a sign-up is a nav that does not know who it is talking
 * to, and it is the single clearest signal that the session is real.
 *
 * Only destinations that exist are listed. A menu is a promise that the thing
 * you tap is there, and the account surfaces the product will eventually want
 * (settings, my matches, RP wallet) have no routes yet. They get added when
 * they are built, not before.
 *
 * Sign out clears the token and drops the cached user (`useLogout`), then
 * sends the browser home. Home is the right landing because it is open: there
 * is nothing to be locked out of, so signing out is a change of state rather
 * than an ejection.
 */

type AccountLink = { href: string; label: string };

/** Live routes only. See the note above before adding to this. */
const ACCOUNT_LINKS: readonly AccountLink[] = [
  { href: "/player/setup", label: "Player profile" },
  { href: "/clubs/manage", label: "My clubs" },
  { href: "/onboarding/area", label: "Your area" },
];

export function AccountMenu({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logout = useLogout();
  const router = useRouter();

  const signOut = async () => {
    setIsOpen(false);
    try {
      await logout.mutateAsync();
    } catch {
      // The token is cleared locally either way, so a failed round trip must
      // not strand the user in a half-signed-out nav.
    }
    router.push("/");
    router.refresh();
  };

  const firstName = (user.name ?? "").trim().split(/\s+/)[0] || "You";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={cn(
          "kx-chrome inline-flex min-h-11 items-center gap-2 rounded-pill pr-1 pl-1",
          "transition-colors duration-quick ease-out",
          "hover:bg-[var(--hover-overlay)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
        )}
      >
        <Avatar
          src={user.avatar_url}
          name={user.name}
          size="sm"
          alt=""
        />
        <span className="hidden max-w-24 truncate text-sm font-medium text-fg sm:inline">
          {firstName}
        </span>
        <CaretDown
          size={13}
          weight="bold"
          aria-hidden
          className="text-fg-muted"
        />
      </button>

      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={triggerRef}
        matchTriggerWidth={false}
        className="min-w-56 p-1"
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
                className="flex min-h-11 items-center rounded-row px-3 text-sm font-medium text-fg transition-colors duration-quick ease-out hover:bg-[var(--hover-overlay)]"
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
          onClick={signOut}
          disabled={logout.isPending}
          className="flex min-h-11 w-full items-center gap-2 rounded-row px-3 text-left text-sm font-medium text-fg transition-colors duration-quick ease-out hover:bg-[var(--hover-overlay)] disabled:opacity-50"
        >
          <SignOut size={16} weight="bold" aria-hidden />
          {logout.isPending ? "Signing out" : "Sign out"}
        </button>
      </Popover>
    </>
  );
}
