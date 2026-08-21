/**
 * The Tamale demo dataset.
 *
 * PRODUCT.md §3.1 is explicit that this is how Kalaanba is built: "We build the
 * entire frontend against a typed mock data layer before writing any backend."
 * §3.2 sets the rules this file follows:
 *
 *   - components never read this file. They call hooks, which call the client
 *     functions in `lib/api/fixtures.ts`, which read this.
 *   - every shape here is the shape the engine will eventually return, so the
 *     swap is an implementation change inside one module and nothing else.
 *
 * Club and area names are the real Tamale localities from PRODUCT.md §11
 * (Lamashegu, Kalpohin, Vittin, Sakasaka, Choggu, Aboabo, Bulpela, Gumbihini,
 * Sagnarigu, Tishigu, Kakpagyili, Nyohini, Gumani, Bantama). The football is
 * invented: scores, minutes, table positions and goal counts are all made up.
 *
 * When Match/Fixture, Competition & Rules and Awards ship, delete this file and
 * point the client functions at their endpoints. Nothing above them changes.
 */

import type { MatchStatus } from "@/components/ui";

export type SeedFixture = {
  id: string;
  home: string;
  away: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  /** Configurable display label for the status (Law 4). */
  status_label: string;
  /** Live minute, e.g. "67'". Null unless the match is running. */
  minute: string | null;
  kickoff_label: string | null;
  competition: string;
  venue: string | null;
};

export const SEED_FIXTURES: readonly SeedFixture[] = [
  {
    id: "fx-01",
    home: "Sakasaka",
    away: "Choggu",
    home_score: 2,
    away_score: 2,
    status: "live",
    status_label: "HT",
    minute: null,
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Sakasaka Park",
  },
  {
    id: "fx-02",
    home: "Aboabo",
    away: "Gumani",
    home_score: 3,
    away_score: 1,
    status: "result_confirmed",
    status_label: "FT",
    minute: null,
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Aboabo Astro",
  },
  {
    id: "fx-03",
    home: "Bantama",
    away: "Sagnarigu",
    home_score: 1,
    away_score: 1,
    status: "live",
    status_label: "Live",
    minute: "82'",
    kickoff_label: null,
    competition: "North Belt",
    venue: "Sagnarigu Pitch",
  },
  {
    id: "fx-04",
    home: "Tishigu",
    away: "Kakpagyili",
    home_score: 4,
    away_score: 2,
    status: "result_confirmed",
    status_label: "FT",
    minute: null,
    kickoff_label: null,
    competition: "North Belt",
    venue: "Tishigu Ground",
  },
  {
    id: "fx-05",
    home: "Nyohini",
    away: "Kalpohini",
    home_score: 0,
    away_score: 1,
    status: "live",
    status_label: "Live",
    minute: "23'",
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Nyohini Park",
  },
  {
    id: "fx-06",
    home: "Lamashegu",
    away: "Vittin",
    home_score: 2,
    away_score: 1,
    status: "live",
    status_label: "Live",
    minute: "67'",
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Lamashegu Park",
  },
  {
    id: "fx-07",
    home: "Bulpela",
    away: "Gumbihini",
    home_score: 0,
    away_score: 0,
    status: "result_confirmed",
    status_label: "FT",
    minute: null,
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Bulpela Field",
  },
  {
    id: "fx-08",
    home: "Lamashegu",
    away: "Kalpohin",
    home_score: 3,
    away_score: 2,
    status: "awaiting_confirmation",
    status_label: "Awaiting confirmation",
    minute: null,
    kickoff_label: null,
    competition: "Tamale Central",
    venue: "Lamashegu Park",
  },
  {
    id: "fx-09",
    home: "Lamashegu",
    away: "Kalpohin",
    home_score: null,
    away_score: null,
    status: "scheduled",
    status_label: "Saturday, 16:00",
    minute: null,
    kickoff_label: "Sat 16:00",
    competition: "Tamale Central",
    venue: "Kalpohin Park",
  },
];

export type SeedTableRow = {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goal_difference: number;
  points: number;
};

export const SEED_TABLE: readonly SeedTableRow[] = [
  { position: 1, club: "Lamashegu", played: 8, won: 6, drawn: 1, lost: 1, goal_difference: 9, points: 19 },
  { position: 2, club: "Vittin", played: 8, won: 5, drawn: 2, lost: 1, goal_difference: 6, points: 17 },
  { position: 3, club: "Kalpohin", played: 8, won: 5, drawn: 0, lost: 3, goal_difference: 4, points: 15 },
  { position: 4, club: "Choggu", played: 8, won: 4, drawn: 1, lost: 3, goal_difference: 1, points: 13 },
  { position: 5, club: "Aboabo", played: 8, won: 2, drawn: 3, lost: 3, goal_difference: -2, points: 9 },
  { position: 6, club: "Sakasaka", played: 8, won: 1, drawn: 2, lost: 5, goal_difference: -8, points: 5 },
];

export type SeedScorer = {
  player_id: string;
  stage_name: string;
  club: string;
  goals: number;
};

export const SEED_SCORERS: readonly SeedScorer[] = [
  { player_id: "pl-1", stage_name: "KAKA", club: "Lamashegu", goals: 11 },
  { player_id: "pl-2", stage_name: "ZOOM", club: "Vittin", goals: 9 },
  { player_id: "pl-3", stage_name: "SHATTA", club: "Kalpohin", goals: 8 },
  { player_id: "pl-4", stage_name: "BADO", club: "Choggu", goals: 7 },
  { player_id: "pl-5", stage_name: "SULE", club: "Aboabo", goals: 6 },
];
