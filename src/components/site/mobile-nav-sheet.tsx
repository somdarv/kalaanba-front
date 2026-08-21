"use client";

import Link from "next/link";
import { SignOut } from "@phosphor-icons/react";

import { Avatar, BottomSheet, ButtonLink, Divider } from "@/components/ui";
import type { CurrentUser } from "@/lib/api/auth";

import { ACCOUNT_LINKS, useSignOut } from "./account-actions";
import { HubPicker } from "./hub-picker";
import { NavLink } from "./nav-link";
import { PRIMARY_NAV, UTILITY_NAV } from "./nav-items";

/**
 * The nav, on a phone.
 *
 * It carries more than the desktop sheet equivalent would, on purpose. The
 * mobile bar holds only the logo, search, the way in, and the button that opens
 * this — the hub picker and the account are not up there, because a 360px bar
 * that carries five controls carries none of them well. Both live in here
 * instead, which is also where a thumb already is (§9.1).
 *
 * `<BottomSheet>` brings its own focus trap, Escape handling and
 * swipe-to-dismiss.
 *
 * A sheet rather than a bottom tab bar. A tab bar commits every screen in the
 * product to a persistent bottom row and to four or five top-level
 * destinations, and five of the six here do not exist yet, so there is nothing
 * to commit to. `<AppShell>` keeps a `bottomNav` slot for that day.
 *
 * Order is deliberate: who you are, then where you are, then the football, then
 * the audience doors. The way out (sign out) is last and separated, so it is
 * never the thing a thumb finds by accident.
 */

export type MobileNavSheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  /** Null when signed out — the sheet then offers the way in instead. */
  user: CurrentUser | null | undefined;
};

export function MobileNavSheet({
  open,
  onOpenChange,
  user,
}: MobileNavSheetProps) {
  const close = () => onOpenChange(false);
  const { signOut, isPending } = useSignOut();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Menu">
      <div className="flex flex-col gap-5 pb-2">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar_url}
                name={user.name}
                size="md"
                alt=""
                className="bg-primary text-on-primary"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">
                  {user.name}
                </p>
                <p className="text-xs text-fg-subtle">Signed in</p>
              </div>
            </div>

            <nav aria-label="Your account">
              <ul className="flex flex-col">
                {ACCOUNT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="rounded-row duration-quick ease-out flex min-h-12 items-center text-base font-medium text-fg transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Divider />
          </>
        ) : null}

        <HubPicker className="self-start" />

        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <li key={item.key}>
                <NavLink item={item} variant="stacked" onNavigate={close} />
              </li>
            ))}
          </ul>
        </nav>

        <Divider />

        <nav aria-label="More">
          <ul className="flex flex-col">
            {UTILITY_NAV.map((item) => (
              <li key={item.key}>
                <NavLink item={item} variant="stacked" onNavigate={close} />
              </li>
            ))}
          </ul>
        </nav>

        {user ? (
          <button
            type="button"
            onClick={() => {
              close();
              void signOut();
            }}
            disabled={isPending}
            className="rounded-row duration-quick ease-out flex min-h-12 w-full items-center gap-2 text-left text-base font-medium text-fg transition-colors disabled:opacity-50"
          >
            <SignOut size={18} weight="bold" aria-hidden />
            {isPending ? "Signing out" : "Sign out"}
          </button>
        ) : (
          <ButtonLink href="/auth/login" size="lg" fullWidth onClick={close}>
            Get in
          </ButtonLink>
        )}
      </div>
    </BottomSheet>
  );
}
