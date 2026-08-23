import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastProvider } from "@/components/ui";
import { ClubCreateWizard } from "./club-create-wizard";
import { ApiError } from "@/lib/api/envelope";
import * as clubApi from "@/lib/api/club";
import type { Club, ClubMeta } from "@/lib/api/club";
import * as zoneApi from "@/lib/api/zone";

vi.mock("@/lib/api/club", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/club")>();
  return { ...actual, createClub: vi.fn(), uploadClubCrest: vi.fn() };
});

vi.mock("@/lib/api/zone", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/zone")>();
  return { ...actual, listHubs: vi.fn(), listAreas: vi.fn() };
});

const createClub = vi.mocked(clubApi.createClub);
const uploadClubCrest = vi.mocked(clubApi.uploadClubCrest);
const listHubs = vi.mocked(zoneApi.listHubs);
const listAreas = vi.mocked(zoneApi.listAreas);

const HUB_ID = "33333333-3333-4333-8333-333333333333";
const AREA_ID = "44444444-4444-4444-8444-444444444444";

/**
 * Stands in for the config-served vocabulary (ADR-0007). Deliberately NOT the
 * shipped defaults: the tier keys carry different labels, there is a club type
 * ("ladies") that does not exist in `club.types`, and the name bounds are 3..40
 * rather than 2..120. A test that passes here proves the flow reads the
 * vocabulary rather than assuming the V1 values.
 */
const META: ClubMeta = {
  tiers: [
    {
      key: "amateur",
      label: "A neighbourhood team",
      description: "Friends or a community side.",
    },
    {
      key: "professional",
      label: "A registered club",
      description: "We check it before it goes live.",
    },
  ],
  types: [
    { key: "community", label: "Community side", tier: "amateur" },
    { key: "ladies", label: "Ladies team", tier: "amateur" },
    { key: "registered", label: "Registered club", tier: "professional" },
  ],
  name: { min_length: 3, max_length: 40 },
};

const CREATED: Club = {
  id: "55555555-5555-4555-8555-555555555555",
  name: "Taha Stars",
  club_type: "community",
  city_hub_id: HUB_ID,
  area_id: AREA_ID,
  crest_url: null,
  maturity_level: "informal",
  verification_state: "not_required",
  verification_source: null,
};

type User = ReturnType<typeof userEvent.setup>;

function renderWizard() {
  const onExit = vi.fn();
  const onManage = vi.fn();
  const onGoHome = vi.fn();
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  // ToastProvider because the area step reuses <SuggestAreaDialog>, which
  // calls useToast; the root layout supplies it in the app.
  render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <ClubCreateWizard
          meta={META}
          onExit={onExit}
          onManage={onManage}
          onGoHome={onGoHome}
        />
      </ToastProvider>
    </QueryClientProvider>,
  );

  return { onExit, onManage, onGoHome };
}

const cta = () => screen.getByRole("button", { name: /continue|create club|send for checking/i });

/** Tier is single-tap and auto-advances after the confirm beat. */
async function pickTier(user: User, label: RegExp) {
  await user.click(await screen.findByRole("radio", { name: label }));
  await screen.findByText(/what kind of team/i);
}

async function pickType(user: User, label: RegExp) {
  await user.click(await screen.findByRole("radio", { name: label }));
  await screen.findByText(/what is your club called/i);
}

async function fillName(user: User, name: string) {
  await user.type(await screen.findByLabelText(/club name/i), name);
  await user.click(cta());
}

/** The badge step is optional (Club §5 step 6), so it is walked past. */
async function skipCrest(user: User) {
  await screen.findByText(/add your club badge/i);
  await user.click(cta());
}

async function reachReview(user: User, name = "Taha Stars") {
  await pickTier(user, /neighbourhood team/i);
  await pickType(user, /community side/i);
  await fillName(user, name);
  await skipCrest(user);

  await user.click(await screen.findByRole("combobox", { name: /city hub/i }));
  await user.click(await screen.findByRole("option", { name: /tamale/i }));
  await user.click(cta());

  await user.click(await screen.findByRole("combobox", { name: /^area$/i }));
  await user.click(await screen.findByRole("option", { name: /aboabo/i }));
  await user.click(cta());

  await screen.findByText(/check this over/i);
}

