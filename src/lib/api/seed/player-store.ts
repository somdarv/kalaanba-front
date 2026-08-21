"use client";

import type { MyPlayer, UpdatePlayerInput } from "../player";

/**
 * The seeded player record, and the session-local store that makes it writable.
 *
 * PRODUCT.md §3.2 specifies both halves: data access goes through the api
 * client, and "mutations persist to `localStorage` for the user's session,
 * hydrate on load". That is what lets `/me` ship a working availability control
 * and a working details sheet before `PATCH /players/{id}` exists — the write
 * lands somewhere real, survives a reload, and swaps to the endpoint later
 * without any caller changing.
 *
 * Nothing here is reachable unless `IS_SEED_ENABLED` (see `src/lib/env.ts`).
 * The gate lives in `lib/api/player.ts` at the call site rather than in this
 * file, so this module stays a plain store and the branch is visible where the
 * decision is made.
 *
 * Names are the Tamale localities already used by `seed/tamale-seed.ts`
 * (PRODUCT.md §11), so the two seeds describe one town rather than two.
 *
 * **The football is invented.** Appearances, goals, assists and minutes below
 * are made up, which is exactly why Player & Affiliation §13 forbids them
 * reaching a real profile and why the surface stamps a "Demo data" chip on the
 * block whenever this is in play.
 */

const STORE_KEY = "kalaanba-seed-player";

/** The record as it stands before the session edits anything. */
const SEED_PLAYER: MyPlayer = {
  id: "01927f4a-0000-7000-8000-00000000p1ay",
  user_id: "",
  first_name: "Abdul",
  last_name: "Fuseini",
  stage_name: "Baba",
  preferred_number: 10,
  primary_position: "striker",
  availability_status: "available",
  market_status: "free_agent",
  claim_status: "claimed",
  headshot_url: null,
  archived_at: null,
  confidence: {
    tier: "growing",
    confirmed_matches: 5,
    next_tier: "verified",
    matches_to_next_tier: 5,
  },
  record: {
    appearances: 5,
    goals: 3,
    assists: 2,
    minutes: 412,
    yellow_cards: 1,
    red_cards: 0,
  },
};

function canPersist(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

/**
 * Read the stored overrides. A malformed entry is discarded rather than thrown:
 * a corrupt demo store must not be able to take down the surface it exists to
 * make workable.
 */
function readOverrides(): Partial<MyPlayer> {
  if (!canPersist()) return {};
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Partial<MyPlayer>;
  } catch {
    return {};
  }
}

function writeOverrides(next: Partial<MyPlayer>): void {
  if (!canPersist()) return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing, quota, disabled storage. The in-memory result of the
    // write is already correct; only its durability is lost, and a demo store
    // is not worth surfacing an error for.
  }
}

/**
 * The seeded player as it currently stands, with any session edits applied.
 *
 * `userId` is stamped in rather than seeded so the record belongs to whoever is
 * signed in. The seed describes a player, not an account.
 */
export function readSeedPlayer(userId: string): MyPlayer {
  return { ...SEED_PLAYER, ...readOverrides(), user_id: userId };
}

/**
 * Apply a patch and persist it.
 *
 * Only the fields `PATCH /players/{id}` accepts are written. `market_status`,
 * `claim_status`, `confidence` and `record` are backend-derived (Constitution
 * Law 3) — letting the demo store edit them would teach the surface a shape the
 * real endpoint will refuse.
 */
export function writeSeedPlayer(
  userId: string,
  patch: UpdatePlayerInput,
): MyPlayer {
  const merged: Partial<MyPlayer> = { ...readOverrides() };

  if (patch.first_name !== undefined) merged.first_name = patch.first_name;
  if (patch.last_name !== undefined) merged.last_name = patch.last_name;
  if (patch.stage_name !== undefined) merged.stage_name = patch.stage_name;
  if (patch.preferred_number !== undefined) {
    merged.preferred_number = patch.preferred_number;
  }
  if (patch.primary_position !== undefined) {
    merged.primary_position = patch.primary_position;
  }
  if (patch.availability_status !== undefined) {
    merged.availability_status = patch.availability_status;
  }
  if (patch.headshot_url !== undefined) {
    merged.headshot_url = patch.headshot_url;
  }

  writeOverrides(merged);
  return { ...SEED_PLAYER, ...merged, user_id: userId };
}

/** Drop session edits and go back to the seed. Used by tests. */
export function resetSeedPlayer(): void {
  if (!canPersist()) return;
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    // See writeOverrides.
  }
}
