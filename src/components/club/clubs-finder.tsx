"use client";

import { useState } from "react";
import Link from "next/link";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";

import { ApiError } from "@/lib/api";
import { Badge, Button, Card, Spinner } from "@/components/ui";
import { CLUB_TYPE_LABELS, type Club } from "@/lib/api/club";
import { useClubsNearby, useRequestToJoin } from "@/lib/api/hooks/use-clubs";

/**
 * ClubsFinder — lists clubs in the player's area (Club engine §6/§15) and lets
 * the player request to join one (Player & Affiliation §8/§11, WP-C2).
 *
 * Design: composes Card + Badge + Button primitives (DESIGN_LANGUAGE §4);
 * request button reflects requested state; no hover trap (§3.5).
 */
export function ClubsFinder({ areaId }: { areaId: string }) {
  const { data: clubs, isLoading, isError } = useClubsNearby(areaId);

  if (isLoading) {
    return (
      <div className="grid min-h-40 place-items-center">
        <Spinner size="lg" label="Finding clubs near you" />
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-danger">
        Couldn&apos;t load clubs right now. Please try again.
      </p>
    );
  }

  if (!clubs || clubs.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-full bg-surface-2 text-fg-muted"
        >
          <UsersThree size={26} weight="duotone" />
        </span>
        <p className="font-semibold">No clubs in your area yet</p>
        <p className="text-sm text-fg-muted">
          Be patient — clubs are being added. Check back soon to find a team
          near you.
        </p>
      </Card>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {clubs.map((club) => (
        <li key={club.id}>
          <ClubRow club={club} />
        </li>
      ))}
    </ul>
  );
}

function ClubRow({ club }: { club: Club }) {
  const requestToJoin = useRequestToJoin();
  const [requested, setRequested] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  const onJoin = () => {
    setNeedsProfile(false);
    requestToJoin.mutate(club.id, {
      onSuccess: () => setRequested(true),
      onError: (error) => {
        // 422 here means "you don't have a player profile yet".
        if (error instanceof ApiError && error.status === 422) {
          setNeedsProfile(true);
        }
      },
    });
  };

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 font-display text-lg font-bold text-fg"
        >
          {club.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold tracking-tight">{club.name}</p>
          <div className="mt-1">
            <Badge size="sm">
              {CLUB_TYPE_LABELS[club.club_type] ?? club.club_type}
            </Badge>
          </div>
        </div>
        {requested ? (
          <Badge intent="success" size="sm">
            Requested
          </Badge>
        ) : (
          <Button
            intent="secondary"
            size="sm"
            onClick={onJoin}
            loading={requestToJoin.isPending}
          >
            Request to join
          </Button>
        )}
      </div>
      {needsProfile ? (
        <p className="text-sm text-fg-muted">
          Create your{" "}
          <Link href="/player/setup" className="font-medium text-primary underline">
            player profile
          </Link>{" "}
          first to join a club.
        </p>
      ) : null}
    </Card>
  );
}
