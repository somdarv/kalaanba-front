"use client";

import type { PlayerCardModel } from "@/components/player/setup/player-card-model";
import type { CardStatLabel } from "@/components/player/setup/player-card-stats";
import type { Player, VerifiedRecord } from "@/lib/api/player";

/**
 * The share graphic's frame: its size, its margins, and the ink it is set in.
 *
 * One file so the three painters (`share-image.ts`, `-identity`, `-record`)
 * measure from the same edge. Every number below is a share-image geometry
 * constant, not a domain value — nothing reads them, nothing depends on them,
 * and changing one moves a pixel rather than a rule.
 */

/**
 * 1080 x 1350. The ratio is the whole argument: 4:5 is the tallest a chat
 * client shows inline without collapsing it to a tap-to-open thumbnail, which
 * is the difference between a card people see in the thread and a card someone
 * has to decide to open. It is also the card's own shape, so the share image is
 * the same object at poster scale rather than a second design.
 */
export const WIDTH = 1080;
export const HEIGHT = 1350;
export const PAD = 88;
export const CONTENT = WIDTH - PAD * 2;

/** Matches `MAX_PATTERN_OPACITY`. The card grounds are derived from it. */
export const PATTERN_OPACITY = 0.12;
export const GRAIN_OPACITY = 0.05;

/** Intrinsic ratio of the wordmark master, from `.kx-wordmark`. */
export const WORDMARK_RATIO = 1748 / 316;
export const WORDMARK_HEIGHT = 46;

/**
 * Baselines the three painters share, so nothing overlaps by accident.
 *
 * The identity block is a centred stack: portrait, then the stage name, then
 * the position and legal name. It ends around 690, which leaves the award the
 * gap between it and the lead labels at 900 — the only part of the card with
 * air on all four sides.
 */
export const AWARD_TOP = 762;
export const PORTRAIT_CENTRE_Y = 396;
export const PORTRAIT_RADIUS = 104;
export const LEAD_LABEL_TOP = 900;
export const LEAD_VALUE_TOP = 938;
export const STRIP_TOP = 1090;
export const FOOT_HEIGHT = 112;

export type ShareImageInput = {
  player: Player;
  model: PlayerCardModel;
  record?: VerifiedRecord | null;
  statLabels?: Record<string, Partial<CardStatLabel>>;
  /** Stamps the graphic when the figures are seeded fiction. */
  isDemo?: boolean;
  /** Shown at the foot so a graphic in a chat leads somewhere. */
  siteLabel?: string;
};

/** The resolved palette and typefaces, looked up once per render. */
export type Ink = {
  strong: string;
  soft: string;
  faint: string;
  display: string;
  sans: string;
  signature: string;
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "";
  const last = parts[parts.length - 1] ?? first;
  if (parts.length === 1) return first.charAt(0).toUpperCase();
  return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
}
