"use client";

import { useState } from "react";

import { Button, useToast } from "@/components/ui";
import { useUpdatePlayer } from "@/lib/api/hooks/use-player";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { AvailabilitySheet } from "./availability-sheet";
import { MeSection } from "./me-section";

/**
 * Availability — §12's field with a consequence past this page, since it feeds
 * the club readiness summary.
 *
 * **It reads as a value with an edit, not as a row of choices.** The chip row
 * that shipped first put every option permanently on the surface, which spent
 * a whole block restating three answers the player did not pick in order to
 * show the one they did. Worse, all four chips carried the brand fill, so the
 * block competed with the page's one real primary action (§4.3). A stated
 * value plus one control says the same thing in one line.
 *
 * The cost is honest and worth naming: setting availability is now two taps
 * rather than one. §12 makes this the field a player is most likely to change,
 * so if that second tap proves to be friction, the answer is to bring the
 * sheet's options onto the surface again, not to scatter the control.
 *
 * The write stays optimistic in `useUpdatePlayer` — a control that waits for a
 * round trip on a Ghanaian mobile connection reads as broken. This component
 * only decides what to SAY about the outcome; the hook owns putting the record
 * back if the server refuses.
 *
 * The sheet's open state is local. `<MeScreen>` owns the photo and details
 * overlays because they hand off to each other; this one is reached from one
 * place and hands off to nothing.
 */

export type AvailabilityBlockProps = {
  player: MyPlayer;
  meta: PlayerMeta;
};

export function AvailabilityBlock({ player, meta }: AvailabilityBlockProps) {
  const { push } = useToast();
  const update = useUpdatePlayer(player);
  const [isEditing, setIsEditing] = useState(false);

  const current = player.availability_status;
  const currentOption = meta.availability.find(
    (option) => option.key === current,
  );

  const choose = (key: string) => {
    if (key === current || update.isPending) return;

    update.mutate(
      { availability_status: key },
      {
        onSuccess: () => {
          push({ title: "Availability saved", tone: "success" });
        },
        onError: () => {
          push({
            title: "That did not save",
            description: "Check your connection and tap again.",
            tone: "danger",
          });
        },
      },
    );
  };

  return (
    <>
      <MeSection
        title="When can you play"
        description="Clubs near you see this."
        action={
          <Button
            intent="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={update.isPending}
          >
            Change
          </Button>
        }
      >
        {/* Display face, one step under the heading, the way the reference
            panel writes the player's name under its headline
            (WP-20260823-me-spotlight). This value is the whole point of the
            block, and at 14px it sat below its own "Change" button.

            `aria-live` so a screen reader hears the new value settle after the
            sheet closes, which is the only feedback the toast does not carry. */}
        <p
          className="font-display text-fg text-base font-bold tracking-tight"
          aria-live="polite"
        >
          {currentOption?.label ??
            labelFor(meta.availability, current) ??
            current}
        </p>
        {currentOption?.description ? (
          <p className="text-fg-muted mt-1 text-sm">
            {currentOption.description}
          </p>
        ) : null}
      </MeSection>

      <AvailabilitySheet
        open={isEditing}
        onOpenChange={setIsEditing}
        options={meta.availability}
        current={current}
        onChoose={choose}
        isPending={update.isPending}
      />
    </>
  );
}
