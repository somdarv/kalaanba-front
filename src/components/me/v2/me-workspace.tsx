"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SiteNav } from "@/components/site";
import { AppShell, ErrorState, Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { useMyPlayer, usePlayerMeta } from "@/lib/api/hooks/use-player";

import { DetailsSheet } from "../details-sheet";
import { MeIdentity } from "./me-identity";
import { MeIndex } from "./me-index";
import { MeRail } from "./me-rail";

/**
 * `/me/v2` — the player's own record, as a workspace.
 *
 * Same data, same rules, same card as `/me`. What changes is the room: v1 is a
 * column of cards, v2 is three panels sitting on the ground with a rail down
 * the side, which is the shape a desktop app uses when one surface holds
 * several kinds of thing at once.
 *
 * Both routes stay built while the shape is being judged, the way
 * `/legacy/showcase` stays built so old and new can be compared side by side
 * (DESIGN_LANGUAGE §7).
 *
 * **Everything v1 refuses, v2 refuses.** Match/Fixture, Competition & Rules,
 * RP Economy and Awards have no endpoints, so a league-dashboard layout here
 * would have to invent four engines' worth of football. Constitution Law 3:
 * never show invented football. What this shows is identity, one live control,
 * and honest names for the rest.
 *
 * **This is the one route in the product that redirects on session state.**
 * The open-home decision (JOURNAL 2026-06-26) makes login a personalisation
 * layer rather than a front door, and every other surface renders for a
 * stranger. Nothing on this one does.
 *
 * **DOM order is mobile order**, not desktop order: rail, then the card, then
 * the index. A phone reads it top to bottom in that order, and grid column
 * placement moves the index into the middle column at `lg` without moving the
 * markup. The trade is a keyboard user on desktop reaching the right pane
 * before the middle one. §9 makes mobile the primary and desktop the
 * progressive enhancement, so the phone gets the honest order.
 *
 * At `lg` the page itself stops scrolling and each pane scrolls independently
 * inside a fixed viewport, which is what v1 settled on for its two columns
 * after sticky positioning pinned a rail taller than the screen and made its
 * bottom unreachable.
 */

export function MeWorkspace() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  // Held here, not in `<PlayerHero>`, because `<DetailsSheet>` opens it too
  // and exactly one overlay may be up at a time.
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
      className="kx-ground-soft lg:h-dvh lg:overflow-hidden"
      contentClassName="max-w-6xl lg:min-h-0 lg:overflow-hidden lg:pb-6"
    >
      {/* `min-h-0` on the panes is load-bearing: a grid item's automatic
          minimum size is its content, so without it a column refuses to shrink
          below its content and scrolls the page instead of itself. */}
      {/* The card pane is the NARROW column, which is the one place this
          layout departs from the app it borrows its shape from. `<PlayerCard>`
          is portrait by construction (`min-h`, no max width), so a pane wide
          enough to be the "detail" pane would render a 768px card 544px tall
          and turn the product's one shareable object landscape. The index
          takes the flexible column instead, where extra width buys legible
          rows. */}
      <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,24rem)] lg:gap-4">
        <MeRail
          hasPlayer={record !== null}
          className="lg:col-start-1 lg:row-start-1 lg:h-full"
        />

        <MeIdentity
          player={record}
          meta={meta.data}
          onEdit={() => setIsEditing(true)}
          isPickingPhoto={isPickingPhoto}
          onPickingPhotoChange={setIsPickingPhoto}
          className="lg:col-start-3 lg:row-start-1 lg:h-full"
        />

        <MeIndex
          user={user}
          player={record}
          meta={meta.data}
          onEdit={() => setIsEditing(true)}
          className="lg:col-start-2 lg:row-start-1 lg:h-full"
        />
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
