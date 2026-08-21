"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getNextFixture,
  getZoneTable,
  listLiveFixtures,
  listRecentResults,
  listTickerFixtures,
  listTopScorers,
} from "../fixtures";

/**
 * Home-surface football reads.
 *
 * TanStack Query wraps every one of them (PRODUCT.md §3.2, and
 * engineering-standards §5: "TanStack Query for every server-state read").
 * The client functions behind these are seed-backed today and endpoint-backed
 * later; nothing in this file has to change for that swap.
 *
 * `staleTime` is set per read rather than globally, because the whole point of
 * this surface is that a live score and a season table do not age at the same
 * speed. Those numbers become config keys when the engines land; until the data
 * is real there is nothing yet to configure.
 */

const LIVE_STALE_MS = 30 * 1000;
const SETTLED_STALE_MS = 5 * 60 * 1000;

/** The nav strip. Live scores plus what just finished. */
export function useTickerFixtures() {
  return useQuery({
    queryKey: ["fixtures", "ticker"],
    queryFn: listTickerFixtures,
    staleTime: LIVE_STALE_MS,
  });
}

export function useLiveFixtures() {
  return useQuery({
    queryKey: ["fixtures", "live"],
    queryFn: listLiveFixtures,
    staleTime: LIVE_STALE_MS,
  });
}

export function useNextFixture() {
  return useQuery({
    queryKey: ["fixtures", "next"],
    queryFn: getNextFixture,
    staleTime: SETTLED_STALE_MS,
  });
}

export function useRecentResults() {
  return useQuery({
    queryKey: ["fixtures", "recent"],
    queryFn: listRecentResults,
    staleTime: SETTLED_STALE_MS,
  });
}

export function useZoneTable() {
  return useQuery({
    queryKey: ["competition", "zone-table"],
    queryFn: getZoneTable,
    staleTime: SETTLED_STALE_MS,
  });
}

export function useTopScorers() {
  return useQuery({
    queryKey: ["awards", "top-scorers"],
    queryFn: listTopScorers,
    staleTime: SETTLED_STALE_MS,
  });
}
