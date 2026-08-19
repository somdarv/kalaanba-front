"use client";

import { Badge, Button, Card, Spinner } from "@/components/ui";
import { CLUB_TYPE_LABELS, type Club } from "@/lib/api/club";
import {
  useDecideJoinRequest,
  useJoinRequests,
} from "@/lib/api/hooks/use-clubs";

/**
 * ClubRequestsManager — a club admin's pending join-request queue
 * (Player & Affiliation §8/§11, WP-C2). Accept → the player becomes active;
 * decline → the request is rejected. Backend enforces admin authority.
 *
 * Design: Card + Button primitives (DESIGN_LANGUAGE §4).
 */
export function ClubRequestsManager({ club }: { club: Club }) {
  const { data: requests, isLoading } = useJoinRequests(club.id);
  const decide = useDecideJoinRequest(club.id);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold tracking-tight">{club.name}</p>
        <Badge size="sm">
          {CLUB_TYPE_LABELS[club.club_type] ?? club.club_type}
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid min-h-16 place-items-center">
          <Spinner label="Loading requests" />
        </div>
      ) : !requests || requests.length === 0 ? (
        <p className="text-sm text-fg-muted">No pending join requests.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex items-center gap-3 rounded-[var(--radius-tile)] bg-surface-2 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {request.player?.stage_name ?? "A player"}
                </p>
                {request.player?.primary_position ? (
                  <p className="text-xs capitalize text-fg-muted">
                    {request.player.primary_position}
                  </p>
                ) : null}
              </div>
              <Button
                intent="success"
                size="sm"
                loading={decide.isPending}
                onClick={() =>
                  decide.mutate({ affiliationId: request.id, accept: true })
                }
              >
                Accept
              </Button>
              <Button
                intent="ghost"
                size="sm"
                loading={decide.isPending}
                onClick={() =>
                  decide.mutate({ affiliationId: request.id, accept: false })
                }
              >
                Decline
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
