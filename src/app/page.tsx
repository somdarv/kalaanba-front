"use client";

import { HomeScreen } from "@/components/site";

/**
 * Home. Replaces the interim redirect to `/legacy/landing` that
 * WP-20260702-home-rewire shipped, and with it the last route in the product
 * that rendered `_archive/*` (design-system §7). The debt logged in JOURNAL
 * 2026-07-02 is closed.
 *
 * `"use client"` because the whole surface is keyed off the session, which is
 * a TanStack Query read. There is no redirect on session state here by design
 * (JOURNAL 2026-06-26, open home over walled dashboard).
 */
export default function HomePage() {
  return <HomeScreen />;
}
