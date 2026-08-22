"use client";

import { Star } from "@phosphor-icons/react";

import { Avatar, Spinner, StatValue } from "@/components/ui";
import type { AvatarSize } from "@/components/ui/avatar";
import { Wordmark } from "@/components/ui/wordmark";
import type { Player } from "@/lib/api/player";
import { cn } from "@/lib/cn";

/**
 * The top of the player card: the mark, the number, the face, the name, and
 * the one fact that places a player on a pitch.
 *
 * Split from `player-card.tsx` at the point that file would have crossed the
 * 400-line limit (engineering-standards §1). The seam is real rather than
 * arithmetic: this is who the player is, that is what the card is made of.
 *
 * **Position sits inline with the real name.** A shirt number and a position
 * are one fact said twice, and a team sheet writes them together. On its own
 * line under the names it read as a third name; beside the legal name it reads
 * as what it is, the way a team sheet writes "10 ST Abdul Fuseini".
 *
 * **Market status and availability are gone from the card.** §15 lists what may
 * appear here — "preferred number, primary position, club badge, photo,
 * verified appearances, goals, assists, and badges" — and neither is on that
 * list. They were bloating the name block with facts nobody reads off a card.
 * Availability keeps its one-tap control directly under the card on `/me`,
 * which is where a value the player changes belongs.
 *
 * **The photo is a control here and nowhere else.** `onEditPhoto` is what turns
 * the avatar into a button; without it the card stays purely presentational
 * (§4.2), which is what lets the same component render for a stranger.
 */

export type PlayerCardIdentityProps = {
  player: Player;
  /** Short position form (`GK`, `ST`) from `player.positions.abbreviations`. */
  positionAbbreviation: string | null;
  /**
   * True when the record band has nothing to show.
   *
   * A card with no verified football on it is mostly empty space, and empty
   * space reads as an unfinished object rather than as a new player. Scaling
   * identity up fills the card with the one thing it does have — who this is —
   * so a player on day one still has something worth sending.
   */
  isRecordEmpty?: boolean;
  /** Omit and the avatar is not interactive. */
  onEditPhoto?: () => void;
  isPhotoPending?: boolean;
};

/**
 * The photo.
 *
 * **No camera badge.** The card is the thing a player screenshots and sends to
 * a club, and a control drawn onto it travels into every copy as a button
 * nobody can press. Tapping the photo still opens the options; the affordance
 * is the tap target and the pointer, not a glyph baked into the artefact.
 *
 * A spinner does appear while an upload is in flight, because that is state
 * rather than chrome — and it is gone by the time anyone screenshots anything.
 */
function PlayerPhoto({
  player,
  size,
  onEditPhoto,
  isPhotoPending,
}: {
  player: Player;
  size: AvatarSize;
  onEditPhoto?: () => void;
  isPhotoPending?: boolean;
}) {
  const shared =
    "ring-on-card/40 shrink-0 shadow-[var(--shadow-sm)] ring-2 bg-on-card/10 text-on-card";

  if (!onEditPhoto) {
    return (
      <Avatar
        size={size}
        name={player.stage_name}
        src={player.headshot_url ?? undefined}
        className={shared}
      />
    );
  }

  return (
    <span className="relative shrink-0">
      <Avatar
        interactive
        size={size}
        name={player.stage_name}
        src={player.headshot_url ?? undefined}
        aria-label={
          player.headshot_url ? "Change your photo" : "Add your photo"
        }
        aria-busy={isPhotoPending || undefined}
        disabled={isPhotoPending}
        onClick={onEditPhoto}
        className={cn(shared, "hover:ring-on-card")}
      />

      {isPhotoPending ? (
        <span
          aria-hidden
          className="bg-card-deep-deep/55 text-on-card pointer-events-none absolute inset-0 grid place-items-center rounded-full"
        >
          <Spinner size="md" />
        </span>
      ) : null}
    </span>
  );
}

/**
 * The one badge on this card backed by verified data: a Trust-cleared match
 * award, never a Fan Buzz signal (Law 8/9).
 *
 * Centred in the gap between the face and the record, which is the only place
 * on the card with air around it. Under the wordmark it crowded the mark; as a
 * full-width slab under the record it carried the same weight as the whole
 * verified set. Here it has room on all four sides and reads as one earned
 * line.
 *
 * Exported because `player-card.tsx` places it — that file owns the vertical
 * rhythm between the bands.
 */
