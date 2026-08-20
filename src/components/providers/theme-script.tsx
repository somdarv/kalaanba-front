"use client";

import { FORCED_THEME, THEME_STORAGE_KEY } from "@/lib/theme";
import { useEffect } from "react";

/**
 * Pre-paint theme resolution: reads the user's choice from localStorage
 * (`auto` | `light` | `dark`) and sets `data-theme` + `data-theme-choice` on
 * `<html>`. Prevents a light/dark flash on first paint.
 *
 * While `FORCED_THEME` is set (see `@/lib/theme`) there is nothing to
 * resolve — the root layout stamps `data-theme` on `<html>` server-side, so
 * the correct theme is in the very first byte of HTML rather than one
 * effect late. This component is then a no-op it keeps around for the day
 * the lock lifts.
 */
export function ThemeScript() {
  useEffect(() => {
    if (FORCED_THEME) return;
    try {
      const key = THEME_STORAGE_KEY;
      let stored = null;
      try { stored = window.localStorage.getItem(key); } catch (_) {}
      const choice = stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
      let resolved = choice;
      if (resolved === "auto") {
        resolved = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      }
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      root.dataset.themeChoice = choice;
    } catch (_) {}
  }, []);

  return null;
}
