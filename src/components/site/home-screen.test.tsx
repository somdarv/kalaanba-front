import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HomeScreen } from "./home-screen";
import * as useAuth from "@/lib/api/hooks/use-auth";
import * as useClubs from "@/lib/api/hooks/use-clubs";
import * as useZone from "@/lib/api/hooks/use-zone";

vi.mock("@/lib/api/hooks/use-auth");
vi.mock("@/lib/api/hooks/use-clubs");
vi.mock("@/lib/api/hooks/use-zone");

// The nav renders inside the home, so the router hooks it uses have to exist.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

const CLUBS = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Lamashegu Warriors",
    club_type: "community",
    city_hub_id: "22222222-2222-4222-8222-222222222222",
    area_id: "33333333-3333-4333-8333-333333333333",
    crest_url: null,
    maturity_level: "informal",
  },
];

type SessionUser = { id: string; name: string; area_id?: string | null };

function stubSession(user: SessionUser | null, isLoading = false) {
  vi.mocked(useAuth.useUser).mockReturnValue({
    data: user,
    isLoading,
    isError: false,
  } as unknown as ReturnType<typeof useAuth.useUser>);
}

function stubClubs(clubs: typeof CLUBS | undefined) {
  vi.mocked(useClubs.useClubsNearby).mockReturnValue({
    data: clubs,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useClubs.useClubsNearby>);
}

function stubHubs() {
  vi.mocked(useZone.useHubs).mockReturnValue({
    data: [{ id: "hub-1", name: "Tamale", region: "Northern Region" }],
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useZone.useHubs>);
}

// Auto-mocking the whole use-auth module stubs useLogout to undefined, and the
// account menu reads `.isPending` off it the moment a session exists.
function stubLogout() {
  vi.mocked(useAuth.useLogout).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useAuth.useLogout>);
}

function renderHome() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <HomeScreen />
    </QueryClientProvider>,
  );
}

describe("<HomeScreen> — the open home (JOURNAL 2026-06-26)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    stubClubs(CLUBS);
    stubHubs();
    stubLogout();
  });

  it("serves a signed-out visitor the page, not a login wall", () => {
    stubSession(null);
    renderHome();

    // The decision this guards: login is a personalisation layer, never a
    // front door. A signed-out visitor gets the pitch and one neutral way in,
    // and is never bounced to /auth.
    expect(
      screen.getByRole("heading", { name: /your game, on the record/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Get in" }).length).toBeGreaterThan(0);
  });

  it("does not ask a stranger to set an area", () => {
    stubSession(null);
    renderHome();

    expect(screen.queryByText(/set your area/i)).not.toBeInTheDocument();
  });

  it("asks a signed-in user without an area to set one", () => {
    stubSession({ id: "u1", name: "Abdul", area_id: null });
    renderHome();

    expect(screen.getByText(/set your area/i)).toBeInTheDocument();
    // Nothing to scope clubs to, so the rail stays away rather than showing
    // an empty state the user cannot act on.
    expect(
      screen.queryByRole("heading", { name: /clubs near you/i }),
    ).not.toBeInTheDocument();
  });

  it("shows clubs once the user has an area", () => {
    stubSession({
      id: "u1",
      name: "Abdul",
      area_id: "33333333-3333-4333-8333-333333333333",
    });
    renderHome();

    expect(
      screen.getByRole("heading", { name: /clubs near you/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lamashegu Warriors")).toBeInTheDocument();
  });

  it("keeps the pitch dismissed once it has been dismissed", async () => {
    const user = userEvent.setup();
    stubSession(null);
    const { unmount } = renderHome();

    await user.click(screen.getByRole("button", { name: /hide this/i }));
    expect(
      screen.queryByRole("heading", { name: /your game, on the record/i }),
    ).not.toBeInTheDocument();

    // It has to survive a remount, otherwise it is a toggle rather than a
    // dismissal and the visitor gets the pitch again on every visit.
    unmount();
    renderHome();
    expect(
      screen.queryByRole("heading", { name: /your game, on the record/i }),
    ).not.toBeInTheDocument();
  });

  it("shows no invented football", () => {
    stubSession({
      id: "u1",
      name: "Abdul",
      area_id: "33333333-3333-4333-8333-333333333333",
    });
    renderHome();

    // Law 3. The feed slot carries discovery until an engine can serve
    // activity; a score or a table here would be the frontend inventing truth.
    expect(screen.queryByText(/standing/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+\s*-\s*\d+/)).not.toBeInTheDocument();
  });
});
