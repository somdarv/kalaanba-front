"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

const WEEKDAY_LABELS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildGrid(monthDate: Date): Date[] {
  const first = startOfMonth(monthDate);
  // JS getDay: Sun=0..Sat=6. We want Monday=0..Sunday=6.
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

/**
 * Calendar — month grid, Monday-first, headed by Prev / month-name / Next.
 *
 * Pink-filled selected day, subtle ring on today, muted days for the
 * previous/next month spillover. Today / Close footer buttons.
 *
 * Matches the legacy date-picker visual the user pinned as the target.
 * DESIGN_LANGUAGE.md §3.5 interaction recipe, §2.3 radii.
 */
export type CalendarProps = {
  value: Date | null;
  onChange: (next: Date) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
};

export function Calendar({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<Date>(startOfMonth(value ?? today));

  const days = useMemo(() => buildGrid(view), [view]);
  const viewMonth = view.getMonth();
  const viewLabel = `${MONTH_NAMES[viewMonth]} ${view.getFullYear()}`;

  const goPrev = () =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const goNext = () =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const isDisabled = (date: Date) => {
    if (minDate && date < startOfMonth(minDate)) return false;
    if (minDate && date.getTime() < minDate.setHours(0, 0, 0, 0)) return true;
    if (maxDate && date.getTime() > maxDate.setHours(23, 59, 59, 999))
      return true;
    return false;
  };

  return (
    <div className="w-full p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={goPrev}
          className="grid size-9 place-items-center rounded-full text-fg-muted hover:bg-(--hover-overlay) hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <div className="text-sm font-semibold text-fg">{viewLabel}</div>
        <button
          type="button"
          aria-label="Next month"
          onClick={goNext}
          className="grid size-9 place-items-center rounded-full text-fg-muted hover:bg-(--hover-overlay) hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 px-1 pb-1 text-center text-[10px] font-semibold tracking-wider text-fg-muted">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-1">
        {days.map((day) => {
          const inMonth = day.getMonth() === viewMonth;
          const selected = isSameDay(day, value);
          const today_ = isSameDay(day, today);
          const disabled = isDisabled(day);
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onChange(new Date(day))}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full text-sm tabular-nums transition-colors duration-quick ease-out",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                inMonth ? "text-fg" : "text-fg-subtle",
                !selected && !disabled && "hover:bg-(--hover-overlay)",
                today_ && !selected && "bg-surface-2 font-semibold",
                selected &&
                  "bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <button
          type="button"
          onClick={() => {
            setView(startOfMonth(today));
            onChange(new Date());
          }}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg hover:bg-(--hover-overlay)"
        >
          Today
        </button>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface-2 px-4 py-1.5 text-xs font-medium text-fg border-[0.5px] border-border-strong hover:shadow-sm"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
