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
        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={crest ? "Change the club badge" : "Add a club badge"}
            className="focus-visible:outline-focus-ring rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {isPreparing ? (
              <span className="bg-surface-2 grid size-28 place-items-center rounded-full">
                <Spinner label="Preparing your badge" />
              </span>
            ) : (
              <Crest
                name={wizard.form.getValues("name") || "Club"}
                src={previewUrl}
                size="xl"
              />
            )}
          </button>

          <Button
            intent="secondary"
            size="md"
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
