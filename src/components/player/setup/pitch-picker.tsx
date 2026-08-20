"use client";

import { useMemo, useRef, type KeyboardEvent } from "react";

import type { PositionOption } from "@/lib/api/player";
import { cn } from "@/lib/cn";

import {
  PITCH_LAYOUT,
  PITCH_VIEWBOX,
  PITCH_ZONE_LABELS,
} from "./pitch-layout";

/**
 * Position picker rendered as a real pitch.
 *
 * A dropdown asks "which of these strings applies to you"; a pitch asks "where
 * do you stand", which is the question the player already knows the answer to.
 *
 * **One SVG, one viewBox, aspect ratio preserved.** The first version of this
 * stretched a `preserveAspectRatio="none"` backdrop under HTML markers placed
 * in percentages. Two things went wrong and both were structural: the markings
 * distorted to whatever shape the box happened to be, and the turf depended on
 * Tailwind resolving a custom property through a utility, which left a black
 * pitch when it did not. Everything is now painted inside one SVG in its own
 * coordinate space, so the drawing is the drawing at every size.
 *
 * **One choice.** Not a formation builder. Choosing another marker moves the
 * selection rather than adding to it.
 *
 * **Config owns the options, this file owns the drawing.** Keys, labels, short
 * forms, descriptions and order come from `player.positions*` (ADR-0007).
 * Coordinates come from `PITCH_LAYOUT`. A key with no coordinate falls through
 * to a list under the pitch, so an admin adding a position can never make it
 * unselectable.
 *
 * Accessibility: the SVG is a real `radiogroup`. Each marker is a `radio` with
 * its full label, roving `tabIndex` so the group is one tab stop, and arrow
 * keys walking the options in config order (WAI-ARIA radio group pattern).
 * Turf is `--pitch-*` (ADR-0011), theme-stable the way a photograph is.
 */

export type PitchPickerProps = {
  options: ReadonlyArray<PositionOption>;
  value: string;
  onChange: (key: string) => void;
  /** Accessible name for the group. */
  legend: string;
};

const MARKER_RADIUS = 19;
const MARKER_RADIUS_SELECTED = 23;

