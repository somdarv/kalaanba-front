"use client";

import { z } from "zod";

import { getApiClient } from "./index";

// Presentation labels for club-type internal keys (backend truth = config
// `club.types`). A future GET meta endpoint should serve these so labels stay
// translatable (Constitution Law 4); until then they mirror the V1 defaults.
export const CLUB_TYPE_LABELS: Record<string, string> = {
  community: "Community club",
  informal: "Friends / crew",
  school: "School club",
  academy: "Academy",
  corporate: "Workplace team",
  religious: "Church / mosque team",
  institution: "Institution team",
  facility: "Facility-based team",
  registered: "Registered club",
};

export const ClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  club_type: z.string(),
  city_hub_id: z.string().uuid(),
  area_id: z.string().uuid(),
  crest_url: z.string().nullable().optional(),
  maturity_level: z.string(),
});

export type Club = z.infer<typeof ClubSchema>;

const ClubListSchema = z.array(ClubSchema);

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
