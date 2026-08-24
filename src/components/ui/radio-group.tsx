"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * RadioGroup — single-select from a list of options.
 *
 * Visual recipe, from a supplied design (WP-20260824-setup-surface): each
 * option is a full-width **pill** on `bg-surface-elev`, promoted to a pale
 * brand tint with a `--primary` hairline when selected, and its label switches
 * to brand ink. The dot sits left, centred against the block, label and hint
 * to its right.
 *
 * **The pill is the shape decision.** `--radius-pill` is filed under "buttons,
 * chips, filters, status" in DESIGN_LANGUAGE §2.3 rather than under rows, and
 * that is the point: an option here is a thing you press, not a row of data.
 * §2.3's actual warning is the opposite mistake, "using card radii for data
 * rows is what makes football data read as consumer app".
 *
 * **Sized off the control scale, not off the drawing.** The label is
 * `text-[0.95rem]`, which is Button `md`'s own text size and the everyday size
 * in this product, and a single-line row lands near the 56px a `<TextField>`
 * sets on a phone (`control-scale.ts`). The first pass took the label to 17px
 * and the padding to `px-5 py-4`, which read as its own hero rather than as
 * one control among the others on the step.
 *
 * **The selected label is `--primary-ink`, not `--primary`.** The design draws
 * the brighter fill pink, which measures 3.19:1 on paper and fails AA for a
 * 17px label; `--primary-ink` is the token tuned for exactly this and clears
 * it comfortably. Colour is not the only signal either way (§6) — the dot
 * fills, the hairline resolves, and `aria-checked` carries it.
 *
 * **The tints are static, not `bg-primary/10`.** That utility compiles to a
 * color-mix whose pre-@supports fallback is bare `var(--primary)`, so this
 * component used to paint the selected option as a SOLID pink slab on any
 * browser without color-mix, with dark label text on top of it. See the note
 * beside `.kx-brand-tints` in `globals.css`.
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
            hasError ? "text-danger-ink" : "text-fg",
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
          "kx-brand-tints flex gap-2",
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
                "rounded-pill group flex items-center gap-3 border px-4 py-3 text-left",
                "duration-quick transition-[background-color,border-color] ease-out",
                "focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "border-primary bg-[var(--kx-brand-08)]"
                  : "border-border bg-surface-elev hover:bg-[var(--secondary-hover)]",
                hasError && "border-danger-ink",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <span
                className={cn(
                  "rounded-pill relative grid size-4.5 shrink-0 place-items-center",
                  "duration-quick border-[1.5px] transition-[border-color] ease-out",
                  active ? "border-primary" : "border-control-border",
                )}
              >
                <span
                  className={cn(
                    "rounded-pill bg-primary size-2",
                    // Bloom in: fade + scale. The dot is the metaphor for
                    // "this one is selected" — its appearance should feel
                    // soft, not snapped.
                    "duration-quick transition-[opacity,transform] ease-out",
                    active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                  )}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[0.95rem] font-semibold",
                    hasError
                      ? "text-danger-ink"
                      : active
                        ? "text-primary-ink"
                        : "text-fg",
                  )}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="text-fg-muted mt-0.5 block text-xs leading-snug">
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
            hasError ? "text-danger-ink" : "text-fg-muted",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
