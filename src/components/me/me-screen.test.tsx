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
    expect(screen.getByText(/nothing on your record yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/stats show up when a match you played in is confirmed/i),
    ).toBeInTheDocument();
  });

  it("shows the confidence tier rather than a numeric rating (§14)", () => {
    renderMe();
    expect(screen.getByText("provisional")).toBeInTheDocument();
    expect(
      screen.getByText(/gets stronger with every match we confirm/i),
    ).toBeInTheDocument();
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
