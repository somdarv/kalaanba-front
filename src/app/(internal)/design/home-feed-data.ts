/**
 * SYNTHETIC data for the Stage 2 home-feed specimen. Not a fixture file, not a
 * mock layer, not reachable from any public route.
 *
 * Club names are built from the real Tamale zones in PRODUCT.md §11
 * (Lamashegu, Kalpohin, Vittin, Sakasaka, Choggu, Aboabo, Bulpela, Gumbihini)
 * so the specimen reads as Kalaanba rather than as the Premier League. Every
 * score, table position, goal count and buzz number below is INVENTED.
 *
 * None of this may reach a public surface. Constitution Law 3 puts every one of
 * these numbers behind a backend engine, and a synthetic standings table on a
 * live page is indistinguishable from a real one to the person reading it.
 */

import type { MatchStatus } from "@/components/ui";

export type FeedFixture = {
  id: string;
  home: { name: string };
  away: { name: string };
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  statusLabel: string;
  minute?: string;
  kickoff?: string;
  meta: string;
};

/** The one match the feed leads on. Fan Buzz §11.1 "upcoming tracked matches". */
export const HERO_FIXTURE: FeedFixture = {
  id: "f-hero",
  home: { name: "Lamashegu Warriors" },
  away: { name: "Kalpohin Stars" },
  homeScore: null,
  awayScore: null,
  status: "scheduled",
  statusLabel: "Saturday, 16:00",
  kickoff: "Sat 16:00",
  meta: "Tamale Central · Kalpohin Park",
};

/** §11.1 "hot" — the one thing happening right now. */
export const LIVE_FIXTURE: FeedFixture = {
  id: "f-live",
  home: { name: "Vittin FC" },
  away: { name: "Sakasaka United" },
  homeScore: 1,
  awayScore: 0,
  status: "live",
  statusLabel: "Live",
  minute: "67'",
  meta: "Tamale Central · Matchday 9",
};

/** §11.1 "verified results". A provisional row is included on purpose. */
export const RECENT_RESULTS: FeedFixture[] = [
  {
    id: "f-1",
    home: { name: "Choggu Rangers" },
    away: { name: "Aboabo FC" },
    homeScore: 2,
    awayScore: 1,
    status: "result_confirmed",
    statusLabel: "Confirmed",
    meta: "Matchday 8",
  },
  {
    id: "f-2",
    home: { name: "Bulpela Athletic" },
    away: { name: "Gumbihini FC" },
    homeScore: 0,
    awayScore: 0,
    status: "result_confirmed",
    statusLabel: "Confirmed",
    meta: "Matchday 8",
  },
  {
    id: "f-3",
    home: { name: "Lamashegu Warriors" },
    away: { name: "Vittin FC" },
    homeScore: 3,
    awayScore: 2,
    status: "awaiting_confirmation",
    statusLabel: "Awaiting confirmation",
    meta: "Matchday 8",
  },
];

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

/** §11.1 "competition updates". Standings are Competition & Rules' output. */
export const ZONE_TABLE: TableRow[] = [
  { position: 1, club: "Lamashegu Warriors", played: 8, won: 6, drawn: 1, lost: 1, goalDifference: 9, points: 19 },
  { position: 2, club: "Vittin FC", played: 8, won: 5, drawn: 2, lost: 1, goalDifference: 6, points: 17 },
  { position: 3, club: "Kalpohin Stars", played: 8, won: 5, drawn: 0, lost: 3, goalDifference: 4, points: 15 },
  { position: 4, club: "Choggu Rangers", played: 8, won: 4, drawn: 1, lost: 3, goalDifference: 1, points: 13 },
  { position: 5, club: "Aboabo FC", played: 8, won: 2, drawn: 3, lost: 3, goalDifference: -2, points: 9 },
];

export type ScorerRow = { name: string; club: string; goals: number };

/** §11.1 "player moments". Verified stats only (Law 9). */
export const TOP_SCORERS: ScorerRow[] = [
  { name: "KAKA", club: "Lamashegu Warriors", goals: 11 },
  { name: "ZOOM", club: "Vittin FC", goals: 9 },
  { name: "SHATTA", club: "Kalpohin Stars", goals: 8 },
];

export type BuzzRow = { id: string; title: string; detail: string };

/** §11.1 "zone pulse". Attention, never respect (Law 8/9). */
export const ZONE_PULSE: BuzzRow[] = [
  {
    id: "b-1",
    title: "Lamashegu vs Kalpohin is pulling a crowd",
    detail: "412 people tracking this match",
  },
  {
    id: "b-2",
    title: "Vittin FC is the most followed club this week",
    detail: "88 new follows in Tamale Central",
  },
  {
    id: "b-3",
    title: "Sakasaka Park is filling up fast",
    detail: "6 bookings in the last two days",
  },
];

/**
 * The nav's score strip, with football in it. On every live page today
 * `<SiteNav>` is passed nothing and the strip renders nothing; this is the
 * only place it has fixtures, and they are invented like everything else here.
 */
export const TICKER_FIXTURES = [
  { id: "t-1", home: "Sakasaka", away: "Choggu", homeScore: 2, awayScore: 2, statusLabel: "HT", minute: null },
  { id: "t-2", home: "Aboabo", away: "Gumani", homeScore: 3, awayScore: 1, statusLabel: "FT", minute: null },
  { id: "t-3", home: "Bantama", away: "Sagnarigu", homeScore: 1, awayScore: 1, statusLabel: null, minute: "82'" },
  { id: "t-4", home: "Tishigu", away: "Kakpagyili", homeScore: 4, awayScore: 2, statusLabel: "FT", minute: null },
  { id: "t-5", home: "Nyohini", away: "Kalpohini", homeScore: 0, awayScore: 1, statusLabel: null, minute: "23'" },
  { id: "t-6", home: "Lamashegu", away: "Vittin", homeScore: 2, awayScore: 1, statusLabel: null, minute: "67'" },
] as const;
