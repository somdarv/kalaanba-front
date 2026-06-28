import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastProvider } from "@/components/ui";
import { AreaOnboarding } from "./area-onboarding";
import * as useZone from "@/lib/api/hooks/use-zone";
import * as useAuth from "@/lib/api/hooks/use-auth";

vi.mock("@/lib/api/hooks/use-zone");
vi.mock("@/lib/api/hooks/use-auth");

const HUBS = [{ id: "hub-1", name: "Tamale City Hub", region: "Northern Region" }];
const AREAS = [
  { id: "area-1", name: "Taha", city_hub_id: "hub-1" },
  { id: "area-2", name: "Kukuo", city_hub_id: "hub-1" },
];

const mutateAsync = vi.fn().mockResolvedValue({ id: "u1", area_id: "area-1" });
const suggestMutate = vi.fn().mockResolvedValue({ id: "s1", status: "pending" });

function stubHooks() {
  vi.mocked(useZone.useHubs).mockReturnValue({
    data: HUBS,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useZone.useHubs>);
  vi.mocked(useZone.useAreas).mockReturnValue({
    data: AREAS,
    isLoading: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useZone.useAreas>);
  vi.mocked(useZone.useSuggestArea).mockReturnValue({
    mutateAsync: suggestMutate,
    isPending: false,
  } as unknown as ReturnType<typeof useZone.useSuggestArea>);
  vi.mocked(useAuth.useUpdateProfile).mockReturnValue({
    mutateAsync,
    isPending: false,
  } as unknown as ReturnType<typeof useAuth.useUpdateProfile>);
}

function renderOnboarding(onDone = vi.fn()) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <AreaOnboarding onDone={onDone} />
      </ToastProvider>
    </QueryClientProvider>,
  );
  return { onDone };
}

describe("<AreaOnboarding> — post-signup area capture (WP-20260625)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubHooks();
  });

  it("shows the hub + area pickers and a skip affordance", () => {
    renderOnboarding();
    expect(screen.getByText("Where do you play?")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "City Hub" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Area" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Skip for now" }),
    ).toBeInTheDocument();
  });

  it("skips without writing a profile update", async () => {
    const user = userEvent.setup();
    const { onDone } = renderOnboarding();

    await user.click(screen.getByRole("button", { name: "Skip for now" }));

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("saves the chosen area via PATCH /users/me then finishes", async () => {
    const user = userEvent.setup();
    const { onDone } = renderOnboarding();

    await user.click(screen.getByRole("combobox", { name: "City Hub" }));
    await user.click(screen.getByRole("option", { name: /Tamale City Hub/ }));

    await user.click(screen.getByRole("combobox", { name: "Area" }));
    await user.click(screen.getByRole("option", { name: "Taha" }));

    await user.click(screen.getByRole("button", { name: "Save and continue" }));

    expect(mutateAsync).toHaveBeenCalledWith({ area_id: "area-1" });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("offers the suggest path once a hub is chosen", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    // No hub yet — no suggest affordance.
    expect(
      screen.queryByRole("button", { name: /suggest it/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "City Hub" }));
    await user.click(screen.getByRole("option", { name: /Tamale City Hub/ }));

    expect(
      screen.getByRole("button", { name: /suggest it/i }),
    ).toBeInTheDocument();
  });
});
