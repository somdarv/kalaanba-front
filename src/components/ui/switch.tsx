"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Switch — boolean toggle. Pink-filled track when on, neutral track
 * when off. Thumb slides with token-defined easing.
 *
 * If both `label` and `description` are provided, the layout becomes a
 * full-width settings row (label/description left, switch right).
 * Without them, it's a compact inline control.
 */

export type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  name?: string;
  /** Render as a full-width settings row (default true when label set). */
  block?: boolean;
  "aria-label"?: string;
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  name,
  block,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const fieldId = useId();
  const asBlock = block ?? Boolean(label && description);

  const control = (
    <button
      type="button"
      role="switch"
      id={fieldId}
      name={name}
      aria-checked={checked}
      aria-label={label ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill",
        "transition-[background-color] duration-quick ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        // Distinct off-state in both themes: subtle inset pill, primary fill when on.
        checked
          ? "bg-primary"
          : "bg-surface-elev ring-1 ring-inset ring-border-strong",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          // Solid white knob in both themes — reads as a physical toggle.
          "absolute left-0.5 size-5 rounded-pill bg-white shadow-sm ring-1 ring-black/10",
          // The knob sliding IS the metaphor — physical translation, not
          // synthetic state feedback. Soft graceful ease across the track.
          "transition-transform duration-graceful ease-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );

  if (asBlock) {
    return (
      <div
        className={cn(
          "flex w-full items-start gap-4",
          disabled && "opacity-60",
        )}
      >
        <label
          htmlFor={fieldId}
          className={cn(
            "min-w-0 flex-1",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          {label ? (
            <span className="block text-sm font-medium text-fg">{label}</span>
          ) : null}
          {description ? (
            <span className="mt-0.5 block text-xs text-fg-muted">
              {description}
            </span>
          ) : null}
        </label>
        {control}
      </div>
    );
  }

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        "inline-flex items-center gap-3 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      {control}
      {label ? <span className="text-sm text-fg">{label}</span> : null}
    </label>
  );
}
