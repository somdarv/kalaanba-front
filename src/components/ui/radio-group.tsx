"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * RadioGroup — single-select from a list of options.
 *
 * Visual recipe: each option is a card-style row on `bg-surface-2`,
 * promoted to a brand-tinted card with hairline `border-primary` when
 * selected. The radio dot sits left, label + optional hint right.
 *
 * Generic `<T extends string>` so option values can be a discriminated
 * string union ("formal" | "informal" | "academy", etc.).
 */

export type RadioOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
  disabled?: boolean;
};

export type RadioGroupProps<T extends string> = {
  value: T | null;
  onChange: (next: T) => void;
  options: ReadonlyArray<RadioOption<T>>;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  /** "vertical" (default) stacks; "horizontal" wraps inline. */
  orientation?: "vertical" | "horizontal";
};

export function RadioGroup<T extends string>({
  value,
  onChange,
  options,
  label,
  hint,
  error,
  disabled,
  name,
  orientation = "vertical",
}: RadioGroupProps<T>) {
  const groupId = useId();
  const msgId = `${groupId}-msg`;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label ? (
        <div
          id={`${groupId}-label`}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger" : "text-fg",
          )}
        >
          {label}
        </div>
      ) : null}

      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={msgId}
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {options.map((opt) => {
          const active = value === opt.value;
          const rowDisabled = disabled || opt.disabled;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={rowDisabled}
              data-active={active || undefined}
              data-error={hasError || undefined}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group flex items-start gap-3 rounded-card border p-3 text-left",
                "transition-[background-color,border-color] duration-quick ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                // Active = light pink tint + primary border. No shadow ring.
                "data-active:border-primary data-active:bg-primary/10",
                "data-active:hover:bg-primary/15",
                // Inactive: hover lifts the surface with a faint pink tint
                // (background change only — border colour stays constant).
                !active &&
                  "border-border bg-surface-2 hover:bg-primary/8",
                "data-error:border-danger",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <span
                className={cn(
                  "relative mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                  "border-[1.5px] transition-[border-color] duration-quick ease-out",
                  active
                    ? "border-primary"
                    : "border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full bg-primary",
                    // Bloom in: fade + scale. The dot is the metaphor for
                    // "this one is selected" — its appearance should feel
                    // soft, not snapped.
                    "transition-[opacity,transform] duration-quick ease-out",
                    active
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0",
                  )}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    hasError ? "text-danger" : "text-fg",
                  )}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="mt-0.5 block text-xs text-fg-muted">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
              {name ? (
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={active}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {error || hint ? (
        <p
          id={msgId}
          className={cn(
            "mt-1.5 text-xs",
            hasError ? "text-danger" : "text-fg-muted",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
