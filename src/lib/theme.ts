/**
 * Theme constants — shared between the inline pre-paint script
 * and the React `ThemeProvider`. Keep this file framework-free.
 */

export type Theme = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "kalaanba-theme";
export const THEME_FLIP_CLASS = "theme-flipping";
export const THEME_FLIP_DURATION_MS = 200;

/**
 * Product lock (2026-08-19) — the app ships **light only**.
 *
 * Dark is finished and stays wired end to end (the `:root` token block, every
 * primitive's dark values, the `/showcase` route) so it keeps being developed
 * alongside; it is simply not offered to users yet. While this is non-null:
 *
 *   - the device / browser `prefers-color-scheme` is ignored — a phone set to
 *     dark still gets the light product,
 *   - a previously stored choice is ignored,
 *   - `setTheme` still applies for the current session — that is how
 *     `/showcase` previews dark — but is never persisted, so the next load
 *     returns to the lock.
 *
 * `<html data-theme>` is stamped server-side in `app/layout.tsx` from this
 * value, so there is no first-paint flash and no client resolution to wait on.
 *
 * To ship the theme switcher: set this to `null`. Nothing else changes.
 */
export const FORCED_THEME: ResolvedTheme | null = "light";

export function isTheme(value: unknown): value is Theme {
  return value === "auto" || value === "light" || value === "dark";
}
