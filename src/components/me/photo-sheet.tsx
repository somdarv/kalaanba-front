"use client";

import { useRef, type ChangeEvent } from "react";
import { Camera, Image as ImageIcon, Trash } from "@phosphor-icons/react";

import { BottomSheet, Button } from "@/components/ui";

/**
 * Choose what to do with the player's photo.
 *
 * **Why a sheet rather than the picker straight away.** Tapping the photo used
 * to open the OS file browser directly, which handles exactly one of the four
 * things a player wants: it cannot take a new photo, and it cannot remove one.
 * A player who tapped by accident also had no way out that did not involve
 * choosing a file. Three named actions cost one tap and answer all of it.
 *
 * **Take a photo is a separate input, not a flag on one.** `capture` is an
 * attribute of the input element, not of the click, so one input cannot offer
 * both the camera and the gallery. Two inputs is the whole mechanism: the
 * `capture` one opens the camera on a phone, the plain one opens the library.
 * On a desktop browser `capture` is ignored and both open a file dialog, which
 * is the correct degradation rather than a broken button.
 *
 * **Remove is last and quiet.** It is the only destructive action here and the
 * least likely intent, so it does not get to sit where a thumb lands first.
 */

export type PhotoSheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  /** Whether there is a photo to change or remove, or none to add. */
  hasPhoto: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
  isPending?: boolean;
};

export function PhotoSheet({
  open,
  onOpenChange,
  hasPhoto,
  onPick,
  onRemove,
  isPending,
}: PhotoSheetProps) {
  const cameraInput = useRef<HTMLInputElement | null>(null);
  const libraryInput = useRef<HTMLInputElement | null>(null);

  function handle(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clearing the value is what lets the same file be picked twice. A browser
    // fires no change event when the value has not changed, so a failed upload
    // could otherwise never be retried with the same photo.
    event.target.value = "";
    if (!file) return;

    onOpenChange(false);
    onPick(file);
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={hasPhoto ? "Your photo" : "Add your photo"}
      description={
        hasPhoto ? undefined : "Clubs look at the photo before anything else."
      }
    >
      <div className="flex flex-col gap-2">
        <Button
          intent="secondary"
          size="lg"
          fullWidth
          disabled={isPending}
          onClick={() => cameraInput.current?.click()}
          leadingIcon={<Camera size={18} weight="bold" />}
        >
          Take a photo
        </Button>

        <Button
          intent="secondary"
          size="lg"
          fullWidth
          disabled={isPending}
          onClick={() => libraryInput.current?.click()}
          leadingIcon={<ImageIcon size={18} weight="bold" />}
        >
          {hasPhoto ? "Choose a new photo" : "Choose from your photos"}
        </Button>

        {hasPhoto ? (
          <Button
            intent="ghost"
            size="lg"
            fullWidth
            disabled={isPending}
            onClick={() => {
              onOpenChange(false);
              onRemove();
            }}
            leadingIcon={<Trash size={18} weight="bold" />}
            className="text-danger-ink"
          >
            Remove photo
          </Button>
        ) : null}
      </div>

      {/* Both accept the same types the API's allow-list accepts. The server
          re-sniffs whatever arrives, so this is a courtesy to the picker, not
          a gate. */}
      <input
        ref={cameraInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        onChange={handle}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      <input
        ref={libraryInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handle}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
    </BottomSheet>
  );
}
