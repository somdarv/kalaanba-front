"use client";

import { useLocalPreference } from "./local-preference";

/**
 * Whether the home pitch has been dismissed.
 *
 * The server value is `null` (not dismissed), which is the reverse of the
 * first cut. Hiding it server-side stopped a dismissed pitch flashing back on
 * a returning visitor, but the build output showed what it cost: the page's
 * `<h1>` was absent from the prerendered HTML entirely, because the only `<h1>`
 * on `/` lives inside the pitch. On a landing page that is the wrong half of
 * the trade. A crawler and a first-time visitor now both get the headline in
 * the first byte; a returning visitor who dismissed it may see it for the one
 * frame between paint and hydration.
 */

const KEY = "kx:home:hero-dismissed";

export function useHeroDismissed() {
  const [value, set] = useLocalPreference(KEY);
  return {
    isDismissed: value === "1",
    dismiss: () => set("1"),
  };
}
