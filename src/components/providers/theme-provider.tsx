"use client";

/**
 * Kalaanba ThemeProvider — v2.
 *
 * Owns: `data-theme` attribute on <html>, persistence in localStorage,
 * system-preference reactivity. Uses `useSyncExternalStore` so React
 * stays in sync with the two external sources (localStorage + the
 * `prefers-color-scheme` MediaQueryList) without setState-in-effect.
 *
 * SSR/FOUC: pair this provider with `themeBootstrapScript` injected into
 * <head> in app/layout.tsx so the attribute is set before first paint.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeChoice = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "kalaanba-theme";
const STORAGE_EVENT = "kalaanba-theme-change";

interface ThemeContextValue {
  theme: ThemeChoice;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── External store: stored choice ────────────────────────────────────

function subscribeStoredChoice(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
}

function getStoredChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "dark" || raw === "light" || raw === "system") return raw;
  return "system";
}

function getStoredChoiceServer(): ThemeChoice {
  return "system";
}

// ── External store: system preference ────────────────────────────────

function subscribeSystem(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getSystemThemeServer(): ResolvedTheme {
  return "dark";
}

// ── Provider ─────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeStoredChoice,
    getStoredChoice,
    getStoredChoiceServer,
  );

  const systemTheme = useSyncExternalStore(
    subscribeSystem,
    getSystemTheme,
    getSystemThemeServer,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Reflect the resolved theme into the DOM whenever it changes.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.classList.toggle("light", resolvedTheme === "light");
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((next: ThemeChoice) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}

/**
 * Inline script that runs before React hydrates and sets `data-theme`
 * on <html>, eliminating the dark→light flash. Render it inside <head>.
 */
export const themeBootstrapScript = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    var resolved = stored === "dark" || stored === "light" ? stored : system;
    var root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    root.classList.toggle("light", resolved === "light");
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  } catch (_) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }
})();
`.trim();
