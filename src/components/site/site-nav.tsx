"use client";

import { useState } from "react";
import { List, MagnifyingGlass } from "@phosphor-icons/react";

import { ButtonLink, IconButton } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { useTickerFixtures } from "@/lib/api/hooks/use-fixtures";
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
 * PHONE drops row 1 entirely and keeps row 2 to four things: the logo, search,
 * the way in, and the button that opens the sheet. The hub picker and the
 * account are NOT in the bar — a 360px row carrying five controls carries none
 * of them well, and both are one tap away inside the menu.
 *
 * The menu button sits on the RIGHT. It is the most-used control in the mobile
 * bar and the right side is where a thumb rests; the logo keeps the left, where
 * a reader starts.
 *
 * The right cluster is the session made visible: one way in when signed out,
 * the account when signed in, never both.
 *
 * ONE button, not "Sign in" beside "Get started". `/auth/signup` is a redirect
 * to `/auth/login`, because ADR-0004 collapsed the two into a single neutral
 * entry: the person types a phone or an email and the system works out
 * new-vs-returning afterwards. Two buttons would put back at the front door
 * exactly the choice that ADR removed, and each one tells half the audience
 * the door is not for them. "Get in" leans neither way and echoes the headline
 * on the screen it opens ("Get in the game").
 *
 * The ticker reads through `useTickerFixtures`, which is seed-backed until
 * Match/Fixture ships (PRODUCT.md §3.1: the frontend is built against a typed
 * mock layer first). It renders nothing while the read is empty, so a page with
 * no football on it simply has a two-row nav.
 */

export type SiteNavProps = {
  /**
   * Override the ticker's fixtures. Only the design specimen passes this; every
   * real page lets the nav read its own.
   */
  fixtures?: readonly TickerFixture[];
  className?: string;
};

export function SiteNav({ fixtures, className }: SiteNavProps) {
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
  const { data: liveFixtures } = useTickerFixtures();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSignedIn = Boolean(user);

  const tickerFixtures: readonly TickerFixture[] =
    fixtures ??
    (liveFixtures ?? []).map((fixture) => ({
      id: fixture.id,
      home: fixture.home,
      away: fixture.away,
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
      statusLabel: fixture.minute ? null : fixture.statusLabel,
      minute: fixture.minute,
    }));

  return (
    // A <header> rather than a <div>: this is the site's banner landmark, and
    // it is how a screen reader user skips past the whole nav in one move
    // instead of arrowing through three rows of it.
    <header className={cn("bg-bg", className)}>
      {/* Row 1 — utility. Desktop only. */}
      <div className="hidden border-b border-divider md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-1.5 sm:px-6">
          <HubPicker />
          {/* `ml-auto` rather than `justify-between` on the row: the hub picker
              renders null when the hub read fails, and a justified row would
              then drag these to the left edge where they read as primary nav.
              Pinned right, they stay put whether or not it is there. */}
          <nav aria-label="More" className="ml-auto">
            <ul className="flex items-center gap-5">
              {UTILITY_NAV.map((item) => (
                <li key={item.key}>
                  <NavLink item={item} variant="utility" />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Row 2 — main. */}
      <div className="border-b border-divider">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <BrandLock />

          <nav
            aria-label="Primary"
            className="hidden flex-1 justify-center md:flex"
          >
            <ul className="flex items-center gap-8 lg:gap-10">
              {PRIMARY_NAV.map((item) => (
                <li key={item.key}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
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
                "border border-border bg-surface-elev px-5",
                "text-sm font-medium text-fg-muted",
                "transition-colors duration-quick ease-out",
                "hover:border-border-strong hover:bg-[var(--secondary-hover)] hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
              )}
            >
              <MagnifyingGlass size={16} weight="bold" aria-hidden />
              Search
            </button>

            {/* The account is desktop-only. On a phone it is in the sheet, so
                the bar keeps its width for navigation. */}
            {isSignedIn && user ? (
              <span className="hidden md:inline-flex">
                <AccountMenu user={user} />
              </span>
            ) : (
              /* `sm`, not `md`. `md` is h-12 and `min-h-11` does not undo an
                 explicit height, so it kept rendering 48px and swallowed a
                 mobile bar that is only a little taller than that. `sm` is a
                 40px box that already carries `tapExpand`, so the pointer
                 target stays at the §9.1 44px floor while the box gets out of
                 the way. Desktop takes the height back at `lg`, where the bar
                 is roomy and this is the primary entry to the product. */
              <ButtonLink
                href="/auth/login"
                size="sm"
                className="px-4 lg:h-11 lg:min-h-11 lg:px-5"
              >
                Get in
              </ButtonLink>
            )}

            <IconButton
              className="md:hidden"
              intent="ghost"
              size="sm"
              label="Open menu"
              icon={<List size={20} weight="bold" />}
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Row 3 — the ticker, when there is football. */}
      <ScoreTicker fixtures={tickerFixtures} />

      <MobileNavSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        user={user}
      />
    </header>
  );
}
