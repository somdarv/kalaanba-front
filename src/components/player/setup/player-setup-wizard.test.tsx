import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PlayerSetupWizard } from "./player-setup-wizard";
import { ApiError } from "@/lib/api/envelope";
import * as playerApi from "@/lib/api/player";
import type { PlayerMeta } from "@/lib/api/player";

vi.mock("@/lib/api/player", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/player")>();
  return { ...actual, createPlayer: vi.fn() };
});

const createPlayer = vi.mocked(playerApi.createPlayer);

/**
 * Stands in for the config-served vocabulary (ADR-0007). Deliberately NOT the
 * shipped defaults — the range is 1–50 and there is a fifth position key — so
 * a test that passes here proves the flow reads config rather than assuming
 * the V1 values.
 */
const META: PlayerMeta = {
  positions: [
    { key: "goalkeeper", label: "Goalkeeper" },
    { key: "defender", label: "Defender" },
    { key: "midfielder", label: "Midfielder" },
    { key: "winger", label: "Winger" },
    { key: "forward", label: "Forward" },
  ],
  availability: [
    {
      key: "available",
      label: "Available to play",
      description: "Clubs see you as ready.",
    },
    { key: "unknown", label: "Not sure yet" },
  ],
  availability_default: "unknown",
  market_statuses: [{ key: "free_agent", label: "Free agent" }],
  preferred_number: { min: 1, max: 50, quick_picks: [7, 9, 10] },
  name: { max_length: 80, stage_name_max_length: 40 },
};

const CREATED: playerApi.Player = {
  id: "11111111-1111-4111-8111-111111111111",
  user_id: "22222222-2222-4222-8222-222222222222",
  first_name: "Abdul",
  last_name: "Rahman",
  stage_name: "Kaka",
  preferred_number: 10,
  primary_position: "winger",
  availability_status: "available",
  market_status: "free_agent",
  claim_status: "claimed",
  headshot_url: null,
};

type User = ReturnType<typeof userEvent.setup>;

function renderWizard() {
  const onDone = vi.fn();
  const onExit = vi.fn();
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <PlayerSetupWizard
        meta={META}
        defaults={{ firstName: "Abdul", lastName: "Rahman" }}
        onExit={onExit}
        onDone={onDone}
      />
    </QueryClientProvider>,
  );
  return { onDone, onExit };
}

const nextStep = () => screen.getByRole("button", { name: /next step/i });
const skip = () => screen.getByRole("button", { name: /skip for now/i });

// Each helper leaves the flow parked on the named step, waiting for it to
// finish animating in before returning.
async function reachStageName(user: User) {
  await user.click(nextStep());
  return screen.findByLabelText(/football name/i);
}

async function reachNumber(user: User, stageName = "Kaka") {
  const field = await reachStageName(user);
  await user.type(field, stageName);
  await user.click(nextStep());
  await screen.findByRole("button", { name: "10" });
}

async function reachPosition() {
  return screen.findByRole("radio", { name: /winger/i });
}

async function reachAvailability() {
  return screen.findByRole("button", { name: /available to play/i });
}

