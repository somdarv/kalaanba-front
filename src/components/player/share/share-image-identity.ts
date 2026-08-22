"use client";

import type { PlayerCardModel } from "@/components/player/setup/player-card-model";
import type { Player } from "@/lib/api/player";

import {
  AWARD_TOP,
  HEIGHT,
  initialsOf,
  PAD,
  PORTRAIT_CENTRE_Y,
  PORTRAIT_RADIUS,
  WIDTH,
  WORDMARK_HEIGHT,
  WORDMARK_RATIO,
  type Ink,
  type ShareImageInput,
} from "./share-image-layout";
import {
  drawCircularImage,
  fitText,
  loadImage,
  paintMask,
  roundedRectPath,
  withAlpha,
} from "./share-image-paint";

/**
 * The top half of the share graphic: mark, number, name, face, position.
 *
 * The same reading order as the card on screen, at poster scale. Split from
 * `share-image.ts` because that file had grown past the 400-line limit and
 * because the seam is real: this paints who the player is, that one paints the
 * ground they stand on.
 */
export async function paintIdentity(
  context: CanvasRenderingContext2D,
  { player, model }: ShareImageInput,
  ink: Ink,
): Promise<void> {
  context.textBaseline = "top";

  await paintWordmark(context, ink);

  if (player.preferred_number != null) {
    context.font = `700 132px ${ink.display}`;
    context.textAlign = "right";
    context.fillStyle = ink.strong;
    context.fillText(String(player.preferred_number), WIDTH - PAD, PAD - 14);
    context.textAlign = "left";
  }

  paintGhostName(context, player.stage_name, ink);
  await paintNameBlock(context, player, model, ink);
}

async function paintWordmark(
  context: CanvasRenderingContext2D,
  ink: Ink,
): Promise<void> {
  try {
    const wordmark = await loadImage("/images/brand/kalaanba-wordmark.png");
    const width = WORDMARK_HEIGHT * WORDMARK_RATIO;
    context.globalAlpha = 0.8;
    context.drawImage(
      paintMask(wordmark, width, WORDMARK_HEIGHT, ink.strong),
      PAD,
      PAD,
      width,
      WORDMARK_HEIGHT,
    );
    context.globalAlpha = 1;
  } catch {
    // The brand name is on the card twice already.
  }
}

/**
 * The name again at poster scale, knocked back until it is texture rather than
 * text. Clipping at the edges is the intent, not a failure.
 */
function paintGhostName(
  context: CanvasRenderingContext2D,
  stageName: string,
  ink: Ink,
): void {
  context.save();
  context.beginPath();
  context.rect(0, 0, WIDTH, HEIGHT);
  context.clip();
  context.font = `700 210px ${ink.display}`;
  context.textAlign = "center";
  context.fillStyle = withAlpha(ink.strong, 0.06);
  context.fillText(stageName.toUpperCase(), WIDTH / 2, 448);
  context.restore();
  context.textAlign = "left";
}

/**
 * The one badge on this card backed by verified data: a Trust-cleared match
 * award, never a Fan Buzz signal (Law 8/9).
 *
 * Centred in the gap between the face and the record, matching the screen card.
 * Measured first and then drawn from a computed start, because a centred group
 * of three pieces at three different sizes cannot be centred by setting
 * `textAlign` on each one — that would centre each piece on the same point and
 * stack them.
 */
export function paintAward(
  context: CanvasRenderingContext2D,
  count: number,
  ink: Ink,
): void {
  const star = 13;
  const gap = 20;

  // One run at one size, matching the screen card: the count and the words
  // share a baseline and a size, and weight alone separates them. Drawn as a
  // single string so the canvas cannot put them on different baselines.
  const line = `${count}X PLAYER OF THE MATCH`;

  context.textBaseline = "top";
  context.textAlign = "left";
  context.font = `600 22px ${ink.sans}`;
  context.letterSpacing = "3.5px";

  const lineWidth = context.measureText(line).width;
  const start = (WIDTH - (star * 2 + gap + lineWidth)) / 2;

  drawStar(context, start + star, AWARD_TOP + star - 1, star, ink.soft);

  context.fillStyle = ink.soft;
  context.fillText(line, start + star * 2 + gap, AWARD_TOP);
  context.letterSpacing = "0px";
}

