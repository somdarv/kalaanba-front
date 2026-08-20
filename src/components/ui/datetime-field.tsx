"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { CalendarBlank, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { controlHeight } from "./control-scale";
import { Popover } from "./popover";
import { Calendar } from "./calendar";

/**
 * DateTimeField — pill trigger that opens a Calendar + time picker
 * inside a Popover. Same visual recipe as TextField / DateField.
 *
 * Logic-only contract: the value is a single `Date` (or null). The
 * picker bundles date + time selection so the consumer never has to
 * reconcile two separate fields.
 *
 * Notes for non-obvious decisions:
 * - 24h clock by default. UI shows zero-padded HH:MM after the date.
 * - Time edits never close the popover — only date clicks do.
 *   This is intentional: users expect to pick a date AND time before
 *   committing, not have the popover snap shut mid-edit.
 */

export type DateTimeFieldProps = {
  value: Date | null;
  onChange: (next: Date | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  /** Optional custom formatter for the trigger label. */
  format?: (date: Date) => string;
  disabled?: boolean;
  fluid?: boolean;
  minDate?: Date;
  maxDate?: Date;
  name?: string;
  "aria-label"?: string;
};

const DEFAULT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function DateTimeField({
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Pick date & time",
  format,
  disabled,
  fluid = true,
  minDate,
  maxDate,
  name,
  "aria-label": ariaLabel,
}: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const hasError = Boolean(error);

  const display = useMemo(() => {
    if (!value) return null;
    return format ? format(value) : DEFAULT_FORMATTER.format(value);
  }, [value, format]);

  const hours = value?.getHours() ?? 0;
  const minutes = value?.getMinutes() ?? 0;

  const setDatePart = (next: Date) => {
    const updated = new Date(next);
    updated.setHours(hours, minutes, 0, 0);
    onChange(updated);
    // close on calendar pick, but keep popover open if no time set yet?
    // We close on date pick — user can re-open to tweak time.
    setOpen(false);
    triggerRef.current?.focus();
  };

  const setHours = (e: ChangeEvent<HTMLInputElement>) => {
    const n = clamp(parseInt(e.target.value || "0", 10), 0, 23);
    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(n, minutes, 0, 0);
    onChange(next);
  };

  const setMinutes = (e: ChangeEvent<HTMLInputElement>) => {
    const n = clamp(parseInt(e.target.value || "0", 10), 0, 59);
    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(hours, n, 0, 0);
    onChange(next);
  };

  return (
    <div className={cn(fluid && "w-full")}>
      {label ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "mb-1.5 block text-sm font-medium",
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
            <CalendarBlank size={18} weight="bold" />
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
          <div className="w-76 p-1">
            <Calendar
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={setDatePart}
            />
            <div className="mt-1 flex items-center gap-2 border-t border-border px-3 py-3">
              <span className="text-xs uppercase tracking-wider text-fg-subtle">
                Time
              </span>
              <div className="ml-auto flex items-center gap-1 rounded-pill bg-surface-elev px-3 py-1.5">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={pad2(hours)}
                  onChange={setHours}
                  aria-label="Hours"
                  className={cn(
                    "w-8 bg-transparent text-center text-input tabular-nums text-fg outline-none",
                    "[appearance:textfield]",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                  )}
                />
                <span className="text-fg-muted">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={pad2(minutes)}
                  onChange={setMinutes}
                  aria-label="Minutes"
                  className={cn(
                    "w-8 bg-transparent text-center text-input tabular-nums text-fg outline-none",
                    "[appearance:textfield]",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                  )}
                />
              </div>
            </div>
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
