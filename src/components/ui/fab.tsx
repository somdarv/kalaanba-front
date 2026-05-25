"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";

export type FabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** REQUIRED — Fabs must announce themselves. */
  label: string;
  icon: ReactNode;
  /** Extended Fab: shows a text label alongside the icon. */
  extended?: ReactNode;
  intent?: "primary" | "accent";
  /** Position helper. `none` = caller positions it. */
  position?: "none" | "bottom-right";
};

/**
 * `<Fab>` — floating action button. Mount animation = a hint of overshoot
 * via `ease-entrance` (the one place we allow scale on mount — appearance,
 * not interaction; DESIGN_LANGUAGE §3.2). All interaction motion is
 * state-change-only (no translate on hover/press).
 */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  {
    label,
    icon,
    extended,
    intent = "primary",
    position = "bottom-right",
    className,
    type = "button",
    ...rest
  },
  ref,
) {
  const intentClasses =
    intent === "primary"
      ? cn(
          "bg-primary text-on-primary",
          "hover:bg-primary-hover",
          "active:bg-primary-pressed active:shadow-[var(--shadow-pressed)]",
        )
      : cn(
          "bg-accent text-on-accent",
          "hover:bg-[color-mix(in_oklab,var(--accent)_92%,white_8%)]",
          "active:bg-[color-mix(in_oklab,var(--accent)_88%,black_12%)] active:shadow-[var(--shadow-pressed)]",
        );

  return (
    <button
      ref={ref}
      type={type}
      aria-label={extended ? undefined : label}
      title={label}
      className={cn(
        pressableBase,
        "shadow-[var(--shadow-md)]",
        "font-medium",
        "motion-safe:animate-[kx-fab-in_var(--dur-graceful)_var(--ease-entrance)_both]",
        extended ? "h-14 px-5 gap-2 rounded-full text-base" : "h-14 w-14 rounded-full",
        intentClasses,
        position === "bottom-right" &&
          "fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-6",
        className,
      )}
      {...rest}
    >
      {icon}
      {extended ? <span>{extended}</span> : null}
    </button>
  );
});
