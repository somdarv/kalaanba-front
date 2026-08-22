"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The geometry behind the photo cropper: decode, pan, zoom, export.
 *
 * Split from the component because it is arithmetic, not markup, and because
 * the clamping rules below are the part worth being able to read on their own.
 *
 * **The image always covers the circle.** `minScale` is derived from the
 * image's short edge, and the offsets are clamped so no edge can be dragged
 * inside the frame. A cropper that lets a corner slip in produces a headshot
 * with a wedge of page behind the player's ear, and the player will not notice
 * until it is on a team sheet.
 *
 * **Zoom keeps a focal point still.** Pinching about the midpoint of two
 * fingers is the behaviour every phone has taught people to expect; zooming
 * about the frame centre instead makes the image slide out from under the
 * fingers. One line of algebra: `t' = f - (f - t) * (s' / s)`.
 */

/** Rendered crop, in pixels. Four times the 128px slot the card draws it in. */
const OUTPUT_SIZE = 512;

/** How far past "just covers" a player may zoom. Beyond this it is mush. */
const MAX_ZOOM = 5;

const QUALITY = 0.85;

export type CropTransform = { scale: number; x: number; y: number };

export type PhotoCrop = {
  bitmap: ImageBitmap | null;
  isDecoding: boolean;
  hasFailed: boolean;
  transform: CropTransform;
  minScale: number;
  /** Pan by a delta in viewport pixels. */
  pan: (dx: number, dy: number) => void;
  /** Multiply the scale, holding `focal` (viewport coords) still. */
  zoomBy: (factor: number, focal?: { x: number; y: number }) => void;
  /** Absolute scale, from the slider. Held about the frame centre. */
  setZoom: (next: number) => void;
  toBlob: () => Promise<Blob | null>;
};

/**
 * One state object, tagged with the file it describes.
 *
 * The alternative — separate `bitmap`, `isDecoding` and `hasFailed` states
 * cleared at the top of the effect — writes state synchronously during render's
 * commit and renders one frame of the OLD photo under the NEW file. Tagging the
 * state with its source makes staleness derivable instead: anything whose
 * `source` is not the current file simply is not shown.
 */
type CropState = {
  source: File | null;
  bitmap: ImageBitmap | null;
  transform: CropTransform;
  hasFailed: boolean;
};

const IDLE: CropState = {
  source: null,
  bitmap: null,
  transform: { scale: 1, x: 0, y: 0 },
  hasFailed: false,
};

export function usePhotoCrop(file: File | null, viewport: number): PhotoCrop {
  const [state, setState] = useState<CropState>(IDLE);

  const isCurrent = state.source === file;
  const bitmap = isCurrent ? state.bitmap : null;
  const transform = isCurrent ? state.transform : IDLE.transform;
  const hasFailed = isCurrent && state.hasFailed;
  const isDecoding = file !== null && !isCurrent;

  const minScale = bitmap
    ? viewport / Math.min(bitmap.width, bitmap.height)
    : 1;

  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    // `imageOrientation: "from-image"` is load-bearing. Phone cameras record
    // rotation in EXIF rather than in the pixels, and a decoder that ignores it
    // hands back every portrait selfie on its side.
    const pending = createImageBitmap(file, { imageOrientation: "from-image" });

    pending
      .then((decoded) => {
        if (cancelled) {
          decoded.close();
          return;
        }
        const fit = viewport / Math.min(decoded.width, decoded.height);
        setState({
          source: file,
          bitmap: decoded,
          transform: {
            scale: fit,
            x: (viewport - decoded.width * fit) / 2,
            y: (viewport - decoded.height * fit) / 2,
          },
          hasFailed: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ ...IDLE, source: file, hasFailed: true });
      });

    return () => {
      cancelled = true;
      // Release the decode even if it lands after the cropper closed.
      void pending.then((decoded) => decoded.close()).catch(() => {});
    };
  }, [file, viewport]);

  const clamp = useCallback(
    (next: CropTransform, width: number, height: number): CropTransform => {
      if (width === 0) return next;

      return {
        scale: next.scale,
        x: Math.min(0, Math.max(viewport - width * next.scale, next.x)),
        y: Math.min(0, Math.max(viewport - height * next.scale, next.y)),
      };
    },
    [viewport],
  );

  const pan = useCallback(
    (dx: number, dy: number) => {
      const width = bitmap?.width ?? 0;
      const height = bitmap?.height ?? 0;
      setState((current) => ({
        ...current,
        transform: clamp(
          {
            ...current.transform,
            x: current.transform.x + dx,
            y: current.transform.y + dy,
          },
          width,
          height,
        ),
      }));
    },
    [bitmap, clamp],
  );

  const zoomTo = useCallback(
    (
      resolve: (current: CropTransform) => number,
      focalX: number,
      focalY: number,
    ) => {
      const width = bitmap?.width ?? 0;
      const height = bitmap?.height ?? 0;
      setState((current) => {
        const next = Math.min(
          minScale * MAX_ZOOM,
          Math.max(minScale, resolve(current.transform)),
        );
        const ratio = next / current.transform.scale;

        return {
          ...current,
          transform: clamp(
            {
              scale: next,
              x: focalX - (focalX - current.transform.x) * ratio,
              y: focalY - (focalY - current.transform.y) * ratio,
            },
            width,
            height,
          ),
        };
      });
    },
    [bitmap, clamp, minScale],
  );

  const zoomBy = useCallback(
    (factor: number, focal?: { x: number; y: number }) => {
      zoomTo(
        (current) => current.scale * factor,
        focal?.x ?? viewport / 2,
        focal?.y ?? viewport / 2,
      );
    },
    [viewport, zoomTo],
  );

  const setZoom = useCallback(
    (next: number) => zoomTo(() => next, viewport / 2, viewport / 2),
    [viewport, zoomTo],
  );

  const toBlob = useCallback(async (): Promise<Blob | null> => {
    if (!bitmap) return null;

    // The same transform, scaled from the on-screen frame to the output. What
    // the player framed is exactly what is stored — no second crop rule that
    // could disagree with what they were looking at.
    const ratio = OUTPUT_SIZE / viewport;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.imageSmoothingQuality = "high";
    context.drawImage(
      bitmap,
      transform.x * ratio,
      transform.y * ratio,
      bitmap.width * transform.scale * ratio,
      bitmap.height * transform.scale * ratio,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", QUALITY);
    });
  }, [bitmap, transform, viewport]);

  return {
    bitmap,
    isDecoding,
    hasFailed,
    transform,
    minScale,
    pan,
    zoomBy,
    setZoom,
    toBlob,
  };
}

export { MAX_ZOOM, OUTPUT_SIZE };
