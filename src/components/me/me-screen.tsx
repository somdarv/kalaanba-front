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
 * **The card owns the record.** There is no separate record block. The card
 * carries the full §13 set now that it is tall enough to, and a block below
 * repeating the same six counters was saying the same thing twice on one
 * screen. The empty case travels with it: the card states the gate, and
 * `CardConfidenceBlock` explains how the gate opens.
 *
 * **Layout.** One column on a phone, in the order a player cares about, and the
 * page scrolls the way every other route does.
 *
 * At `lg` the page itself stops scrolling and the two columns scroll
 * independently inside a fixed viewport. Sticky was the first attempt and it
 * was wrong for this surface: a sticky rail taller than the viewport pins its
 * top and makes its bottom unreachable, and giving it its own scroll then put a
 * second scrollbar inside the page's, which reads as a rendering fault rather
 * than as two panes. Fixing the shell means one scroll context per column and
 * none for the document.
 *
 * Both bars are hidden (`kx-scroll-none`). They sit inside a composed surface
 * where two of them side by side is noise, and each column's scrollability is
 * already evident from its content being clipped at the fold.
 */

export function MeScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  // Held here, not in <PlayerHero>, because <DetailsSheet> opens it too and
  // exactly one overlay may be up at a time.
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);

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
    <AppShell
      header={<SiteNav />}
      className="lg:h-dvh lg:overflow-hidden"
      contentClassName="max-w-6xl lg:min-h-0 lg:overflow-hidden lg:pb-6"
    >
      <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start lg:gap-6">
        {/* `min-h-0` on both columns is load-bearing: a grid item's automatic
            minimum size is its content, so without it the column refuses to
            shrink below its content and scrolls the page instead of itself. */}
        <div className="kx-scroll-none flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
          <PlayerHero
            player={record}
            meta={meta.data}
            onEdit={() => setIsEditing(true)}
            isPickingPhoto={isPickingPhoto}
            onPickingPhotoChange={setIsPickingPhoto}
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

        <div className="kx-scroll-none flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
          {record ? (
            <>
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
          onEditPhoto={() => {
            setIsEditing(false);
            setIsPickingPhoto(true);
          }}
        />
      ) : null}
    </AppShell>
  );
}
