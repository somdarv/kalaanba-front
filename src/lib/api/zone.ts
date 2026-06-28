"use client";

import { z } from "zod";

import { getApiClient } from "./index";

/**
 * Zone read client — City Hubs + Areas for the post-signup area picker, plus
 * the user-facing "suggest a missing area" submission.
 *
 * Backend (kalaanba-api WP-20260625a-zone-public-read) implements these; the
 * shapes below mirror contracts/api/zone/*.v1.yaml. The api-client unwraps the
 * `{ data, meta }` envelope, so every schema describes the inner `data`.
 *
 * Zone engine §2/§5: users pick a Hub then an Area. Zone/Belt mapping is
 * admin-derived and intentionally absent here (Constitution Law 3).
 */

// ─── Schemas ─────────────────────────────────────────────────────────

export const CityHubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  region: z.string().nullable().optional(),
});

export type CityHub = z.infer<typeof CityHubSchema>;

export const CityHubListSchema = z.array(CityHubSchema);

export const AreaSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  city_hub_id: z.string().uuid(),
});

export type Area = z.infer<typeof AreaSchema>;

export const AreaListSchema = z.array(AreaSchema);

export const AreaSuggestionResultSchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
});

export type AreaSuggestionResult = z.infer<typeof AreaSuggestionResultSchema>;

// ─── Calls ───────────────────────────────────────────────────────────

/** List the active City Hubs a user can belong to. */
export async function listHubs(): Promise<CityHub[]> {
  return getApiClient().request({
    path: "/zone/hubs",
    method: "GET",
    schema: CityHubListSchema,
  });
}

export type ListAreasParams = {
  city_hub_id: string;
  q?: string;
};

/** List areas inside a City Hub, optionally filtered by a search query. */
export async function listAreas(params: ListAreasParams): Promise<Area[]> {
  return getApiClient().request({
    path: "/zone/areas",
    method: "GET",
    query: { city_hub_id: params.city_hub_id, q: params.q || undefined },
    schema: AreaListSchema,
  });
}

export type SuggestAreaInput = {
  city_hub_id: string;
  proposed_name: string;
  note?: string | null;
};

/** Propose a missing area; it enters the admin review queue (Zone §5). */
export async function suggestArea(
  input: SuggestAreaInput,
): Promise<AreaSuggestionResult> {
  return getApiClient().request({
    path: "/zone/area-suggestions",
    method: "POST",
    body: {
      city_hub_id: input.city_hub_id,
      proposed_name: input.proposed_name,
      note: input.note ?? null,
    },
    schema: AreaSuggestionResultSchema,
  });
}
