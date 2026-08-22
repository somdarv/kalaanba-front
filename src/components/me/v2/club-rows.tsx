"use client";

import Link from "next/link";

import { ButtonLink, Crest, Divider, Skeleton } from "@/components/ui";
import { CLUB_TYPE_LABELS } from "@/lib/api/club";
import { useMyClubs } from "@/lib/api/hooks/use-clubs";
import type { MyPlayer } from "@/lib/api/player";

/**
 * Club affiliation (Player & Affiliation §8).
 *
 * **Free-agent state is read off `market_status`, not off the club list.**
 * `market_status` is backend-owned truth on the record we already hold
 * (Law 3); the club list is a separate read that can be empty for reasons with
 * nothing to do with being a free agent (a request in flight, a failed fetch).
 * Deriving "free agent" from an empty array turns a network blip into a claim
 * about the player's standing.
 *
 * The actions §11 describes — leave a club, withdraw a request — are absent
 * rather than disabled. There is no endpoint for either, and a dead control
 * with no route out invites a tap that can never work. They land with the
 * affiliation packet.
 */

export const FREE_AGENT_KEY = "free_agent";

export function ClubRows({ player }: { player: MyPlayer }) {
  const isFreeAgent = player.market_status === FREE_AGENT_KEY;
  const clubs = useMyClubs();

  if (isFreeAgent) {
    return (
      <div className="mt-1">
        <p className="text-fg-muted text-sm">
          You are a free agent. Clubs near you can find you.
        </p>
        <ButtonLink href="/clubs/near-you" size="md" className="mt-3">
          Find a club
        </ButtonLink>
      </div>
    );
  }

  if (clubs.isLoading) {
    return <Skeleton height={44} className="mt-2" />;
  }

  if (!clubs.data || clubs.data.length === 0) {
    // Not a free agent, but the club read gave us nothing. Say only what is
    // certain rather than inventing a club name to fill the row.
    return (
      <p className="text-fg-muted mt-2 text-sm">
        We could not load your club just now.
      </p>
    );
  }

  return (
    <ul className="mt-1 flex flex-col">
      {clubs.data.map((club, index) => (
        <li key={club.id}>
          {index > 0 ? <Divider /> : null}
          <Link
            href="/clubs/manage"
            className="rounded-row duration-quick flex min-h-14 items-center gap-3 px-1 transition-colors ease-out hover:bg-[var(--hover-overlay)]"
          >
            <Crest name={club.name} src={club.crest_url} size="md" />
            <span className="min-w-0 flex-1">
              <span className="text-fg block truncate text-sm font-semibold">
                {club.name}
              </span>
              <span className="text-fg-subtle block truncate text-xs">
                {CLUB_TYPE_LABELS[club.club_type] ?? club.club_type}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
