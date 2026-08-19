"use client";

import { useId, type KeyboardEvent } from "react";
import { Check, Minus } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/**
 * Checkbox — boolean / tri-state control with label + hint.
 *
 * Tri-state: `checked: boolean | "indeterminate"`. The "indeterminate"
 * value is for parent rows of a list with mixed children — pressing
 * the box from indeterminate transitions to `true` then `false`.
 */

export type CheckboxProps = {
  checked: boolean | "indeterminate";
  onChange: (next: boolean) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  /** Render the label in a heavier weight (e.g. for a settings-row title). */
  emphasizeLabel?: boolean;
  "aria-label"?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  hint,
  error,
  disabled,
  name,
  emphasizeLabel,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  const fieldId = useId();
  const isOn = checked === true;
  const isMixed = checked === "indeterminate";
  const hasError = Boolean(error);

  const toggle = () => {
    if (disabled) return;
    onChange(!(checked === true));
  };

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-start gap-3",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <button
        type="button"
        role="checkbox"
        id={fieldId}
        name={name}
        disabled={disabled}
        aria-checked={isMixed ? "mixed" : isOn}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
        aria-invalid={hasError || undefined}
        onClick={toggle}
        onKeyDown={handleKey}
        data-error={hasError || undefined}
        className={cn(
          "relative mt-0.5 grid size-5 shrink-0 place-items-center rounded-md",
          "border-[1.5px] transition-[background-color,border-color,box-shadow] duration-quick ease-out",
          isOn || isMixed
            ? "border-primary bg-primary"
            : "border-border-strong bg-surface-elev hover:border-fg-muted",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
          "data-error:border-danger-ink data-error:bg-transparent",
          "disabled:cursor-not-allowed",
        )}
      >
        {isMixed ? (
          <Minus
            size={12}
            weight="bold"
            className="text-on-primary motion-safe:animate-[kx-pop-in_180ms_var(--ease-entrance)]"
          />
        ) : isOn ? (
          <Check
            size={12}
            weight="bold"
            className="text-on-primary motion-safe:animate-[kx-pop-in_180ms_var(--ease-entrance)]"
          />
        ) : null}
      </button>

      {label || hint || error ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "min-w-0 select-none",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          {label ? (
            <span
              className={cn(
                "block text-sm",
                emphasizeLabel && "font-semibold",
                hasError ? "text-danger-ink" : "text-fg",
              )}
            >
              {label}
            </span>
          ) : null}
          {error || hint ? (
            <span
              id={`${fieldId}-msg`}
              className={cn(
                "mt-0.5 block text-xs",
                hasError ? "text-danger-ink" : "text-fg-muted",
              )}
            >
              {error ?? hint}
            </span>
          ) : null}
        </label>
      ) : null}
    </div>
  );
}
