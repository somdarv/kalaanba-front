"use client";

import type { PlayerCardModel } from "@/components/player/setup/player-card-model";

import { paintAward, paintIdentity } from "./share-image-identity";
import {
  GRAIN_OPACITY,
  HEIGHT,
  PATTERN_OPACITY,
  WIDTH,
  type Ink,
  type ShareImageInput,
} from "./share-image-layout";
import {
  canvasToBlob,
  grainPattern,
  loadImage,
  mixColors,
  paintMask,
  tokenColor,
  tokenFont,
  withAlpha,
} from "./share-image-paint";
import { paintFoot, paintRecord } from "./share-image-record";

/**
 * Draw the player's card as a share graphic.
 *
 * **Why it is drawn rather than screenshotted.** The card on screen is built
 * from `mask-image`, `mix-blend-mode`, `color-mix()` and OKLCH — the four
 * things every DOM-to-image library gets wrong, because none of them is a
 * browser. Rasterising the node would hand a player a broken version of their
 * own card to send to a club.
 *
 * Drawing it also lets the share image be its own object rather than a picture
 * of a web page: poster scale, no controls, and a foot that says where it came
 * from. §15 names "static share images for WhatsApp" and "a live URL that stays
 * current" as two different artefacts, and this is the first one.
 *
 * **What differs from the screen card, and why.** No controls, because a camera
 * button in a picture is a button nobody can press. An address at the foot,
 * because a graphic in a group chat has no URL bar. Everything else is the same
 * object rendered bigger, from the same model, so the two cannot disagree.
 *
 * Every colour is read live from the `--card-*` tokens rather than restated, so
 * a token change reaches the share image without anyone remembering to come
 * here.
 */
export async function renderShareImage(input: ShareImageInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not open a canvas.");

  const onCard = tokenColor("--on-card");
  const ink: Ink = {
    strong: onCard,
    soft: withAlpha(onCard, 0.8),
    faint: withAlpha(onCard, 0.62),
    display: tokenFont("--font-sora", "system-ui, sans-serif"),
    sans: tokenFont("--font-inter", "system-ui, sans-serif"),
    signature: tokenFont("--font-signature-face", "cursive"),
  };

  await paintGround(context, input.model, onCard);
  await paintIdentity(context, input, ink);

  // Between the two bands, like the screen card.
  if (input.model.playerOfTheMatch > 0) {
    paintAward(context, input.model.playerOfTheMatch, ink);
  }

  paintRecord(context, input, ink);
  paintFoot(context, input, ink, onCard);

  return canvasToBlob(canvas);
}

/** Wash, artwork, light source, grain — the card's four layers, in order. */
async function paintGround(
  context: CanvasRenderingContext2D,
  model: PlayerCardModel,
  onCard: string,
): Promise<void> {
  const from = tokenColor(`--card-${model.look.key}`);
  const to = tokenColor(`--card-${model.look.key}-deep`);

  const gradient = context.createLinearGradient(0, 0, WIDTH * 0.55, HEIGHT);
  gradient.addColorStop(0, from);
  gradient.addColorStop(0.52, mixColors(from, to, 0.48));
  gradient.addColorStop(1, to);
  context.fillStyle = gradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  await paintPattern(context, model, onCard);

  // The light source: anchored to the top and capped at 12%, for the same
  // contrast reason the screen card caps it. The small text lives below it,
  // where the gradient is deepest.
  const glow = context.createRadialGradient(
    WIDTH * 0.78,
    -HEIGHT * 0.06,
    0,
    WIDTH * 0.78,
    -HEIGHT * 0.06,
    WIDTH * 1.05,
  );
  glow.addColorStop(0, withAlpha(onCard, 0.12));
  glow.addColorStop(1, withAlpha(onCard, 0));
  context.fillStyle = glow;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  const grain = grainPattern(context);
  if (!grain) return;

  context.save();
  context.globalCompositeOperation = "overlay";
  context.globalAlpha = GRAIN_OPACITY;
  context.fillStyle = grain;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.restore();
}

/**
 * The card's own artwork, painted through its alpha master.
 *
 * A failed load is not worth surfacing: the ground and the grain already carry
 * the card, and a share that refuses to happen because a decorative texture
 * 404'd would be the wrong trade.
 */
async function paintPattern(
  context: CanvasRenderingContext2D,
  model: PlayerCardModel,
  onCard: string,
): Promise<void> {
  const source = model.texture.mask.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
  if (!source) return;

  try {
    const artwork = await loadImage(source);
    const scale = Math.max(WIDTH / artwork.width, HEIGHT / artwork.height);
    const drawWidth = artwork.width * scale;
    const drawHeight = artwork.height * scale;
    const tinted = paintMask(artwork, drawWidth, drawHeight, onCard);

    context.save();
    context.globalCompositeOperation =
      model.texture.blend === "soft-light" ? "soft-light" : "source-over";
    context.globalAlpha = Math.min(PATTERN_OPACITY, model.texture.opacity);
    context.drawImage(
      tinted,
      (WIDTH - drawWidth) / 2,
      (HEIGHT - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
    context.restore();
  } catch {
    // Decoration. Carry on without it.
  }
}

export type { ShareImageInput } from "./share-image-layout";
