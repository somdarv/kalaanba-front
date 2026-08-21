"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SiteNav } from "@/components/site";
import { AppShell, ErrorState, Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { useMyPlayer, usePlayerMeta } from "@/lib/api/hooks/use-player";

import { AccountBlock } from "./account-block";
import { AvailabilityBlock } from "./availability-block";
import { CardConfidenceBlock } from "./card-confidence-block";
import { ClubBlock } from "./club-block";
import { ComingBlock } from "./coming-block";
import { DetailsBlock } from "./details-block";
import { DetailsSheet } from "./details-sheet";
import { PlayerHero } from "./player-hero";
import { RecordBlock } from "./record-block";

/**
 * `/me` — the player's own record.
 *
 * The one private surface in an otherwise open product (JOURNAL 2026-06-26).
 * Everything else renders for a stranger; this does not, so it is also the one
 * place a redirect on session state is correct rather than a front door.
 *
 * **Not a dashboard.** Match/Fixture, Competition & Rules, RP Economy and
 * Awards have no endpoints, so a league-dashboard layout here would have to
 * invent four engines' worth of football. Constitution Law 3 and the same rule
 * `site/home-screen.tsx` states: never show invented football. What this shows
 * instead is identity, one live control, and honest names for the rest.
 *
 * **Layout.** One column on a phone, in the order a player cares about. At
 * `lg` the identity half lifts into a sticky rail and the substance scrolls
 * beside it — the composition the reference dashboards get right, without
 * introducing the second navigation model a sidebar would bring. Same
 * `AppShell` + `SiteNav` as every other route.
 *
 * The rail caps its height and scrolls internally. A sticky element taller than
 * the viewport pins its top and makes its bottom unreachable, which on a short
 * laptop screen would hide the availability control behind nothing.
 */

export function MeScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading: isUserLoading } = useUser();
  const meta = usePlayerMeta();
  const player = useMyPlayer(user?.id);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isUserLoading, user, router]);

  // `!user` covers null AND undefined. `useUser` returns undefined when
  // `GET /users/me` errors, and the onboarding page shipped a frozen loader by
  // only handling null (JOURNAL 2026-06-25). This page always resolves to a
  // redirect or content.
  if (isUserLoading || !user || meta.isLoading || player.isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <Spinner size="lg" label="Loading" />
      </main>
    );
  }

  if (meta.isError || !meta.data) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <ErrorState
          title="Couldn't open your profile"
          description="We couldn't load your profile options. Check your connection and try again."
          onRetry={async () => {
            await meta.refetch();
          }}
        />
      </main>
    );
  }

  // Distinct from `null`, which is the legitimate no-card state (§22). Only a
  // genuine read failure lands here.
  if (player.isError) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <ErrorState
          title="Couldn't open your profile"
          description="We couldn't load your record. Check your connection and try again."
          onRetry={async () => {
            await player.refetch();
          }}
        />
      </main>
    );
  }

  const record = player.data ?? null;

  return (
    <AppShell header={<SiteNav />} contentClassName="max-w-6xl">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
          <PlayerHero
            player={record}
            meta={meta.data}
            onEdit={() => setIsEditing(true)}
          />

          {record ? (
            <>
              <CardConfidenceBlock
                confidence={record.confidence}
                meta={meta.data}
              />
              <AvailabilityBlock player={record} meta={meta.data} />
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {record ? (
            <>
              <RecordBlock record={record.record} />
              <ClubBlock player={record} meta={meta.data} />
              <DetailsBlock
                player={record}
                meta={meta.data}
                onEdit={() => setIsEditing(true)}
              />
            </>
          ) : null}

          <AccountBlock user={user} />
          <ComingBlock />
        </div>
      </div>

      {record ? (
        <DetailsSheet
          open={isEditing}
          onOpenChange={setIsEditing}
          player={record}
          meta={meta.data}
        />
      ) : null}
    </AppShell>
  );
}
