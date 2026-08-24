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
import { CaretDown } from "@phosphor-icons/react";
import { Popover } from "./popover";
import { BottomSheet } from "./bottom-sheet";
import { SelectOptions, type SelectOption } from "./select-options";
import { cn } from "@/lib/cn";
import { controlHeight } from "./control-scale";
import { useIsInsideSheet } from "./sheet-context";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";

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
 * **On a phone the options open as a `<BottomSheet>`, not a popover**
 * (WP-20260824-setup-surface, owner's request). A popover anchored to a
 * control halfway up a 360px screen opens a panel that the thumb cannot
 * comfortably reach and the keyboard can cover; the bottom of the screen is
 * where a phone puts a list of choices, which is why `<BottomSheet>` is
 * already called "the primary modal surface on mobile" in DESIGN_LANGUAGE
 * §4.1. The popover stays on pointer devices, where an anchored panel is
 * exactly right and a sheet would be absurd.
 *
 * The switch is a real media query rather than a CSS one because the two are
 * different COMPONENTS, not two styles of one. `useMediaQuery` answers `false`
 * before hydration, so a phone never gets a frame of the desktop form.
 *
 * COMPONENT_INVENTORY.md §2.07 Select / dropdown.
 */
export type { SelectOption };

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
  /**
   * Options are still loading.
   *
   * Deliberately NOT the same as `disabled`. A control locked shut while a
   * request runs tells the person to wait; one that opens and fills in lets
   * them spend the wait reading the question instead. The only thing this
   * changes is what the empty list says.
   */
  loading?: boolean;
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
    loading,
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
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  // A sheet inside a sheet is two backdrops and two drag surfaces. When this
  // Select is already in one, it keeps its popover on every screen size.
  const isInsideSheet = useIsInsideSheet();
  const usePopover = isDesktop || isInsideSheet;

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

  const renderList = (variant: "popover" | "sheet") => (
    <SelectOptions
      listId={listId}
      options={filtered}
      value={value}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      onCommit={commit}
      onKeyDown={onKey}
      searchable={searchable}
      query={query}
      onQueryChange={setQuery}
      renderOption={renderOption}
      loading={loading}
      variant={variant}
    />
  );

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
            controlHeight,
            "relative flex w-full items-center gap-2 rounded-control bg-control-surface",
            "border border-control-border text-input",
            leftIcon ? "pl-4" : "pl-5",
            "pr-3",
            "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
            "hover:shadow-sm hover:border-border",
            "data-open:border-primary-ink data-open:ring-1 data-open:ring-primary-ink",
            "focus-visible:outline-none focus-visible:border-primary-ink focus-visible:ring-1 focus-visible:ring-focus-ring",
            "data-error:border-danger-ink data-error:data-open:ring-danger-ink",
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

        {/* Same list, two frames. The sheet gets the phone, the popover gets
            the pointer. See the note at the top of the file. */}
        {usePopover ? (
          <Popover
            open={open}
            onClose={() => setOpen(false)}
            anchorRef={triggerRef}
          >
            {renderList("popover")}
          </Popover>
        ) : (
          <BottomSheet
            open={open}
            onOpenChange={setOpen}
            // A sheet is a titled surface; a popover is not. The field's own
            // label is the honest title, and the placeholder ("Choose a hub")
            // is the fallback for a Select that has none.
            title={label ?? ariaLabel ?? placeholder}
          >
            {renderList("sheet")}
          </BottomSheet>
        )}
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

export const Select = forwardRef(SelectInner) as <T extends string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> },
) => ReturnType<typeof SelectInner>;
