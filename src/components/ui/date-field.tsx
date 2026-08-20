"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { CalendarBlank, CaretDown } from "@phosphor-icons/react";
import { Popover } from "./popover";
import { Calendar } from "./calendar";
import { cn } from "@/lib/cn";
import { controlHeight } from "./control-scale";

const DEFAULT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * DateField — pill trigger that opens a Calendar in a Popover.
 *
 * The popover **matches the trigger's width** (Popover default) — that
 * was the user's explicit ask vs the legacy version where the calendar
 * was narrower than its input.
 */
export type DateFieldProps = {
  value: Date | null;
  onChange: (next: Date | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  /** Custom formatter for the displayed value. */
  format?: (date: Date) => string;
  /** Render a custom leading slot (defaults to a calendar icon). */
  leftIcon?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  fluid?: boolean;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
};

export function DateField({
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Pick a date",
  format,
  leftIcon,
  minDate,
  maxDate,
  disabled,
  fluid = true,
  className,
  name,
  id,
  "aria-label": ariaLabel,
}: DateFieldProps) {
  const reactId = useId();
  const fieldId = id ?? name ?? `df-${reactId}`;
  const msgId = error || hint ? `${fieldId}-msg` : undefined;
  const hasError = Boolean(error);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const display = value ? (format ?? DEFAULT_FORMATTER.format)(value) : null;

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

      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          name={name}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          aria-label={label ? undefined : ariaLabel}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          data-error={hasError || undefined}
          data-open={open || undefined}
          className={cn(
            controlHeight,
            "relative flex w-full items-center gap-2 rounded-control bg-control-surface",
            "border border-control-border text-input pl-4 pr-3",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border",
            "data-open:border-primary-ink data-open:ring-1 data-open:ring-primary-ink",
            "focus-visible:outline-none focus-visible:border-primary-ink focus-visible:ring-1 focus-visible:ring-focus-ring",
            "data-error:border-danger-ink data-error:data-open:ring-danger-ink",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className="flex shrink-0 items-center text-fg-muted">
            {leftIcon ?? <CalendarBlank size={18} weight="bold" />}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              display ? "text-fg" : "text-fg-subtle",
            )}
          >
            {display ?? placeholder}
          </span>
          <CaretDown
            size={16}
            weight="bold"
            className={cn(
              "shrink-0 text-fg-muted transition-transform duration-quick ease-out",
              open && "rotate-180",
            )}
          />
        </button>

        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={triggerRef}
          matchTriggerWidth={false}
        >
          <div className="w-76">
            <Calendar
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => {
                onChange(date);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </Popover>
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
