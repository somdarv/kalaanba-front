"use client";

import {
  AppShell,
  ButtonLink,
  SiteHeader,
  Skeleton,
  Wordmark,
} from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";

import { AreaPill } from "./area-pill";
import { ClubsNearYouRail } from "./clubs-near-you-rail";
import { HomeCtaPrompts } from "./home-cta-prompts";
import { HomeHero } from "./home-hero";
import { useHeroDismissed } from "./use-hero-dismissed";

/**
 * `/` — the open home (JOURNAL 2026-06-26).
 *
 * Kalaanba is not a walled dashboard. A signed-out visitor gets the same shell
 * as a signed-in one, and signing in adds layers (an area, clubs near it,
 * an inbox) rather than opening a door. Nothing here redirects on session
 * state, which is the whole point: a redirect would make login a front door
 * again.
 *
 * What this deliberately is NOT yet: the feed. Fan Buzz §11.1 specifies nine
 * card types for the home feed (hot challenges, tracked matches, followed club
 * updates, verified results, fixtures nearby, competition updates, player
 * moments, venue suggestions, zone pulse) and the API can serve none of them —
 * there is no match, fixture, competition, challenge or buzz endpoint yet. So
 * the feed slot below carries discovery instead of activity, and the shell it
 * sits in is the shell the feed will use unchanged. See the home-feed specimen
 * at /design for what that slot becomes.
 *
 * The one thing it must never do is show invented football. Synthetic
 * standings on a live surface are indistinguishable from real ones, and Law 3
 * exists because that is how a record loses its meaning.
 */

export function HomeScreen() {
  const { data: user, isLoading } = useUser();
  const isSignedIn = Boolean(user);
  // Dismissing the pitch is a presentation preference, so it lives in the
  // browser. Identity does not own a column for it.
  const { isDismissed, dismiss } = useHeroDismissed();

  return (
    <AppShell
      header={
        <SiteHeader
          brand={
            <Wordmark size="sm" className="text-fg" label="Kalaanba, home" />
          }
          actions={
            isSignedIn ? undefined : (
              <ButtonLink href="/auth/login" intent="secondary" size="sm">
                Sign in
              </ButtonLink>
            )
          }
        />
      }
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <AreaPill isSignedIn={isSignedIn} hasArea={Boolean(user?.area_id)} />
        )}

        {isDismissed ? null : (
          <HomeHero
            ctaHref={isSignedIn ? "/player/setup" : "/auth/signup"}
            ctaLabel={isSignedIn ? "Create your player card" : "Get started"}
            onDismiss={dismiss}
          />
        )}

        {/* The feed slot. Discovery today, Fan Buzz §11.1 items tomorrow. */}
        <ClubsNearYouRail areaId={user?.area_id} />

        <HomeCtaPrompts />
      </div>
    </AppShell>
  );
}
