"use client";

import { forwardRef } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { TextField, type TextFieldProps } from "./text-field";
import { cn } from "@/lib/cn";

/**
 * SearchField — TextField preset with a leading magnifier and an
 * optional clear (×) button on the right that appears whenever the
 * field has a value.
 *
 * The clear button is only useful when the field is controlled, so we
 * only render it if the consumer passed `value` AND `onClear`.
 */

export type SearchFieldProps = Omit<
  TextFieldProps,
  "type" | "leftIcon" | "rightSlot" | "purpose"
> & {
  /** Called when the × button is clicked. Render only when set. */
  onClear?: () => void;
};

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    { value, onClear, ...rest },
    ref,
  ) {
    const showClear =
      typeof onClear === "function" &&
      typeof value === "string" &&
      value.length > 0;

    return (
      <TextField
        ref={ref}
        purpose="search"
        value={value}
        leftIcon={<MagnifyingGlass size={18} weight="bold" />}
        rightSlot={
          showClear ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={onClear}
              disabled={rest.disabled}
              className={cn(
                "mr-1 grid size-9 place-items-center rounded-pill text-fg-muted",
                "transition-colors duration-quick ease-out",
                "hover:bg-(--hover-overlay) hover:text-fg",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
                "disabled:cursor-not-allowed",
              )}
            >
              <X size={16} weight="bold" />
            </button>
          ) : undefined
        }
        {...rest}
      />
    );
  },
);
