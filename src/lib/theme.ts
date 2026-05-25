/**
 * Theme constants — shared between the inline pre-paint script
 * and the React `ThemeProvider`. Keep this file framework-free.
 */

export type Theme = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "kalaanba-theme";
export const THEME_FLIP_CLASS = "theme-flipping";
export const THEME_FLIP_DURATION_MS = 200;

export function isTheme(value: unknown): value is Theme {
  return value === "auto" || value === "light" || value === "dark";
}
