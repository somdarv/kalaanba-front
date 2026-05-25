"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * TextField — pill-shaped, fluid single-line input.
 *
 * Design intent (DESIGN_LANGUAGE.md §1 — Solid / Proactive / Premium,
 * §2.3 radius-pill, §2.4 elevation "flat" filled, §3.5 interaction recipe):
 *   - Pill surface that sits *on top of* the page (`bg-surface-2`), with a
 *     hairline `border-border-strong` so the field is **definitive on a card
 *     or page** without shouting.
 *   - Focus-within = solid brand ring (`ring-2 ring-primary` + `border-primary`).
 *   - Hover (pointer only) deepens the border via shadow-sm, no pink wash.
 *   - 16 px input font (`text-input`) to defeat iOS zoom.
 *   - Disabled: 50 % opacity + non-interactive.
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
      ...inputProps
    },
    ref,
  ) {
    const reactId = useId();
    const fieldId = id ?? name ?? `tf-${reactId}`;
    const msgId = error || hint ? `${fieldId}-msg` : undefined;
    const hasError = Boolean(error);

    return (
      <div className={cn("block", fluid ? "w-full" : undefined, className)}>
        {label ? (
          <label
            htmlFor={fieldId}
            className={cn(
              "mb-2 block text-sm font-medium",
              hasError ? "text-danger" : "text-fg",
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
            "group relative flex h-12 w-full items-center gap-2 rounded-full",
            // Distinct surface — sits above page / card.
            "bg-surface-2",
            // Hairline boundary, stepped to strong on hover (pointer only).
            "border-[0.5px] border-border-strong",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            // Tailwind v4 wraps `hover:` in `(hover: hover)` automatically.
            "hover:shadow-sm hover:border-border-strong",
            // Focus = solid brand ring (1 px, tight).
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            // Error tone wins over default border.
            "data-error:border-danger data-error:focus-within:ring-danger",
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
              hasError ? "text-danger" : "text-fg-muted",
            )}
          >
            {error ?? hint}
          </p>
        ) : null}
      </div>
    );
  },
);
