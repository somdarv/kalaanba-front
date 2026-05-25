"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import type { Theme } from "@/lib/theme";

const OPTIONS: Array<{ value: Theme; label: string; glyph: React.ReactNode }> =
  [
    {
      value: "light",
      label: "Light",
      glyph: (
        <Icon size="sm">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </Icon>
      ),
    },
    {
      value: "auto",
      label: "Auto",
      glyph: (
        <Icon size="sm">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M12 3a9 9 0 0 0 0 18" fill="currentColor" stroke="none" />
        </Icon>
      ),
    },
    {
      value: "dark",
      label: "Dark",
      glyph: (
        <Icon size="sm">
          <path d="M20 15.5A8 8 0 0 1 8.5 4a8 8 0 1 0 11.5 11.5Z" />
        </Icon>
      ),
    },
  ];

export type ThemeToggleProps = {
  className?: string;
  /** Compact icon-only variant. */
  compact?: boolean;
};

/**
 * `<ThemeToggle>` — segmented 3-state control: Light · Auto · Dark.
 * Default is `auto` (follows OS). User choice is persisted to localStorage
 * and synced via `<ThemeProvider>`.
 */
export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-2 p-1 border border-border",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full font-medium",
              compact ? "h-8 w-8 justify-center" : "h-9 px-3 text-sm",
              "touch-manipulation outline-none",
              "transition-[background-color,color,box-shadow] duration-[var(--dur-quick)] ease-[var(--ease-out)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
              isActive
                ? "bg-bg text-fg shadow-[var(--shadow-sm)]"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {opt.glyph}
            {!compact ? <span>{opt.label}</span> : null}
            {compact ? <span className="sr-only">{opt.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
