/**
 * The guided-flow column — how wide a full-screen flow is, in one place.
 *
 * Area onboarding and player setup are single-column screens a player meets on
 * a phone. DESIGN_LANGUAGE §9.2 sets the *floor* for edge padding
 * ("padding-inline: max(1rem, env(safe-area-inset-left/right))"), which on a
 * 360px handset leaves the content filling ~89% of the screen. On a form that
 * is one question per screen, that reads as a page bleeding off both edges
 * rather than a thing being handed over, and §1.3 (Premium) is mostly a
 * question of what you leave empty.
 *
 * These screens therefore take a wider gutter: 10% each side, so the content
 * sits on 80% of the viewport. `max()` keeps the §9.2 safe-area floor intact,
 * so a notched phone in landscape still clears the cutout, and each side reads
 * its own inset rather than both sides sharing the left one.
 *
 * Nothing moves on desktop: 10% of a 1280px window is far outside the 28rem
 * cap, which stays centred exactly where it was.
 *
 * Rule of three (engineering-standards §3): five call sites across two flows.
 * Change the column here, not in a screen.
 */

/** Edge padding for a flow's scroll region and its sticky footer. */
export const flowGutter =
  "pl-[max(10%,env(safe-area-inset-left))] pr-[max(10%,env(safe-area-inset-right))]";

/** The column inside the gutter — full width on a phone, capped on a desktop. */
export const flowColumn = "mx-auto w-full max-w-md";