export function PlayerCardAward({
  count,
  labelClassName,
}: {
  count: number;
  labelClassName: string;
}) {
  return (
    <p className="text-on-card/85 flex items-center justify-center gap-2.5">
      {/* `-mt-px`, and it is not a fudge. The label sets `leading-none`, so its
          line box is exactly the font size while the capitals occupy only the
          upper two thirds of it — the optical centre of an all-caps run sits
          above the box centre. A star centred on the BOX therefore reads as
          sitting low against the letters. One pixel up puts it on the line the
          eye actually draws. */}
      <Star size={12} weight="fill" aria-hidden className="-mt-px shrink-0" />

      {/* One text run, not three. The count and the label used to be separate
          spans at different sizes, which produced both faults in the review:
          the number read as larger than the words, and the two sat on
          different baselines because each was centred in its own box. Setting
          them as one line makes a shared baseline and a shared size structural
          rather than something to keep re-tuning. Weight alone separates the
          figure from the words. */}
      <span className={cn(labelClassName, "tracking-[0.16em]")}>
        <span className="kx-numeric font-bold">{count}x</span> Player of the
        match
      </span>
    </p>
  );
}

export function PlayerCardIdentity({
  player,
  positionAbbreviation,
  isRecordEmpty,
  onEditPhoto,
  isPhotoPending,
}: PlayerCardIdentityProps) {
  const fullName = `${player.first_name} ${player.last_name}`.trim();

  return (
    <>
      {/* Head: the mark hard against the left margin, the number against the
          right. Both are identity, neither is copy.

          The wordmark must stay a child of a ROW flex box. `.kx-wordmark`
          paints through a mask positioned `center`, so inside a COLUMN flex box
          it stretches to the widest sibling and the art re-centres itself in
          that wider box. The symptom is the logo appearing to drift off the
          margin, which reads as a design choice rather than as the layout bug
          it is. */}
      <div className="mt-1 flex items-start justify-between gap-4">
        <Wordmark size="sm" className="h-5 opacity-80" />

        {player.preferred_number != null ? (
          <StatValue
            size="xl"
            className="text-on-card leading-none"
            aria-label={`Shirt number ${player.preferred_number}`}
          >
            {player.preferred_number}
          </StatValue>
        ) : null}
      </div>

      {/* Photo over name, both on the card's centre line.

          The card is a centred composition everywhere else — the ghost name,
          the award, the three lead figures — and the identity block was the one
          part still hanging off the left edge. Stacked and centred it agrees
          with the rest, and it is the shape a player card has always had:
          the face, then the name under it. */}
      <div className="mt-4 flex flex-col items-center">
        <PlayerPhoto
          player={player}
          size={isRecordEmpty ? "3xl" : "2xl"}
          onEditPhoto={onEditPhoto}
          isPhotoPending={isPhotoPending}
        />

        <div className="relative mt-5 w-full">
          {/* The name again at poster scale, knocked back until it is texture
              rather than text.

              Growing outward from the middle, so a long name loses the same
              amount at each edge and stays symmetrical about the card rather
              than trailing off one side. Clipping is the intent, not a failure:
              `whitespace-nowrap` plus the panel's clip is also what stops a
              long name from breaking the layout. */}
          <span
            aria-hidden
            className="text-on-card/[0.06] font-display pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-[3.75rem] leading-none font-bold tracking-[-0.04em] whitespace-nowrap uppercase select-none sm:text-[4.5rem]"
          >
            {player.stage_name}
          </span>

          {/* `break-words`, never `truncate`. A centred line that truncates
              loses its end while pretending to be balanced; a centred line that
              wraps keeps every letter and stays symmetrical about the middle,
              which is what a long name should do here. */}
          <h2
            className={cn(
              "text-on-card font-display relative text-center leading-tight font-bold tracking-tight break-words",
              isRecordEmpty ? "text-4xl" : "text-3xl",
            )}
          >
            {player.stage_name}
          </h2>

          {/* Tight to the stage name on purpose. The two names and the position
              are one identity block, and a looser gap let the lower line float
              free of the name it belongs to.

              `flex-wrap`: a long legal name drops under the chip rather than
              squeezing it, and both stay centred. */}
          <p className="relative mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
            {positionAbbreviation ? (
              <span className="bg-on-card/15 text-on-card rounded-row shrink-0 px-1.5 py-1 text-[0.625rem] leading-none font-bold tracking-[0.06em] uppercase">
                {positionAbbreviation}
              </span>
            ) : null}
            <span
              className={cn(
                "text-on-card/80 text-center break-words",
                isRecordEmpty ? "text-base" : "text-sm",
              )}
            >
              {fullName}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
