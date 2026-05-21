import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./theme-provider";

const STORAGE_KEY = "kalaanba-theme";

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((event: MediaQueryListEvent) => void) | null;
  addEventListener: (
    type: "change",
    listener: (event: MediaQueryListEvent) => void,
  ) => void;
  removeEventListener: (
    type: "change",
    listener: (event: MediaQueryListEvent) => void,
  ) => void;
  dispatchEvent: (event: Event) => boolean;
  // legacy
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
}

function installMatchMedia(initialLight: boolean) {
  let listeners: Array<(event: MediaQueryListEvent) => void> = [];
  const list: MockMediaQueryList = {
    matches: initialLight,
    media: "(prefers-color-scheme: light)",
    onchange: null,
    addEventListener: (_type, listener) => listeners.push(listener),
    removeEventListener: (_type, listener) => {
      listeners = listeners.filter((existing) => existing !== listener);
    },
    dispatchEvent: () => true,
    addListener: (listener) => listeners.push(listener),
    removeListener: (listener) => {
      listeners = listeners.filter((existing) => existing !== listener);
    },
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue(list),
  });
  return {
    fireChange(matches: boolean) {
      list.matches = matches;
      const event = { matches } as MediaQueryListEvent;
      for (const listener of listeners) listener(event);
    },
  };
}

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="choice">{theme}</div>
      <div data-testid="resolved">{resolvedTheme}</div>
      <button onClick={() => setTheme("light")}>to-light</button>
      <button onClick={() => setTheme("dark")}>to-dark</button>
      <button onClick={() => setTheme("system")}>to-system</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to system preference and reflects it on <html data-theme>", async () => {
    installMatchMedia(false); // system = dark

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId("choice")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists explicit choice and updates the DOM immediately", async () => {
    installMatchMedia(false);
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("to-light"));

    expect(screen.getByTestId("choice")).toHaveTextContent("light");
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("reacts live to system preference changes when set to system", async () => {
    const media = installMatchMedia(false); // system = dark

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId("resolved")).toHaveTextContent("dark");

    act(() => {
      media.fireChange(true); // system flips to light
    });

    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
