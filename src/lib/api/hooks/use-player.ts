"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { preparePhoto } from "@/lib/images/prepare-photo";

import {
  createPlayer,
  fetchPlayerMeta,
  getMyPlayer,
  updatePlayer,
  uploadPlayerMedia,
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

/**
 * Set the signed-in player's photo.
 *
 * Three steps behind one call: shrink it, store it, point the profile at it.
 * The caller passes a file and gets back the updated record.
 *
 * **Not optimistic, unlike `useUpdatePlayer`.** Availability is one tap and a
 * boolean, so showing the new value immediately and rolling back on failure
 * costs nothing if it fails. A photo is a two-request round trip carrying
 * megabytes over a connection that drops; painting the face on before the
 * bytes have landed would show the player a card that does not exist yet, and
 * on a slow upload it would show it for a long time. The avatar reports that it
 * is working instead (`isPending`), which is honest and is what the spinner is
 * for.
 *
 * **The PATCH is not what saves the photo.** `POST /players/{id}/media` writes
 * `headshot_url` itself, inside the same transaction as the moderation event,
 * so a connection that drops after the upload cannot leave a stored photo that
 * no card points at. The PATCH that follows is doing two other jobs: it is the
 * write in seeded mode, where there is no server to do it, and against the real
 * API it returns the fresh `MyPlayer` — which is why it is a PATCH rather than
 * an invalidate plus a refetch. Same two requests either way, and this way the
 * second one hands back the record instead of a cache miss.
 *
 * The caller owns the failure message — this hook does the work, it does not
 * decide how to say so.
 */
export function useUploadPlayerPhoto(player: MyPlayer | null | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File | Blob): Promise<MyPlayer> => {
      if (!player) {
        throw new Error("useUploadPlayerPhoto called without a player record.");
      }

      const prepared = await preparePhoto(file);
      const media = await uploadPlayerMedia(
        player.id,
        prepared.blob,
        "headshot",
      );

      return updatePlayer(player.id, player.user_id, {
        headshot_url: media.url,
      });
    },

    onSuccess: (next) => {
      qc.setQueryData<MyPlayer>(PLAYER_ME_KEY, next);
    },
  });
}
