"use client";

import { MeWorkspace } from "@/components/me/v2";

/**
 * `/me/v2` — the workspace shape of the player's own record.
 *
 * Thin by design, the same as `/me`: the surface is entirely session-keyed,
 * which is a TanStack Query read, so the whole thing is a client component and
 * this file exists only to name the route.
 *
 * Both routes stay built until one is chosen. Two live routes over one flag is
 * deliberate: a flag makes the two shapes impossible to hold side by side on
 * two screens, which is the only way a layout decision actually gets made.
 */
export default function MeV2Page() {
  return <MeWorkspace />;
}
