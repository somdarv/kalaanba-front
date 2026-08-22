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
 * **The engine name is off the rows.** "Match engine" and "RP economy" are how
 * the team names the parts, not how a player does, and a column of internal
 * words beside four plain labels was explaining the build to someone who came
 * to look at their record.
 *
 * No ARIA state on the rows. They are plain text, not disabled controls: there
 * is nothing to focus, nothing to press and nothing in the keyboard path, so
 * `aria-disabled` would be describing an interaction that does not exist. The
 * heading and its one line carry the meaning for everyone, so the dimming is
 * never the only signal (DESIGN_LANGUAGE §6).
 */

const COMING: ReadonlyArray<{ key: string; label: string }> = [
  { key: "matches", label: "Your matches" },
  { key: "rp", label: "Your RP" },
  { key: "awards", label: "Your awards" },
  { key: "zone", label: "Your zone standing" },
];

export function ComingBlock() {
  return (
    <MeSection title="Coming soon" description="New features on the way.">
      <ul className="flex flex-col">
        {COMING.map((item, index) => (
          <li key={item.key} className="opacity-55">
            {index > 0 ? <Divider /> : null}
            <div className="py-2.5">
              <span className="text-fg text-sm font-medium">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </MeSection>
  );
}
