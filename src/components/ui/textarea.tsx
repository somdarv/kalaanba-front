"use client";

import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Textarea — multi-line input.
 *
 * Same language as TextField (distinct surface, hairline border, solid
 * pink focus ring) but **rounded-card** (not pill), with vertical padding
 * so it reads as a multi-line panel — not a tall single-line input.
 *
 * Mirrors the legacy KxTextarea visual but on the current token system.
 * DESIGN_LANGUAGE.md §1.1 Solid (definitive surface), §3.5 interaction recipe.
 *
 * Optional `showCount` + `maxLength` renders a `74/240` counter under the
 * field, right-aligned, with the hint on the left.
 */
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
  /** Full-width by default. */
  fluid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      error,
      showCount,
      fluid = true,
      className,
      disabled,
      id,
      name,
      rows = 4,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) {
    const reactId = useId();
    const fieldId = id ?? name ?? `ta-${reactId}`;
    const msgId = error || hint ? `${fieldId}-msg` : undefined;
    const hasError = Boolean(error);

    const isControlled = typeof value === "string";
    const [internal, setInternal] = useState<string>(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const liveValue = isControlled ? (value as string) : internal;

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
            "relative w-full rounded-card bg-surface-2",
            "border-[0.5px] border-border-strong",
            "px-4 py-3",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border-strong",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            "data-error:border-danger data-error:focus-within:ring-danger",
            "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          )}
        >
          <textarea
            ref={ref}
            id={fieldId}
            name={name}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={msgId}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              if (!isControlled) setInternal(e.target.value);
              onChange?.(e);
            }}
            className={cn(
              "block w-full resize-y bg-transparent text-input text-fg outline-none",
              "placeholder:text-fg-subtle",
              "disabled:cursor-not-allowed",
            )}
            {...props}
          />
        </div>

        {error || hint || (showCount && maxLength) ? (
          <div className="mt-1.5 flex items-start justify-between gap-3">
            {error || hint ? (
              <p
                id={msgId}
                className={cn(
                  "text-xs",
                  hasError ? "text-danger" : "text-fg-muted",
                )}
              >
                {error ?? hint}
              </p>
            ) : (
              <span />
            )}
            {showCount && maxLength ? (
              <p className="ml-auto text-xs tabular-nums text-fg-muted">
                {liveValue.length}/{maxLength}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
