"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { listAreas, listHubs, suggestArea, type ListAreasParams } from "../zone";

const HUBS_KEY = ["zone", "hubs"] as const;
const AREAS_KEY = ["zone", "areas"] as const;

/** Active City Hubs. Reference data — cached generously. */
export function useHubs() {
  return useQuery({
    queryKey: HUBS_KEY,
    queryFn: listHubs,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Areas inside a hub. Disabled until a hub is chosen; the search query is part
 * of the key so typing refetches (backend does the filtering).
 */
export function useAreas(params: Partial<ListAreasParams>) {
  return useQuery({
    queryKey: [...AREAS_KEY, params.city_hub_id, params.q ?? ""],
    queryFn: () => listAreas({ city_hub_id: params.city_hub_id!, q: params.q }),
    enabled: Boolean(params.city_hub_id),
    staleTime: 5 * 60 * 1000,
  });
}

/** Submit a missing-area suggestion to the admin review queue. */
export function useSuggestArea() {
  return useMutation({
    mutationFn: suggestArea,
  });
}
