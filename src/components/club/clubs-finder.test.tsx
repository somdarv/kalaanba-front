import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ClubsFinder } from "./clubs-finder";
import * as clubApi from "@/lib/api/club";

vi.mock("@/lib/api/club", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/club")>();
  return {
    ...actual,
    listClubsNearby: vi.fn(),
    requestToJoinClub: vi.fn(),
  };
});

const listClubsNearby = vi.mocked(clubApi.listClubsNearby);
const requestToJoinClub = vi.mocked(clubApi.requestToJoinClub);

const AREA = "8c2f9d0a-2c5b-4e3e-9c1e-6a3b1a0e1005";

function makeClub(name: string, type = "community") {
  return {
    id: crypto.randomUUID(),
    name,
    club_type: type,
    city_hub_id: "8c2f9d0a-2c5b-4e3e-9c1e-6a3b1a0e1003",
    area_id: AREA,
    crest_url: null,
    maturity_level: "informal",
  };
}

function renderFinder() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <ClubsFinder areaId={AREA} />
    </QueryClientProvider>,
  );
}

describe("ClubsFinder", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists clubs in the area with a join action", async () => {
    listClubsNearby.mockResolvedValue([
      makeClub("Bantama Boys"),
      makeClub("Aboabo United", "academy"),
    ]);
    renderFinder();

    await waitFor(() =>
      expect(screen.getByText("Bantama Boys")).toBeInTheDocument(),
    );
    expect(screen.getByText("Aboabo United")).toBeInTheDocument();
    expect(screen.getByText(/community club/i)).toBeInTheDocument();

    const joinButtons = screen.getAllByRole("button", {
      name: /request to join/i,
    });
    expect(joinButtons).toHaveLength(2);
    expect(joinButtons[0]).toBeEnabled();
  });

  it("requests to join and reflects the requested state", async () => {
    listClubsNearby.mockResolvedValue([makeClub("Bantama Boys")]);
    requestToJoinClub.mockResolvedValue({
      id: crypto.randomUUID(),
      player_id: crypto.randomUUID(),
      club_id: crypto.randomUUID(),
      state: "requested",
    });
    const user = userEvent.setup();
    renderFinder();

    await waitFor(() =>
      expect(screen.getByText("Bantama Boys")).toBeInTheDocument(),
    );
    await user.click(
      screen.getByRole("button", { name: /request to join/i }),
    );

    await waitFor(() =>
      expect(screen.getByText(/^requested$/i)).toBeInTheDocument(),
    );
    expect(requestToJoinClub).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when no clubs are nearby", async () => {
    listClubsNearby.mockResolvedValue([]);
    renderFinder();

    await waitFor(() =>
      expect(screen.getByText(/no clubs in your area yet/i)).toBeInTheDocument(),
    );
  });
});
