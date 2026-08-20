"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { controlMinHeight } from "./control-scale";
import { Popover } from "./popover";

/**
 * Combobox — multi-select tag picker.
 *
 * Generic over the option value (`T extends string`). Selected items
 * render as inline chips inside the trigger pill; pressing × on a
 * chip (or Backspace when the search field is empty) removes the
 * trailing selection.
 *
 * Searchable, keyboard-navigable, with optional async filtering
 * (just control `options` from outside on input change).
 */

export type ComboboxOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  leading?: ReactNode;
  disabled?: boolean;
};

export type ComboboxProps<T extends string> = {
  value: ReadonlyArray<T>;
  onChange: (next: T[]) => void;
  options: ReadonlyArray<ComboboxOption<T>>;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  fluid?: boolean;
  /** Cap selections. `Infinity` (default) = no cap. */
  maxItems?: number;
  /** Custom filter; defaults to case-insensitive label/description match. */
  filter?: (option: ComboboxOption<T>, query: string) => boolean;
  /** Empty-search empty-state message. */
  emptyMessage?: string;
  name?: string;
  "aria-label"?: string;
};

const defaultFilter = <T extends string>(
  opt: ComboboxOption<T>,
  q: string,
): boolean => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    opt.label.toLowerCase().includes(needle) ||
    Boolean(opt.description?.toLowerCase().includes(needle))
  );
};

export function Combobox<T extends string>({
  value,
  onChange,
  options,
  label,
  hint,
  error,
  placeholder = "Pick a few…",
  disabled,
  fluid = true,
  maxItems = Infinity,
  filter = defaultFilter,
  emptyMessage = "No matches.",
  name,
  "aria-label": ariaLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const hasError = Boolean(error);

  const selectedMap = useMemo(() => {
    const m = new Set<T>(value);
    return m;
  }, [value]);

  const filtered = useMemo(
    () => options.filter((opt) => filter(opt, query)),
    [options, query, filter],
  );

  const labelFor = useMemo(() => {
    const m = new Map<T, ComboboxOption<T>>();
    options.forEach((o) => m.set(o.value, o));
    return m;
  }, [options]);

  useEffect(() => {
    if (!open) return;
    setActiveIdx(0);
  }, [open, query]);

  const toggle = (v: T) => {
    if (selectedMap.has(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      if (value.length >= maxItems) return;
      onChange([...value, v]);
    }
  };

  const remove = (v: T) => {
    onChange(value.filter((x) => x !== v));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !query && value.length > 0) {
      e.preventDefault();
      const last = value[value.length - 1];
      if (last !== undefined) remove(last);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIdx];
      if (opt && !opt.disabled) toggle(opt.value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
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

      <div
        ref={triggerRef}
        data-error={hasError || undefined}
        data-disabled={disabled || undefined}
        data-open={open || undefined}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={cn(
          controlMinHeight,
          "group relative flex w-full flex-wrap items-center gap-1.5 rounded-card bg-control-surface py-1.5 pl-3 pr-3",
          "border border-control-border",
          "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
          "hover:shadow-sm",
          "focus-within:border-primary-ink focus-within:ring-1 focus-within:ring-primary-ink",
          "data-error:border-danger-ink data-error:focus-within:ring-danger-ink",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          !disabled && "cursor-text",
        )}
      >
        {value.map((v) => {
          const opt = labelFor.get(v);
          if (!opt) return null;
          return (
            <span
              key={v}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-pill bg-surface-elev pl-2.5 pr-1 text-xs font-medium text-fg",
                "border-[0.5px] border-border",
              )}
            >
              {opt.leading ? (
                <span className="shrink-0">{opt.leading}</span>
              ) : null}
              <span className="truncate">{opt.label}</span>
              <button
                type="button"
                aria-label={`Remove ${opt.label}`}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(v);
                }}
                className={cn(
                  "grid size-5 place-items-center rounded-pill text-fg-muted",
                  "transition-colors duration-quick ease-out",
                  "hover:bg-(--hover-overlay) hover:text-fg",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
                  "disabled:cursor-not-allowed",
                )}
              >
                <X size={11} weight="bold" />
              </button>
            </span>
          );
        })}

        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="text"
          autoComplete="off"
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          aria-label={label ? undefined : ariaLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          placeholder={value.length === 0 ? placeholder : ""}
          className={cn(
            "min-w-24 flex-1 bg-transparent py-1 text-input text-fg outline-none",
            "placeholder:text-fg-subtle",
            "disabled:cursor-not-allowed",
          )}
        />

        <CaretDown
          size={16}
          weight="bold"
          aria-hidden
          className={cn(
            "ml-auto shrink-0 self-center text-fg-muted transition-transform duration-quick ease-out",
            open && "rotate-180",
          )}
        />
      </div>

      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef as unknown as React.RefObject<HTMLElement>}
        matchTriggerWidth
      >
        <div className="p-2">
          {options.length > 8 ? (
            <div className="mb-2 flex h-10 items-center gap-2 rounded-control bg-surface-elev px-4">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="text-fg-muted"
              />
              <span className="text-sm text-fg-muted">
                Type above to filter…
              </span>
            </div>
          ) : null}
          <ul ref={listRef} role="listbox" aria-multiselectable className="max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-fg-muted">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = selectedMap.has(opt.value);
                const isActive = idx === activeIdx;
                const capped =
                  !isSelected && value.length >= maxItems;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled || capped}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(opt.value);
                        inputRef.current?.focus();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm",
                        "transition-[background-color] duration-quick ease-out",
                        isActive && "bg-(--hover-overlay)",
                        isSelected && "text-fg",
                        !isSelected && "text-fg",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    >
                      {opt.leading ? (
                        <span className="shrink-0">{opt.leading}</span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{opt.label}</span>
                        {opt.description ? (
                          <span className="block truncate text-xs text-fg-muted">
                            {opt.description}
                          </span>
                        ) : null}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-md border-[1.5px]",
                          isSelected
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border-strong bg-surface-elev",
                        )}
                      >
                        {isSelected ? (
                          <span className="text-[10px] font-bold">✓</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          {Number.isFinite(maxItems) ? (
            <p className="mt-2 px-1 text-xs text-fg-muted">
              {value.length} / {maxItems} selected
            </p>
          ) : null}
        </div>
      </Popover>

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
