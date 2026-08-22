"use client";

/**
 * Shrink a picked photo before it is uploaded.
 *
 * **This is about the player's data bundle, not about the image.** A photo
 * straight off a phone camera is 3 to 8 MB. The card renders it at 96px. In
 * Ghana that upload is paid for by the megabyte on a connection that will drop
 * halfway and start again, so sending the original is a cost the player carries
 * for nothing. A 512px square lands around 60 KB and is indistinguishable at
 * every size the product draws it.
 *
 * **It is not validation.** The server owns the MIME allow-list, the size
 * ceiling and the throttle (`player.media.*`, see
 * `contracts/api/player/post-players-id-media.v1.yaml`), and it applies them to
 * whatever actually arrives. Nothing here is a gate; a caller that skips this
 * module produces a slower upload, not an unchecked one. That is why the
 * numbers below are local constants rather than config keys — no rule reads
 * them and no truth depends on them.
 *
 * **Failure is not fatal.** If the browser cannot decode the file, the original
 * is returned untouched and the server decides. A photo upload that refuses to
 * start because an optimisation failed is worse than a slow one.
 *
 * **This no longer decides the framing.** It used to centre-crop with a bias a
 * sixth down, on the theory that people put their faces in the upper half of a
 * portrait shot. That was right often enough to be worse than nothing: when it
 * was wrong it silently put a player's chest on a team sheet. `<PhotoCropper>`
 * now hands over an already-framed square, and the crop below survives only as
 * a fallback for any future caller that does not frame first.
 */

/**
 * Longest edge of the stored square, in CSS pixels.
 *
 * 512 is four times the largest slot the product draws a headshot in today
 * (the 96px card avatar at 2x DPR is 192px), which leaves room for the profile
 * hero and a retina team sheet without storing a wall poster.
 */
const TARGET_EDGE = 512;

/** JPEG quality. Above ~0.85 the file grows fast and the face does not. */
const QUALITY = 0.82;

export type PreparedPhoto = {
  blob: Blob;
  /** Edge length of the square, in pixels. Equal to `TARGET_EDGE` on success. */
  size: number;
};

/**
 * Decode, square-crop and re-encode a picked image.
 *
 * `imageOrientation: "from-image"` is load-bearing: phone cameras record
 * rotation in EXIF rather than in the pixels, and a decoder that ignores it
 * hands back every portrait selfie on its side.
 */
export async function preparePhoto(file: File | Blob): Promise<PreparedPhoto> {
  if (typeof createImageBitmap !== "function") {
    return { blob: file, size: 0 };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { blob: file, size: 0 };
  }

  try {
    const edge = Math.min(bitmap.width, bitmap.height);

    // Already framed and already within budget: hand it back untouched. A
    // second JPEG pass over a crop the player just approved costs quality and
    // buys nothing, and this is the ordinary path now that the cropper exists.
    if (bitmap.width === bitmap.height && edge <= TARGET_EDGE) {
      return { blob: file, size: edge };
    }

    const sourceX = (bitmap.width - edge) / 2;
    const sourceY = (bitmap.height - edge) / 2;

    // Never upscale. A 200px photo blown up to 512 is a bigger file that looks
    // worse than the one it replaced.
    const size = Math.min(TARGET_EDGE, edge);

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) return { blob: file, size: 0 };

    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, sourceX, sourceY, edge, edge, 0, 0, size, size);

    const blob = await toBlob(canvas);
    // A re-encode that came out bigger is a re-encode worth throwing away.
    if (!blob || blob.size >= file.size) return { blob: file, size: 0 };

    return { blob, size };
  } finally {
    bitmap.close();
  }
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", QUALITY);
  });
}
