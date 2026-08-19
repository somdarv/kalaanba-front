"use client";

import type { ReactNode } from "react";

import { StatValue } from "@/components/ui";
import { pressableBase } from "@/components/ui/pressable";
import { cn } from "@/lib/cn";

/**
 * The two selection shapes used across the setup flow.
 *
 * Both compose `pressableBase`, so they inherit the canonical interaction
 * recipe wholesale (DESIGN_LANGUAGE §3.5) — 44px floor, focus-visible ring in
 * the focus hue, `scale(0.99)` press compression, no positional hover. Colour
 * is never the only signal for the selected state (§6): the fill changes, the
 * border resolves, and `aria-pressed` carries it to assistive tech.
 */

const SELECTED = "bg-primary text-on-primary border-transparent shadow-[var(--shadow-sm)]";
const UNSELECTED = cn(
  "bg-surface-elev text-fg border-border",
  "hover:border-border-strong hover:bg-[color-mix(in_oklab,transparent,var(--fg)_6%)]",
);

export type NumberTileProps = {
  value: number;
  selected: boolean;
  onSelect: () => void;
};

/** A one-tap shirt number. Square so a row of them reads as a keypad. */
export function NumberTile({ value, selected, onSelect }: NumberTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        pressableBase,
        "aspect-square w-full rounded-control border",
        selected ? SELECTED : UNSELECTED,
      )}
    >
      <StatValue size="lg" className="text-current">
        {value}
      </StatValue>
    </button>
  );
}

export type TextTileProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
};

/** The "Other" escape hatch beside the number grid. */
export function TextTile({
  label,
  selected,
  onSelect,
  className,
}: TextTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        pressableBase,
        "w-full rounded-control border px-3 text-sm font-semibold",
        selected ? SELECTED : UNSELECTED,
        className,
      )}
    >
      {label}
    </button>
  );
}

export type ChoiceCardProps = {
  label: string;
  description?: ReactNode;
  selected: boolean;
  onSelect: () => void;
};

/**
 * A full-width option with its consequence spelled out underneath. Used where
 * the choice has a downstream effect the player should understand before
 * making it — availability feeds club readiness (Player & Affiliation §12).
 */
export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        pressableBase,
        "w-full flex-col items-start gap-1 rounded-card border px-4 py-3.5 text-left",
        selected ? SELECTED : UNSELECTED,
      )}
    >
      <span className="text-base font-semibold">{label}</span>
      {description ? (
        <span
          className={cn(
            "text-sm",
            selected ? "text-on-primary/80" : "text-fg-muted",
          )}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
