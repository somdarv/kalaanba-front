"use client";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import { useEffect } from "react";

/**
 * Inline pre-paint script that resolves the user's theme choice from
 * localStorage (`auto` | `light` | `dark`) and sets `data-theme` +
 * `data-theme-choice` on `<html>` before React hydrates. Prevents a
 * light/dark flash on first paint.
 *
 * Must be rendered inside `<head>` (or at the very top of `<body>`).
 */
export function ThemeScript() {
  useEffect(() => {
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
