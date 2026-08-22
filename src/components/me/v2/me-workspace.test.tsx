import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastProvider } from "@/components/ui";
import { MeWorkspace } from "./me-workspace";
import * as usePlayer from "@/lib/api/hooks/use-player";
import * as useAuth from "@/lib/api/hooks/use-auth";
import * as useClubs from "@/lib/api/hooks/use-clubs";
import type { MyPlayer, PlayerMeta } from "@/lib/api/player";

vi.mock("@/lib/api/hooks/use-player");
vi.mock("@/lib/api/hooks/use-auth");
vi.mock("@/lib/api/hooks/use-clubs");

const replace = vi.fn();
// `usePathname` too: the screen renders the real <SiteNav>, whose <NavLink>
// reads the path to mark the current item.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => "/me/v2",
}));

const USER = {
  id: "01927f4a-0000-7000-8000-000000000001",
  name: "Abdul Fuseini",
  role: "user",
  area_id: "area-1",
  email: null,
  email_verified_at: null,
  phone_e164_last4: "4567",
};

const META: PlayerMeta = {
  positions: [
    { key: "striker", label: "Striker" },
    { key: "goalkeeper", label: "Goalkeeper" },
  ],
  availability: [
    {
      key: "available",
      label: "Available",
      description: "You can play any week.",
    },
    {
      key: "weekends_only",
      label: "Weekends only",
      description: "Saturdays and Sundays.",
    },
  ],
  availability_default: "available",
  market_statuses: [{ key: "free_agent", label: "Free agent" }],
  preferred_number: { min: 1, max: 99, quick_picks: [7, 9, 10] },
  name: { max_length: 40, stage_name_max_length: 20 },
};

const PLAYER: MyPlayer = {
  id: "01927f4a-0000-7000-8000-000000000002",
  user_id: USER.id,
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
    tier: "provisional",
    confirmed_matches: 0,
    next_tier: "growing",
    matches_to_next_tier: 3,
  },
  record: {
    appearances: 0,
    goals: 0,
    assists: 0,
    minutes: 0,
    yellow_cards: 0,
    red_cards: 0,
  },
};

type PlayerQuery = ReturnType<typeof usePlayer.useMyPlayer>;

function stub({
  user = USER as unknown as ReturnType<typeof useAuth.useUser>["data"],
  player = PLAYER as MyPlayer | null,
}: {
  user?: ReturnType<typeof useAuth.useUser>["data"];
  player?: MyPlayer | null;
} = {}) {
  vi.mocked(useAuth.useUser).mockReturnValue({
    data: user,
    isLoading: false,
  } as unknown as ReturnType<typeof useAuth.useUser>);

  vi.mocked(useAuth.useLogout).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useAuth.useLogout>);

  vi.mocked(usePlayer.usePlayerMeta).mockReturnValue({
    data: META,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof usePlayer.usePlayerMeta>);

  vi.mocked(usePlayer.useMyPlayer).mockReturnValue({
    data: player,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as PlayerQuery);

  vi.mocked(usePlayer.useUpdatePlayer).mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(PLAYER),
    isPending: false,
  } as unknown as ReturnType<typeof usePlayer.useUpdatePlayer>);

  vi.mocked(usePlayer.useUploadPlayerPhoto).mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue(PLAYER),
    isPending: false,
  } as unknown as ReturnType<typeof usePlayer.useUploadPlayerPhoto>);

  vi.mocked(useClubs.useMyClubs).mockReturnValue({
    data: [],
    isLoading: false,
  } as unknown as ReturnType<typeof useClubs.useMyClubs>);
}

function renderWorkspace() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MeWorkspace />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

function rail() {
  return screen.getByRole("navigation", { name: /your profile/i });
}

/** The index pane, which is where every group heading lives. */
function indexPane() {
  return screen.getByRole("region", { name: /your record/i });
}

function railTargets() {
  return within(rail())
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));
}

describe("<MeWorkspace> — the /me/v2 workspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stub();
  });

  it("sends a signed-out visitor to sign in", () => {
    stub({
      user: null as unknown as ReturnType<typeof useAuth.useUser>["data"],
    });
    renderWorkspace();
    expect(replace).toHaveBeenCalledWith("/auth/login");
  });

  it("points every live rail tile at a region that is actually on the page", () => {
    renderWorkspace();

    const targets = railTargets();
    expect(targets.length).toBeGreaterThan(0);

    for (const target of targets) {
      expect(target).toMatch(/^#/);
      expect(document.getElementById(String(target).slice(1))).not.toBeNull();
    }
  });

  it("shows the unbuilt sections dimmed and inert rather than hiding them", () => {
    renderWorkspace();

    // The call site/nav-items.ts made for the main nav, one level down: a rail
    // that drops its unbuilt half tells a player Kalaanba tracks a name and a
    // photo. Nothing unbuilt is reachable by keyboard or by tap.
    for (const label of ["Matches", "RP", "Awards", "Zone"]) {
      const tile = within(rail()).getByText(label);
      expect(tile.closest("[aria-disabled]")).not.toBeNull();
    }

    expect(railTargets()).not.toContain("#me-matches");
  });

  it("collapses a group and says so to a screen reader", async () => {
    const person = userEvent.setup();
    renderWorkspace();

    // Scoped to the pane: the site nav carries an account control of its own,
    // and this test is about the group heading, not that one.
    const toggle = within(indexPane()).getByRole("button", {
      name: /your account/i,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/ends in 4567/i)).toBeInTheDocument();

    await person.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/ends in 4567/i)).not.toBeInTheDocument();
  });

  it("keeps the confidence tier in one place and off the card (§14)", () => {
    renderWorkspace();

    // Once, not twice. The card carries the verified counters (§13); the
    // featured tile carries the ladder those counters climb, and the two sets
    // never overlap. v1 deleted a whole record block over exactly this.
    expect(screen.getAllByText("provisional")).toHaveLength(1);
    expect(screen.getByText(/every match we confirm/i)).toBeInTheDocument();
    // §14: no numeric rating anywhere on the surface.
    expect(screen.queryByText(/rating/i)).not.toBeInTheDocument();
  });

  it("shows the ladder without repeating the counters printed on the card", () => {
    renderWorkspace();

    expect(screen.getByText(/matches to go/i)).toBeInTheDocument();
    expect(screen.getByText(/matches confirmed/i)).toBeInTheDocument();

    // A row of zeroes at display scale reads as a verdict on the player rather
    // than as a season that has not started.
    expect(screen.queryByText("GAMES")).not.toBeInTheDocument();
    expect(screen.queryByText("Assists")).not.toBeInTheDocument();
  });

  it("offers to create a card when there is no player, without redirecting", () => {
    stub({ player: null });
    renderWorkspace();

    expect(
      screen.getByRole("heading", { name: /make your player card/i }),
    ).toBeInTheDocument();

    // The no-card state is legitimate (§22), not a trapdoor into the wizard:
    // the account half still renders and nothing redirects.
    expect(
      within(indexPane()).getByRole("button", { name: /your account/i }),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();

    // The rail keeps its shape and goes inert, so the surface is the same
    // object before and after a card exists.
    expect(railTargets()).toEqual(["#me-account"]);
  });
});
