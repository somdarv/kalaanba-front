"use client";

import { MeScreen } from "@/components/me";

/**
 * `/me` — the signed-in player's own record (WP-20260821-me-surface).
 *
 * Thin by design: the surface is entirely session-keyed, which is a TanStack
 * Query read, so the whole thing is a client component and this file exists
 * only to name the route.
 *
 * This is the one route in the product that redirects on session state. The
 * open-home decision (JOURNAL 2026-06-26) makes login a personalisation layer
 * rather than a front door, and every other surface renders for a stranger.
 * Nothing on this one does.
 */
export default function MePage() {
  return <MeScreen />;
}
