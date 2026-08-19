import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ClubRequestsManager } from "./club-requests-manager";
import * as clubApi from "@/lib/api/club";

vi.mock("@/lib/api/club", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/club")>();
  return {
    ...actual,
    listJoinRequests: vi.fn(),
    decideJoinRequest: vi.fn(),
  };
});

const listJoinRequests = vi.mocked(clubApi.listJoinRequests);
const decideJoinRequest = vi.mocked(clubApi.decideJoinRequest);

const CLUB = {
  id: "029c0365-1c59-49ee-a791-93c29b6b5bd8",
  name: "Bantama Boys",
  club_type: "community",
  city_hub_id: "8c2f9d0a-2c5b-4e3e-9c1e-6a3b1a0e1003",
  area_id: "8c2f9d0a-2c5b-4e3e-9c1e-6a3b1a0e1005",
  crest_url: null,
  maturity_level: "informal",
} as const;

function renderManager() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <ClubRequestsManager club={CLUB} />
    </QueryClientProvider>,
  );
}

describe("ClubRequestsManager", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows pending requests and accepts one", async () => {
    listJoinRequests.mockResolvedValue([
      {
        id: "aff-1111",
        player_id: "p-1111",
        club_id: CLUB.id,
        state: "requested",
        player: { stage_name: "Kaka", primary_position: "forward" },
      },
    ]);
    decideJoinRequest.mockResolvedValue({
      id: "aff-1111",
      player_id: "p-1111",
      club_id: CLUB.id,
      state: "active",
    });
    const user = userEvent.setup();
    renderManager();

    await waitFor(() => expect(screen.getByText("Kaka")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /accept/i }));

    await waitFor(() =>
      expect(decideJoinRequest).toHaveBeenCalledWith(CLUB.id, "aff-1111", true),
    );
  });

  it("shows an empty state with no pending requests", async () => {
    listJoinRequests.mockResolvedValue([]);
    renderManager();

    await waitFor(() =>
      expect(
        screen.getByText(/no pending join requests/i),
      ).toBeInTheDocument(),
    );
  });
});
