"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { resolveInputAttributes, type InputPurpose } from "./input-attributes";

/**
 * TextField — pill-shaped, fluid single-line input.
 *
 * Design intent (DESIGN_LANGUAGE.md §1 — Solid / Proactive / Premium,
 * §2.3 radius-pill, §2.4 elevation "flat" filled, §3.5 interaction recipe):
 *   - The field is identified by its FILL (`bg-control-surface`), not by a
 *     drawn box: on white paper the fill recedes, on dark it lifts. The
 *     hairline (`border-control-border`) only finishes the edge, so the
 *     control reads **definitive without shouting**.
 *   - Focus-within = solid brand ring (`ring-2 ring-primary` + `border-primary`).
 *   - Hover (pointer only) steps the hairline to `--border` + shadow-sm, no pink wash.
 *   - 16 px input font (`text-input`) to defeat iOS zoom.
 *   - Disabled: 50 % opacity + non-interactive.
 *   - `purpose` drives the browser contract (§9.3): soft-keyboard type,
 *     Enter-key label, autofill token, capitalisation, autocorrect,
 *     spellcheck, and the fallback placeholder — one prop, not six.
 *
 * Icons are slot props (`leftIcon`, `rightSlot`) — caller passes any
 * ReactNode (phosphor icon, IconButton, currency tag, etc.).
 */
export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  /** Full-width by default; pass `false` to size by content / parent. */
  fluid?: boolean;
  /**
   * What the field is *for*. Selects the browser attribute bundle from
   * `INPUT_ATTRIBUTES` (DESIGN_LANGUAGE §9.3). Inferred from `type` when
   * omitted; a bare `type="text"` warns in development.
   */
  purpose?: InputPurpose;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      hint,
      error,
      leftIcon,
      rightSlot,
      fluid = true,
      className,
      disabled,
      id,
      name,
      purpose,
      type,
      inputMode,
      autoComplete,
      enterKeyHint,
      autoCapitalize,
      autoCorrect,
      spellCheck,
      placeholder,
      ...inputProps
    },
    ref,
  ) {
    const reactId = useId();
    const fieldId = id ?? name ?? `tf-${reactId}`;
    const msgId = error || hint ? `${fieldId}-msg` : undefined;
    const hasError = Boolean(error);
    const attrs = resolveInputAttributes(purpose, type, label);

    return (
      <div className={cn("block", fluid ? "w-full" : undefined, className)}>
        {label ? (
          <label
            htmlFor={fieldId}
            className={cn(
              "mb-2 block text-sm font-medium",
              hasError ? "text-danger-ink" : "text-fg",
            )}
          >
            {label}
          </label>
        ) : null}

        <div
          data-disabled={disabled || undefined}
          data-error={hasError || undefined}
          className={cn(
            // Pill, fluid, comfortable height.
            "group relative flex h-12 w-full items-center gap-2 rounded-control",
            // Distinct surface — sits above page / card.
            "bg-control-surface",
            // Hairline boundary, stepped to strong on hover (pointer only).
            "border border-control-border",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            // Tailwind v4 wraps `hover:` in `(hover: hover)` automatically.
            "hover:shadow-sm hover:border-border",
            // Focus = solid brand ring (1 px, tight).
            "focus-within:border-primary-ink focus-within:ring-1 focus-within:ring-primary-ink",
            // Error tone wins over default border.
            "data-error:border-danger-ink data-error:focus-within:ring-danger-ink",
            // Disabled visuals.
            "data-disabled:cursor-not-allowed data-disabled:opacity-50",
            // Horizontal padding adjusts to leading/trailing slots.
            leftIcon ? "pl-4" : "pl-5",
            rightSlot ? "pr-2" : "pr-5",
          )}
        >
          {leftIcon ? (
            <span
              aria-hidden
              className="grid size-5 shrink-0 place-items-center text-fg-muted transition-colors group-focus-within:text-fg"
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={fieldId}
            name={name}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={msgId}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-input text-fg outline-none",
              "placeholder:text-fg-subtle",
              "disabled:cursor-not-allowed",
              // Suppress the native WebKit clear (×) on type="search"; we render our own.
              "[&::-webkit-search-cancel-button]:appearance-none",
              "[&::-webkit-search-decoration]:appearance-none",
            )}
            type={type ?? attrs.type}
            inputMode={inputMode ?? attrs.inputMode}
            autoComplete={autoComplete ?? attrs.autoComplete}
            enterKeyHint={enterKeyHint ?? attrs.enterKeyHint}
            autoCapitalize={autoCapitalize ?? attrs.autoCapitalize}
            autoCorrect={autoCorrect ?? attrs.autoCorrect}
            spellCheck={spellCheck ?? attrs.spellCheck}
            placeholder={placeholder ?? attrs.placeholder}
            {...inputProps}
          />

          {rightSlot ? (
            <span className="grid shrink-0 place-items-center text-fg-muted transition-colors group-focus-within:text-fg">
              {rightSlot}
            </span>
          ) : null}
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
  },
);
