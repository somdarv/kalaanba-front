import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

describe("<Badge>", () => {
  it("renders children as a <span>", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active").tagName).toBe("SPAN");
  });

  it("defaults to neutral intent", () => {
    render(<Badge>Default</Badge>);
    // Neutral badge has surface-2 background; we check the accessible text is present.
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it.each(["neutral", "primary", "success", "warning", "danger"] as const)(
    "renders %s intent without throwing",
    (intent) => {
      const { container } = render(<Badge intent={intent}>Label</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    },
  );

  it("applies custom className", () => {
    render(<Badge className="extra-class">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("extra-class");
  });

  it("forwards extra HTML attributes", () => {
    render(<Badge data-testid="my-badge">Badge</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});

describe("<Avatar>", () => {
  it("renders initials derived from name", () => {
    render(<Avatar name="Kwame Mensah" />);
    expect(screen.getByText("KM")).toBeInTheDocument();
  });

  it("uses explicit initials override when provided", () => {
    render(<Avatar name="Kwame Mensah" initials="KW" />);
    expect(screen.getByText("KW")).toBeInTheDocument();
  });

  it("renders a placeholder icon when no name or initials", () => {
    const { container } = render(<Avatar />);
    // Placeholder is an SVG element
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders as a <span> (non-interactive) by default", () => {
    const { container } = render(<Avatar name="Test User" />);
    expect(container.firstChild!.nodeName).toBe("SPAN");
  });

  it("renders as a <button> when interactive=true with aria-label", () => {
    render(
      <Avatar
        interactive
        aria-label="Open Kwame's profile"
        name="Kwame Mensah"
      />,
    );
    const btn = screen.getByRole("button", { name: /kwame's profile/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders an <img> when src is provided", () => {
    render(
      <Avatar src="https://i.pravatar.cc/48" alt="User photo" size="md" />,
    );
    expect(screen.getByRole("img", { name: "User photo" })).toBeInTheDocument();
  });

  it("derives single initial from a single-word name", () => {
    render(<Avatar name="Kwame" />);
    expect(screen.getByText("K")).toBeInTheDocument();
  });
});
