"use client";

import { forwardRef, useId, useState, type KeyboardEvent } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * NumberInput — labelled stepper for bounded integers.
 *
 * Pill surface (TextField recipe) with circular `–` / `+` tiles flanking
 * a centered, tabular numeric input. Reusable for player age, squad-size
 * cap, match-duration minutes, etc.
 *
 * DESIGN_LANGUAGE.md §2.3 radius-pill, §3.5 interaction recipe.
 * COMPONENT_INVENTORY.md §2.12 Stepper.
 */
export type NumberInputProps = {
  /** Controlled value. */
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  error?: string;
  /** Optional trailing unit (e.g. "yrs", "min"). */
  unit?: string;
  disabled?: boolean;
  fluid?: boolean;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      value,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      label,
      hint,
      error,
      unit,
      disabled,
      fluid = true,
      className,
      name,
      id,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const reactId = useId();
    const fieldId = id ?? name ?? `ni-${reactId}`;
    const msgId = error || hint ? `${fieldId}-msg` : undefined;
    const hasError = Boolean(error);
    const [focused, setFocused] = useState(false);

    const set = (n: number) => {
      if (Number.isNaN(n)) return;
      onChange(clamp(n, min, max));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        set(value + step);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        set(value - step);
      } else if (event.key === "Home" && Number.isFinite(min)) {
        event.preventDefault();
        set(min);
      } else if (event.key === "End" && Number.isFinite(max)) {
        event.preventDefault();
        set(max);
      }
    };

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
          data-focused={focused || undefined}
          className={cn(
            "relative flex h-12 w-full items-center gap-1 rounded-control bg-control-surface",
            "border border-control-border px-1",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border",
            "data-focused:border-primary-ink data-focused:ring-1 data-focused:ring-primary-ink",
            "data-error:border-danger-ink data-error:data-focused:ring-danger-ink",
            "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          )}
        >
          <StepperButton
            ariaLabel="Decrease"
            disabled={disabled || value <= min}
            onClick={() => set(value - step)}
          >
            <Minus size={16} weight="bold" />
          </StepperButton>

          <input
            ref={ref}
            id={fieldId}
            name={name}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="next"
            autoCorrect="off"
            spellCheck={false}
            step={step}
            min={Number.isFinite(min) ? min : undefined}
            max={Number.isFinite(max) ? max : undefined}
            value={Number.isFinite(value) ? value : ""}
            disabled={disabled}
            aria-label={label ? undefined : ariaLabel}
            aria-invalid={hasError || undefined}
            aria-describedby={msgId}
            // The stepper buttons are the visual affordance; these tell a
            // screen reader the same range the arrow keys operate over.
            aria-valuenow={Number.isFinite(value) ? value : undefined}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!Number.isNaN(next)) set(next);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-center text-input font-semibold tabular-nums text-fg outline-none",
              "[appearance:textfield]",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-outer-spin-button]:appearance-none",
            )}
          />

          {unit ? (
            <span className="px-1 text-xs text-fg-muted">{unit}</span>
          ) : null}

          <StepperButton
            ariaLabel="Increase"
            disabled={disabled || value >= max}
            onClick={() => set(value + step)}
          >
            <Plus size={16} weight="bold" />
          </StepperButton>
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

function StepperButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-pill text-fg-muted",
        "transition-colors duration-quick ease-out",
        "hover:bg-(--hover-overlay) hover:text-fg",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-muted",
      )}
    >
      {children}
    </button>
  );
}
