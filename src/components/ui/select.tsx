"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { Popover } from "./popover";
import { cn } from "@/lib/cn";

/**
 * Select — custom dropdown with rich option rendering.
 *
 * Trigger uses the TextField pill recipe. Popover is the same width as
 * the trigger (Popover defaults to matchTriggerWidth = true). Each
 * option can render a `leading` slot (icon, dot, position abbreviation,
 * jersey number — anything) plus optional `description`.
 *
 * Search is opt-in via `searchable`. Keyboard: ArrowUp/Down to move,
 * Enter to select, Escape to close.
 *
 * COMPONENT_INVENTORY.md §2.07 Select / dropdown.
 */
export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  leading?: ReactNode;
  disabled?: boolean;
};

export type SelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (next: T) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  searchable?: boolean;
  /** Optional left adornment on the trigger (e.g. an icon). */
  leftIcon?: ReactNode;
  /** Per-option rendering override (rare). */
  renderOption?: (option: SelectOption<T>) => ReactNode;
  disabled?: boolean;
  fluid?: boolean;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
};

function SelectInner<T extends string>(
  {
    options,
    value,
    onChange,
    label,
    hint,
    error,
    placeholder = "Select…",
    searchable,
    leftIcon,
    renderOption,
    disabled,
    fluid = true,
    className,
    name,
    id,
    "aria-label": ariaLabel,
  }: SelectProps<T>,
  _ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const reactId = useId();
  const fieldId = id ?? name ?? `sel-${reactId}`;
  const listId = `${fieldId}-list`;
  const msgId = error || hint ? `${fieldId}-msg` : undefined;
  const hasError = Boolean(error);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.description?.toLowerCase().includes(q) ?? false),
    );
  }, [options, searchable, query]);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(Math.max(0, filtered.findIndex((o) => o.value === value)));
    }
  }, [open, filtered, value]);

  const commit = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) commit(opt);
    }
  };

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

      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          name={name}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          aria-label={label ? undefined : ariaLabel}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          data-error={hasError || undefined}
          data-open={open || undefined}
          className={cn(
            "relative flex h-12 w-full items-center gap-2 rounded-full bg-surface-2",
            "border-[0.5px] border-border-strong text-input",
            leftIcon ? "pl-4" : "pl-5",
            "pr-3",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border-strong",
            "data-open:border-primary data-open:ring-1 data-open:ring-primary",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
            "data-error:border-danger data-error:data-open:ring-danger",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {leftIcon ? (
            <span className="flex shrink-0 items-center text-fg-muted">
              {leftIcon}
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              selected ? "text-fg" : "text-fg-subtle",
            )}
          >
            {selected ? (
              <span className="inline-flex items-center gap-2">
                {selected.leading ? (
                  <span className="inline-flex shrink-0 items-center">
                    {selected.leading}
                  </span>
                ) : null}
                {selected.label}
              </span>
            ) : (
              placeholder
            )}
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

        <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef}>
          <div onKeyDown={onKey} className="p-2">
            {searchable ? (
              <div className="mb-2 flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4">
                <MagnifyingGlass size={16} weight="bold" className="text-fg-muted" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search…"
                  aria-label="Search options"
                  className="w-full bg-transparent text-input text-fg outline-none placeholder:text-fg-subtle"
                />
              </div>
            ) : null}
            <ul
              id={listId}
              role="listbox"
              className="max-h-72 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-fg-muted">No results.</li>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commit(option)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-control px-3 py-2.5 text-sm",
                        isActive && "bg-(--hover-overlay)",
                        isSelected && "text-primary",
                        option.disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <>
                          {option.leading ? (
                            <span className="flex size-6 shrink-0 items-center justify-center">
                              {option.leading}
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-fg">
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className="block truncate text-xs text-fg-muted">
                                {option.description}
                              </span>
                            ) : null}
                          </span>
                        </>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </Popover>
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
}

export const Select = forwardRef(SelectInner) as <T extends string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof SelectInner>;
