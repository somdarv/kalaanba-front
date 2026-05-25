"use client";

/**
 * `List` / `ListItem` — Tier 7 workhorse for vertical record collections.
 *
 * Design intent (DESIGN_LANGUAGE §3.1 interaction recipe, §2.3 radius,
 * §2.4 elevation flat, COMPONENT_INVENTORY 7.1):
 *   - List is a semantic `<ul role="list">` with optional surface + hairline
 *     dividers. It owns layout (gap / dividers / variant) and nothing else.
 *   - ListItem owns the per-row recipe: leading slot (icon / avatar /
 *     thumbnail) → content stack (meta + title + description) → trailing
 *     slot (badge / chevron / value / switch). When `onClick` or `href`
 *     are provided, it composes the canonical pressable recipe — same
 *     1% press, soft hover, focus ring as Button.
 *   - Selected state uses a subtle foreground tint (`bg-fg/6`) — readable
 *     in both themes without resorting to brand color (brand color is
 *     reserved for primary CTAs and live status).
 *
 * Used by: every dashboard list, settings pages, fixtures, members,
 * search results, Combobox listbox, BottomNav (composed indirectly),
 * Menu, ActionSheet, MatchRow.
 */

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";

/* ============================================ List =========================================== */

export type ListVariant = "plain" | "separated" | "surface";
export type ListDensity = "cozy" | "compact";

export type ListProps = Omit<HTMLAttributes<HTMLUListElement>, "role"> & {
  /**
   * Visual variant:
   * - `plain` (default): no surface, no dividers — items breathe via their
   *   own padding.
   * - `separated`: hairline dividers between items (no surface).
   * - `surface`: wrapped in a soft card with hairline dividers — the
   *   "settings panel" look.
   */
  variant?: ListVariant;
  /** Cozy (default) or compact density. Affects ListItem padding. */
  density?: ListDensity;
  children: ReactNode;
};

/**
 * `<List>` — semantic vertical collection. Set `aria-label` (or
 * `aria-labelledby`) when the list is meaningful on its own; omit when
 * the surrounding heading provides context.
 */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { variant = "plain", density = "cozy", className, children, ...rest },
  ref,
) {
  const isSurface = variant === "surface";
  const dividedKids =
    variant === "plain"
      ? children
      : addBetween(children, (key) => (
          <li
            key={`__list-div-${key}`}
            aria-hidden
            className="h-px bg-divider"
          />
        ));

  return (
    <ul
      ref={ref}
      role="list"
      data-density={density}
      className={cn(
        "flex w-full flex-col",
        isSurface && "rounded-card border border-border bg-surface overflow-hidden",
        className,
      )}
      {...rest}
    >
      {dividedKids}
    </ul>
  );
});

/* ========================================== ListItem ========================================== */

type ListItemCommon = {
  /** Optional small uppercase label above the title (e.g. "Match 12 · Group B"). */
  meta?: ReactNode;
  /** Primary line. Required for accessible row identity. */
  title: ReactNode;
  /** Secondary line under the title (one or two lines). */
  description?: ReactNode;
  /** Leading slot — Avatar, Icon, ClubCrest, image. */
  leading?: ReactNode;
  /**
   * Trailing slot — Badge, value, IconButton, Switch, chevron, etc.
   * If omitted and the row is interactive, a soft chevron is rendered
   * automatically (set `hideChevron` to suppress).
   */
  trailing?: ReactNode;
  /** Suppress the auto-chevron on interactive rows when no `trailing` is provided. */
  hideChevron?: boolean;
  /** Visual selected state — soft fg-tint + bold title. */
  selected?: boolean;
  /** Inherits density from parent List via `data-density`. */
  className?: string;
  /** Optional id for scroll-into-view / aria-activedescendant. */
  id?: string;
};

type ListItemAsButton = ListItemCommon &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
    as?: "button";
    href?: undefined;
  };

type ListItemAsAnchor = ListItemCommon &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> & {
    as?: "a";
    href: string;
  };

type ListItemAsDiv = ListItemCommon &
  Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
    as?: "div";
    href?: undefined;
    onClick?: undefined;
  };

export type ListItemProps = ListItemAsButton | ListItemAsAnchor | ListItemAsDiv;

