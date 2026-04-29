"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* =====================================================================
   KX EXPERIMENTS — Vet-first surface treatments.
   Three living-surface options for cards & containers:
     1. <KxAuroraCard>   — dual-color aurora that drifts via @keyframes
     2. <KxTintedCard>   — single-tone soft wash (the "alive" baseline)
     3. <KxMeshCard>     — multi-stop radial mesh that very slowly morphs
   All scoped under .kx-root, all token-driven (light + dark).
   Animations respect prefers-reduced-motion via the global rule.
   ===================================================================== */

/* --------------------------- KxTintedCard --------------------------- */
/* Soft single-color wash from one corner. Static. The "calm" baseline
   for surfaces that should feel alive but not move. */

export function KxTintedCard({
  tone = "pink",
  intensity = 14,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: "pink" | "blue" | "success" | "warning" | "danger";
  intensity?: number; // 0–30 typical
}) {
  const c = TONE[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] p-5 sm:p-6 shadow-[var(--kx-shadow-md)]",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, ${c} ${intensity}%, transparent) 0%, transparent 60%)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* --------------------------- KxAuroraCard --------------------------- */
/* Two soft blobs drift across the surface. Cheap (transform on a
   pseudo via inline span). Looks alive without being distracting. */

export function KxAuroraCard({
  toneA = "pink",
  toneB = "blue",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  toneA?: keyof typeof TONE;
  toneB?: keyof typeof TONE;
}) {
  const a = TONE[toneA];
  const b = TONE[toneB];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] p-5 sm:p-6 shadow-[var(--kx-shadow-md)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -left-1/4 h-[140%] w-[80%] rounded-full opacity-70 blur-3xl"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, ${a} 32%, transparent), transparent 70%)`,
          animation: "kx-aurora-a 14s ease-in-out infinite alternate",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[140%] w-[80%] rounded-full opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, ${b} 28%, transparent), transparent 70%)`,
          animation: "kx-aurora-b 18s ease-in-out infinite alternate",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* --------------------------- KxMeshCard --------------------------- */
/* A multi-stop radial mesh that morphs by slowly swapping conic
   gradient angles (very slow, very subtle). Premium. */

export function KxMeshCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] p-5 sm:p-6 shadow-[var(--kx-shadow-md)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(40% 60% at 18% 20%, color-mix(in oklab, var(--kx-pink) 22%, transparent) 0%, transparent 70%),
            radial-gradient(45% 55% at 82% 12%, color-mix(in oklab, var(--kx-blue) 22%, transparent) 0%, transparent 70%),
            radial-gradient(50% 60% at 70% 90%, color-mix(in oklab, var(--kx-pink) 14%, transparent) 0%, transparent 70%),
            radial-gradient(40% 50% at 10% 95%, color-mix(in oklab, var(--kx-blue) 14%, transparent) 0%, transparent 70%)
          `,
          animation: "kx-mesh-morph 22s ease-in-out infinite alternate",
          filter: "blur(2px)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* --------------------------- internal: tone map --------------------------- */

const TONE = {
  pink:    "var(--kx-pink)",
  blue:    "var(--kx-blue)",
  success: "var(--kx-success)",
  warning: "var(--kx-warning)",
  danger:  "var(--kx-danger)",
} as const;

/* Helper to use inside an experiment cell — title + caption stack. */
export function KxExperimentLabel({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
        {title}
      </div>
      <div className="[font-family:var(--kx-font-display)] text-[18px] font-extrabold tracking-tight text-[var(--kx-fg)]">
        {caption}
      </div>
      {children}
    </div>
  );
}
