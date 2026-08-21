"use client";

import { useRef, useState } from "react";
import { CaretDown, MapPin } from "@phosphor-icons/react";

import { Popover, Skeleton, tapExpand } from "@/components/ui";
import { useHubs } from "@/lib/api/hooks/use-zone";
import { cn } from "@/lib/cn";

import { useLocalPreference } from "./local-preference";

/**
 * The City Hub you are browsing.
 *
 * Not the same thing as the area on your profile, and deliberately so. Your
 * area is where you play (Zone §5, set once during onboarding); this is which
 * hub's football you are looking at right now, and a Tamale player should be
 * able to look at Accra without moving house. It is therefore a local
 * preference rather than a profile field, and it works signed out, which is
 * what the open home needs (JOURNAL 2026-06-26).
 *
 * `GET /zone/hubs` is public and unauthenticated, so this is real backend data
 * on every render — the only part of the reference nav that is.
 *
 * There is one hub in the database today, so the list currently has nothing to
 * choose between. That is a seeding gap, not a component state: the picker
 * stays as it is and gets longer when the geography lands.
 *
 * `<SiteNav>` mounts two of these, one per breakpoint row, and the hidden one
 * is `display:none` rather than merely invisible, so exactly one is ever in
 * the accessibility tree. They share a storage key, so the two never disagree.
 *
 * The trigger and the panel share a `relative` wrapper because `<Popover>` is
 * `position: absolute` and anchors to the nearest positioned ancestor. Without
 * the wrapper it walked up the tree and pinned itself to the page, which put
 * the hub list against the left edge of the window.
 */

const KEY = "kx:browsing-hub";

export function HubPicker({ className }: { className?: string }) {
  const { data: hubs, isLoading } = useHubs();
  const [storedHubId, setStoredHubId] = useLocalPreference(KEY);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (isLoading) {
    return <Skeleton className={cn("h-8 w-24 rounded-pill", className)} />;
  }
  if (!hubs || hubs.length === 0) return null;

  // Fall back to the first hub rather than rendering "choose one": a visitor
  // who has never picked is not in an empty state, they are in the default.
  const active = hubs.find((hub) => hub.id === storedHubId) ?? hubs[0];

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          // 32px box, 44px target. DESIGN_LANGUAGE §9.1 allows the smaller
          // visual box and requires `tapExpand` to grow the POINTER target
          // with a pseudo-element, never a lowered min-h on its own. The
          // control wraps nothing interactive, so the pseudo is safe here.
          "kx-chrome inline-flex min-h-8 items-center gap-1.5 rounded-pill",
          tapExpand,
          "border border-border bg-surface-elev px-2.5",
          "text-xs font-medium text-fg",
          "transition-colors duration-quick ease-out",
          "hover:border-border-strong hover:bg-[var(--secondary-hover)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        )}
      >
        <MapPin size={13} weight="fill" aria-hidden className="text-primary" />
        <span className="max-w-28 truncate">{active.name}</span>
        <CaretDown
          size={11}
          weight="bold"
          aria-hidden
          className="text-fg-muted"
        />
      </button>

      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={triggerRef}
        matchTriggerWidth={false}
        className="min-w-[19rem] p-1"
      >
        <ul role="listbox" aria-label="City Hub">
          {hubs.map((hub) => {
            const isActive = hub.id === active.id;
            return (
              <li key={hub.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setStoredHubId(hub.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between gap-3 rounded-row px-3 text-left",
                    "transition-colors duration-quick ease-out",
                    "hover:bg-[var(--hover-overlay)]",
                    isActive && "bg-[var(--hover-overlay)]",
                  )}
                >
                  <span className="truncate text-sm font-medium text-fg">
                    {hub.name}
                  </span>
                  {hub.region ? (
                    // Never wraps. "Greater Accra Region" and "Upper East
                    // Region" both broke onto a second line in a 13rem panel,
                    // which turned a flat list into a ragged one where some
                    // rows were twice the height of their neighbours.
                    <span className="shrink-0 text-xs whitespace-nowrap text-fg-subtle">
                      {hub.region}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </span>
  );
}
