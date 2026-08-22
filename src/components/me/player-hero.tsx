"use client";

import { useState } from "react";

import { PlayerCard } from "@/components/player/setup/player-card";
import { buildPlayerCardModel } from "@/components/player/setup/player-card-model";
import { ShareCardButton } from "@/components/player/share/share-card-button";

import { PhotoCropper } from "./photo-cropper";
import { PhotoSheet } from "./photo-sheet";
import { Button, ButtonLink, Card, flowGutter } from "@/components/ui";
import {
  useUpdatePlayer,
  useUploadPlayerPhoto,
} from "@/lib/api/hooks/use-player";
import type { MyPlayer, PlayerMeta } from "@/lib/api/player";

/**
 * The hero of `/me` — the player's own card.
 *
 * Reuses the `<PlayerCard>` the setup reveal already ships rather than growing a
 * second one. §15 wants ONE card that is shareable and stays current; two
 * implementations of it is how the shared image and the live URL start
 * disagreeing.
 *
 * **This surface is where the card is fullest.** Setup has no record to speak
 * of, so it renders identity alone. Here the card gets the verified counters
 * (§13) and the two controls only the owner gets: the photo and the share.
 * They are backend-owned values passed straight through (Constitution Law 3),
 * and which of them lead is config the card reads by position (Law 2).
 *
 * The confidence tier stays OFF the card and in `<CardConfidenceBlock>` below
 * it. On the card it read as a caveat on figures that carry none — only
 * confirmed matches reach a record at all (§13) — and in its own block it is
 * what it actually measures: how much record stands behind the card.
 *
 * **No availability on the card here.** `<AvailabilityBlock>` sits directly
 * underneath it as a one-tap control, so the card would be restating a value
 * the player can already see and change six inches lower. The setup reveal
 * still shows it, where the player has just chosen it and nothing else on the
 * screen confirms the choice.
 *
 * **The photo is picked here and nowhere else.** `<PlayerCard>` takes a
 * callback and knows nothing about files, uploads or mutations — it stays
 * presentational (§4.2), which is what lets the same component render for a
 * stranger with no control attached. Tapping it opens `<PhotoSheet>`, which
 * owns the four things a player might want: camera, library, replace, remove.
 *
 * The no-card branch is a real state, not a fallback: post-signup users are
 * `role=user` and player-hood is opt-in (§22), so most accounts land here. It
 * offers one action and does not redirect, because a `/me` that bounces you
 * into the wizard is a trapdoor rather than a page.
 */

export type PlayerHeroProps = {
  player: MyPlayer | null;
  meta: PlayerMeta;
  onEdit: () => void;
  /** Owned by `<MeScreen>`: the details sheet opens the photo options too. */
  isPickingPhoto: boolean;
  onPickingPhotoChange: (next: boolean) => void;
};

export function PlayerHero({
  player,
  meta,
  onEdit,
  isPickingPhoto,
  onPickingPhotoChange,
}: PlayerHeroProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  // The picked file, held while the player frames it. Cleared on confirm or
  // cancel, which is also what closes the cropper.
  const [pickedPhoto, setPickedPhoto] = useState<File | null>(null);
  const photo = useUploadPlayerPhoto(player);
  const update = useUpdatePlayer(player);

  if (!player) {
    return (
      <Card tone="flat" size="md" className="border-dashed text-center">
        <h1 className="font-display text-fg text-xl font-bold tracking-tight">
          Make your player card
        </h1>
        <p className="text-fg-muted mx-auto mt-2 max-w-xs text-sm">
          It takes a minute. You pick your number, your position and when you
          play.
        </p>
        <ButtonLink href="/player/setup" size="md" className="mt-5">
          Start
        </ButtonLink>
      </Card>
    );
  }

  const model = buildPlayerCardModel({
    player,
    positions: meta.positions,
    marketStatuses: meta.market_statuses,
    record: player.record,
    featuredStats: meta.card_featured_stats,
    statLabels: meta.card_stat_labels,
  });

  function onPick(file: File) {
    setPhotoFailed(false);
    // Framed before it is sent. The card crops a headshot to a circle, so
    // whatever the player did not choose gets cut by a rule, and a rule that
    // guesses puts a chest on a team sheet with no way to correct it.
    setPickedPhoto(file);
  }

  function onFramed(blob: Blob) {
    setPickedPhoto(null);
    photo.mutate(blob, { onError: () => setPhotoFailed(true) });
  }

  /**
   * Clearing the photo is an ordinary profile patch, not a media call.
   *
   * The stored object is deliberately left where it is. It is content-addressed
   * and unreferenced once the row stops pointing at it, and deleting bytes on a
   * "remove" that the player may undo thirty seconds later trades a recoverable
   * mistake for an unrecoverable one. Archive, do not delete (Law 13).
   */
  function onRemove() {
    setPhotoFailed(false);
    update.mutate(
      { headshot_url: null },
      { onError: () => setPhotoFailed(true) },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* The card carries the player's name at display size, so it is the page
          heading. A second visible <h1> above it would say the same thing
          twice; `<PlayerCard>` renders the stage name as its own <h2>, and the
          visually-hidden <h1> is what gives the document one. */}
      <h1 className="sr-only">{player.stage_name}, your player card</h1>

      {/* The card takes the guided-flow gutter on a phone, and only on a phone.
          `flowGutter` is 10% each side, so the card sits on 80% of the viewport
          the way the setup screens do — at the §9.2 floor it filled ~89% and
          read as a page bleeding off both edges rather than an object being
          handed over.

          Reset at `sm` on purpose. Percentage padding resolves against the
          CONTAINING BLOCK, and on desktop this card lives in a 380px column, so
          leaving the gutter on would shave 76px off a card whose length is the
          thing that works there. */}
      <div className={`${flowGutter} sm:pr-0 sm:pl-0`}>
        <PlayerCard
          player={player}
          positions={meta.positions}
          marketStatuses={meta.market_statuses}
          record={player.record}
          featuredStats={meta.card_featured_stats}
          statLabels={meta.card_stat_labels}
          onEditPhoto={() => onPickingPhotoChange(true)}
          isPhotoPending={photo.isPending}
        />
      </div>

      <PhotoSheet
        open={isPickingPhoto}
        onOpenChange={onPickingPhotoChange}
        hasPhoto={Boolean(player.headshot_url)}
        onPick={onPick}
        onRemove={onRemove}
        isPending={photo.isPending}
      />

      <PhotoCropper
        open={pickedPhoto !== null}
        file={pickedPhoto}
        onCancel={() => setPickedPhoto(null)}
        onConfirm={onFramed}
        isPending={photo.isPending}
      />

      {photoFailed ? (
        <p role="alert" className="text-danger-ink text-xs">
          Could not save your photo. Try again.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button intent="secondary" size="sm" onClick={onEdit}>
          Edit details
        </Button>
        <ShareCardButton
          player={player}
          model={model}
          record={player.record}
          statLabels={meta.card_stat_labels}
        />
      </div>
    </div>
  );
}