describe("PlayerSetupWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
  });

  it("collects each answer one step at a time and submits them together", async () => {
    createPlayer.mockResolvedValue(CREATED);
    const user = userEvent.setup();
    renderWizard();

    // Step 1 arrives prefilled from the account name.
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Abdul");

    await reachNumber(user);

    // A quick pick confirms and advances on its own.
    await user.click(screen.getByRole("button", { name: "10" }));
    await reachPosition();

    // The pitch renders every configured position, not a fixed four.
    expect(screen.getAllByRole("radio")).toHaveLength(META.positions.length);
    await user.click(screen.getByRole("radio", { name: /winger/i }));

    // The last question waits for a deliberate press rather than a timer.
    const available = await reachAvailability();
    await user.click(available);
    await user.click(screen.getByRole("button", { name: /create my profile/i }));

    await waitFor(() => expect(createPlayer).toHaveBeenCalledTimes(1));
    // TanStack Query hands `mutationFn` a second context argument; the
    // payload we care about is the first.
    expect(createPlayer.mock.calls[0]?.[0]).toEqual({
      first_name: "Abdul",
      last_name: "Rahman",
      stage_name: "Kaka",
      preferred_number: 10,
      primary_position: "winger",
      availability_status: "available",
    });
  });

  it("will not advance past a question it still needs answered", async () => {
    const user = userEvent.setup();
    renderWizard();
    await reachStageName(user);

    await user.click(nextStep());

    expect(
      await screen.findByText(/enter the name they call you/i),
    ).toBeInTheDocument();
    // Still on the same step — the number grid never appeared.
    expect(screen.queryByRole("button", { name: "10" })).not.toBeInTheDocument();
    expect(createPlayer).not.toHaveBeenCalled();
  });

  it("bounds the shirt number by the served config range, not a hardcoded one", async () => {
    const user = userEvent.setup();
    renderWizard();
    await reachNumber(user);

    await user.click(screen.getByRole("button", { name: /another number/i }));
    await user.type(await screen.findByLabelText(/your number/i), "77");
    await user.click(nextStep());

    // 77 is legal under the V1 default of 1–99 and illegal under this config.
    expect(
      await screen.findByText(/pick a number between 1 and 50/i),
    ).toBeInTheDocument();
  });

  it("leaves the optional answers null when they are skipped", async () => {
    createPlayer.mockResolvedValue({ ...CREATED, preferred_number: null });
    const user = userEvent.setup();
    renderWizard();
    await reachNumber(user);

    await user.click(skip());
    await reachPosition();
    await user.click(skip());

    await user.click(await reachAvailability());
    await user.click(screen.getByRole("button", { name: /create my profile/i }));

    await waitFor(() => expect(createPlayer).toHaveBeenCalledTimes(1));
    expect(createPlayer.mock.calls[0]?.[0]).toMatchObject({
      preferred_number: null,
      primary_position: null,
    });
  });

  it("returns a rejected field to the step that owns it", async () => {
    createPlayer.mockRejectedValue(
      new ApiError(422, "player.profile.stage_name_invalid", "Invalid", {
        stage_name: ["That football name is already taken."],
      }),
    );
    const user = userEvent.setup();
    renderWizard();
    await reachNumber(user);
    await user.click(skip());
    await reachPosition();
    await user.click(skip());
    await user.click(await reachAvailability());
    await user.click(screen.getByRole("button", { name: /create my profile/i }));

    // Back on step 2, with the server's reason attached to the field.
    expect(
      await screen.findByText(/that football name is already taken/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/football name/i)).toHaveValue("Kaka");
  });

  it("reveals the saved player, labelled from config", async () => {
    createPlayer.mockResolvedValue(CREATED);
    const user = userEvent.setup();
    const { onDone } = renderWizard();
    await reachNumber(user);
    await user.click(screen.getByRole("button", { name: "10" }));
    await reachPosition();
    await user.click(screen.getByRole("radio", { name: /winger/i }));
    await user.click(await reachAvailability());
    await user.click(screen.getByRole("button", { name: /create my profile/i }));

    expect(await screen.findByText(/you're on the record/i)).toBeInTheDocument();
    // "Winger" and "Free agent" both come from the served label maps.
    expect(screen.getAllByText("Winger").length).toBeGreaterThan(0);
    expect(screen.getByText("Free agent")).toBeInTheDocument();
    // Nothing computed: a brand-new card carries no stats or rating (§13/§14).
    expect(screen.queryByText(/rating/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /find a club/i }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("clears the draft once the profile exists", async () => {
    createPlayer.mockResolvedValue(CREATED);
    const user = userEvent.setup();
    renderWizard();

    await reachNumber(user);
    expect(window.sessionStorage.getItem("kx:player-setup:draft")).toContain(
      "Kaka",
    );

    await user.click(screen.getByRole("button", { name: "10" }));
    await reachPosition();
    await user.click(screen.getByRole("radio", { name: /winger/i }));
    await user.click(await reachAvailability());
    await user.click(screen.getByRole("button", { name: /create my profile/i }));

    await screen.findByText(/you're on the record/i);
    expect(window.sessionStorage.getItem("kx:player-setup:draft")).toBeNull();
  });
});
