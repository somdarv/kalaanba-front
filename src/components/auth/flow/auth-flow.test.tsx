import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthFlow } from "./auth-flow";
import * as authApi from "@/lib/api/auth";

// Mock the API layer so the flow's branching can be asserted without a network.
vi.mock("@/lib/api/auth", () => ({
  lookupAccount: vi.fn(),
  requestOtp: vi
    .fn()
    .mockResolvedValue({ expires_at: "", masked_phone: "***", otp_length: 6 }),
  verifyOtpForLogin: vi.fn(),
  registerWithOtp: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithEmailPassword: vi.fn(),
  verifyEmail: vi.fn(),
  logout: vi.fn(),
}));

const lookup = vi.mocked(authApi.lookupAccount);

function renderFlow() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AuthFlow onAuthed={vi.fn()} />
    </QueryClientProvider>,
  );
}

describe("<AuthFlow> — identifier-first branching (ADR-0004)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens on the neutral entry — no returning/new assumption, no signup link", () => {
    renderFlow();
    expect(screen.getByText("Get in the game")).toBeInTheDocument();
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("branches a known email to the returning-user password step", async () => {
    lookup.mockResolvedValue({ exists: true, channel: "email" });
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Use email instead" }));
    await user.type(screen.getByLabelText("Email"), "kojo@example.com");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("branches a new email to the create-your-career step", async () => {
    lookup.mockResolvedValue({ exists: false, channel: "email" });
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Use email instead" }));
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByText(/let.s start your career/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("sends a NEW phone to the name step first (code comes last)", async () => {
    lookup.mockResolvedValue({ exists: false, channel: "phone" });
    const user = userEvent.setup();
    renderFlow();

    await user.type(screen.getByLabelText("Phone number"), "244123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByText(/let.s start your career/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    // No code requested yet — the verify screen comes after the name.
    expect(authApi.requestOtp).not.toHaveBeenCalled();
  });

  it("new phone: name → verify screen requests the code", async () => {
    lookup.mockResolvedValue({ exists: false, channel: "phone" });
    const user = userEvent.setup();
    renderFlow();

    await user.type(screen.getByLabelText("Phone number"), "244123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.type(screen.getByLabelText("Your name"), "Kojo Mensah");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Verify your number")).toBeInTheDocument();
    expect(authApi.requestOtp).toHaveBeenCalledTimes(1);
  });

  it("shows Welcome back on OTP entry for a recognised number", async () => {
    lookup.mockResolvedValue({ exists: true, channel: "phone" });
    const user = userEvent.setup();
    renderFlow();

    await user.type(screen.getByLabelText("Phone number"), "244123456");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Welcome back")).toBeInTheDocument();
    expect(authApi.requestOtp).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["+233244123456", "+233244123456"],
    ["+2330244123456", "+233244123456"],
    ["+233244123456", "+233244123456"],
    ["0244123456", "+233244123456"],
    ["244123456", "+233244123456"],
  ])("normalises %s to %s before lookup", async (typed, expected) => {
    lookup.mockResolvedValue({ exists: true, channel: "phone" });
    const user = userEvent.setup();
    renderFlow();

    await user.type(screen.getByLabelText("Phone number"), typed);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(lookup.mock.calls.at(-1)?.[0]).toBe(expected);
  });

  it("validates an empty identifier before calling lookup", async () => {
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByText("Enter your phone number to continue."),
    ).toBeInTheDocument();
    expect(lookup).not.toHaveBeenCalled();
  });
});
