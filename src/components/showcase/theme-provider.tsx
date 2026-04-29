"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const STORAGE_KEY = "kx-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialMode(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  const ds = document.documentElement.dataset.kxTheme;
  if (ds === "light") return "light";
  if (ds === "dark") return "dark";
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function KxThemeProvider({ children }: { children: ReactNode }) {
  // Lazy init reads the dataset that the inline bootstrap script set on <html>
  // before hydration, so light-mode users never see a dark flash.
  const [mode, setModeState] = useState<ThemeMode>(() => readInitialMode());

  const persist = (next: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.dataset.kxTheme = next;
    } catch {
      /* ignore */
    }
  };

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    persist(next);
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`kx-root ${mode === "light" ? "kx-light" : ""}`} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useKxTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useKxTheme must be used within KxThemeProvider");
  return ctx;
}