describe("ClubCreateWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    listHubs.mockResolvedValue([
      { id: HUB_ID, name: "Tamale City Hub", region: "Northern" },
    ]);
    listAreas.mockResolvedValue([
      { id: AREA_ID, name: "Aboabo", city_hub_id: HUB_ID },
    ]);
    createClub.mockResolvedValue(CREATED);
    uploadClubCrest.mockResolvedValue({
      crest_url: "https://cdn.test/crest.png",
      moderation_status: "pending",
    });
  });

  it("asks what kind of club it is before anything else", async () => {
    // The ordering ADR-0017 turns on: tier decides which types are offered and
    // whether a protected name is refused or reviewed, so it cannot come later.
    renderWizard();

    expect(
      await screen.findByText(/what kind of club is this/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/club name/i)).not.toBeInTheDocument();
  });

  it("renders the tiers from the vocabulary, not from a literal", async () => {
    renderWizard();

    expect(
      await screen.findByRole("radio", { name: /a neighbourhood team/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /a registered club/i }),
    ).toBeInTheDocument();
  });

  it("shows the official door but does not let anyone through it yet", async () => {
    renderWizard();

    // The API would hold such a club at `pending`, correctly, but the document
    // upload and admin review that release it ship in the next packet. Taking
    // a claim now would strand the club and tell the claimant we are checking
    // something nobody can see.
    const official = await screen.findByRole("radio", {
      name: /a registered club/i,
    });

    expect(official).toBeDisabled();
    expect(screen.getByText(/not open yet/i)).toBeInTheDocument();
  });

  it("offers only the club types belonging to the chosen tier", async () => {
    const user = userEvent.setup();
    renderWizard();

    await pickTier(user, /neighbourhood team/i);

    expect(
      screen.getByRole("radio", { name: /community side/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /ladies team/i }),
    ).toBeInTheDocument();
    // An official type behind the local door would be a way to be a registered
    // club with nothing checked.
    expect(
      screen.queryByRole("radio", { name: /registered club/i }),
    ).not.toBeInTheDocument();
  });

  it("cannot reach the type step through the gated door", async () => {
    const user = userEvent.setup();
    renderWizard();

    const official = await screen.findByRole("radio", {
      name: /a registered club/i,
    });
    await user.click(official);

    // Still on the tier question. A disabled control that silently advances
    // anyway is worse than one that does nothing.
    expect(screen.getByText(/what kind of club is this/i)).toBeInTheDocument();
  });

  it("enforces the name bounds served by config", async () => {
    const user = userEvent.setup();
    renderWizard();

    await pickTier(user, /neighbourhood team/i);
    await pickType(user, /community side/i);

    // META says 3, not the shipped default of 2.
    await user.type(await screen.findByLabelText(/club name/i), "FC");
    await user.click(cta());

    expect(await screen.findByText(/at least 3 letters/i)).toBeInTheDocument();
    expect(createClub).not.toHaveBeenCalled();
  });

  it("creates the club and lands on the live outcome", async () => {
    const user = userEvent.setup();
    renderWizard();

    await reachReview(user);
    await user.click(screen.getByRole("button", { name: /create club/i }));

    await waitFor(() => expect(createClub).toHaveBeenCalledTimes(1));
    // First arg only: TanStack passes its own context as a second argument.
    expect(createClub.mock.calls[0]?.[0]).toEqual({
      name: "Taha Stars",
      tier: "amateur",
      club_type: "community",
      city_hub_id: HUB_ID,
      area_id: AREA_ID,
    });

    expect(await screen.findByText(/taha stars is live/i)).toBeInTheDocument();
    expect(screen.getByText(/you own it/i)).toBeInTheDocument();
  });

  it("sends a reserved name back to the name step with its own copy", async () => {
    createClub.mockRejectedValue(
      new ApiError(422, "club.name_reserved", "That club name is not available."),
    );

    const user = userEvent.setup();
    renderWizard();

    await reachReview(user, "Asante Kotoko");
    await user.click(screen.getByRole("button", { name: /create club/i }));

    // Back on the field that produced it, with copy this client owns — never
    // the server's message (Law 4).
    expect(
      await screen.findByText(/belongs to a well known club/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/club name/i)).toBeInTheDocument();
  });

  it("shows a generic error when the failure has no field to blame", async () => {
    createClub.mockRejectedValue(new ApiError(500, "api.unknown_error", "boom"));

    const user = userEvent.setup();
    renderWizard();

    await reachReview(user);
    await user.click(screen.getByRole("button", { name: /create club/i }));

    expect(
      await screen.findByText(/could not create the club/i),
    ).toBeInTheDocument();
  });

  it("offers a badge step that can be walked past", async () => {
    const user = userEvent.setup();
    renderWizard();

    await pickTier(user, /neighbourhood team/i);
    await pickType(user, /community side/i);
    await fillName(user, "Taha Stars");

    // Club §5 step 6 marks the crest optional and says "allow later
    // completion". A required badge would stop a neighbourhood side that has
    // never had one from existing.
    expect(await screen.findByText(/add your club badge/i)).toBeInTheDocument();
    expect(screen.getByText(/you can add this later/i)).toBeInTheDocument();

    await user.click(cta());
    expect(await screen.findByText(/which city hub/i)).toBeInTheDocument();
  });

  it("uploads no badge when none was chosen", async () => {
    const user = userEvent.setup();
    renderWizard();

    await reachReview(user);
    await user.click(screen.getByRole("button", { name: /create club/i }));

    await waitFor(() => expect(createClub).toHaveBeenCalledTimes(1));
    expect(uploadClubCrest).not.toHaveBeenCalled();
  });

  it("leaves the flow from the first step rather than trapping the user", async () => {
    const user = userEvent.setup();
    const { onExit } = renderWizard();

    await user.click(await screen.findByRole("button", { name: /leave setup/i }));

    expect(onExit).toHaveBeenCalled();
  });
});
