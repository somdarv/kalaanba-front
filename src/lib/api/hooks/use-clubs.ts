"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  decideJoinRequest,
  listClubsNearby,
  listJoinRequests,
  listMyClubs,
  requestToJoinClub,
} from "../club";

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
