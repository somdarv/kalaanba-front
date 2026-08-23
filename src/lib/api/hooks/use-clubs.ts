"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { clubTypeLabel } from "../club";
import {
  createClub,
  decideJoinRequest,
  getClubMeta,
  listClubsNearby,
  listJoinRequests,
  listMyClubs,
  requestToJoinClub,
  uploadClubCrest,
} from "../club";

/**
 * Tiers, club types and name bounds for the creation flow (ADR-0007).
 *
 * Reference data with an ETag, and it changes only when an admin edits config,
 * so it is held for an hour rather than refetched per mount. Every surface that
 * renders a club-type label shares this one query.
 */
export function useClubMeta() {
  return useQuery({
    queryKey: ["clubs", "meta"],
    queryFn: getClubMeta,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Upload a club crest. Separate from creation on purpose: the club must exist
 * before there is an id to attach an image to.
 */
export function useUploadClubCrest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clubId, file }: { clubId: string; file: Blob }) =>
      uploadClubCrest(clubId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}

/**
 * A resolver for club-type display labels, backed by the shared vocabulary.
 *
 * Every surface that shows a club type needs the same two lines, so they live
 * here once. It never suspends and never blocks a render: while the vocabulary
 * is in flight the resolver returns the raw key, which is a real word and not a
 * spinner in the middle of a sentence.
 */
export function useClubTypeLabel(): (key: string) => string {
  const meta = useClubMeta();

  return (key: string) => clubTypeLabel(meta.data, key);
}

/**
 * Create a club. Invalidates the caller's club list so the new club appears
 * wherever they are sent next, including an official one still under review.
 */
export function useCreateClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs", "mine"] });
    },
  });
}

/**
 * Clubs in the given area for the "clubs near you" finder. Disabled until an
 * area is known (the query needs one).
 */
export function useClubsNearby(areaId: string | null | undefined) {
  return useQuery({
    queryKey: ["clubs", "near", areaId],
    queryFn: () => listClubsNearby(areaId as string),
    enabled: Boolean(areaId),
    staleTime: 30 * 1000,
  });
}

/** Request to join a club (player side). */
export function useRequestToJoin() {
  return useMutation({ mutationFn: requestToJoinClub });
}

/** Clubs the signed-in user administers. */
export function useMyClubs() {
  return useQuery({ queryKey: ["clubs", "mine"], queryFn: listMyClubs });
}

/** Pending join requests for a club (admin surface). */
export function useJoinRequests(clubId: string | null | undefined) {
  return useQuery({
    queryKey: ["clubs", clubId, "join-requests"],
    queryFn: () => listJoinRequests(clubId as string),
    enabled: Boolean(clubId),
  });
}

/** Accept/decline a join request; refreshes that club's pending list. */
export function useDecideJoinRequest(clubId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      affiliationId,
      accept,
    }: {
      affiliationId: string;
      accept: boolean;
    }) => decideJoinRequest(clubId, affiliationId, accept),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubs", clubId, "join-requests"] });
    },
  });
}
