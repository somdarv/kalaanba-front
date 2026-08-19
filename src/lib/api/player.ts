"use client";

import { z } from "zod";

import { getApiClient } from "./index";

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

export const PlayerMetaSchema = z.object({
  positions: z.array(LabelledOptionSchema),
  availability: z.array(LabelledOptionSchema),
  availability_default: z.string().optional(),
  market_statuses: z.array(LabelledOptionSchema),
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
