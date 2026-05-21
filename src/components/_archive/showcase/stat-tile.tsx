"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Big number tile (the "9.6" card from the reference).
 * Smoothly counts up to the target value the first time it scrolls into view.
 */
export function KxStatTile({
  value,
  label,
  decimals = 1,
  className,
  size = "lg",
}: {
  value: number;
  label?: string;
  decimals?: number;
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const duration = 900;
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const sizeClass =
    size === "xl"
      ? "text-[5rem] leading-none"
      : size === "md"
        ? "text-4xl"
        : "text-[4rem] leading-none";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--kx-r-card-lg)] bg-[var(--kx-card-2)] px-10 py-14 grid place-items-center",
        "transition-[transform,box-shadow] duration-300 ease-[var(--kx-ease-out)] hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="text-center">
        <div
          className={cn(
            "[font-family:var(--kx-font-display)] font-bold tracking-tight text-[var(--kx-fg)] tabular-nums",
            sizeClass,
          )}
        >
          {display.toFixed(decimals)}
        </div>
        {label ? (
          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
}
