"use client";

import { pressableBase } from "@/components/ui";
import { cn } from "@/lib/cn";

import { COMING_SECTIONS, LIVE_SECTIONS, type MeSection } from "./me-sections";
import { useActiveHash } from "./use-active-hash";

/**
 * The rail: every part of your record, as one strip of tiles.
 *
 * One element, two orientations. A vertical rail down the left at `lg` and a
 * dock across the top on a phone, which is the same object rotated rather than
 * two components that can drift. Both carry the panel chrome, so on a phone it
 * reads as a dock sitting on the page rather than as a row of loose buttons.
 *
 * Per DESIGN_LANGUAGE §9.1 every tile clears 44px on its own box, so no
 * `tapExpand` is needed and none is used: the plate is 44px and the label sits
 * inside the same target.
 *
 * The current tile is marked three ways, because §6 forbids colour as the only
 * signal: a filled plate, a bar on the edge, and `aria-current`.
 *
 * The hairline is load-bearing. Everything before it works; everything after it
 * is designed and not built, and renders dimmed and inert exactly as
 * `site/nav-link.tsx` renders an unbuilt destination. A rail that hides the
 * unbuilt half tells a player Kalaanba tracks a name and a photo.
 */

export type MeRailProps = {
  /**
   * Without a player record, the football sections have nothing to point at.
   * The tiles stay visible and go inert rather than disappearing, so the rail
   * is the same shape before and after a card exists.
   */
  hasPlayer: boolean;
  className?: string;
};

export function MeRail({ hasPlayer, className }: MeRailProps) {
  const active = useActiveHash();

  return (
    <nav
      aria-label="Your profile"
      className={cn(
        "kx-chrome elev-soft rounded-panel shrink-0",
        "lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden",
        className,
      )}
    >
      <ul
        className={cn(
          "kx-scroll-none flex items-stretch gap-1 overflow-x-auto p-2",
          "lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:overscroll-contain",
        )}
      >
        {LIVE_SECTIONS.map((section) => (
          <RailTile
            key={section.key}
            section={section}
            isCurrent={active === section.targetId}
            isLive={hasPlayer || section.key === "account"}
          />
        ))}

        <li
          aria-hidden
          className="bg-divider mx-1 h-9 w-px shrink-0 self-center lg:mx-auto lg:my-2 lg:h-px lg:w-9"
        />

        {COMING_SECTIONS.map((section) => (
          <RailTile
            key={section.key}
            section={section}
            isCurrent={false}
            isLive={false}
          />
        ))}
      </ul>
    </nav>
  );
}

const TILE_BOX = cn(
  "flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-control px-1 py-2",
  "text-[0.6875rem] leading-none font-medium",
  "lg:w-full",
);

const PLATE = cn(
  "grid size-11 place-items-center rounded-control border",
  "duration-quick ease-out transition-colors",
);

function RailTile({
  section,
  isCurrent,
  isLive,
}: {
  section: MeSection;
  isCurrent: boolean;
  isLive: boolean;
}) {
  const Glyph = section.icon;

  if (section.targetId == null || !isLive) {
    return (
      <li>
        <span
          aria-disabled
          className={cn(TILE_BOX, "text-fg-subtle opacity-55")}
        >
          <span className={cn(PLATE, "border-border bg-surface")}>
            <Glyph size={20} aria-hidden />
          </span>
          {section.label}
        </span>
      </li>
    );
  }

  return (
    <li>
      <a
        href={`#${section.targetId}`}
        aria-current={isCurrent ? "true" : undefined}
        className={cn(
          pressableBase,
          TILE_BOX,
          isCurrent ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        <span
          className={cn(
            PLATE,
            isCurrent
              ? "bg-primary text-on-primary border-transparent shadow-[var(--shadow-sm)]"
              : "border-border bg-surface",
          )}
        >
          <Glyph
            size={20}
            weight={isCurrent ? "fill" : "regular"}
            aria-hidden
          />
        </span>
        {section.label}

        {isCurrent ? (
          <span
            aria-hidden
            className={cn(
              "bg-primary rounded-pill absolute",
              "inset-x-4 bottom-0 h-0.5",
              "lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-0 lg:h-7 lg:w-0.5 lg:-translate-y-1/2",
            )}
          />
        ) : null}
      </a>
    </li>
  );
}