export function PitchPicker({
  options,
  value,
  onChange,
  legend,
}: PitchPickerProps) {
  const groupRef = useRef<SVGGElement>(null);

  const { placed, unplaced } = useMemo(() => {
    const on: Array<PositionOption & { x: number; y: number }> = [];
    const off: PositionOption[] = [];
    for (const option of options) {
      const spot = PITCH_LAYOUT[option.key];
      if (spot) on.push({ ...option, x: spot.x, y: spot.y });
      else off.push(option);
    }
    return { placed: on, unplaced: off };
  }, [options]);

  const selected = options.find((option) => option.key === value) ?? null;
  const activeIndex = Math.max(
    0,
    placed.findIndex((option) => option.key === value),
  );

  /** Arrow keys walk the markers; space and enter choose. */
  const handleKeyDown = (index: number) => (event: KeyboardEvent) => {
    const last = placed.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = index === 0 ? last : index - 1;
    } else if (event.key === " " || event.key === "Enter") {
      onChange(placed[index]!.key);
      event.preventDefault();
      return;
    }
    if (next === null) return;
    event.preventDefault();
    const target = placed[next];
    if (!target) return;
    onChange(target.key);
    groupRef.current
      ?.querySelector<SVGGElement>(`[data-key="${target.key}"]`)
      ?.focus();
  };

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>

      <div className="overflow-hidden rounded-card shadow-(--shadow-md)">
        <svg
          viewBox={`0 0 ${PITCH_VIEWBOX.width} ${PITCH_VIEWBOX.height}`}
          className="block w-full touch-manipulation select-none"
          role="radiogroup"
          aria-label={legend}
        >
          {/* Turf: plain rects, no <defs>, no ids, no url(#...) references.
              The version before this used a gradient and a pattern keyed by
              `useId()`, and `useId()` returns something like `«r0»` — the
              guillemets make `url(#«r0»)` an invalid reference, so neither
              paint server resolved and every shape fell back to black. That
              is what turned the whole pitch into a black rectangle. Ten rects
              cost nothing and cannot fail that way.

              Paint goes through `style`, not a `fill=` attribute. A presentation
              attribute is the weakest link in the chain for `var()`, and there
              is no reason to depend on it when the CSS property is exact. */}
          <rect
            width="460"
            height="600"
            style={{ fill: "var(--pitch-turf)" }}
          />
          {Array.from({ length: 10 }).map((_, band) =>
            band % 2 === 0 ? (
              <rect
                key={band}
                x="0"
                y={band * 60}
                width="460"
                height="60"
                style={{ fill: "var(--pitch-turf-alt)" }}
              />
            ) : null,
          )}

          {/* Markings */}
          <g
            fill="none"
            strokeWidth="2"
            style={{ stroke: "var(--pitch-line)" }}
            aria-hidden="true"
          >
            <rect x="28" y="20" width="404" height="560" rx="2" />
            <line x1="28" y1="300" x2="432" y2="300" />
            <circle cx="230" cy="300" r="60" />
            <circle cx="230" cy="300" r="3" stroke="none" style={{ fill: "var(--pitch-line)" }} />

            {/* Attacking end */}
            <rect x="103" y="20" width="254" height="90" />
            <rect x="163" y="20" width="134" height="36" />
            <circle cx="230" cy="76" r="2.5" stroke="none" style={{ fill: "var(--pitch-line)" }} />
            <path d="M 174 110 A 60 60 0 0 0 286 110" />
            <rect x="183" y="10" width="94" height="10" />

            {/* Defending end */}
            <rect x="103" y="490" width="254" height="90" />
            <rect x="163" y="544" width="134" height="36" />
            <circle cx="230" cy="524" r="2.5" stroke="none" style={{ fill: "var(--pitch-line)" }} />
            <path d="M 174 490 A 60 60 0 0 1 286 490" />
            <rect x="183" y="580" width="94" height="10" />

            {/* Corner arcs */}
            <path d="M 28 30 A 10 10 0 0 0 38 20" />
            <path d="M 422 20 A 10 10 0 0 0 432 30" />
            <path d="M 28 570 A 10 10 0 0 1 38 580" />
            <path d="M 422 580 A 10 10 0 0 1 432 570" />
          </g>

          {/* Zone labels down the right touchline */}
          {PITCH_ZONE_LABELS.map((band) => (
            <text
              key={band.zone}
              x="446"
              y={band.y}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              letterSpacing="2"
              opacity="0.35"
              style={{ fill: "var(--on-pitch)" }}
              transform={`rotate(-90 446 ${band.y})`}
              aria-hidden="true"
            >
              {band.label.toUpperCase()}
            </text>
          ))}

          <text
            x="230"
            y="597"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            letterSpacing="1.5"
            opacity="0.35"
            style={{ fill: "var(--on-pitch)" }}
            aria-hidden="true"
          >
            YOU ATTACK THIS WAY ↑
          </text>

          {/* Markers */}
          <g ref={groupRef}>
            {placed.map((option, index) => {
              const isSelected = option.key === value;
              return (
                <g
                  key={option.key}
                  data-key={option.key}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={option.label}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => onChange(option.key)}
                  onKeyDown={handleKeyDown(index)}
                  className="cursor-pointer outline-none [&:focus-visible>circle.ring]:opacity-100"
                >
                  {/* Touch target. Invisible, 48px across in pitch units, so a
                      thumb never has to find a 38px dot (§9.1). */}
                  <circle cx={option.x} cy={option.y} r={26} fill="transparent" />

                  {/* Focus / selection ring */}
                  <circle
                    className="ring transition-opacity duration-quick"
                    cx={option.x}
                    cy={option.y}
                    r={MARKER_RADIUS_SELECTED + 6}
                    fill="none"
                    strokeWidth="2.5"
                    opacity={isSelected ? 0.55 : 0}
                    style={{
                      stroke: isSelected
                        ? "var(--primary)"
                        : "var(--focus-ring)",
                    }}
                  />

                  <circle
                    cx={option.x}
                    cy={option.y}
                    r={isSelected ? MARKER_RADIUS_SELECTED : MARKER_RADIUS}
                    fillOpacity={isSelected ? 1 : 0.18}
                    strokeOpacity={isSelected ? 0 : 0.45}
                    strokeWidth="1.5"
                    className="transition-all duration-quick"
                    style={{
                      fill: isSelected ? "var(--primary)" : "var(--on-pitch)",
                      stroke: "var(--on-pitch)",
                    }}
                  />

                  <text
                    x={option.x}
                    y={option.y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    className="pointer-events-none select-none"
                    style={{
                      fill: isSelected
                        ? "var(--on-primary)"
                        : "var(--on-pitch)",
                    }}
                  >
                    {option.abbreviation ??
                      option.label.slice(0, 2).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* The readout sits OFF the turf, on the page's own ground. It is not
            part of the pitch: it is the answer the pitch produced, and on green
            it read as a stray label lying on the grass. Out here it reads as
            the confirmation of a choice, which is what it is. */}
        <div className="min-h-18 border-t border-border bg-surface-elev px-4 py-3 text-center">
          {selected ? (
            <>
              <p className="font-display text-xl leading-tight font-bold tracking-tight text-fg">
                {selected.label}
              </p>
              {selected.description ? (
                <p className="mt-1 text-sm leading-snug text-fg-muted">
                  {selected.description}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-fg-muted">
              Tap the spot where you play.
            </p>
          )}
        </div>
      </div>

      {/* Any configured position with no coordinate yet. Normally empty. */}
      {unplaced.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {unplaced.map((option) => (
            <label
              key={option.key}
              className={cn(
                "cursor-pointer rounded-pill border px-4 py-2.5 text-sm font-medium",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                "has-[:focus-visible]:outline-focus-ring",
                option.key === value
                  ? "border-transparent bg-primary text-on-primary"
                  : "border-border bg-surface-elev text-fg hover:border-border-strong",
              )}
            >
              <input
                type="radio"
                name="pitch-unplaced"
                value={option.key}
                checked={option.key === value}
                onChange={() => onChange(option.key)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
