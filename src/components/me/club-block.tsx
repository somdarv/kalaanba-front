"use client";

import Link from "next/link";

import { ButtonLink, Crest, Divider, Skeleton } from "@/components/ui";
import { useMyClubs } from "@/lib/api/hooks/use-clubs";
import { CLUB_TYPE_LABELS } from "@/lib/api/club";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { MeSection } from "./me-section";

/**
 * Club affiliation (Player & Affiliation §8).
 *
 * **Free-agent state is read off `market_status`, not off the club list.**
 * `market_status` is backend-owned truth on the record we already hold
 * (Law 3); the club list is a separate read that can be empty for reasons that
 * have nothing to do with being a free agent (a request in flight, a failed
 * fetch). Deriving "free agent" from an empty array would turn a network blip
 * into a claim about the player's standing.
 *
 * The actions §11 describes — leave a club, withdraw a request — are absent
 * rather than disabled. There is no endpoint for either, and a dead control
 * with no route out is worse than an honest gap: it invites a tap that can
 * never work. They land with the affiliation packet.
 */

export type ClubBlockProps = {
  player: MyPlayer;
  meta: PlayerMeta;
};

const FREE_AGENT_KEY = "free_agent";

export function ClubBlock({ player, meta }: ClubBlockProps) {
  const isFreeAgent = player.market_status === FREE_AGENT_KEY;
  const clubs = useMyClubs();

  if (isFreeAgent) {
    return (
      <MeSection
        title="Your club"
        description="You are a free agent. Clubs near you can find you."
      >
        <ButtonLink href="/clubs/near-you" size="md">
          Find a club
        </ButtonLink>
      </MeSection>
    );
  }

  return (
    <MeSection
      title="Your club"
      note={
        <span className="text-sm text-fg-muted">
          {labelFor(meta.market_statuses, player.market_status)}
        </span>
      }
    >
      {clubs.isLoading ? (
        <Skeleton height={44} />
      ) : clubs.data && clubs.data.length > 0 ? (
        <ul className="flex flex-col">
          {clubs.data.map((club, index) => (
            <li key={club.id}>
              {index > 0 ? <Divider /> : null}
              <Link
                href="/clubs/manage"
                className="rounded-row duration-quick ease-out flex min-h-14 items-center gap-3 px-1 transition-colors hover:bg-[var(--hover-overlay)]"
              >
                <Crest name={club.name} src={club.crest_url} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-fg">
                    {club.name}
                  </span>
                  <span className="block truncate text-xs text-fg-subtle">
                    {CLUB_TYPE_LABELS[club.club_type] ?? club.club_type}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        // Not a free agent, but the club read gave us nothing. Say only what is
        // certain rather than inventing a club name to fill the row.
        <p className="text-sm text-fg-muted">
          We could not load your club just now.
        </p>
      )}
    </MeSection>
  );
}
