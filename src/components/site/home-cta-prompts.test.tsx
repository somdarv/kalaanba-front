import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { HomeCtaPrompts } from "./home-cta-prompts";

describe("HomeCtaPrompts", () => {
  it("offers the player-profile and join-club entry points", () => {
    render(<HomeCtaPrompts />);

    const player = screen.getByRole("link", {
      name: /set up your player profile/i,
    });
    expect(player).toHaveAttribute("href", "/player/setup");

    const club = screen.getByRole("link", { name: /join a club near you/i });
    expect(club).toHaveAttribute("href", "/clubs/near-you");
  });

  it("offers starting a club", () => {
    // Absent until WP-20260823: creation had no flow, and no door policy to
    // stop the first person who signed up registering Asante Kotoko.
    render(<HomeCtaPrompts />);

    const create = screen.getByRole("link", { name: /start a club/i });
    expect(create).toHaveAttribute("href", "/clubs/create");
  });

  it("renders exactly three prompts", () => {
    render(<HomeCtaPrompts />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