function drawStar(
  context: CanvasRenderingContext2D,
  centreX: number,
  centreY: number,
  radius: number,
  color: string,
): void {
  context.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const reach = point % 2 === 0 ? radius : radius * 0.45;
    const angle = (Math.PI / 5) * point - Math.PI / 2;
    const x = centreX + Math.cos(angle) * reach;
    const y = centreY + Math.sin(angle) * reach;
    if (point === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

async function paintNameBlock(
  context: CanvasRenderingContext2D,
  player: Player,
  model: PlayerCardModel,
  ink: Ink,
): Promise<void> {
  const centreX = WIDTH / 2;
  const textWidth = WIDTH - PAD * 2;

  await paintPortrait(
    context,
    player,
    ink,
    centreX,
    PORTRAIT_CENTRE_Y,
    PORTRAIT_RADIUS,
  );

  // Photo over name, both on the centre line, matching the screen card.
  const stageTop = PORTRAIT_CENTRE_Y + PORTRAIT_RADIUS + 46;

  context.font = `700 84px ${ink.display}`;
  context.fillStyle = ink.strong;
  context.textAlign = "center";
  context.fillText(
    fitText(context, player.stage_name, textWidth),
    centreX,
    stageTop,
  );
  context.textAlign = "left";

  paintNameLine(
    context,
    player,
    model,
    ink,
    centreX,
    stageTop + 104,
    textWidth,
  );
}

/**
 * Position chip and legal name, centred on one line.
 *
 * Measured first and drawn from a computed start, because a centred group of
 * two pieces cannot be centred by setting `textAlign` on each — that centres
 * each piece on the same point and stacks them.
 */
function paintNameLine(
  context: CanvasRenderingContext2D,
  player: Player,
  model: PlayerCardModel,
  ink: Ink,
  centreX: number,
  top: number,
  maxWidth: number,
): void {
  const gap = 16;
  const fullName = `${player.first_name} ${player.last_name}`.trim();

  context.textAlign = "left";
  context.font = `400 34px ${ink.sans}`;
  const name = fitText(context, fullName, maxWidth - 120);
  const nameWidth = context.measureText(name).width;

  let chipWidth = 0;
  let label = "";
  if (model.positionAbbreviation) {
    label = model.positionAbbreviation.toUpperCase();
    context.font = `700 22px ${ink.sans}`;
    context.letterSpacing = "1.4px";
    chipWidth = context.measureText(label).width + 26;
    context.letterSpacing = "0px";
  }

  let cursor =
    centreX - (chipWidth + (chipWidth > 0 ? gap : 0) + nameWidth) / 2;

  if (chipWidth > 0) {
    roundedRectPath(context, cursor, top - 2, chipWidth, 40, 10);
    context.fillStyle = withAlpha(ink.strong, 0.15);
    context.fill();

    context.font = `700 22px ${ink.sans}`;
    context.letterSpacing = "1.4px";
    context.fillStyle = ink.strong;
    context.fillText(label, cursor + 13, top + 8);
    context.letterSpacing = "0px";
    cursor += chipWidth + gap;
  }

  context.font = `400 34px ${ink.sans}`;
  context.fillStyle = ink.soft;
  context.fillText(name, cursor, top);
}

async function paintPortrait(
  context: CanvasRenderingContext2D,
  player: Player,
  ink: Ink,
  centreX: number,
  centreY: number,
  radius: number,
): Promise<void> {
  context.beginPath();
  context.arc(centreX, centreY, radius, 0, Math.PI * 2);
  context.fillStyle = withAlpha(ink.strong, 0.14);
  context.fill();

  let painted = false;
  if (player.headshot_url) {
    try {
      const photo = await loadImage(player.headshot_url);
      drawCircularImage(context, photo, centreX, centreY, radius);
      painted = true;
    } catch {
      // A cross-origin photo served without CORS headers falls back to
      // initials rather than failing the whole share.
    }
  }

  if (!painted) {
    context.font = `700 72px ${ink.display}`;
    context.textAlign = "center";
    context.fillStyle = ink.strong;
    context.fillText(initialsOf(player.stage_name), centreX, centreY - 40);
    context.textAlign = "left";
  }

  context.lineWidth = 5;
  context.strokeStyle = withAlpha(ink.strong, 0.4);
  context.beginPath();
  context.arc(centreX, centreY, radius, 0, Math.PI * 2);
  context.stroke();
}
