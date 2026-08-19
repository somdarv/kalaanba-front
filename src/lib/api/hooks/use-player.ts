"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPlayer, fetchPlayerMeta } from "../player";

const PLAYER_META_KEY = ["player", "meta"] as const;

/**
 * Create the signed-in user's player profile. On success the new player is
 * cached under ["player","me"] so downstream surfaces can read it without a
 * refetch.
 */
export function useCreatePlayer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPlayer,
    onSuccess: (player) => {
      qc.setQueryData(["player", "me"], player);
    },
  });
}

/**
 * Profile-form vocabulary (positions, availability, number bounds) resolved
 * from Admin Configuration — ADR-0007. Reference data: it changes when an
 * admin edits a config key, not when the user does anything, so it is cached
 * generously and revalidated in the background.
 */
export function usePlayerMeta() {
  return useQuery({
    queryKey: PLAYER_META_KEY,
    queryFn: fetchPlayerMeta,
    staleTime: 60 * 60 * 1000,
  });
}
