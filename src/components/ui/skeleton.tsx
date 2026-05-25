import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Match the height of the eventual content. */
  height?: number | string;
  /** Match the width of the eventual content. */
  width?: number | string;
  /** Pill (default) or rounded. */
  shape?: "pill" | "rect";
};

/**
 * `<Skeleton>` — loading placeholder. A gentle shimmer (opacity pulse only,
 * never translate) keeps within the no-movement rule for state changes
 * (DESIGN_LANGUAGE §3.1). Respects reduced motion.
 */
export function Skeleton({
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
      className={cn(
        "bg-fg/10 motion-safe:animate-pulse",
        shape === "pill" ? "rounded-full" : "rounded-md",
        className,
      )}
      {...rest}
    />
  );
}
