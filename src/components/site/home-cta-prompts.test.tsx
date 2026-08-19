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

  it("hides 'Create a club' in V1", () => {
    render(<HomeCtaPrompts />);
    expect(screen.queryByText(/create a club/i)).not.toBeInTheDocument();
  });

  it("renders exactly two prompts", () => {
    render(<HomeCtaPrompts />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
