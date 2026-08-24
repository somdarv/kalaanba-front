"use client";

import { useCallback } from "react";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  listAreas,
  listHubs,
  suggestArea,
  type ListAreasParams,
} from "../zone";

/**
 * Zone reference data.
 *
 * The query options are factories rather than inline objects so a hook and a
 * PREFETCH cannot disagree about the key. That is the whole trick: a prefetch
 * that builds its own key writes to a cache entry nobody reads, and looks like
 * it works because the screen still loads — just as slowly as before.
 */

const HUBS_KEY = ["zone", "hubs"] as const;
const AREAS_KEY = ["zone", "areas"] as const;

/** Active City Hubs. Reference data — cached generously. */
export function hubsQuery() {
  return queryOptions({
    queryKey: HUBS_KEY,
    queryFn: listHubs,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Areas inside a hub. The search query is part of the key so typing refetches
 * (the backend does the filtering).
 */
export function areasQuery(params: Partial<ListAreasParams>) {
  return queryOptions({
    queryKey: [...AREAS_KEY, params.city_hub_id, params.q ?? ""],
    queryFn: () => listAreas({ city_hub_id: params.city_hub_id!, q: params.q }),
    enabled: Boolean(params.city_hub_id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHubs() {
  return useQuery(hubsQuery());
}

/** Disabled until a hub is chosen. */
export function useAreas(params: Partial<ListAreasParams>) {
  return useQuery(areasQuery(params));
}

/**
 * Warm the Zone caches ahead of the screens that read them.
 *
 * **Prefetch on intent, not on render.** A guided flow knows what it will ask
 * next long before it asks, and the network is the slowest thing a player on
 * Ghanaian mobile data will meet. Starting the hub list when the FLOW starts
 * and the area list the moment a hub is picked gives each read a whole step of
 * head start, which on this flow is several seconds of the person reading a
 * question and tapping an option.
 *
 * `prefetchQuery` and not `fetchQuery`: it resolves rather than throwing, so a
 * warm-up that fails is silent and the screen that actually needs the data
 * still shows its own loading and error states. A prefetch must never be able
 * to break a page.
 *
 * It also respects `staleTime`, so calling this on every step change costs one
 * request per hub and nothing after that.
 */
export function useWarmZoneCaches() {
  const queryClient = useQueryClient();

  const warmHubs = useCallback(() => {
    void queryClient.prefetchQuery(hubsQuery());
  }, [queryClient]);

  const warmAreas = useCallback(
    (cityHubId: string) => {
      if (!cityHubId) return;
      void queryClient.prefetchQuery(areasQuery({ city_hub_id: cityHubId }));
    },
    [queryClient],
  );

  return { warmHubs, warmAreas };
}

/** Submit a missing-area suggestion to the admin review queue. */
export function useSuggestArea() {
  return useMutation({
    mutationFn: suggestArea,
  });
}
