"use client";

import { z } from "zod";

import { getApiClient } from "./index";

/**
 * A club whose `professional` claim has not been checked yet. It is hidden from
 * every public read; the one place it surfaces is `/clubs/mine`, so its Owner
 * can see the claim is being looked at (ADR-0017).
 */
export const CLUB_PENDING_REVIEW = "pending";

/**
 * The tier whose clubs are checked before they go live (ADR-0017). Keyed on
 * rather than compared against a label, because the label is config and can be
 * relabelled without a deploy (Law 4).
 */
export const PROFESSIONAL_TIER = "professional";

export const ClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  club_type: z.string(),
  city_hub_id: z.string().uuid(),
  area_id: z.string().uuid(),
  crest_url: z.string().nullable().optional(),
  maturity_level: z.string(),
  /** not_required | pending | cleared | rejected. Backend truth (Law 3). */
  verification_state: z.string().optional(),
  /** Internal detail, served only to the club's own admins. Null otherwise. */
  verification_source: z.string().nullable().optional(),
});

export type Club = z.infer<typeof ClubSchema>;

const ClubListSchema = z.array(ClubSchema);

// ─── Creation vocabulary (ADR-0007) ──────────────────────────────────

/**
 * Everything the creation flow needs to render itself, resolved from Admin
 * Configuration at request time.
 *
 * This endpoint exists because the alternative was here: a hardcoded
 * `CLUB_TYPE_LABELS` map mirroring the `club.types` config default, with a
 * comment admitting it. An admin adding a club type would have had the backend
 * accept it and the form never offer it.
 *
 * The reserved-name list is deliberately NOT part of this. Whether a name may
 * be used is a verdict, and verdicts are backend truth (ADR-0017 §4).
 */
export const ClubTierOptionSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().nullable().optional(),
});

export type ClubTierOption = z.infer<typeof ClubTierOptionSchema>;

export const ClubTypeOptionSchema = ClubTierOptionSchema.extend({
  tier: z.string(),
});

export type ClubTypeOption = z.infer<typeof ClubTypeOptionSchema>;

export const ClubMetaSchema = z.object({
  tiers: z.array(ClubTierOptionSchema).min(1),
  types: z.array(ClubTypeOptionSchema),
  name: z.object({ min_length: z.number(), max_length: z.number() }),
});

export type ClubMeta = z.infer<typeof ClubMetaSchema>;

/** Tiers and club types for the creation flow. Public, cacheable. */
export async function getClubMeta(): Promise<ClubMeta> {
  return getApiClient().request({
    path: "/clubs/meta",
    method: "GET",
    schema: ClubMetaSchema,
  });
}

/**
 * The display label for a club-type key, from the vocabulary.
 *
 * Falls back to the key rather than to an English string, so an unreachable
 * meta read shows `academy` and not a label this bundle invented.
 */
export function clubTypeLabel(
  meta: ClubMeta | undefined,
  key: string,
): string {
  return meta?.types.find((type) => type.key === key)?.label ?? key;
}

// ─── Creation ────────────────────────────────────────────────────────

export type CreateClubInput = {
  name: string;
  tier: string;
  club_type: string;
  city_hub_id: string;
  area_id: string;
};

/**
 * Create a club. The caller becomes its Owner.
 *
 * A `amateur` club is live on return. An `professional` one comes back with
 * `verification_state: "pending"` and is not yet visible to anyone else.
 * The api-client attaches the Idempotency-Key.
 *
 * Contract: contracts/api/club/post-clubs.v1.yaml.
 */
export async function createClub(input: CreateClubInput): Promise<Club> {
  return getApiClient().request({
    path: "/clubs",
    method: "POST",
    body: input,
    schema: ClubSchema,
  });
}

// ─── Crest ───────────────────────────────────────────────────────────

export const ClubCrestSchema = z.object({
  crest_url: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  /**
   * Always `pending` on upload, and that is not "we did not check". The verdict
   * is Moderation's and arrives asynchronously (Law 6), so none exists yet.
   */
  moderation_status: z.string(),
});

export type ClubCrest = z.infer<typeof ClubCrestSchema>;

/**
 * Upload or replace a club crest. Owner / Cofounder / Admin only.
 *
 * The image is cropped and re-encoded client-side first, so what goes over the
 * wire is a square well under the size ceiling rather than a raw 12 MP photo.
 *
 * Contract: contracts/api/club/post-clubs-id-crest.v1.yaml.
 */
export async function uploadClubCrest(
  clubId: string,
  file: File | Blob,
): Promise<ClubCrest> {
  const form = new FormData();
  form.append("file", file, "crest.jpg");

  return getApiClient().request({
    path: `/clubs/${clubId}/crest`,
    method: "POST",
    body: form,
    schema: ClubCrestSchema,
  });
}

export const AffiliationSchema = z.object({
  id: z.string().uuid(),
  player_id: z.string().uuid(),
  club_id: z.string().uuid(),
  state: z.string(),
});

export type Affiliation = z.infer<typeof AffiliationSchema>;

/**
 * List clubs in an area for the "join a club near you" finder. The client
 * unwraps the `{ data, meta }` envelope; `data` is the club array.
 * Contract: contracts/api/club/get-clubs.v1.yaml.
 */
export async function listClubsNearby(areaId: string): Promise<Club[]> {
  return getApiClient().request({
    path: `/clubs?area_id=${encodeURIComponent(areaId)}`,
    method: "GET",
    schema: ClubListSchema,
  });
}

/**
 * Request to join a club (Player & Affiliation §8/§11). Creates a `requested`
 * affiliation; a club admin later accepts. Requires a player profile — a 422
 * `affiliation.request_invalid` means "create your player profile first".
 */
export async function requestToJoinClub(
  clubId: string,
): Promise<Affiliation> {
  return getApiClient().request({
    path: `/clubs/${clubId}/join-requests`,
    method: "POST",
    body: {},
    schema: AffiliationSchema,
  });
}

/** A pending join request as seen by a club admin (includes the player). */
export const JoinRequestSchema = z.object({
  id: z.string().uuid(),
  player_id: z.string().uuid(),
  club_id: z.string().uuid(),
  state: z.string(),
  player: z
    .object({
      stage_name: z.string(),
      primary_position: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type JoinRequest = z.infer<typeof JoinRequestSchema>;

const JoinRequestListSchema = z.array(JoinRequestSchema);

/** Clubs the signed-in user administers (Owner / Cofounder / Admin). */
export async function listMyClubs(): Promise<Club[]> {
  return getApiClient().request({
    path: "/clubs/mine",
    method: "GET",
    schema: ClubListSchema,
  });
}

/** Pending join requests for a club (admin only). */
export async function listJoinRequests(
  clubId: string,
): Promise<JoinRequest[]> {
  return getApiClient().request({
    path: `/clubs/${clubId}/join-requests`,
    method: "GET",
    schema: JoinRequestListSchema,
  });
}

/** Accept or decline a pending join request (club admin). */
export async function decideJoinRequest(
  clubId: string,
  affiliationId: string,
  accept: boolean,
): Promise<Affiliation> {
  return getApiClient().request({
    path: `/clubs/${clubId}/join-requests/${affiliationId}/${accept ? "accept" : "decline"}`,
    method: "POST",
    body: {},
    schema: AffiliationSchema,
  });
}
