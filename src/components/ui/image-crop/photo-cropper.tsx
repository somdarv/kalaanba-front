"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { BottomSheet, Button, Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";

import { MAX_ZOOM, usePhotoCrop } from "./use-photo-crop";

/**
 * Frame the photo before it is uploaded.
 *
 * **Why this exists.** The card draws a headshot in a circle and crops to fill
 * it, so whatever the player did not choose gets cut by a rule. The rule used
 * to be a heuristic — square from the centre, biased a sixth down for portrait
 * shots, on the theory that people frame their faces in the upper half. It is
 * right often enough to be worse than nothing: when it is wrong it silently
 * puts a player's chest on a team sheet, and there was no way to correct it.
 * Letting the player drag and pinch removes the guess.
 *
 * **The frame is the crop.** What is inside the circle is exactly what is
 * stored — the export applies the same transform, scaled up. A second crop rule
 * at save time could disagree with what the player was looking at, which is the
 * one thing a cropper must never do.
 *
 * **Drawn on a canvas, not moved with CSS transforms.** The circle has to mask
 * the image and the masked-out part has to stay visible but dimmed, which in
 * CSS means a second copy of the image under a blend or a clip path. One canvas
 * paints both passes from one decode, and it is the same canvas the export
 * uses, so what is measured is what is shown.
 */

export type PhotoCropperProps = {
  open: boolean;
  file: File | null;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
  isPending?: boolean;
};

/** The frame, in CSS pixels. Fits a 360px screen with the gutter intact. */
const VIEWPORT = 288;

export function PhotoCropper({
  open,
  file,
  onCancel,
  onConfirm,
  isPending,
}: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef(0);
  const [isSaving, setIsSaving] = useState(false);

  const crop = usePhotoCrop(open ? file : null, VIEWPORT);
  const { bitmap, transform } = crop;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bitmap) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = VIEWPORT * dpr;
    canvas.height = VIEWPORT * dpr;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, VIEWPORT, VIEWPORT);

    const drawImage = () =>
      context.drawImage(
        bitmap,
        transform.x,
        transform.y,
        bitmap.width * transform.scale,
        bitmap.height * transform.scale,
      );

    // Pass one: the whole photo, knocked back. It is context, not content —
    // it shows what is being given up without competing with what is kept.
    context.globalAlpha = 0.32;
    drawImage();

    // Pass two: the same photo at full strength, clipped to the circle.
    context.globalAlpha = 1;
    context.save();
    context.beginPath();
    context.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2, 0, Math.PI * 2);
    context.clip();
    drawImage();
    context.restore();
  }, [bitmap, transform]);

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    pinchDistance.current = 0;
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;

    const next = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, next);

    const active = [...pointers.current.values()];

    if (active.length >= 2) {
      const [a, b] = active as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (pinchDistance.current > 0 && distance > 0) {
        const box = event.currentTarget.getBoundingClientRect();
        crop.zoomBy(distance / pinchDistance.current, {
          x: (a.x + b.x) / 2 - box.left,
          y: (a.y + b.y) / 2 - box.top,
        });
      }
      pinchDistance.current = distance;
      return;
    }

    crop.pan(next.x - previous.x, next.y - previous.y);
  }

  function onPointerUp(event: PointerEvent<HTMLCanvasElement>) {
    pointers.current.delete(event.pointerId);
    pinchDistance.current = 0;
  }

  async function confirm() {
    setIsSaving(true);
    const blob = await crop.toBlob();
    setIsSaving(false);
    if (blob) onConfirm(blob);
  }

  const isBusy = isPending || isSaving;

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => {
        if (!next && !isBusy) onCancel();
      }}
      title="Frame your photo"
      description="Drag to move. Pinch or use the slider to zoom."
      disableDrag
      dismissible={!isBusy}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="bg-surface-elev relative overflow-hidden rounded-[var(--radius-card)]"
          style={{ width: VIEWPORT, height: VIEWPORT }}
        >
          {crop.isDecoding ? (
            <span className="absolute inset-0 grid place-items-center">
              <Spinner size="lg" label="Opening your photo" />
            </span>
          ) : null}

          {crop.hasFailed ? (
            <p
              role="alert"
              className="text-fg-muted absolute inset-0 grid place-items-center px-6 text-center text-sm"
            >
              That photo could not be opened. Try another one.
            </p>
          ) : null}

          <canvas
            ref={canvasRef}
            width={VIEWPORT}
            height={VIEWPORT}
            style={{ width: VIEWPORT, height: VIEWPORT }}
            // `touch-none`: without it the browser claims the drag for
            // scrolling and the photo never moves on a phone.
            className={cn(
              "touch-none select-none",
              bitmap ? "cursor-grab active:cursor-grabbing" : "opacity-0",
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(event) =>
              crop.zoomBy(Math.exp(-event.deltaY * 0.0015), {
                x: event.nativeEvent.offsetX,
                y: event.nativeEvent.offsetY,
              })
            }
          />
        </div>

        {/* A slider as well as pinch, because pinch needs two fingers and a
            mouse has none. It is also the only keyboard route to zoom. */}
        <label className="flex w-full items-center gap-3">
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={crop.minScale}
            max={crop.minScale * MAX_ZOOM}
            step={crop.minScale / 100}
            value={transform.scale}
            disabled={!bitmap || isBusy}
            onChange={(event) => crop.setZoom(Number(event.target.value))}
            className="accent-primary h-11 w-full cursor-pointer"
          />
        </label>

        <div className="flex w-full gap-2">
          <Button
            intent="ghost"
            size="lg"
            fullWidth
            disabled={isBusy}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            intent="primary"
            size="lg"
            fullWidth
            loading={isBusy}
            disabled={!bitmap}
            onClick={confirm}
          >
            Use photo
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
