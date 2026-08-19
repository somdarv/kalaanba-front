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

/**
 * A textarea is always prose, so the browser contract is fixed rather than
 * purpose-keyed (DESIGN_LANGUAGE §9.3): sentence case, autocorrect and
 * spellcheck on, and `enterKeyHint="enter"` because Enter inserts a newline
 * here instead of advancing the form.
 */
const TEXTAREA_DEFAULTS = {
  autoCapitalize: "sentences",
  autoCorrect: "on",
  spellCheck: true,
  enterKeyHint: "enter",
  placeholder: "Write your message…",
} as const;

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
      onKeyDown,
      autoCapitalize,
      autoCorrect,
      spellCheck,
      enterKeyHint,
      placeholder,
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
            "relative w-full rounded-card bg-control-surface",
            "border border-control-border",
            "px-4 py-3",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border",
            "focus-within:border-primary-ink focus-within:ring-1 focus-within:ring-primary-ink",
            "data-error:border-danger-ink data-error:focus-within:ring-danger-ink",
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
            autoCapitalize={autoCapitalize ?? TEXTAREA_DEFAULTS.autoCapitalize}
            autoCorrect={autoCorrect ?? TEXTAREA_DEFAULTS.autoCorrect}
            spellCheck={spellCheck ?? TEXTAREA_DEFAULTS.spellCheck}
            enterKeyHint={enterKeyHint ?? TEXTAREA_DEFAULTS.enterKeyHint}
            placeholder={placeholder ?? TEXTAREA_DEFAULTS.placeholder}
            onChange={(e) => {
              if (!isControlled) setInternal(e.target.value);
              onChange?.(e);
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e);
              // Enter is reserved for newlines, so Cmd/Ctrl+Enter is the only
              // keyboard route to submit from inside a textarea.
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.defaultPrevented) {
                e.currentTarget.form?.requestSubmit();
              }
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
                  hasError ? "text-danger-ink" : "text-fg-muted",
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
