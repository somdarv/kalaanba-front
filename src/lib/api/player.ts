"use client";

import { z } from "zod";

import { IS_SEED_ENABLED } from "../env";
import { ApiError, getApiClient } from "./index";
import { readSeedPlayer, writeSeedPlayer } from "./seed/player-store";

// ─── Schemas ─────────────────────────────────────────────────────────
// The client unwraps the `{ data, meta }` envelope; schemas describe the
// inner `data`.

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  stage_name: z.string(),
  preferred_number: z.number().nullable().optional(),
  primary_position: z.string().nullable().optional(),
  availability_status: z.string(),
  market_status: z.string(),
  claim_status: z.string(),
  headshot_url: z.string().nullable().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;

/**
 * Card confidence (Player & Affiliation §14). A LABEL, not a score: §14 rules
 * numeric ratings out of V1 because a rating without minutes, role and
 * opposition context goes unfair fast.
 *
 * `tier` is a stable internal key resolved backend-side against
 * `player.card_confidence.tiers`; the display string comes from the label map
 * on `/players/meta` (Law 4). `matches_to_next_tier` is backend-computed and
 * deliberately not derivable here — the thresholds are effective-dated config,
 * so only the server knows which ones applied when.
 */
export const CardConfidenceSchema = z.object({
  tier: z.string(),
  confirmed_matches: z.number().int().nonnegative(),
  next_tier: z.string().nullable().optional(),
  matches_to_next_tier: z.number().int().nonnegative().nullable().optional(),
});

export type CardConfidence = z.infer<typeof CardConfidenceSchema>;

/**
 * Verified stats only (Player & Affiliation §13). Every counter is sourced from
 * matches where `result_confirmed = true` with Trust clearance recorded
 * (Constitution Law 7). Claimed or provisional figures never reach this shape.
 *
 * Returned with every counter at 0 rather than omitted while Match/Fixture has
 * no endpoints, so a caller never has to tell "no stats yet" apart from "field
 * missing" by guessing.
 */
export const VerifiedRecordSchema = z.object({
  appearances: z.number().int().nonnegative(),
  goals: z.number().int().nonnegative(),
  assists: z.number().int().nonnegative(),
  minutes: z.number().int().nonnegative(),
  yellow_cards: z.number().int().nonnegative(),
  red_cards: z.number().int().nonnegative(),
});

export type VerifiedRecord = z.infer<typeof VerifiedRecordSchema>;

/**
 * The signed-in user's own player record, as `/me` reads it.
 * Contract: contracts/api/player/get-players-me.v1.yaml.
 */
export const MyPlayerSchema = PlayerSchema.extend({
  archived_at: z.string().nullable().optional(),
  confidence: CardConfidenceSchema,
  record: VerifiedRecordSchema,
});

export type MyPlayer = z.infer<typeof MyPlayerSchema>;

/**
 * Partial update payload. Every key optional, at least one required — enforced
 * by the Form Request, not here, for the same reason `CreatePlayerInput` is
 * structural: the bounds and allowed key sets are config (Law 2/4).
 *
 * Deliberately absent: `market_status`, `claim_status`, `confidence`, `record`.
 * All backend-derived (Law 3); typing them here would invite a caller to send
 * one.
 */
export const UpdatePlayerInputSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  stage_name: z.string().optional(),
  preferred_number: z.number().int().nullable().optional(),
  primary_position: z.string().nullable().optional(),
  availability_status: z.string().optional(),
  headshot_url: z.string().url().nullable().optional(),
});

export type UpdatePlayerInput = z.infer<typeof UpdatePlayerInputSchema>;

/**
 * Transport shape of the create payload. Deliberately structural: it types the
 * request, it does not police it. Bounds and allowed keys are config (Law 2/4),
 * so the form's validation schema is *derived* from `PlayerMeta` at runtime
 * rather than duplicated here as literals — see ADR-0007 and
 * `buildPlayerSetupSchema`. The Form Request remains the authority.
 */
export const CreatePlayerInputSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  stage_name: z.string(),
  preferred_number: z.number().int().nullable().optional(),
  primary_position: z.string().nullable().optional(),
  availability_status: z.string().optional(),
  headshot_url: z.string().url().nullable().optional(),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerInputSchema>;

// ─── Profile-form vocabulary (ADR-0007) ──────────────────────────────
// Option sets, labels and bounds resolved from Admin Configuration at request
// time. The frontend holds no copy of a config value: an admin adding a
// position or renaming "Available" must reach the UI without a deploy.

