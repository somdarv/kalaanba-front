/**
 * Picking an image and framing it.
 *
 * A sheet offering camera / library / remove, and a canvas cropper with drag,
 * pinch and a zoom slider. Neither knows what the image is OF — the caller
 * receives a Blob and decides where it goes.
 *
 * Promoted out of `components/me/` in WP-20260823 when club crests became the
 * second caller. The crop is circular because both callers draw the result in
 * a circle: a player headshot on a card, a club crest in `<Crest>`.
 */
export { PhotoCropper } from "./photo-cropper";
export type { PhotoCropperProps } from "./photo-cropper";
export { PhotoSheet } from "./photo-sheet";
export type { PhotoSheetProps } from "./photo-sheet";
