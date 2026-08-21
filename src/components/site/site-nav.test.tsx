import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SiteNav } from "./site-nav";
import { PRIMARY_NAV } from "./nav-items";
import type { TickerFixture } from "./score-ticker";
import * as useAuth from "@/lib/api/hooks/use-auth";
import * as useZone from "@/lib/api/hooks/use-zone";
import * as useFixtures from "@/lib/api/hooks/use-fixtures";

vi.mock("@/lib/api/hooks/use-auth");
vi.mock("@/lib/api/hooks/use-zone");
vi.mock("@/lib/api/hooks/use-fixtures");
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

const HUBS = [
  { id: "hub-1", name: "Tamale", region: "Northern Region" },
  { id: "hub-2", name: "Accra", region: "Greater Accra" },
];

function stubSession(user: { id: string; name: string } | null) {
  vi.mocked(useAuth.useUser).mockReturnValue({
    data: user,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useAuth.useUser>);
  vi.mocked(useAuth.useLogout).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useAuth.useLogout>);
}

function renderNav(fixtures: readonly TickerFixture[] = []) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <SiteNav fixtures={fixtures} />
    </QueryClientProvider>,
  );
}

describe("<SiteNav>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.mocked(useZone.useHubs).mockReturnValue({
      data: HUBS,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useZone.useHubs>);
    // Stubbed empty so a test that does not care about the strip does not get
    // one from the seed. The two ticker tests below pass fixtures explicitly.
    vi.mocked(useFixtures.useTickerFixtures).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useFixtures.useTickerFixtures>);
  });

  it("offers ONE way in when signed out, and an account when signed in", async () => {
    stubSession(null);
    const { unmount } = renderNav();
    expect(screen.getByRole("link", { name: "Get in" })).toBeInTheDocument();
    // ADR-0004 made the entry screen neutral, so a separate "Sign in" would
    // put the new-vs-returning question back at the front door.
    expect(screen.queryByRole("link", { name: /^sign in$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /abdul/i })).not.toBeInTheDocument();
    unmount();

    stubSession({ id: "u1", name: "Abdul Rahman" });
    renderNav();
    // Never both: a nav offering an account and a sign-up at once does not
    // know who it is talking to.
    expect(screen.queryByRole("link", { name: "Get in" })).not.toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /abdul/i })).toBeInTheDocument();
  });

  it("renders unbuilt destinations as inert text, never as dead links", () => {
    stubSession(null);
    renderNav();

    const unbuilt = PRIMARY_NAV.filter((item) => item.href === null);
    expect(unbuilt.length).toBeGreaterThan(0);
    for (const item of unbuilt) {
      // Present, so the nav still shows the shape of the product...
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0);
      // ...but never a link, so it can never 404.
      expect(
        screen.queryByRole("link", { name: new RegExp(`^${item.label}$`, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("links the destinations that exist", () => {
    stubSession(null);
    renderNav();

    const clubs = PRIMARY_NAV.find((item) => item.key === "clubs");
    expect(clubs?.href).toBe("/clubs/near-you");
    expect(
      screen.getAllByRole("link", { name: /^clubs$/i }).length,
    ).toBeGreaterThan(0);
  });

  it("hides the score ticker when there is no football", () => {
    stubSession(null);
    renderNav([]);

    // Law 3. There is no match endpoint, so the strip has nothing true to say
    // and says nothing rather than something invented.
    expect(
      screen.queryByRole("region", { name: /latest scores/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the score ticker once fixtures are passed", () => {
    stubSession(null);
    renderNav([
      {
        id: "f1",
        home: "Aboabo",
        away: "Gumani",
        homeScore: 3,
        awayScore: 1,
        statusLabel: "FT",
        minute: null,
      },
    ]);

    const ticker = screen.getByRole("region", { name: /latest scores/i });
    // The list is rendered twice on purpose: the track slides exactly -50%, so
    // the second copy is what makes the loop close without a seam. The copy is
    // aria-hidden, so a screen reader still hears each score once.
    expect(within(ticker).getAllByText(/3\s*-\s*1/)).toHaveLength(2);
    expect(within(ticker).getAllByText("FT")).toHaveLength(2);
  });

  it("lets a visitor change the hub they are browsing", async () => {
    const user = userEvent.setup();
    stubSession(null);
    renderNav();

    // Two pickers exist, one per breakpoint row. Only one is ever in the
    // accessibility tree in a browser (the other is `display:none`), but jsdom
    // applies no media queries, so the test picks the first deliberately.
    const [trigger] = screen.getAllByRole("button", { name: /tamale/i });
    await user.click(trigger);
    await user.click(screen.getAllByRole("option", { name: /accra/i })[0]);

    expect(
      screen.getAllByRole("button", { name: /accra/i }).length,
    ).toBeGreaterThan(0);
    // Persisted, so it survives the next page the visitor opens.
    expect(window.localStorage.getItem("kx:browsing-hub")).toBe("hub-2");
  });

  it("opens the mobile menu with the same destinations as the desktop row", async () => {
    const user = userEvent.setup();
    stubSession(null);
    renderNav();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const sheet = await screen.findByRole("dialog");
    for (const item of PRIMARY_NAV) {
      expect(within(sheet).getByText(item.label)).toBeInTheDocument();
    }
  });
});
