"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  FORCED_THEME,
  isTheme,
  THEME_FLIP_CLASS,
  THEME_FLIP_DURATION_MS,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  /** User's stated preference. `auto` follows OS. */
  theme: Theme;
  /** Concrete theme actually applied to the DOM. */
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "auto";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(raw) ? raw : "auto";
  } catch {
    return "auto";
  }
}

function applyTheme(resolved: ResolvedTheme, choice: Theme): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.dataset["themeChoice"] = choice;
}

function flashThemeFlip(): void {
  const root = document.documentElement;
  root.classList.add(THEME_FLIP_CLASS);
  window.setTimeout(() => {
    root.classList.remove(THEME_FLIP_CLASS);
  }, THEME_FLIP_DURATION_MS);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to whatever the server / inline script already chose so SSR and
  // first paint agree. Under the lock that is `FORCED_THEME`, which the root
  // layout has already stamped on <html>.
  const [theme, setThemeState] = useState<Theme>(FORCED_THEME ?? "auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    FORCED_THEME ?? "dark",
  );

  // Hydrate from storage + DOM on mount.
  useEffect(() => {
    // Locked: storage and the OS preference are both deliberately ignored, so
    // a phone set to dark — or a browser that once stored `dark` — still gets
    // the light product.
    if (FORCED_THEME) return;
    const stored = readStoredTheme();
    const resolved =
      stored === "auto" ? readSystemTheme() : (stored as ResolvedTheme);
    setThemeState(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved, stored);
  }, []);

  // Watch OS preference when in auto mode.
  useEffect(() => {
    if (FORCED_THEME || theme !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handle = (event: MediaQueryListEvent) => {
      const next: ResolvedTheme = event.matches ? "light" : "dark";
      flashThemeFlip();
      setResolvedTheme(next);
      applyTheme(next, "auto");
    };
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const resolved =
      next === "auto"
        ? (FORCED_THEME ?? readSystemTheme())
        : (next as ResolvedTheme);
    flashThemeFlip();
    setThemeState(next);
    setResolvedTheme(resolved);
    applyTheme(resolved, next);
    // Under the lock a flip is a *preview* — how `/showcase` keeps dark
    // developable — never a preference. Persisting it would ship dark to that
    // browser on the next visit, which is the one thing the lock forbids.
    if (FORCED_THEME) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore — private mode, etc.
    }
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
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return value;
}
