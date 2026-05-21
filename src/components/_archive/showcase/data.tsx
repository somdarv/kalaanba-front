"use client";

/* =====================================================================
   KX TRACK 1 · DATA PRIMITIVES
     - KxFormPills               (last-N results dot row)
     - KxStatTileSpark           (number + label + sparkline + trend)
     - KxFixtureSkeleton         (placeholder for fixture cards)
     - KxRowSkeleton             (placeholder for table rows)
     - KxStatSkeleton            (placeholder for stat tiles)
   All scoped under .kx-root. Token-driven for light + dark.
   ===================================================================== */

import {
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxFormPills --------------------------- */

export type FormResult = "W" | "L" | "D";

export function KxFormPills({
  results,
  size = "md",
  className,
}: {
  results: FormResult[];                 // last-N, oldest → newest
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-[11px]";
  return (
    <div className={cn("inline-flex items-center gap-1", className)} aria-label="Form">
      {results.map((r, i) => (
        <span
          key={i}
          aria-label={r === "W" ? "Win" : r === "L" ? "Loss" : "Draw"}
          className={cn(
            "grid place-items-center rounded-full font-extrabold uppercase tracking-tight",
            "[font-family:var(--kx-font-display)]",
            dim,
            r === "W" &&
              "bg-[color-mix(in_oklab,var(--kx-success)_18%,transparent)] text-[var(--kx-success)]",
            r === "L" &&
              "bg-[color-mix(in_oklab,var(--kx-danger)_18%,transparent)] text-[var(--kx-danger)]",
            r === "D" &&
              "bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)]",
          )}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

/* --------------------------- KxStatTileSpark --------------------------- */
/* Number + label + sparkline + delta arrow. Sparkline drawn as an SVG
   polyline on a 100x32 viewBox with a soft area fill. */

export function KxStatTileSpark({
  value,
  label,
  series,
  delta,
  decimals = 0,
  prefix,
  suffix,
  tone = "pink",
  className,
}: {
  value: number;
  label: string;
  series: number[];
  delta?: number;          // +12 / -3 ; sign decides arrow color
  decimals?: number;
  prefix?: string;
  suffix?: string;
  tone?: "pink" | "blue" | "success" | "warning";
  className?: string;
}) {
  const accent =
    tone === "blue"
      ? "var(--kx-blue)"
      : tone === "success"
        ? "var(--kx-success)"
        : tone === "warning"
          ? "var(--kx-warning)"
          : "var(--kx-pink)";

  const path = useMemo(() => buildSparkline(series, 100, 32), [series]);
  const trendUp = (delta ?? 0) >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] p-4 sm:p-5 shadow-[var(--kx-shadow-md)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--kx-fg-muted)]">
            {label}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5 [font-family:var(--kx-font-display)] text-[28px] font-extrabold leading-none tracking-tight text-[var(--kx-fg)]">
            {prefix ? <span className="text-[16px] text-[var(--kx-fg-muted)]">{prefix}</span> : null}
            <span className="tabular-nums">{value.toFixed(decimals)}</span>
            {suffix ? <span className="text-[14px] text-[var(--kx-fg-muted)]">{suffix}</span> : null}
          </div>
        </div>
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
              trendUp
                ? "bg-[color-mix(in_oklab,var(--kx-success)_16%,transparent)] text-[var(--kx-success)]"
                : "bg-[color-mix(in_oklab,var(--kx-danger)_16%,transparent)] text-[var(--kx-danger)]",
            )}
          >
            {trendUp ? <CaretUp size={10} weight="bold" /> : <CaretDown size={10} weight="bold" />}
            {Math.abs(delta)}
          </span>
        ) : null}
      </div>

      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className="mt-3 block h-10 w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={`spark-fill-${tone}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path.area} fill={`url(#spark-fill-${tone})`} />
        <path d={path.line} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function buildSparkline(series: number[], w: number, h: number) {
  if (series.length < 2) return { line: "", area: "" };
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const step = w / (series.length - 1);
  const pts = series.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return { line, area };
}

/* --------------------------- KxFixtureSkeleton --------------------------- */

export function KxFixtureSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <SkBlock w="w-20" h="h-3" />
        <SkBlock w="w-12" h="h-4" rounded="rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-3">
          <SkBlock w="w-10" h="h-10" rounded="rounded-full" />
          <SkBlock w="w-24" h="h-3" />
        </div>
        <SkBlock w="w-10" h="h-10" rounded="rounded-full" />
        <div className="flex items-center justify-end gap-3">
          <SkBlock w="w-24" h="h-3" />
          <SkBlock w="w-10" h="h-10" rounded="rounded-full" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <SkBlock w="w-32" h="h-2.5" />
        <SkBlock w="w-16" h="h-4" rounded="rounded-full" />
      </div>
    </div>
  );
}

/* --------------------------- KxRowSkeleton --------------------------- */

export function KxRowSkeleton({
  cols = 5,
  className,
}: {
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-3 rounded-[var(--kx-r-tile)] bg-[var(--kx-card)] px-3 py-3",
        className,
      )}
      style={{ gridTemplateColumns: `auto 1fr repeat(${cols - 2}, 60px)` }}
    >
      <SkBlock w="w-7" h="h-7" rounded="rounded-full" />
      <div className="flex flex-col gap-1.5">
        <SkBlock w="w-32" h="h-3" />
        <SkBlock w="w-20" h="h-2.5" />
      </div>
      {Array.from({ length: cols - 2 }).map((_, i) => (
        <SkBlock key={i} w="w-10" h="h-3" />
      ))}
    </div>
  );
}

/* --------------------------- KxStatSkeleton --------------------------- */

export function KxStatSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4",
        className,
      )}
    >
      <SkBlock w="w-16" h="h-2.5" />
      <SkBlock w="w-20" h="h-7" className="mt-2" />
      <SkBlock w="w-full" h="h-10" className="mt-3" />
    </div>
  );
}

/* --------------------------- shared shimmer block --------------------------- */

function SkBlock({
  w,
  h,
  rounded = "rounded-md",
  className,
}: {
  w: string;
  h: string;
  rounded?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block overflow-hidden", w, h, rounded, className)}
      style={{
        background:
          "linear-gradient(90deg, var(--kx-card-2) 0%, color-mix(in srgb, var(--kx-fg) 8%, var(--kx-card-2)) 50%, var(--kx-card-2) 100%)",
        backgroundSize: "200% 100%",
        animation: "kx-shimmer 1.6s linear infinite",
      }}
    />
  );
}

/* placate unused-import linter */
export type _DataExtra = HTMLAttributes<HTMLDivElement> & { _: ReactNode };
