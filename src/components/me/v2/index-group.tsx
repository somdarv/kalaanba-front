"use client";

import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

import { Eyebrow, pressableBase } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * One collapsible group in the index pane.
 *
 * The index is a source list, not a stack of cards: an uppercase group label
 * with a caret, then its rows, then the next label. That is what lets six
 * sections share one panel without six borders competing for the reader, and
 * it is why the group heading is an `<Eyebrow>` (§2.6 — the 12px uppercase
 * tracked label) rather than another 16px bold title.
 *
 * The `<h2>` is the page's second level. `/me` gives its `<h1>` to the
 * player's own name on the card, so a screen reader running the heading list
 * hears who this is before it hears what is on the page.
 *
 * Collapsing mounts and unmounts rather than animating a height. §3.4 allows
 * animating height where the geometric change IS the animation, but it also
 * calls it expensive and bans it in lists, and this is six of them on a phone.
 * The caret rotation is a transform, which is free.
 *
 * `scroll-mt` keeps the heading clear of the sticky site header when the rail
 * jumps here.
 */

export type IndexGroupProps = {
  /** Anchor target for the rail. */
  id: string;
  title: string;
  /** Status beside the title. A chip or one short word, never a sentence. */
  note?: ReactNode;
  /** Closed groups start collapsed. Everything that works starts open. */
  defaultOpen?: boolean;
  children: ReactNode;
};

export function IndexGroup({
  id,
  title,
  note,
  defaultOpen = true,
  children,
}: IndexGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `${id}-panel`;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-2">
        <h2 id={`${id}-title`} className="min-w-0">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((open) => !open)}
            className={cn(
              pressableBase,
              "text-fg-subtle hover:text-fg-muted w-full justify-start gap-1.5",
            )}
          >
            <CaretDown
              size={12}
              weight="fill"
              aria-hidden
              className={cn(
                "duration-quick transition-transform ease-out",
                isOpen ? "rotate-0" : "-rotate-90",
              )}
            />
            <Eyebrow tone="subtle">{title}</Eyebrow>
          </button>
        </h2>
        {note}
      </div>

      {isOpen ? (
        <div id={panelId} className="pb-1">
          {children}
        </div>
      ) : null}
    </section>
  );
}

export type TreeItem = {
  key: string;
  label: string;
  value?: ReactNode;
};

/**
 * The sub-facts hanging off the item above them, drawn with a connector.
 *
 * A bracket rather than an indent, because indentation alone leaves the reader
 * to guess whether a row belongs to the tile above it or to the group. The
 * line is two pseudo-elements: a vertical rule down the left and a stub across
 * to each row, with the rule cut to half height on the last row so it closes
 * into an L instead of running off the end.
 *
 * Text only. Nothing here is interactive, so nothing here is focusable.
 */
export function TreeList({ items }: { items: ReadonlyArray<TreeItem> }) {
  return (
    <ul className="mt-1 pl-4">
      {items.map((item) => (
        <li
          key={item.key}
          className={cn(
            "relative flex items-center justify-between gap-3 py-1.5 pl-6",
            "before:bg-divider before:absolute before:top-0 before:left-0 before:h-full before:w-px",
            "after:bg-divider after:absolute after:top-1/2 after:left-0 after:h-px after:w-4",
            "last:before:h-1/2",
          )}
        >
          <span className="text-fg-muted flex min-w-0 items-center gap-2 text-sm">
            <span
              aria-hidden
              className="bg-fg-subtle rounded-pill size-1.5 shrink-0"
            />
            <span className="truncate">{item.label}</span>
          </span>
          {item.value != null ? (
            <span className="text-fg shrink-0 text-sm font-medium">
              {item.value}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
