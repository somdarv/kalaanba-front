"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPlayer,
  fetchPlayerMeta,
  getMyPlayer,
  updatePlayer,
  type MyPlayer,
  type UpdatePlayerInput,
} from "../player";

const PLAYER_META_KEY = ["player", "meta"] as const;

/** The signed-in user's own record. One key, so every surface shares a cache. */
export const PLAYER_ME_KEY = ["player", "me"] as const;

/**
 * Create the signed-in user's player profile.
 *
 * Invalidates the `/me` record rather than seeding the cache with the create
 * response. `POST /players` returns a `Player`; `/me` reads a `MyPlayer`, which
 * carries confidence and the verified record on top. Writing the narrower shape
 * into the wider key would hand every reader a half-built object that the types
 * claim is whole.
 */
export function useCreatePlayer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PLAYER_ME_KEY });
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

/**
 * The signed-in user's player record.
 *
 * `undefined` while loading, `null` when the account has no player profile.
 * Those are different states and `/me` renders different halves for each, so
 * callers must not collapse them with a truthiness check.
 */
export function useMyPlayer(userId: string | null | undefined) {
  return useQuery({
    queryKey: PLAYER_ME_KEY,
    queryFn: () => getMyPlayer(userId as string),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

/**
 * Update the signed-in user's player profile.
 *
 * Optimistic, because the availability control is a single tap that a player
 * makes on a phone on a bad connection, and a control that waits for a round
 * trip before moving reads as broken. The previous record is captured in
 * `onMutate` and put back on failure, so a rejected write never leaves the UI
 * asserting something the backend refused.
 *
 * The caller owns the failure message — this hook restores truth, it does not
 * decide how to say so.
 */
export function useUpdatePlayer(player: MyPlayer | null | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePlayerInput) => {
      if (!player) {
        return Promise.reject(
          new Error("useUpdatePlayer called without a player record."),
        );
      }
      return updatePlayer(player.id, player.user_id, input);
    },

    onMutate: async (input: UpdatePlayerInput) => {
      await qc.cancelQueries({ queryKey: PLAYER_ME_KEY });
      const previous = qc.getQueryData<MyPlayer | null>(PLAYER_ME_KEY);
      if (previous) {
        qc.setQueryData<MyPlayer>(PLAYER_ME_KEY, { ...previous, ...input });
      }
      return { previous };
    },

    onError: (_error, _input, context) => {
      if (context && "previous" in context) {
        qc.setQueryData(PLAYER_ME_KEY, context.previous);
      }
    },

    onSuccess: (next) => {
      qc.setQueryData<MyPlayer>(PLAYER_ME_KEY, next);
    },
  });
}
