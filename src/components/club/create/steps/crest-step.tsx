"use client";

import { useState } from "react";
import { Camera } from "@phosphor-icons/react";

import { Button, Crest, Spinner } from "@/components/ui";
import { PhotoCropper, PhotoSheet } from "@/components/ui/image-crop";
import { StepHeading, StepStagger } from "@/components/ui/wizard";
import { useObjectUrl } from "@/hooks/use-object-url";
import { preparePhoto } from "@/lib/images/prepare-photo";

import { type ClubStepProps } from "./step-props";

/**
 * Step 4 — the club badge (Club engine doc §5 step 6).
 *
 * **Optional, and it says so.** §5 marks the crest optional and step 6 says
 * "allow later completion", so this step can be walked past. A required badge
 * would stop a neighbourhood side that has never had one from existing.
 *
 * **Nothing is uploaded here.** The club does not exist yet, so there is no id
 * to upload against. The cropped Blob is held in the wizard and sent straight
 * after the club is created. The preview is a local object URL, so it is
 * instant and works with no signal — which also means the person sees the
 * actual framing they chose before they commit, rather than after.
 *
 * The crop is the same one the player photo uses: drag, pinch, zoom, circular
 * mask. Both draw the result in a circle, so one cropper serves both.
 */
export function CrestStep({ wizard }: ClubStepProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [picked, setPicked] = useState<File | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const { crest, setCrest } = wizard;

  const previewUrl = useObjectUrl(crest);

  const onConfirmCrop = async (blob: Blob) => {
    setPicked(null);
    setIsPreparing(true);
    try {
      // Squares and shrinks it, so a 12 MP photo does not go over mobile data.
      const { blob: prepared } = await preparePhoto(blob);
      setCrest(prepared);
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <>
      <StepHeading note="You can add this later.">
        Add your club badge
      </StepHeading>

      <StepStagger index={1}>
        {/* One column the width of the badge, aligned to the question above it
            rather than centred, with the control sitting directly under the
            thing it changes. Centred, the badge and its button read as two
            loose objects in the middle of a tall empty step; stacked and
            matched in width they read as one control.

            The width is stated here and the crest's `2xl` matches it, so the
            button can be `fullWidth` and land on the badge's exact edges. */}
        <div className="flex w-44 flex-col gap-3 sm:w-56">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={crest ? "Change the club badge" : "Add a club badge"}
            // `flex` so the button hugs the crest: an inline-flex child leaves
            // a few pixels of line-box under it, which showed as the ring and
            // the plate disagreeing by a hair.
            //
            // Focus ring traces the crest's own shape. It was `rounded-full`
            // against a rounded-square plate, so the ring never matched the
            // thing it was marking.
            className="focus-visible:outline-focus-ring rounded-card flex w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {isPreparing ? (
              // Same box as the crest it stands in for, so confirming a crop
              // does not make the page jump.
              <span className="bg-surface-2 rounded-card grid aspect-square w-full place-items-center">
                <Spinner label="Preparing your badge" />
              </span>
            ) : (
              <Crest
                name={wizard.form.getValues("name") || "Club"}
                src={previewUrl}
                size="2xl"
              />
            )}
          </button>

          <Button
            intent="secondary"
            size="md"
            fullWidth
            leadingIcon={<Camera size={18} weight="bold" />}
            onClick={() => setSheetOpen(true)}
          >
            {crest ? "Change badge" : "Add a badge"}
          </Button>
        </div>
      </StepStagger>

      <PhotoSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        hasPhoto={crest !== null}
        onPick={(file) => {
          setSheetOpen(false);
          setPicked(file);
        }}
        onRemove={() => {
          setSheetOpen(false);
          setCrest(null);
        }}
      />

      <PhotoCropper
        open={picked !== null}
        file={picked}
        onCancel={() => setPicked(null)}
        onConfirm={(blob) => {
          void onConfirmCrop(blob);
        }}
      />
    </>
  );
}
