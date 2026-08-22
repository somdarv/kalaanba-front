"use client";

import { Avatar, Chip } from "@/components/ui";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { PlayerHero } from "../player-hero";
import { PaneLabel, WorkspacePane } from "./workspace-pane";

/**
 * The right pane: who you are, then the card itself.
 *
 * **The card is the v1 card, untouched.** `<PlayerHero>` already owns the
 * photo sheet, the cropper, the upload, the share button and the no-record
 * prompt, and §15 wants ONE card that is shareable and stays current. A second
 * implementation of it is how the shared image and the live URL start
 * disagreeing. v2 changes the room the card sits in, not the card.
 *
 * **The strip above it carries state, not identity.** Name aside, everything
 * in it is something the card deliberately does not show: availability is off
 * the card on this surface (the control sits six inches away in the index) and
 * market status only appears on an empty card. A strip repeating the number
 * and position printed six inches below in 40px type would be saying the same
 * thing twice, which is the exact fault v1 deleted a whole record block over.
 *
 * The strip is not interactive. The photo is picked by tapping the card, in
 * one place, and an avatar here that also opened the photo sheet would be a
 * second door to one room.
 */

export type MeIdentityProps = {
  player: MyPlayer | null;
  meta: PlayerMeta;
  onEdit: () => void;
  isPickingPhoto: boolean;
  onPickingPhotoChange: (next: boolean) => void;
  className?: string;
};

export function MeIdentity({
  player,
  meta,
  onEdit,
  isPickingPhoto,
  onPickingPhotoChange,
  className,
}: MeIdentityProps) {
  return (
    <WorkspacePane
      label="Your card"
      className={className}
      contentClassName="gap-4"
    >
      {player ? <IdentityStrip player={player} meta={meta} /> : null}

      <div id="me-card" className="flex scroll-mt-24 flex-col gap-4">
        <PaneLabel>Your card</PaneLabel>

        <PlayerHero
          player={player}
          meta={meta}
          onEdit={onEdit}
          isPickingPhoto={isPickingPhoto}
          onPickingPhotoChange={onPickingPhotoChange}
          withMobileGutter={false}
        />
      </div>
    </WorkspacePane>
  );
}

function IdentityStrip({
  player,
  meta,
}: {
  player: MyPlayer;
  meta: PlayerMeta;
}) {
  const availability = labelFor(meta.availability, player.availability_status);
  const market = labelFor(meta.market_statuses, player.market_status);

  return (
    <div className="flex items-center gap-3">
      <Avatar
        size="lg"
        name={player.stage_name}
        src={player.headshot_url ?? undefined}
      />

      <div className="min-w-0">
        <p className="font-display text-fg truncate text-lg font-bold tracking-tight">
          {player.stage_name}
        </p>

        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {/* Neutral, both of them. The keys behind these labels are
              config-driven (ADR-0007), so a tinted chip would be this
              component asserting that "available" is good and something else
              is not, on a vocabulary an admin can rename tomorrow. The label
              carries the meaning; the chip only frames it. */}
          {availability ? <Chip size="sm">{availability}</Chip> : null}
          {market ? <Chip size="sm">{market}</Chip> : null}
        </div>
      </div>
    </div>
  );
}
