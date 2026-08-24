"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { cn } from "@/lib/cn";

/**
 * The option list a `<Select>` shows, independent of what shows it.
 *
 * Extracted in WP-20260824-setup-surface when the same list had to render in
 * two containers: a `<Popover>` anchored to the trigger on a pointer device,
 * and a `<BottomSheet>` on a phone. The list is identical in both; only the
 * frame and a few sizes change, which is exactly the split that belongs in one
 * component with a `variant` rather than two copies.
 *
 * Lives here rather than in `select.tsx` for the ordinary reason: that file
 * was already at 303 lines and engineering-standards §1 caps a source file at
 * 400.
 */

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  leading?: ReactNode;
  disabled?: boolean;
};

export type SelectOptionsProps<T extends string> = {
  listId: string;
  options: SelectOption<T>[];
  value: T | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onCommit: (option: SelectOption<T>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  searchable?: boolean;
  query: string;
  onQueryChange: (next: string) => void;
  renderOption?: (option: SelectOption<T>) => ReactNode;
  /**
   * The options are still on their way.
   *
   * Only changes the EMPTY state: "No results." is a finding, and stating it
   * while a request is in flight is a claim the component cannot support yet.
   */
  loading?: boolean;
  /**
   * `sheet` has the bottom of the screen and a thumb reaching it; `popover`
   * has a small anchored panel and a pointer.
   */
  variant: "popover" | "sheet";
};

export function SelectOptions<T extends string>({
  listId,
  options,
  value,
  activeIndex,
  onActiveIndexChange,
  onCommit,
  onKeyDown,
  searchable,
  query,
  onQueryChange,
  renderOption,
  loading,
  variant,
}: SelectOptionsProps<T>) {
  const isSheet = variant === "sheet";

  return (
    <div onKeyDown={onKeyDown} className={isSheet ? undefined : "p-2"}>
      {searchable ? (
        <div
          className={cn(
            "rounded-control bg-surface-elev mb-2 flex items-center gap-2 px-4",
            isSheet ? "border-control-border h-14 border" : "h-10",
          )}
        >
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="text-fg-muted shrink-0"
          />
          <input
            // Focused on a popover, NOT on a sheet. On a phone, raising the
            // keyboard the instant the sheet opens covers half the list it
            // just showed; the person can tap the field if they want to type.
            autoFocus={!isSheet}
            type="text"
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              onActiveIndexChange(0);
            }}
            placeholder="Search"
            aria-label="Search options"
            className="text-input text-fg placeholder:text-fg-subtle w-full bg-transparent outline-none"
          />
        </div>
      ) : null}

      <ul
        id={listId}
        role="listbox"
        className={cn(
          "overflow-y-auto overscroll-contain",
          // `overscroll-contain` so a flick at the end of the list does not
          // leak into the page behind the sheet (§9.5).
          isSheet ? "max-h-[52dvh] pb-2" : "max-h-72 py-1",
        )}
      >
        {options.length === 0 ? (
          <li className="text-fg-muted px-3 py-3 text-sm">
            {loading ? "Loading" : "No results."}
          </li>
        ) : (
          options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => onActiveIndexChange(index)}
                onClick={() => onCommit(option)}
                className={cn(
                  // `min-h-11` is the §9.1 floor. The rows were 40px, which is
                  // under it on both variants.
                  "rounded-control flex min-h-11 cursor-pointer items-center gap-3 text-sm",
                  isSheet ? "px-3 py-3" : "px-3 py-2.5",
                  isActive && "bg-(--hover-overlay)",
                  isSelected && "text-primary-ink",
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
                      <span className="text-fg block truncate font-medium">
                        {option.label}
                      </span>
                      {option.description ? (
                        <span className="text-fg-muted block truncate text-xs">
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
  );
}
