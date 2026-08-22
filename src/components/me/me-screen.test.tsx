import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastProvider } from "@/components/ui";
import { MeScreen } from "./me-screen";
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
  usePathname: () => "/me",
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
    { key: "available", label: "Available", description: "You can play any week." },
    { key: "weekends_only", label: "Weekends only", description: "Saturdays and Sundays." },
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

const mutate = vi.fn();

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

  // Both the nav's account menu and the account block sign out through this.
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
    mutate,
    mutateAsync: vi.fn().mockResolvedValue(PLAYER),
    isPending: false,
  } as unknown as ReturnType<typeof usePlayer.useUpdatePlayer>);

  vi.mocked(useClubs.useMyClubs).mockReturnValue({
    data: [],
    isLoading: false,
  } as unknown as ReturnType<typeof useClubs.useMyClubs>);
}

function renderMe() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MeScreen />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe("<MeScreen> — the /me surface (WP-20260821)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stub();
  });

  it("sends a signed-out visitor to sign in", () => {
    stub({ user: null as unknown as ReturnType<typeof useAuth.useUser>["data"] });
    renderMe();
    expect(replace).toHaveBeenCalledWith("/auth/login");
  });

  it("offers to create a card when the account has no player profile, without redirecting", () => {
    stub({ player: null });
    renderMe();

    expect(
      screen.getByRole("heading", { name: /make your player card/i }),
    ).toBeInTheDocument();
    // The no-card state is a legitimate state (§22), not a trapdoor into the
    // wizard: the account half must still render and nothing may redirect.
    expect(screen.getByText(/your account/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("names the gate instead of showing a row of zeros for an empty record", () => {
    renderMe();
    // On the card itself now. The separate record block is gone: the card is
    // tall enough to carry the full §13 set, so a block repeating the same
    // counters was saying one thing twice on one screen.
    expect(
      screen.getByText(/stats show up when a match you played in is confirmed/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Games")).not.toBeInTheDocument();
    expect(screen.queryByText("Assists")).not.toBeInTheDocument();
  });

  it("keeps the confidence tier off the card and in its own block (§14)", () => {
    renderMe();

    // Once, not twice. The tier reads as a claim about whether the stats are
    // verified, and on this platform every stat already is — only confirmed
    // matches reach a record at all (§13). On the card that made it look like
    // a caveat on figures that carry none. The block below keeps it, where it
    // is what it actually measures: how much record stands behind the card.
    expect(screen.getAllByText("provisional")).toHaveLength(1);

    expect(
      screen.getByText(/gets stronger with every match we confirm/i),
    ).toBeInTheDocument();
    // §14: no numeric rating anywhere on the surface.
    expect(screen.queryByText(/rating/i)).not.toBeInTheDocument();
  });

  it("carries the full verified record on the card once matches are confirmed", () => {
    stub({
      player: {
        ...PLAYER,
        record: {
          ...PLAYER.record,
          appearances: 12,
          goals: 5,
          assists: 3,
          minutes: 940,
          starts: 10,
          yellow_cards: 2,
          red_cards: 1,
          player_of_the_match: 2,
        },
      },
    });
    renderMe();

    // META ships no `card_featured_stats`, so the lead falls back to the three
    // §15 names rather than to nothing.
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    // §13's wider set follows underneath rather than being dropped.
    expect(screen.getByText("Starts")).toBeInTheDocument();
    expect(screen.getByText("940")).toBeInTheDocument();
    // One disciplinary line, never two counters.
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("2Y, 1R")).toBeInTheDocument();
    expect(screen.queryByText("Yellows")).not.toBeInTheDocument();
    // A verified match award, so it may appear as a §15 badge.
    expect(screen.getByText(/player of the match/i)).toBeInTheDocument();
  });

  it("leads with the counters the position is judged on (Law 2)", () => {
    vi.mocked(usePlayer.usePlayerMeta).mockReturnValue({
      data: {
        ...META,
        positions: [{ key: "goalkeeper", label: "Goalkeeper" }],
        card_featured_stats: {
          goalkeeper: ["appearances", "clean_sheets", "minutes"],
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePlayer.usePlayerMeta>);

    vi.mocked(usePlayer.useMyPlayer).mockReturnValue({
      data: {
        ...PLAYER,
        primary_position: "goalkeeper",
        record: {
          ...PLAYER.record,
          appearances: 20,
          goals: 0,
          assists: 1,
          minutes: 1800,
          clean_sheets: 9,
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as PlayerQuery);

    renderMe();

    // A keeper is not judged on goals. Clean sheets take the middle slot from
    // config, and nothing is hidden by the swap: goals and assists move to the
    // strip rather than disappearing.
    expect(screen.getByText("Clean sheets")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("Assists")).toBeInTheDocument();
  });

  it("drops record fields the API has not sent rather than rendering them blank", () => {
    stub({
      player: {
        ...PLAYER,
        // `starts` and `player_of_the_match` are additive on the contract, so
        // an API predating them omits both (§7).
        record: { ...PLAYER.record, appearances: 4, goals: 1, assists: 0 },
      },
    });
    renderMe();

    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.queryByText("Starts")).not.toBeInTheDocument();
    expect(screen.queryByText(/player of the match/i)).not.toBeInTheDocument();
  });

  it("names the player's status on the card without a legend (§15)", () => {
    renderMe();

    // Position, market status and availability resolved from the config-served
    // label maps (ADR-0007), never compiled in. `getAllByText` because the
    // availability control below the card offers the same words as options.
    expect(screen.getAllByText("Striker").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Free agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Available").length).toBeGreaterThanOrEqual(1);
  });

  it("gives the shirt number an accessible name, since it renders as a bare numeral", () => {
    renderMe();
    expect(screen.getByLabelText("Shirt number 10")).toBeInTheDocument();
  });

  it("writes availability on a single tap", async () => {
    const user = userEvent.setup();
    renderMe();

    await user.click(screen.getByRole("button", { name: "Weekends only" }));

    expect(mutate).toHaveBeenCalledWith(
      { availability_status: "weekends_only" },
      expect.anything(),
    );
  });

  it("does not re-write the availability already set", async () => {
    const user = userEvent.setup();
    renderMe();

    await user.click(screen.getByRole("button", { name: "Available" }));

    expect(mutate).not.toHaveBeenCalled();
  });

  it("points a free agent at the club finder", () => {
    renderMe();
    const find = screen.getByRole("link", { name: /find a club/i });
    expect(find).toHaveAttribute("href", "/clubs/near-you");
  });

  it("keeps share visible but disabled until the public card ships", () => {
    renderMe();
    expect(screen.getByRole("button", { name: /share card/i })).toBeDisabled();
    expect(screen.getByText(/sharing your card is coming next/i)).toBeInTheDocument();
  });
});
