/**
 * Everything a player card renders, resolved once.
 *
 * §15 asks for two artefacts from one record: "static share images for WhatsApp
 * and a live URL that stays current". Two artefacts deriving their own lead
 * stats, their own labels and their own colours is how those two start
 * disagreeing — a player screenshots a card billing goals and sends a link
 * billing minutes. So the derivation lives here, and both the DOM card and the
 * canvas share image read the same object.
 *
 * Pure. No React, no DOM, no fetching — it takes config-served vocabulary and a
 * backend-owned record and decides nothing about football (Law 3).
 */

import {
  abbreviationFor,
  type Player,
  type PositionOption,
  type VerifiedRecord,
} from "@/lib/api/player";

import type { PlayerCardPattern } from "./player-card-patterns";
import {
  hasAnyStat,
  leadStatsFor,
  secondaryStatsFor,
  statPriorityFor,
  type CardStatKey,
  type CardStatLabel,
} from "./player-card-stats";
import { variantFor, type PlayerCardVariant } from "./player-card-variants";

export type PlayerCardModelInput = {
  player: Player;
  positions: ReadonlyArray<PositionOption>;
  record?: VerifiedRecord | null;
  featuredStats?: Record<string, ReadonlyArray<string>>;
  statLabels?: Record<string, Partial<CardStatLabel>>;
  variant?: PlayerCardVariant;
  pattern?: PlayerCardPattern;
};

export type PlayerCardModel = {
  look: PlayerCardVariant;
  texture: PlayerCardPattern;
  /** Short position form for the chip beside the name. */
  positionAbbreviation: string | null;
  lead: ReadonlyArray<CardStatKey>;
  secondary: ReadonlyArray<CardStatKey>;
  /** False when the record is absent or entirely zero — the card shows the gate. */
  hasRecord: boolean;
  playerOfTheMatch: number;
};

export function buildPlayerCardModel({
  player,
  positions,
  record,
  featuredStats,
  variant,
  pattern,
}: PlayerCardModelInput): PlayerCardModel {
  // Derived, never random. A random look would hand the same player a
  // different card on every render, which is worse than one colour: it makes
  // the card feel like it belongs to the app instead of to them.
  const look = variant ?? variantFor(player.id ?? player.stage_name);

  const priority = statPriorityFor(player.primary_position, featuredStats);
  const lead = record ? leadStatsFor(priority, record) : [];

  return {
    look,
    texture: pattern ?? look.pattern,
    positionAbbreviation: abbreviationFor(positions, player.primary_position),
    lead,
    secondary: record ? secondaryStatsFor(priority, lead, record) : [],
    hasRecord: hasAnyStat(record),
    playerOfTheMatch: record?.player_of_the_match ?? 0,
  };
}
