"use client";

import Link from "next/link";
import { UsersThree } from "@phosphor-icons/react";

import { Badge, ButtonLink, Card, Crest, EmptyState, Skeleton } from "@/components/ui";
import { CLUB_TYPE_LABELS } from "@/lib/api/club";
import { useClubsNearby } from "@/lib/api/hooks/use-clubs";

/**
 * "Clubs near you" on the home surface — the only real football Kalaanba can
 * show today, so it leads the feed slot.
 *
 * A rail, not a list. The full list lives at /clubs/near-you and this is a
 * teaser inside a feed: a vertical list of six clubs would be the whole home
 * page, and when the §11.1 feed items arrive they need to sit under this
 * rather than scroll past it.
 *
 * Every value shown is the backend's (Law 3). `CLUB_TYPE_LABELS` maps the
 * internal key to a display string and is flagged in `lib/api/club.ts` as
 * standing in for a config-served label map until Club ships a meta endpoint
 * (Law 4).
 */

export type ClubsNearYouRailProps = {
  /** Null when the user has no area yet — the rail hides itself. */
  areaId: string | null | undefined;
};

export function ClubsNearYouRail({ areaId }: ClubsNearYouRailProps) {
  const { data: clubs, isLoading, isError } = useClubsNearby(areaId);

  if (!areaId) return null;

  return (
    <section aria-labelledby="clubs-near-you">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2
          id="clubs-near-you"
          className="font-display text-lg font-bold tracking-tight text-fg"
        >
          Clubs near you
        </h2>
        <ButtonLink href="/clubs/near-you" intent="ghost" size="sm">
          See all
        </ButtonLink>
      </div>

      {isLoading ? (
        <div className="flex gap-3">
          <Skeleton className="h-32 w-44 shrink-0 rounded-card" />
          <Skeleton className="h-32 w-44 shrink-0 rounded-card" />
          <Skeleton className="h-32 w-44 shrink-0 rounded-card" />
        </div>
      ) : isError ? (
        <p role="alert" className="text-sm text-fg-muted">
          Could not load clubs. Pull down to try again.
        </p>
      ) : !clubs || clubs.length === 0 ? (
        <EmptyState
          icon={<UsersThree size={26} weight="duotone" />}
          title="No clubs here yet"
          description="Be the first. Start your club and other players will find it."
          action={<ButtonLink href="/clubs/manage">Start a club</ButtonLink>}
          size="sm"
        />
      ) : (
        /* Horizontal scroll owns its overscroll so a swipe at the end of the
           rail cannot rubber-band the page behind it (§9.5). `snap` makes it
           land on a card rather than halfway through one. */
        <ul className="kx-scroll -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2">
          {clubs.slice(0, 8).map((club) => (
            <li key={club.id} className="w-44 shrink-0 snap-start">
              <Link
                href="/clubs/near-you"
                className="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <Card tone="raised" size="md" className="h-full">
                  <Crest name={club.name} src={club.crest_url} size="lg" />
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-fg">
                    {club.name}
                  </p>
                  <Badge size="sm" className="mt-2">
                    {CLUB_TYPE_LABELS[club.club_type] ?? club.club_type}
                  </Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
