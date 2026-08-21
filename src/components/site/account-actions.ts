"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/lib/api/hooks/use-auth";

/**
 * What "your account" means, in one place.
 *
 * The desktop nav shows it in a popover behind the avatar; the phone shows it
 * inside the menu sheet, because the avatar is not in the mobile bar at all.
 * Two surfaces, one list — a destination that exists on one and not the other
 * is how a product ends up with a phone version that is a different product.
 *
 * Only routes that exist are listed. A menu is a promise that the thing you tap
 * is there, and the surfaces the product will eventually want (settings, my
 * matches, RP wallet) have none yet. They get added when they are built.
 */

export type AccountLink = { href: string; label: string };

/** Live routes only. See the note above before adding to this. */
export const ACCOUNT_LINKS: readonly AccountLink[] = [
  { href: "/player/setup", label: "Player profile" },
  { href: "/clubs/manage", label: "My clubs" },
  { href: "/onboarding/area", label: "Your area" },
];

/**
 * Sign out, then go home.
 *
 * Home is the right landing because it is open (JOURNAL 2026-06-26): there is
 * nothing to be locked out of, so signing out is a change of state rather than
 * an ejection.
 *
 * The failure path matters. `useLogout` clears the token locally on success,
 * but a dead network must not strand someone in a nav that still thinks they
 * are signed in, so the navigation happens either way.
 */
export function useSignOut() {
  const logout = useLogout();
  const router = useRouter();

  const signOut = async () => {
    try {
      await logout.mutateAsync();
    } catch {
      // Deliberately swallowed. See above.
    }
    router.push("/");
    router.refresh();
  };

  return { signOut, isPending: logout.isPending };
}
