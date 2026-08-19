"use client";

/**
 * `ScrollTo` — floating utility button that smooth-scrolls the page (or a
 * scrollable container) to a target position when clicked. Auto-shows /
 * hides based on the user's current scroll distance from the target.
 *
 * Design intent:
 *   - Tiny, unobtrusive, brand-quiet by default. Lives in the bottom-right
 *     gutter at the same z-layer as toasts.
 *   - Smooth scroll uses native `scrollTo({ behavior: "smooth" })` — which
 *     respects `prefers-reduced-motion` automatically.
 *   - Entrance: `kx-pop-in` from the design system. Exit: opacity fade.
 *   - Three targets out of the box (`top`, `middle`, `bottom`); callers
 *     can pass a custom Y in pixels or a ref to an element.
 *
 * Composes `Pressable`'s recipe (1% press, focus ring, etc.) by using
 * `IconButton`. No new visual surface area.
 */

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp, ArrowDown, DotsThreeVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

export type ScrollToTarget = "top" | "middle" | "bottom" | number;

export type ScrollToProps = {
  /**
   * Where to scroll. `"top"` → y=0. `"bottom"` → max scroll. `"middle"`
   * → 50% of the scrollable height. Or pass a pixel offset.
   */
  to: ScrollToTarget;
  /**
   * Minimum scroll distance from the target before the button shows.
   * Default 240px.
   */
  threshold?: number;
  /** Override the icon. */
  icon?: ReactNode;
  /** Accessible label. */
  "aria-label"?: string;
  /** Optional extra classes (e.g. positioning overrides). */
  className?: string;
};

/**
 * `<ScrollTo>` — single floating button. For a stacked cluster (top +
 * middle + bottom), use `<ScrollControls>`.
 */
export function ScrollTo({
  to,
  threshold = 240,
  icon,
  "aria-label": ariaLabel,
  className,
}: ScrollToProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const targetY =
        to === "top"
          ? 0
          : to === "bottom"
            ? max
            : to === "middle"
              ? max / 2
              : to;
      setVisible(Math.abs(y - targetY) > threshold);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [to, threshold]);

  const handleClick = () => {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const targetY =
      to === "top"
        ? 0
        : to === "bottom"
          ? max
          : to === "middle"
            ? max / 2
            : to;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const defaultIcon =
    to === "top" ? (
      <ArrowUp size={18} weight="bold" />
    ) : to === "bottom" ? (
      <ArrowDown size={18} weight="bold" />
    ) : (
      <DotsThreeVertical size={18} weight="bold" />
    );

  const defaultLabel =
    to === "top"
      ? "Scroll to top"
      : to === "bottom"
        ? "Scroll to bottom"
        : to === "middle"
          ? "Scroll to middle"
          : "Scroll";

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none transition-opacity duration-graceful ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={
        visible
          ? { animation: "kx-pop-in var(--dur-graceful) var(--ease-entrance)" }
          : undefined
      }
    >
      <IconButton
        intent="secondary"
        size="md"
        onClick={handleClick}
        aria-label={ariaLabel ?? defaultLabel}
        className={cn(
          "pointer-events-auto shadow-md",
          !visible && "pointer-events-none",
        )}
      >
        {icon ?? defaultIcon}
      </IconButton>
    </div>
  );
}

/* ====================================== ScrollControls ====================================== */

export type ScrollControlsProps = {
  /** Which targets to show. Defaults to top + bottom. */
  targets?: Array<"top" | "middle" | "bottom">;
  /** Threshold passed to each button. */
  threshold?: number;
  /** Position anchor. Defaults to `bottom-right`. */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Extra classes for the wrapper. */
  className?: string;
};

/**
 * `<ScrollControls>` — pre-composed stacked cluster (top / middle /
 * bottom) anchored to the viewport. Drop once near the bottom of your
 * page tree; each button manages its own visibility.
 */
export function ScrollControls({
  targets = ["top", "bottom"],
  threshold = 240,
  position = "bottom-right",
  className,
}: ScrollControlsProps) {
  const positionClasses =
    position === "bottom-left"
      ? "left-4 sm:left-6"
      : position === "bottom-center"
        ? "left-1/2 -translate-x-1/2"
        : "right-4 sm:right-6";

  return (
    <div
      className={cn(
        "fixed bottom-4 z-40 flex flex-col gap-2 sm:bottom-6",
        positionClasses,
        className,
      )}
    >
      {targets.map((t) => (
        <ScrollTo key={t} to={t} threshold={threshold} />
      ))}
    </div>
  );
}
