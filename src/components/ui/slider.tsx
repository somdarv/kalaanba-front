"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Slider primitives:
 *  - `Slider`       — single-thumb range input (controlled).
 *  - `RangeSlider`  — two-thumb range with `[min, max]` value.
 *
 * Both share the same visual recipe: a 6 px track on `bg-surface-elev`
 * with a brand-filled progress segment and a white 20 px thumb ringed
 * in primary. Keyboard: ←/→ adjust by step, Shift+←/→ jumps by 10×,
 * Home/End jump to bounds.
 *
 * Pointer handling is done on the track + window pointermove so that
 * dragging works even when the cursor leaves the thumb (industry
 * standard behaviour).
 */

type Bounds = {
  min: number;
  max: number;
  step: number;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, step: number, min: number): number {
  if (step <= 0) return n;
  const offset = n - min;
  const snapped = Math.round(offset / step) * step + min;
  // Avoid floating-point drift like 0.30000000000000004.
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(snapped.toFixed(decimals));
}

function pctOf({ min, max }: Bounds, value: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function nextStep(
  current: number,
  delta: number,
  bounds: Bounds,
  multiplier: number,
): number {
  const moved = current + delta * bounds.step * multiplier;
  return clamp(snap(moved, bounds.step, bounds.min), bounds.min, bounds.max);
}

function valueFromClient(
  trackRect: DOMRect,
  clientX: number,
  bounds: Bounds,
): number {
  const ratio = clamp(
    (clientX - trackRect.left) / trackRect.width,
    0,
    1,
  );
  const raw = bounds.min + ratio * (bounds.max - bounds.min);
  return clamp(snap(raw, bounds.step, bounds.min), bounds.min, bounds.max);
}

export type SliderProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  showValue?: boolean;
  /** Optional formatter for the trailing value label. */
  formatValue?: (n: number) => string;
  name?: string;
  "aria-label"?: string;
};

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  hint,
  error,
  disabled,
  showValue = true,
  formatValue,
  name,
  "aria-label": ariaLabel,
}: SliderProps) {
  const fieldId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bounds: Bounds = useMemo(() => ({ min, max, step }), [min, max, step]);
  const hasError = Boolean(error);

  const commit = useCallback(
    (next: number) => {
      if (next !== value) onChange(next);
    },
    [onChange, value],
  );

  const handlePointer = (clientX: number) => {
    if (!trackRef.current) return;
    const next = valueFromClient(
      trackRef.current.getBoundingClientRect(),
      clientX,
      bounds,
    );
    commit(next);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handlePointer(e.clientX);
    // rAF-throttle pointermove: never queue more updates than the
    // screen can paint. Without this, fast drags fire 100+ React
    // state updates per second and the thumb appears to lag.
    let pendingX: number | null = null;
    let rafId = 0;
    const flush = () => {
      rafId = 0;
      if (pendingX != null) {
        handlePointer(pendingX);
        pendingX = null;
      }
    };
    const onMove = (ev: PointerEvent) => {
      pendingX = ev.clientX;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const big = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      commit(nextStep(value, +1, bounds, big));
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      commit(nextStep(value, -1, bounds, big));
      e.preventDefault();
    } else if (e.key === "Home") {
      commit(min);
      e.preventDefault();
    } else if (e.key === "End") {
      commit(max);
      e.preventDefault();
    }
  };

  const pct = pctOf(bounds, value);
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className="w-full">
      {label || showValue ? (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label ? (
            <label
              htmlFor={fieldId}
              className={cn(
                "text-sm font-medium",
                hasError ? "text-danger-ink" : "text-fg",
              )}
            >
              {label}
            </label>
          ) : (
            <span aria-hidden />
          )}
          {showValue ? (
            <span className="text-sm font-semibold tabular-nums text-fg">
              {display}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative h-10 touch-none select-none",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onPointerDown={onPointerDown}
      >
        <div
          ref={trackRef}
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-pill bg-surface-elev",
          )}
        >
          <div
            aria-hidden
            className="absolute left-0 top-0 h-full rounded-pill bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div
          id={fieldId}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={display}
          aria-label={label ? undefined : ariaLabel}
          aria-disabled={disabled || undefined}
          aria-invalid={hasError || undefined}
          onKeyDown={onKeyDown}
          className={cn(
            // Pointer events are handled by the wrapper — thumb is purely visual.
            "pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-pill",
            "bg-white ring-2 ring-primary shadow-md",
            "focus-visible:outline-none focus-visible:ring-[3px]",
          )}
          style={{ left: `${pct}%` }}
        />

        {name ? (
          <input
            type="hidden"
            name={name}
            value={value}
            readOnly
            aria-hidden
          />
        ) : null}
      </div>

      {error || hint ? (
        <p
          className={cn(
            "mt-1.5 text-xs",
            hasError ? "text-danger-ink" : "text-fg-muted",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}

export type RangeSliderProps = {
  value: [number, number];
  onChange: (next: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Minimum gap between thumbs (in value units). Defaults to `step`. */
  minDistance?: number;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  showValue?: boolean;
  formatValue?: (n: number) => string;
  "aria-label"?: string;
};

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  minDistance,
  label,
  hint,
  error,
  disabled,
  showValue = true,
  formatValue,
  "aria-label": ariaLabel,
}: RangeSliderProps) {
  const fieldId = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeThumb = useRef<"lo" | "hi" | null>(null);
  const bounds: Bounds = useMemo(() => ({ min, max, step }), [min, max, step]);
  const gap = minDistance ?? step;
  const hasError = Boolean(error);
  const [lo, hi] = value;

  const commit = (next: [number, number]) => {
    if (next[0] !== value[0] || next[1] !== value[1]) onChange(next);
  };

  const updateThumb = (which: "lo" | "hi", raw: number) => {
    if (which === "lo") {
      const nextLo = clamp(raw, min, hi - gap);
      commit([nextLo, hi]);
    } else {
      const nextHi = clamp(raw, lo + gap, max);
      commit([lo, nextHi]);
    }
  };

  const nearestThumb = (raw: number): "lo" | "hi" => {
    const dLo = Math.abs(raw - lo);
    const dHi = Math.abs(raw - hi);
    return dLo <= dHi ? "lo" : "hi";
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;
    e.preventDefault();
    const raw = valueFromClient(
      trackRef.current.getBoundingClientRect(),
      e.clientX,
      bounds,
    );
    activeThumb.current = nearestThumb(raw);
    updateThumb(activeThumb.current, raw);
    // rAF throttle (see Slider above).
    let pendingX: number | null = null;
    let rafId = 0;
    const flush = () => {
      rafId = 0;
      if (pendingX != null && trackRef.current && activeThumb.current) {
        const next = valueFromClient(
          trackRef.current.getBoundingClientRect(),
          pendingX,
          bounds,
        );
        updateThumb(activeThumb.current, next);
      }
      pendingX = null;
    };
    const onMove = (ev: PointerEvent) => {
      pendingX = ev.clientX;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      activeThumb.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const makeKey =
    (which: "lo" | "hi") => (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const big = e.shiftKey ? 10 : 1;
      const current = which === "lo" ? lo : hi;
      let next = current;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        next = nextStep(current, +1, bounds, big);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        next = nextStep(current, -1, bounds, big);
      } else if (e.key === "Home") {
        next = min;
      } else if (e.key === "End") {
        next = max;
      } else {
        return;
      }
      e.preventDefault();
      updateThumb(which, next);
    };

  const pctLo = pctOf(bounds, lo);
  const pctHi = pctOf(bounds, hi);
  const fmt = formatValue ?? ((n: number) => String(n));

  return (
    <div className="w-full">
      {label || showValue ? (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label ? (
            <span
              id={`${fieldId}-label`}
              className={cn(
                "text-sm font-medium",
                hasError ? "text-danger-ink" : "text-fg",
              )}
            >
              {label}
            </span>
          ) : (
            <span aria-hidden />
          )}
          {showValue ? (
            <span className="text-sm font-semibold tabular-nums text-fg">
              {fmt(lo)} – {fmt(hi)}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "relative h-10 touch-none select-none",
          disabled && "cursor-not-allowed opacity-50",
        )}
        aria-label={label ? undefined : ariaLabel}
        onPointerDown={onPointerDown}
      >
        <div
          ref={trackRef}
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-pill bg-surface-elev",
          )}
        >
          <div
            aria-hidden
            className="absolute top-0 h-full rounded-pill bg-primary"
            style={{
              left: `${pctLo}%`,
              width: `${Math.max(0, pctHi - pctLo)}%`,
            }}
          />
        </div>

        {(["lo", "hi"] as const).map((which) => {
          const v = which === "lo" ? lo : hi;
          const pct = which === "lo" ? pctLo : pctHi;
          return (
            <div
              key={which}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={which === "lo" ? min : lo + gap}
              aria-valuemax={which === "lo" ? hi - gap : max}
              aria-valuenow={v}
              aria-valuetext={fmt(v)}
              aria-labelledby={label ? `${fieldId}-label` : undefined}
              aria-disabled={disabled || undefined}
              onKeyDown={makeKey(which)}
              className={cn(
                // Pointer events handled by the wrapper \u2014 thumb is purely visual.
                "pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-pill",
                "bg-white ring-2 ring-primary shadow-md",
                "focus-visible:outline-none focus-visible:ring-[3px]",
              )}
              style={{ left: `${pct}%` }}
            />
          );
        })}
      </div>

      {error || hint ? (
        <p
          className={cn(
            "mt-1.5 text-xs",
            hasError ? "text-danger-ink" : "text-fg-muted",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
