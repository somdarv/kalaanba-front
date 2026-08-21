/**
 * The navigation model, in one place, for both views.
 *
 * Desktop renders it as a centre row, mobile renders it in a sheet, and the
 * two must never drift — a destination that exists on one and not the other is
 * how a product ends up with a phone version that is a different product.
 *
 * `href: null` means the destination is designed but not built. Five of the
 * six primary items are in that state today: Matches, Table, Players and Zones
 * all need engines that have no API yet (Match/Fixture, Competition & Rules,
 * Player read, Zone read), and News has no engine at all.
 *
 * They are rendered, dimmed and inert, rather than dropped. Dropping them
 * leaves a one-item nav that tells the user nothing about what Kalaanba is;
 * linking them ships six 404s. Showing the shape of the product with the
 * unfinished parts visibly unfinished is the honest third option, and turning
 * one on later is deleting a `null`.
 */

export type NavItem = {
  key: string;
  label: string;
  /** null until the destination exists. Renders inert. */
  href: string | null;
};

/** The centre row on desktop, the main list in the mobile sheet. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { key: "matches", label: "Matches", href: null },
  { key: "table", label: "Table", href: null },
  { key: "players", label: "Players", href: null },
  { key: "clubs", label: "Clubs", href: "/clubs/near-you" },
  { key: "zones", label: "Zones", href: null },
  { key: "news", label: "News", href: null },
];

/**
 * The utility row above it. These are audience doors rather than football, so
 * they sit apart from the primary set and go quieter on mobile.
 */
export const UTILITY_NAV: readonly NavItem[] = [
  { key: "facilities", label: "For Facilities", href: null },
  { key: "organisers", label: "For Organisers", href: null },
  { key: "about", label: "About", href: null },
  { key: "blog", label: "Blog", href: null },
];
