import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { CreateOutcome } from "./create-outcome";
import type { Club, ClubMeta } from "@/lib/api/club";

/**
 * The two endings, tested directly.
 *
 * The pending ending is not reachable through the wizard yet — the official
 * door is gated until the review path ships — but the API already creates such
 * a club, so the screen that reports it has to be right before the door opens.
 */
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
  it("tells a local club it is live and owned", () => {
    renderOutcome(BASE);

    expect(screen.getByText(/taha stars is live/i)).toBeInTheDocument();
    expect(screen.getByText(/you own it/i)).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("never tells a held club it is live", () => {
    renderOutcome({
      ...BASE,
      name: "Asante Kotoko",
      club_type: "registered",
      maturity_level: "registered",
      verification_state: "pending",
      verification_source: "documents",
    });

    expect(screen.getByText(/we are checking your club/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing shows publicly yet/i)).toBeInTheDocument();
    expect(screen.getByText(/under review/i)).toBeInTheDocument();

    // The one lie this screen must not tell. A claimant who reads "live" will
    // hand the link to their players and none of them will be able to open it.
    expect(screen.queryByText(/is live/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/you own it/i)).not.toBeInTheDocument();
  });

  it("reads the state off the club, not off what was asked for", () => {
    // A registered-type club that came back cleared is live, and says so.
    renderOutcome({
      ...BASE,
      name: "Real Tamale Academy",
      club_type: "registered",
      verification_state: "cleared",
    });

    expect(
      screen.getByText(/real tamale academy is live/i),
    ).toBeInTheDocument();
  });

  it("labels the club type from the vocabulary", () => {
    renderOutcome(BASE);

    expect(screen.getByText("Community club")).toBeInTheDocument();
  });
});
