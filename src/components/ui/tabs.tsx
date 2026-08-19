"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useId, useRef } from "react";

import { cn } from "@/lib/cn";

/**
 * `<Tabs>` — pill-shaped segmented control.
 *
 * Direct port of the legacy `KxTabs` recipe (kalaanba-front/src/components/_archive/
 * showcase/primitives.tsx, line 360) translated to our semantic tokens.
 *
 *   list:       rounded-pill  bg-surface-elev  p-1.5
 *   tab:        h-9 rounded-pill px-4 text-[13px] font-medium
 *   active:     bg-surface text-fg shadow-sm
 *   inactive:   text-fg-muted hover:text-fg
 *
 * The active state is the "lifted card" — the visual cue is a surface change,
 * not a translate. Per the design language, no transform motion is used.
 *
 * A11y:
 *   - `role="tablist"` on the wrapper
 *   - `role="tab"` + `aria-selected` on each button
 *   - Arrow-key roving focus (←/→ Home/End) per WAI-ARIA Tabs pattern
 *   - The component is *controlled* — selecting a tab calls `onChange`, no
 *     internal state is kept.
 */

export type TabsItem<T extends string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type TabsProps<T extends string> = {
  items: TabsItem<T>[];
  value: T;
  onChange: (next: T) => void;
  /** Accessible label for the tablist when no visible heading exists. */
  "aria-label"?: string;
  className?: string;
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: TabsProps<T>) {
  const listId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAt = useCallback(
    (idx: number) => {
      const enabledIndexes = items
        .map((it, i) => (it.disabled ? -1 : i))
        .filter((i) => i !== -1);
      if (enabledIndexes.length === 0) return;
      const wrapped =
        ((idx % enabledIndexes.length) + enabledIndexes.length) %
        enabledIndexes.length;
      const target = enabledIndexes[wrapped];
      if (target === undefined) return;
      const el = buttonsRef.current[target];
      if (!el) return;
      el.focus();
      const next = items[target];
      if (next) onChange(next.value);
    },
    [items, onChange],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items
      .map((it, i) => (it.disabled ? -1 : i))
      .filter((i) => i !== -1);
    const currentEnabledIdx = enabled.findIndex(
      (i) => items[i]?.value === value,
    );

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusAt(currentEnabledIdx + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusAt(currentEnabledIdx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusAt(enabled.length - 1);
    }
  };

  return (
    <div
      id={listId}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex items-center gap-1 rounded-pill bg-surface-elev p-1.5",
        className,
      )}
    >
      {items.map((it, i) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={it.disabled || undefined}
            tabIndex={active ? 0 : -1}
            disabled={it.disabled}
            onClick={() => {
              if (!it.disabled) onChange(it.value);
            }}
            className={cn(
              "relative inline-flex h-9 items-center gap-2 rounded-pill px-4 text-[13px] font-medium",
              "transition-[color,background-color,box-shadow] duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? "bg-surface text-fg shadow-sm"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {it.icon ? (
              <span className="inline-flex shrink-0 items-center" aria-hidden>
                {it.icon}
              </span>
            ) : null}
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
