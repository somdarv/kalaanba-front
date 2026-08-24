import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { CreateOutcome } from "./create-outcome";
import { ANNOUNCEMENT_HOLD_MS } from "@/components/ui/wizard";
import type { Club, ClubMeta } from "@/lib/api/club";

/**
 * The two endings, tested directly.
 *
 * The pending ending is not reachable through the wizard yet — the official
 * door is gated until the review path ships — but the API already creates such
 * a club, so the screen that reports it has to be right before the door opens.
 *
 * Every assertion here has to OUTWAIT the announcement: the screen opens on a
 * "Club created" moment that holds for ANNOUNCEMENT_HOLD_MS before the club
 * takes its place (WP-20260824-setup-surface), the same two acts the player
 * reveal runs. Real timers rather than fake ones, matching
 * `player-setup-wizard.test.tsx`.
 */
const REVEAL_TIMEOUT = { timeout: ANNOUNCEMENT_HOLD_MS + 2000 };
const META: ClubMeta = {
  tiers: [{ key: "amateur", label: "A local team" }],
  types: [
    { key: "community", label: "Community club", tier: "amateur" },
    { key: "registered", label: "Registered club", tier: "professional" },
  ],
  name: { min_length: 2, max_length: 120 },
};

const BASE: Club = {
  id: "55555555-5555-4555-8555-555555555555",
  name: "Taha Stars",
  club_type: "community",
  city_hub_id: "33333333-3333-4333-8333-333333333333",
  area_id: "44444444-4444-4444-8444-444444444444",
  crest_url: null,
  maturity_level: "informal",
  verification_state: "not_required",
  verification_source: null,
};

function renderOutcome(club: Club) {
  const onManage = vi.fn();
  const onGoHome = vi.fn();
  render(
    <CreateOutcome
      club={club}
      meta={META}
      onManage={onManage}
      onGoHome={onGoHome}
    />,
  );
  return { onManage, onGoHome };
}

describe("CreateOutcome", () => {
  it("opens on the created moment before it shows the club", async () => {
    renderOutcome(BASE);

    // The tick and its sentence hold the screen alone. The club is not up yet,
    // which is the point of the beat.
    expect(screen.getByText("Club created")).toBeInTheDocument();
    expect(screen.queryByText(/taha stars is live/i)).not.toBeInTheDocument();

    // ...and the moment is transient. It must not still be there afterwards,
    // saying the same thing as the headline that replaced it.
    expect(
      await screen.findByText(/taha stars is live/i, undefined, REVEAL_TIMEOUT),
    ).toBeInTheDocument();
    expect(screen.queryByText("Club created")).not.toBeInTheDocument();
  });

  it("tells a local club it is live and active", async () => {
    renderOutcome(BASE);

    expect(
      await screen.findByText(/taha stars is live/i, undefined, REVEAL_TIMEOUT),
    ).toBeInTheDocument();

    // "Active", not "Owner", and no "You own it." sentence under it: the badge
    // says in one word what the sentence was spending a line on.
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText(/you own it/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Owner")).not.toBeInTheDocument();

    // What kind of club it is sits directly under the name.
    expect(screen.getByText("Community club")).toBeInTheDocument();
  });

  it("never tells a held club it is live", async () => {
    renderOutcome({
      ...BASE,
      name: "Asante Kotoko",
      club_type: "registered",
      maturity_level: "registered",
      verification_state: "pending",
      verification_source: "documents",
    });

    expect(
      await screen.findByText(
        /we are checking your club/i,
        undefined,
        REVEAL_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/nothing shows publicly yet/i)).toBeInTheDocument();
    expect(screen.getByText(/under review/i)).toBeInTheDocument();

    // The one lie this screen must not tell. A claimant who reads "live" will
    // hand the link to their players and none of them will be able to open it.
    expect(screen.queryByText(/is live/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
  });

  it("reads the state off the club, not off what was asked for", async () => {
    // A registered-type club that came back cleared is live, and says so.
    renderOutcome({
      ...BASE,
      name: "Real Tamale Academy",
      club_type: "registered",
      verification_state: "cleared",
    });

    expect(
      await screen.findByText(
        /real tamale academy is live/i,
        undefined,
        REVEAL_TIMEOUT,
      ),
    ).toBeInTheDocument();
  });

  it("labels the club type from the vocabulary", async () => {
    renderOutcome(BASE);

    expect(
      await screen.findByText("Community club", undefined, REVEAL_TIMEOUT),
    ).toBeInTheDocument();
  });
});
