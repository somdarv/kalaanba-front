"use client";

import type { ReactNode } from "react";

import {
  Card,
  Crest,
  Divider,
  FixtureRow,
  LiveIndicator,
  ScoreLine,
  Skeleton,
  StatValue,
} from "@/components/ui";
import {
  useLiveFixtures,
  useNextFixture,
  useRecentResults,
} from "@/lib/api/hooks/use-fixtures";

import { ClubsNearYouRail } from "./clubs-near-you-rail";
import { TopScorersSection, ZoneTableSection } from "./home-standings";

/**
 * The football on the home page.
 *
 * Every section reads through a hook in `lib/api/hooks/use-fixtures`, which
 * calls a typed async client in `lib/api/fixtures.ts`, which is backed by the
 * Tamale seed until Match/Fixture, Competition & Rules and Awards ship
 * endpoints. That chain is PRODUCT.md §3.1/§3.2, not a shortcut: components
 * never touch the seed, so the swap to real engines is an edit inside one
 * module and nothing here changes.
 *
 * Nothing on this page computes football. Scores, minutes, table positions and
 * goal counts all arrive as given (Law 3), and a result that is not confirmed
 * is rendered as provisional rather than filtered out, because it is real news
 * that simply is not settled (Law 7).
 *
 * Order is what a supporter opens the app for: what is happening now, what is
 * next, what just happened, then where everyone stands.
 */

export type HomeFeedProps = {
  /** The signed-in user's area, for the clubs rail. Null hides it. */
  areaId: string | null | undefined;
};

export function HomeFeed({ areaId }: HomeFeedProps) {
  return (
    <div className="flex flex-col gap-8">
      <LiveNowSection />
      <NextUpSection />
      <LatestResultsSection />

      <FeedSection title="Tamale Central">
        <ZoneTableSection />
      </FeedSection>

      <FeedSection title="Top scorers">
        <TopScorersSection />
        <p className="text-fg-subtle mt-2 text-xs">
          Verified matches only. A goal from an unconfirmed result does not
          count yet.
        </p>
      </FeedSection>

      <ClubsNearYouRail areaId={areaId} />
    </div>
  );
}

function FeedSection({
  title,
  trailing,
  children,
}: {
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">
          {title}
        </h2>
        {trailing}
      </div>
      {children}
    </section>
  );
}

function LiveNowSection() {
  const { data: fixtures, isLoading } = useLiveFixtures();

  if (isLoading) return <Skeleton className="rounded-card h-40 w-full" />;
  if (!fixtures || fixtures.length === 0) return null;

  return (
    <FeedSection title="Happening now" trailing={<LiveIndicator />}>
      <div className="flex flex-col gap-3">
        {fixtures.map((fixture) => (
          <Card key={fixture.id} tone="raised" size="md">
            <ScoreLine
              home={{ name: fixture.home }}
              away={{ name: fixture.away }}
              homeScore={fixture.homeScore}
              awayScore={fixture.awayScore}
              status={fixture.status}
              statusLabel={fixture.statusLabel}
              minute={fixture.minute ?? undefined}
              meta={
                fixture.venue
                  ? `${fixture.competition} · ${fixture.venue}`
                  : fixture.competition
              }
              size="lg"
            />
          </Card>
        ))}
      </div>
    </FeedSection>
  );
}

function NextUpSection() {
  const { data: fixture, isLoading } = useNextFixture();

  if (isLoading) return <Skeleton className="rounded-card h-48 w-full" />;
  if (!fixture) return null;

  return (
    <FeedSection title="Next up">
      {/* No photographic hero. Grassroots has no press photography and never
          will, so the weight comes from the crests and the type instead. */}
      <Card tone="raised" size="md">
        <div className="flex items-center justify-center gap-5">
          <Crest name={fixture.home} size="xl" />
          <StatValue size="lg" tone="muted">
            vs
          </StatValue>
          <Crest name={fixture.away} size="xl" />
        </div>
        <p className="font-display mt-4 text-center text-lg leading-tight font-bold tracking-tight text-balance">
          {fixture.home} vs {fixture.away}
        </p>
        <p className="text-fg-muted mt-1 text-center text-sm">
          {fixture.statusLabel}
        </p>
        {fixture.venue ? (
          <p className="text-fg-subtle mt-0.5 text-center text-xs">
            {fixture.competition} · {fixture.venue}
          </p>
        ) : null}
      </Card>
    </FeedSection>
  );
}

function LatestResultsSection() {
  const { data: fixtures, isLoading } = useRecentResults();

  if (isLoading) return <Skeleton className="rounded-card h-56 w-full" />;
  if (!fixtures || fixtures.length === 0) return null;

  return (
    <FeedSection title="Latest results">
      <Card tone="flat" size="md">
        {fixtures.map((fixture, index) => (
          <div key={fixture.id}>
            {index > 0 ? <Divider /> : null}
            <FixtureRow
              home={{ name: fixture.home }}
              away={{ name: fixture.away }}
              homeScore={fixture.homeScore}
              awayScore={fixture.awayScore}
              status={fixture.status}
              statusLabel={fixture.statusLabel}
              meta={fixture.competition}
            />
          </div>
        ))}
      </Card>
    </FeedSection>
  );
}