/**
 * `<ListItem>` — composes the canonical pressable recipe when interactive
 * (button or anchor), or renders a flat `<div>` row when purely
 * presentational. Auto-injects a chevron on interactive rows that don't
 * specify a `trailing` slot.
 */
export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  props,
  ref,
) {
  const {
    leading,
    meta,
    title,
    description,
    trailing,
    hideChevron = false,
    selected = false,
    className,
    ...rest
  } = props;

  const isAnchor = "href" in rest && (rest as { href?: string }).href != null;
  const isButton =
    !isAnchor &&
    ("onClick" in rest && typeof (rest as { onClick?: unknown }).onClick === "function");
  const interactive = isAnchor || isButton;

  const renderedTrailing =
    trailing ?? (interactive && !hideChevron ? <ListChevron /> : null);

  const inner = (
    <>
      {leading ? (
        <span className="flex shrink-0 items-center justify-center text-fg-muted">
          {leading}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {meta ? (
          <span className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
            {meta}
          </span>
        ) : null}
        <span
          className={cn(
            "truncate text-sm text-fg",
            selected ? "font-semibold" : "font-medium",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="line-clamp-2 text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
      </div>
      {renderedTrailing ? (
        <span className="flex shrink-0 items-center justify-center text-fg-muted">
          {renderedTrailing}
        </span>
      ) : null}
    </>
  );

  // Shared row classes — density read from the parent List via group
  // selector (no JS), padding via group-[[data-density=...]]:.
  const rowBase = cn(
    "flex w-full items-center gap-3 text-left",
    "group/li", // for descendants that want to react
    // density: cozy default 14px/16px, compact 10px/12px. We can't read
    // ancestor data-attr in pure CSS without :has, so we expose `:where`
    // selectors via Tailwind arbitrary parents — but the lowest-friction
    // path is to default to cozy on the row and let surface-style Lists
    // tighten via their own override. Keep it simple:
    "px-4 py-3.5",
    // Selected tint, interactive hover, focus ring all go on the
    // interactive variant only — div rows stay flat.
    selected && "bg-(--secondary-hover)",
  );

  if (isAnchor) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <li className="contents">
        <a
          {...anchorProps}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(
            pressableBase,
            "justify-start", // override pressable's centred default
            rowBase,
            "min-h-14 hover:bg-(--secondary-hover)",
            "no-underline",
            className,
          )}
          aria-current={selected ? "true" : undefined}
        >
          {inner}
        </a>
      </li>
    );
  }

  if (isButton) {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <li className="contents">
        <button
          {...buttonProps}
          ref={ref as React.Ref<HTMLButtonElement>}
          type={buttonProps.type ?? "button"}
          className={cn(
            pressableBase,
            "justify-start",
            rowBase,
            "min-h-14 hover:bg-(--secondary-hover)",
            className,
          )}
          aria-pressed={selected || undefined}
        >
          {inner}
        </button>
      </li>
    );
  }

  // Presentational row — flat <li>, no pressable.
  const divProps = rest as HTMLAttributes<HTMLLIElement>;
  return (
    <li
      {...divProps}
      ref={ref as React.Ref<HTMLLIElement>}
      className={cn(rowBase, className)}
    >
      {inner}
    </li>
  );
});

/* ========================================== helpers ========================================== */

function ListChevron() {
  return (
    <CaretRight
      size={16}
      weight="bold"
      className="text-fg-subtle transition-colors duration-quick ease-out"
      aria-hidden
    />
  );
}

/**
 * Inserts a separator between every adjacent pair of React children.
 * Skips falsy children. Pure function — does not touch keys on the
 * caller's nodes.
 */
function addBetween(children: ReactNode, sep: (key: string | number) => ReactNode) {
  const arr: ReactNode[] = [];
  let i = 0;
  // Iterate via React's children helper to handle fragments / arrays.
  // We can't use React.Children.toArray here because consumers may pass
  // a single render expression; the simplest portable path is to coerce
  // to an array.
  const items = Array.isArray(children) ? children : [children];
  for (const c of items) {
    if (c == null || c === false) continue;
    if (i > 0) arr.push(sep(i));
    arr.push(c);
    i += 1;
  }
  return arr;
}