export const LabelledOptionSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().nullable().optional(),
});

export type LabelledOption = z.infer<typeof LabelledOptionSchema>;

/**
 * A position carries two extra display strings: the short form drawn on the
 * pitch marker, and a line on what the position does. Both are config, not
 * client-derived — "Goalkeeper" shortens to "GK" in English and "GB" in
 * French, and no rule in this file gets that right (Law 4).
 *
 * `abbreviation` is optional in the schema, not because the API omits it (it
 * falls back to the label, then the key, so it is always sent) but so a client
 * on this build keeps working against an API that predates the field.
 */
export const PositionOptionSchema = LabelledOptionSchema.extend({
  abbreviation: z.string().optional(),
});

export type PositionOption = z.infer<typeof PositionOptionSchema>;

export const PlayerMetaSchema = z.object({
  positions: z.array(PositionOptionSchema),
  availability: z.array(LabelledOptionSchema),
  availability_default: z.string().optional(),
  market_statuses: z.array(LabelledOptionSchema),
  /**
   * Card-confidence tier labels (§14), from `player.card_confidence.labels`.
   *
   * Optional because the key is contract-first: `/me` consumes it now, the
   * backend serves it in the paired packet. Until then `labelFor` falls back to
   * the raw tier key, which is readable rather than blank — the same graceful
   * degradation `abbreviation` already relies on above.
   */
  card_confidence: z.array(LabelledOptionSchema).optional(),
  preferred_number: z.object({
    min: z.number().int(),
    max: z.number().int(),
    quick_picks: z.array(z.number().int()),
  }),
  name: z.object({
    max_length: z.number().int(),
    stage_name_max_length: z.number().int(),
  }),
});

export type PlayerMeta = z.infer<typeof PlayerMetaSchema>;

/** Resolve a config-served label, falling back to the raw key (ADR-0007 §2). */
export function labelFor(
  options: ReadonlyArray<LabelledOption>,
  key: string | null | undefined,
): string | null {
  if (!key) return null;
  return options.find((option) => option.key === key)?.label ?? key;
}

// ─── Calls ───────────────────────────────────────────────────────────

/**
 * Create the authenticated user's player profile (free agent). One-per-user +
 * idempotent server-side — a repeat returns the existing player.
 * Contract: contracts/api/player/post-players.v1.yaml.
 */
export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  return getApiClient().request({
    path: "/players",
    method: "POST",
    body: input,
    schema: PlayerSchema,
  });
}

/**
 * Option sets, labels and bounds for the player-profile form. Reference data —
 * public, cacheable, no per-user content.
 * Contract: contracts/api/player/get-players-meta.v1.yaml.
 */
export async function fetchPlayerMeta(): Promise<PlayerMeta> {
  return getApiClient().request({
    path: "/players/meta",
    method: "GET",
    schema: PlayerMetaSchema,
  });
}

/**
 * The signed-in user's player record, or `null` when the account has no player
 * profile.
 *
 * **404 is a state, not a failure.** Post-signup users are `role=user` and
 * player-hood is opt-in (§22), so most accounts legitimately have no card. The
 * `/me` surface renders its no-card half on this; raising would put an error
 * state in front of a perfectly ordinary account.
 *
 * `userId` is only used to stamp the seeded record. The real endpoint derives
 * the player from the bearer token and ignores it.
 *
 * Contract: contracts/api/player/get-players-me.v1.yaml.
 */
export async function getMyPlayer(userId: string): Promise<MyPlayer | null> {
  if (IS_SEED_ENABLED) {
    return readSeedPlayer(userId);
  }

  try {
    return await getApiClient().request({
      path: "/players/me",
      method: "GET",
      schema: MyPlayerSchema,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Update your own player profile. Availability from the `/me` control and the
 * identity fields from the details sheet share this call, because they share a
 * resource and an authorization.
 *
 * Returns the full record rather than the patched fields so the caller replaces
 * its cache entry outright instead of merging a partial into it.
 *
 * Contract: contracts/api/player/patch-players-id.v1.yaml.
 */
export async function updatePlayer(
  playerId: string,
  userId: string,
  input: UpdatePlayerInput,
): Promise<MyPlayer> {
  if (IS_SEED_ENABLED) {
    return writeSeedPlayer(userId, input);
  }

  return getApiClient().request({
    path: `/players/${playerId}`,
    method: "PATCH",
    body: input,
    schema: MyPlayerSchema,
  });
}
