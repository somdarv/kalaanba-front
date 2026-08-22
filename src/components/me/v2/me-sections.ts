import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  CalendarCheck,
  Coins,
  Compass,
  IdentificationCard,
  SlidersHorizontal,
  SoccerBall,
  Trophy,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react";

/**
 * The rail model for `/me/v2`, in one place, for both the vertical rail and
 * the phone dock.
 *
 * Same rule `site/nav-items.ts` set for the main nav: `targetId: null` means
 * the section is designed but not built, and it renders dimmed and inert
 * rather than being dropped. Four of the nine are in that state, and each one
 * is waiting on an engine with no API yet (Match/Fixture, RP Economy, Awards &
 * Recognition, Zone). Dropping them leaves a rail that says Kalaanba tracks a
 * name and a photo; linking them ships four dead taps.
 *
 * Turning one on later is filling in a `null` and adding the region it points
 * at. Nothing else on this surface has to change.
 *
 * These are anchors within one page, not routes. The rail moves the reader
 * around a workspace they are already inside, which is why nothing here is an
 * href to somewhere else.
 */

export type MeSection = {
  key: string;
  /** The rail tile label. One word wherever one word will do. */
  label: string;
  /** The region this tile scrolls to. `null` until that region exists. */
  targetId: string | null;
  icon: PhosphorIcon;
  /** Which engine owes the section, shown in the "Coming" list. */
  engine?: string;
};

/** The part of the rail that works today. */
export const LIVE_SECTIONS: readonly MeSection[] = [
  { key: "card", label: "Card", targetId: "me-card", icon: IdentificationCard },
  {
    key: "playing",
    label: "Playing",
    targetId: "me-playing",
    icon: CalendarCheck,
  },
  { key: "club", label: "Club", targetId: "me-club", icon: UsersThree },
  {
    key: "details",
    label: "Details",
    targetId: "me-details",
    icon: SlidersHorizontal,
  },
  {
    key: "account",
    label: "Account",
    targetId: "me-account",
    icon: UserCircle,
  },
];

/** Designed, not built. Rendered dimmed and inert. */
export const COMING_SECTIONS: readonly MeSection[] = [
  {
    key: "matches",
    label: "Matches",
    targetId: null,
    icon: SoccerBall,
    engine: "Match engine",
  },
  { key: "rp", label: "RP", targetId: null, icon: Coins, engine: "RP economy" },
  {
    key: "awards",
    label: "Awards",
    targetId: null,
    icon: Trophy,
    engine: "Awards engine",
  },
  {
    key: "zone",
    label: "Zone",
    targetId: null,
    icon: Compass,
    engine: "Zone engine",
  },
];

/** Everything the rail shows, in rail order. */
export const ALL_SECTIONS: readonly MeSection[] = [
  ...LIVE_SECTIONS,
  ...COMING_SECTIONS,
];
