"use client";

import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * `<Skeleton>` — loading placeholder.
 *
 * A subtle shimmer (animated `background-position`, never `transform`)
 * keeps within the no-movement rule for state changes
 * (DESIGN_LANGUAGE §3.1). The animation pauses for users who prefer
 * reduced motion via `motion-safe:`.
 *
 * Single-element use:
 *   <Skeleton width={120} height={16} />
 *
 * Composite recipes (attached as sub-components):
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Avatar size="md" />
 *   <Skeleton.Button />
 *   <Skeleton.Card />  // card-shaped composite for list/grid items
 *
 * Every list, table, card, and profile should render a Skeleton during
 * its cold-load state (COMPONENT_INVENTORY §0.4).
 */

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Match the height of the eventual content. Number → px. */
  height?: number | string;
  /** Match the width of the eventual content. Number → px. */
  width?: number | string;
  /** Corner shape. */
  shape?: "rect" | "pill" | "circle";
};

const BASE =
  "block overflow-hidden bg-fg/10 motion-safe:[background-image:linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--fg)_14%,transparent)_50%,transparent_100%)] motion-safe:[background-size:200%_100%] motion-safe:[animation:kx-shimmer_1.6s_linear_infinite] motion-reduce:opacity-70";

const SHAPE: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  rect: "rounded-md",
  pill: "rounded-pill",
  circle: "rounded-pill",
};

function SkeletonBase({
  height,
  width,
  shape = "rect",
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      style={{ height, width, ...style }}
      className={cn(BASE, SHAPE[shape], className)}
      {...rest}
    />
  );
}

/* --------------------------- Sub-recipes --------------------------- */

export type SkeletonTextProps = {
  /** How many lines to render. Default 3. */
  lines?: number;
  /** Line height in px or any CSS length. Default `0.875rem`. */
  lineHeight?: number | string;
  /** Width of the final line as a CSS length or percent. Default `60%`. */
  lastLineWidth?: number | string;
  /** Gap between lines. Default `0.5rem`. */
  gap?: number | string;
  className?: string;
};

function SkeletonText({
  lines = 3,
  lineHeight = "0.875rem",
  lastLineWidth = "60%",
  gap = "0.5rem",
  className,
}: SkeletonTextProps) {
  const count = Math.max(1, lines);
  return (
    <div
      aria-hidden
      data-slot="skeleton-text"
      className={cn("flex w-full flex-col", className)}
      style={{ gap }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isLast = i === count - 1 && count > 1;
        const style: CSSProperties = {
          height: lineHeight,
          width: isLast ? lastLineWidth : "100%",
        };
        return (
          <div
            key={i}
            className={cn(BASE, "rounded-md")}
            style={style}
          />
        );
      })}
    </div>
  );
}

export type SkeletonAvatarProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const AVATAR_SIZE: Record<NonNullable<SkeletonAvatarProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton-avatar"
      className={cn(BASE, "shrink-0 rounded-pill", AVATAR_SIZE[size], className)}
    />
  );
}

export type SkeletonButtonProps = {
  /** Visual height. Default `md` (44 px floor). */
  size?: "sm" | "md" | "lg";
  /** Approximate width — defaults to a sensible button width. */
  width?: number | string;
  className?: string;
};

const BUTTON_HEIGHT: Record<NonNullable<SkeletonButtonProps["size"]>, string> = {
  sm: "h-11",
  md: "h-12",
  lg: "h-13",
};

function SkeletonButton({
  size = "md",
  width = "8rem",
  className,
}: SkeletonButtonProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton-button"
      style={{ width }}
      className={cn(BASE, "rounded-pill", BUTTON_HEIGHT[size], className)}
    />
  );
}

export type SkeletonCardProps = {
  /** Show a small avatar + title row at the top. Default true. */
  withAvatar?: boolean;
  /** How many body text lines. Default 2. */
  lines?: number;
  className?: string;
};

/**
 * Card-shaped composite for list/grid item cold-loads. Mirrors the
 * proportions of a typical content card (avatar + title row, body text,
 * action footer).
 */
function SkeletonCard({
  withAvatar = true,
  lines = 2,
  className,
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton-card"
      className={cn(
        "flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-5",
        className,
      )}
    >
      {withAvatar ? (
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className={cn(BASE, "h-3 w-2/5 rounded-md")} />
            <div className={cn(BASE, "h-2.5 w-1/4 rounded-md")} />
          </div>
        </div>
      ) : (
        <div className={cn(BASE, "h-4 w-2/3 rounded-md")} />
      )}
      <SkeletonText lines={lines} />
      <div className="flex items-center gap-2 pt-1">
        <SkeletonButton size="sm" width="5rem" />
        <SkeletonButton size="sm" width="4rem" />
      </div>
    </div>
  );
}

/* --------------------------- Public surface --------------------------- */

export const Skeleton = Object.assign(SkeletonBase, {
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Card: SkeletonCard,
});
