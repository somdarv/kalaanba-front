"use client";

import {
  balanceStrip,
  statLabelFor,
  stripColumns,
} from "@/components/player/setup/player-card-stats";
import type { VerifiedRecord } from "@/lib/api/player";

import {
  CONTENT,
  FOOT_HEIGHT,
  HEIGHT,
  LEAD_LABEL_TOP,
  LEAD_VALUE_TOP,
  PAD,
  STRIP_TOP,
  WIDTH,
  type Ink,
  type ShareImageInput,
} from "./share-image-layout";
import { withAlpha } from "./share-image-paint";

/**
 * The bottom half of the share graphic: the record, and the line that says how
 * much of it is verified.
 *
 * Three billed counters over a two-column strip, trimmed to whole rows the same
 * way the screen card trims it, so the picture and the page never end on a
 * different line.
 */
export function paintRecord(
  context: CanvasRenderingContext2D,
  input: ShareImageInput,
  ink: Ink,
): void {
  const { model, record, statLabels } = input;

  if (!model.hasRecord || !record) {
    context.font = `400 32px ${ink.sans}`;
    context.textAlign = "center";
    context.fillStyle = ink.soft;
    context.fillText(
      "Stats show up when a match is confirmed.",
      WIDTH / 2,
      940,
    );
    context.textAlign = "left";
    return;
  }

  const columnWidth = CONTENT / 3;
  context.textAlign = "center";

  model.lead.forEach((key, index) => {
    const centre = PAD + columnWidth * index + columnWidth / 2;

    context.font = `600 24px ${ink.sans}`;
    context.letterSpacing = "0.5px";
    context.fillStyle = ink.faint;
    context.fillText(
      statLabelFor(key, statLabels).short,
      centre,
      LEAD_LABEL_TOP,
    );
    context.letterSpacing = "0px";

    context.font = `700 104px ${ink.display}`;
    context.fillStyle = ink.strong;
    context.fillText(String(record[key] ?? 0), centre, LEAD_VALUE_TOP);
  });

  context.textAlign = "left";
  paintStrip(context, input, record, ink);
}

function paintStrip(
  context: CanvasRenderingContext2D,
  { model, statLabels }: ShareImageInput,
  record: VerifiedRecord,
  ink: Ink,
): void {
  const stats = model.secondary.map((key) => ({
    label: statLabelFor(key, statLabels).label,
    value: String(record[key] ?? 0),
  }));

  // One disciplinary line, never two counters. Yellows and reds are read
  // together or not at all.
  const cards =
    record.yellow_cards > 0 || record.red_cards > 0
      ? {
          label: "Cards",
          value: `${record.yellow_cards}Y, ${record.red_cards}R`,
        }
      : null;

  // Same assembly and the same column rule as the screen card, from the same
  // two functions, so the picture and the page never end on a different line.
  const fitted = balanceStrip(stats, cards);
  if (fitted.length === 0) return;
  const columns = stripColumns(fitted.length);

  context.strokeStyle = withAlpha(ink.strong, 0.15);
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(PAD, STRIP_TOP);
  context.lineTo(WIDTH - PAD, STRIP_TOP);
  context.stroke();

  const gutter = 56;
  const columnWidth = (CONTENT - gutter * (columns - 1)) / columns;

  fitted.forEach((item, index) => {
    const left = PAD + (index % columns) * (columnWidth + gutter);
    const rowTop = STRIP_TOP + 42 + Math.floor(index / columns) * 56;

    // Justified: label hard left, value hard right, filling the column. The
    // values then line up in a column the eye can run down, which is the whole
    // reason the strip is not centred like the lead row above it.
    context.textAlign = "left";
    context.font = `400 28px ${ink.sans}`;
    context.fillStyle = ink.faint;
    context.fillText(item.label, left, rowTop);

    context.textAlign = "right";
    context.font = `600 28px ${ink.sans}`;
    context.fillStyle = ink.strong;
    context.fillText(item.value, left + columnWidth, rowTop);
  });

  context.textAlign = "left";
}

/**
 * The address, and the seeded-data stamp when there is one.
 *
 * This foot exists only on the picture. The card on screen has none: position
 * and status moved up beside the name and the confidence tier stays in its own
 * block. But a graphic in a group chat has no URL bar, and §15 wants the share
 * image to lead somewhere, so the picture carries the address that the page
 * gets for free.
 *
 * The stamp is the same load-bearing warning the seeded card makes on screen:
 * a fabricated stat line must never travel as a record, least of all in a
 * picture that outlives the session it was made in.
 */
export function paintFoot(
  context: CanvasRenderingContext2D,
  { isDemo, siteLabel = "kalaanba.com" }: ShareImageInput,
  ink: Ink,
  onCard: string,
): void {
  const top = HEIGHT - FOOT_HEIGHT;

  context.fillStyle = withAlpha(onCard, 0.07);
  context.fillRect(0, top, WIDTH, FOOT_HEIGHT);

  context.strokeStyle = withAlpha(onCard, 0.2);
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, top);
  context.lineTo(WIDTH, top);
  context.stroke();

  if (isDemo) {
    context.font = `500 28px ${ink.sans}`;
    context.fillStyle = ink.soft;
    context.fillText("Demo data", PAD, top + 42);
  }

  // Centred when it stands alone, so a foot carrying one word does not read as
  // a line that lost its other half.
  context.font = `600 28px ${ink.sans}`;
  context.fillStyle = withAlpha(onCard, 0.7);
  context.textAlign = isDemo ? "right" : "center";
  context.fillText(siteLabel, isDemo ? WIDTH - PAD : WIDTH / 2, top + 42);
  context.textAlign = "left";
}
