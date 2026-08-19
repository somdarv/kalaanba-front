"use client";

import { useId } from "react";

import type { LabelledOption } from "@/lib/api/player";
import { cn } from "@/lib/cn";

/**
 * Position picker rendered as a pitch.
 *
 * A dropdown asks "which of these four strings applies to you"; a pitch asks
 * "where do you stand", which is the question the player already knows the
 * answer to. Underneath it is an ordinary radio group — arrow keys move
 * between bands, the focus ring is the canonical one, and the label text
 * carries the meaning without relying on position alone (DESIGN_LANGUAGE §6).
 *
 * Options and their order come from config (`player.positions`, ADR-0007), so
 * a fifth position key added by an admin renders a fifth band with no code
 * change. Config lists positions back-to-front, which is why the array is
 * reversed for display: the goalkeeper belongs at the bottom of the pitch.
 */

export type PitchPickerProps = {
  options: ReadonlyArray<LabelledOption>;
  value: string;
  onChange: (key: string) => void;
  /** Accessible name for the group. */
  legend: string;
  name?: string;
};

export function PitchPicker({
  options,
  value,
  onChange,
  legend,
  name,
}: PitchPickerProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const bands = [...options].reverse();

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div className="relative overflow-hidden rounded-card border border-border bg-surface-elev">
        <PitchMarkings />
        <div className="relative flex min-h-80 flex-col gap-1 p-1">
          {bands.map((option) => {
            const selected = option.key === value;
            return (
              <label
                key={option.key}
                className={cn(
                  "group relative flex min-h-11 flex-1 cursor-pointer items-center justify-center",
                  "rounded-row border border-transparent px-3 text-center select-none",
                  "transition-[background-color,color,border-color] duration-quick ease-out",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                  "has-[:focus-visible]:outline-focus-ring",
                  selected
                    ? "border-transparent bg-primary text-on-primary shadow-[var(--shadow-sm)]"
                    : "text-fg-muted hover:border-border-strong hover:bg-[color-mix(in_oklab,transparent,var(--fg)_6%)] hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={option.key}
                  checked={selected}
                  onChange={() => onChange(option.key)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "font-display text-lg font-semibold tracking-tight",
                    selected && "text-on-primary",
                  )}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

/**
 * Pitch lines, drawn once behind the bands. Decorative — the bands carry all
 * the meaning, so this is hidden from assistive tech. Stroke inherits
 * `--border-strong` so it moves with the theme instead of pinning a colour.
 */
function PitchMarkings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 140"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-border-strong"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        opacity={0.7}
      >
        <rect x={4} y={4} width={92} height={132} rx={2} />
        <line x1={4} y1={70} x2={96} y2={70} />
        <circle cx={50} cy={70} r={14} />
        <rect x={26} y={4} width={48} height={20} />
        <rect x={26} y={116} width={48} height={20} />
        <rect x={38} y={4} width={24} height={8} />
        <rect x={38} y={128} width={24} height={8} />
      </g>
    </svg>
  );
}
