"use client";

import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * `<LiveSurface>` — opt-in ambient surface treatment.
 *
 * Rebuilt from legacy `KxAuroraCard` / `KxMeshCard` / `KxTintedCard`
 * (`src/components/_archive/showcase/experiments.tsx`). One primitive,
 * four `variant`s — the rich effects vocabulary lives here so individual
 * primitives can stay calm by default. Premium treatment, opt-in only.
 *
 * Variants:
 *   - `tinted`   — static single-tone radial wash. Always safe. Calmest.
 *   - `aurora`   — two soft blobs drift across the surface
 *                  (`kx-aurora-a` + `kx-aurora-b` keyframes in globals).
 *   - `mesh`     — multi-stop radial mesh with two layers in opposite
 *                  drift (`kx-mesh-a` + `kx-mesh-b`).
 *   - `glass`    — frosted glass: translucent fill, backdrop-blur,
 *                  hairline top-edge highlight. Static. Best for top-bars,
 *                  overlays, and floating chrome.
 *
 * Motion is decorative ambient drift, not user-facing feedback — so the
 * "no translate motion" rule doesn't apply here. The transforms are on
 * decorative pseudo-spans (aria-hidden, pointer-events-none), not on
 * content. The drifting layers carry the `.kx-alive` class, which is
 * the explicit opt-out of the global `prefers-reduced-motion` blanket
 * in `globals.css` — these effects ARE the brand, gentle and slow, and
 * killing them turns premium surfaces into flat cards. If a future use
 * case ever needs a non-living LiveSurface for accessibility-critical
 * contexts, use `variant="tinted"` (static) or `variant="glass"`.
 *
 * Tones reference semantic palette (`--primary`, `--accent`, …), not the
 * legacy `--kx-*` variables. The same component works in light and dark.
 */

export type LiveSurfaceVariant = "tinted" | "aurora" | "mesh" | "glass";

export type LiveSurfaceTone =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type LiveSurfaceProps<E extends ElementType = "div"> = {
  variant?: LiveSurfaceVariant;
  /** Primary tone (used by tinted/aurora/mesh). Default `primary`. */
  toneA?: LiveSurfaceTone;
  /** Secondary tone (used by aurora/mesh). Default `accent`. */
  toneB?: LiveSurfaceTone;
  /** Wash strength for `tinted` variant, 0–30 typical. Default 14. */
  intensity?: number;
  /** Render as another element. Default `div`. */
  as?: E;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

const TONE: Record<LiveSurfaceTone, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

/** Shared shell — every variant wears the same card chrome. */
const SHELL =
  "relative overflow-hidden rounded-card border border-border bg-surface text-fg shadow-md";

export function LiveSurface({
  variant = "tinted",
  toneA = "primary",
  toneB = "accent",
  intensity = 14,
  as,
  className,
  children,
  ...rest
}: LiveSurfaceProps) {
  const Component = (as ?? "div") as ElementType;
  const a = TONE[toneA];
  const b = TONE[toneB];

  // Tinted: static, no animation, simplest variant.
  if (variant === "tinted") {
    const style: CSSProperties = {
      backgroundImage: `radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, ${a} ${intensity}%, transparent) 0%, transparent 60%)`,
    };
    return (
      <Component
        className={cn(SHELL, "p-5 sm:p-6", className)}
        style={style}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  // Glass: frosted, static. Backdrop-blur is the whole point.
  if (variant === "glass") {
    return (
      <Component
        className={cn(
          SHELL,
          "p-5 sm:p-6",
          "bg-surface/60 backdrop-blur-xl",
          // Hairline top-edge highlight — sells the glass.
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-fg/15 before:to-transparent",
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  // Aurora: two blobs drift across the card.
  if (variant === "aurora") {
    return (
      <Component
        className={cn(SHELL, "p-5 sm:p-6", className)}
        {...rest}
      >
        <span
          aria-hidden
          className="kx-alive pointer-events-none absolute -left-1/4 -top-1/3 h-[140%] w-[80%] rounded-pill opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(closest-side, color-mix(in oklab, ${a} 32%, transparent), transparent 70%)`,
            animation: "kx-aurora-a 14s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />
        <span
          aria-hidden
          className="kx-alive pointer-events-none absolute -bottom-1/3 -right-1/4 h-[140%] w-[80%] rounded-pill opacity-60 blur-3xl"
          style={{
            background: `radial-gradient(closest-side, color-mix(in oklab, ${b} 28%, transparent), transparent 70%)`,
            animation: "kx-aurora-b 18s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />
        <div className="relative">{children}</div>
      </Component>
    );
  }

  // Mesh: multi-stop radial, two opposing-drift layers.
  return (
    <Component
      className={cn(SHELL, "p-5 sm:p-6", className)}
      {...rest}
    >
      <span
        aria-hidden
        className="kx-alive pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(45% 60% at 20% 22%, color-mix(in oklab, ${a} 30%, transparent) 0%, transparent 72%),
            radial-gradient(48% 55% at 82% 14%, color-mix(in oklab, ${b} 28%, transparent) 0%, transparent 72%)
          `,
          animation: "kx-mesh-a 18s ease-in-out infinite alternate",
          filter: "blur(2px)",
          willChange: "transform",
        }}
      />
      <span
        aria-hidden
        className="kx-alive pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(55% 60% at 75% 88%, color-mix(in oklab, ${a} 22%, transparent) 0%, transparent 72%),
            radial-gradient(45% 55% at 12% 92%, color-mix(in oklab, ${b} 22%, transparent) 0%, transparent 72%)
          `,
          animation: "kx-mesh-b 24s ease-in-out infinite alternate",
          filter: "blur(3px)",
          willChange: "transform",
        }}
      />
      <div className="relative">{children}</div>
    </Component>
  );
}
