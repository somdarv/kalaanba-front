"use client";

import { useState } from "react";
import { List, MagnifyingGlass } from "@phosphor-icons/react";

import { ButtonLink, IconButton } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { cn } from "@/lib/cn";

import { AccountMenu } from "./account-menu";
import { BrandLock } from "./brand-lock";
import { HubPicker } from "./hub-picker";
import { MobileNavSheet } from "./mobile-nav-sheet";
import { NavLink } from "./nav-link";
import { PRIMARY_NAV, UTILITY_NAV } from "./nav-items";
import { ScoreTicker, type TickerFixture } from "./score-ticker";

/**
 * The site nav, in three rows, for both views.
 *
 *   1. utility  — the hub you are browsing, and the audience doors.
 *   2. main     — brand, the football, and who you are.
 *   3. ticker   — live scores, when there are any.
 *
 * DESKTOP keeps all three, as designed.
 *
 * PHONE drops row 1 and moves the hub picker up into row 2, because a 40px
 * strip carrying one pill is 40px a phone does not have, and the six primary
 * destinations move into a sheet. What survives in the bar is what a thumb
 * needs: the way back home, where you are, search, and you.
 *
 * The right cluster is the session made visible. Signed out it is Sign in and
 * Get started; signed in it is the account. Never both, because a nav offering
 * an account *and* a sign-up does not know who it is talking to.
 *
 * The ticker takes fixtures as a prop and renders nothing when the array is
 * empty. There is no match endpoint yet, so on every live page today it is
 * absent, and it cannot be made to show a score the backend did not produce
 * (Law 3). See `/design` for what it looks like with football in it.
 */

export type SiteNavProps = {
  /** Live scores. Empty until Match/Fixture ships an endpoint. */
  fixtures?: readonly TickerFixture[];
  className?: string;
};

export function SiteNav({ fixtures = [], className }: SiteNavProps) {
  // Deliberately not branching on `isLoading`. This app is not a BFF, so the
  // server cannot read the session at render time and `useUser` is always
  // loading during SSR. Showing a skeleton there put a grey pill where the
  // sign-up button belongs in the prerendered HTML, for every visitor, until a
  // cross-origin round trip finished. On a landing page over paid mobile data
  // that is the most important control on the screen being invisible.
  //
  // Signed out is therefore the default render and a session is the upgrade,
  // which is the same shape as the open-home decision itself: login is a
  // personalisation layer, not a precondition. A returning signed-in user sees
  // Sign in for the length of one request before it becomes their account.
  const { data: user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSignedIn = Boolean(user);

  return (
    <div className={cn("bg-bg", className)}>
      {/* Row 1 — utility. Desktop only. */}
      <div className="hidden border-b border-divider md:block">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <HubPicker />
          <nav aria-label="More">
            <ul className="flex items-center gap-5">
              {UTILITY_NAV.map((item) => (
                <li key={item.key}>
                  <span className="text-sm">
                    <NavLink item={item} />
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Row 2 — main. */}
      <div className="border-b border-divider">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <IconButton
              className="md:hidden"
              intent="ghost"
              size="sm"
              label="Open menu"
              icon={<List size={20} weight="bold" />}
              onClick={() => setIsMenuOpen(true)}
            />
            <BrandLock />
          </div>

          {/* The hub picker rides here instead of row 1 on a phone. */}
          <HubPicker className="md:hidden" />

          <nav
            aria-label="Primary"
            className="hidden flex-1 justify-center md:flex"
          >
            <ul className="flex items-center gap-6">
              {PRIMARY_NAV.map((item) => (
                <li key={item.key}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Search is an icon on a phone and a labelled control on a
                desktop. The icon is understood universally and the bar has no
                room for the word; on desktop the word is worth the pixels. */}
            <IconButton
              className="sm:hidden"
              intent="ghost"
              size="sm"
              label="Search"
              icon={<MagnifyingGlass size={18} weight="bold" />}
            />
            <button
              type="button"
              className={cn(
                "hidden min-h-11 items-center gap-2 rounded-pill sm:inline-flex",
                "border border-border bg-surface-elev px-4",
                "text-sm font-medium text-fg-muted",
                "transition-colors duration-quick ease-out",
                "hover:border-border-strong hover:bg-[var(--secondary-hover)] hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
              )}
            >
              <MagnifyingGlass size={16} weight="bold" aria-hidden />
              Search
            </button>

            {isSignedIn && user ? (
              <AccountMenu user={user} />
            ) : (
              <>
                <ButtonLink
                  href="/auth/login"
                  intent="secondary"
                  size="md"
                  className="hidden sm:inline-flex"
                >
                  Sign in
                </ButtonLink>
                <ButtonLink href="/auth/signup" size="md">
                  Get started
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 — the ticker, when there is football. */}
      <ScoreTicker fixtures={fixtures} />

      <MobileNavSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        isSignedIn={isSignedIn}
      />
    </div>
  );
}
