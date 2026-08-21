"use client";

import type { MatchStatus } from "@/components/ui";
import {
  SEED_FIXTURES,
  SEED_SCORERS,
  SEED_TABLE,
  type SeedFixture,
} from "./seed/tamale-seed";

/**
 * Match, table and scorer reads for the home surface.
 *
 * These are the api-client functions PRODUCT.md §3.2 describes: typed, async,
 * and returning the exact shape the engine will return. They are backed by the
 * Tamale seed today because Match/Fixture, Competition & Rules and Awards have
 * no endpoints yet.
 *
 * WHEN THE BACKEND ARRIVES, the change is confined to this file: swap each body
 * for a `getApiClient().request({ ... })` with a Zod schema, exactly like
 * `lib/api/zone.ts` already does. Hooks and components do not change, which is
 * the entire point of routing through here rather than importing the seed into
 * a component (§3.2: "Component code never reads mock data directly").
 *
 * `async` is not decoration. It is what makes these swappable without touching
 * a caller, and it keeps TanStack Query's loading states real in development
 * rather than resolving in the same tick and hiding every skeleton.
 *
 * Nothing here computes football. Positions, points, goal differences and goal
 * counts all arrive as given (Law 3). If a value would have to be derived, it
 * belongs in an engine, not in this file.
 */

export type Fixture = {
  id: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  statusLabel: string;
  minute: string | null;
  kickoffLabel: string | null;
  competition: string;
  venue: string | null;
};

export type TableRow = {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  points: number;
};

export type Scorer = {
  playerId: string;
  stageName: string;
  club: string;
  goals: number;
};

/** Wire shape (snake_case) to app shape (camelCase), per engineering-standards §2. */
function toFixture(row: SeedFixture): Fixture {
  return {
    id: row.id,
    home: row.home,
    away: row.away,
    homeScore: row.home_score,
    awayScore: row.away_score,
    status: row.status,
    statusLabel: row.status_label,
    minute: row.minute,
    kickoffLabel: row.kickoff_label,
    competition: row.competition,
    venue: row.venue,
  };
}

/** Everything currently running or just finished, for the nav strip. */
export async function listTickerFixtures(): Promise<Fixture[]> {
  return SEED_FIXTURES.filter(
    (row) => row.status === "live" || row.status === "result_confirmed",
  ).map(toFixture);
}

/** Matches in play right now. */
export async function listLiveFixtures(): Promise<Fixture[]> {
  return SEED_FIXTURES.filter((row) => row.minute !== null).map(toFixture);
}

/** The next scheduled match. Null when nothing is on. */
export async function getNextFixture(): Promise<Fixture | null> {
  const next = SEED_FIXTURES.find((row) => row.status === "scheduled");
  return next ? toFixture(next) : null;
}

/**
 * Recent results, confirmed and provisional alike. The caller shows the
 * difference; it does not filter it away, because a result awaiting
 * confirmation is real news that simply is not settled yet (Law 7).
 */
export async function listRecentResults(): Promise<Fixture[]> {
  return SEED_FIXTURES.filter(
    (row) =>
      row.status === "result_confirmed" ||
      row.status === "awaiting_confirmation",
  ).map(toFixture);
}

/** Standings for a zone. Computed by Competition & Rules, never here. */
export async function getZoneTable(): Promise<TableRow[]> {
  return SEED_TABLE.map((row) => ({
    position: row.position,
    club: row.club,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    goalDifference: row.goal_difference,
    points: row.points,
  }));
}

/** Top scorers from verified matches only (Law 9). */
export async function listTopScorers(): Promise<Scorer[]> {
  return SEED_SCORERS.map((row) => ({
    playerId: row.player_id,
    stageName: row.stage_name,
    club: row.club,
    goals: row.goals,
  }));
}
