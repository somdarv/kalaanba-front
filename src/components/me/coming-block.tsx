"use client";

import { Divider } from "@/components/ui";

import { MeSection } from "./me-section";

/**
 * What `/me` becomes.
 *
 * Rendered dimmed and inert rather than dropped, which is the pattern
 * `site/nav-items.ts` already established for destinations that are designed
 * but not built:
 *
 *   "Dropping them leaves a one-item nav that tells the user nothing about what
 *    Kalaanba is; linking them ships six 404s. Showing the shape of the product
 *    with the unfinished parts visibly unfinished is the honest third option."
 *
 * Same reasoning one level down. A player who opens this page and sees a card
 * plus an empty record learns that Kalaanba tracks almost nothing; a player who
 * also sees where their matches, RP and awards will sit learns what it is FOR.
 *
 * Turning one on later is deleting a row from this list and adding a real block.
 *
 * No ARIA state on the rows. They are plain text, not disabled controls: there
 * is nothing to focus, nothing to press and nothing in the keyboard path, so
 * `aria-disabled` would be describing an interaction that does not exist. The
 * section's own "Not built yet" line carries the meaning for everyone
 * (DESIGN_LANGUAGE §6 — colour is never the only signal).
 */

const COMING: ReadonlyArray<{ key: string; label: string; note: string }> = [
  { key: "matches", label: "Your matches", note: "Match engine" },
  { key: "rp", label: "Your RP", note: "RP economy" },
  { key: "awards", label: "Your awards", note: "Awards engine" },
  { key: "zone", label: "Your zone standing", note: "Zone engine" },
];

export function ComingBlock() {
  return (
    <MeSection title="Coming" description="Not built yet.">
      <ul className="flex flex-col">
        {COMING.map((item, index) => (
          <li key={item.key} className="opacity-55">
            {index > 0 ? <Divider /> : null}
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="text-sm font-medium text-fg">{item.label}</span>
              <span className="text-xs text-fg-subtle">{item.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </MeSection>
  );
}
