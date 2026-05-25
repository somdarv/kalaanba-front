"use client";

import {
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { cn } from "@/lib/cn";

/**
 * OTPInput — one-time code entry. Fixed number of single-character
 * boxes. Auto-advance on input, backspace returns to the previous
 * box, paste fills boxes left to right, arrow keys navigate.
 *
 * Visual recipe matches the rest of the input suite: pill (rounded-full)
 * boxes on `bg-surface-2`, hairline border, brand ring on focus, danger
 * border + ring on error.
 *
 * Logic-only: emits the joined string on every change. Consumer drives
 * the value (controlled).
 */

export type OtpInputProps = {
  value: string;
  onChange: (next: string) => void;
  /** Number of boxes. Defaults to 6. */
  length?: number;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** "numeric" (default) shows the number keyboard on mobile. */
  inputMode?: "numeric" | "text";
  /** Pattern of allowed characters. Defaults to digits. */
  pattern?: RegExp;
  autoFocus?: boolean;
  name?: string;
  "aria-label"?: string;
};

export function OtpInput({
  value,
  onChange,
  length = 6,
  label,
  hint,
  error,
  disabled,
  inputMode = "numeric",
  pattern = /[0-9]/,
  autoFocus,
  name,
  "aria-label": ariaLabel,
}: OtpInputProps) {
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const hasError = Boolean(error);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setCharAt = (index: number, char: string) => {
    const chars = value.padEnd(length, " ").split("");
    chars[index] = char || " ";
    const joined = chars.join("").trimEnd();
    onChange(joined);
  };

  const focusBox = (index: number) => {
    const target = refs.current[index];
    target?.focus();
    target?.select();
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Take only the last typed character (handles repeats / IMEs).
    const last = raw.slice(-1);
    if (last && !pattern.test(last)) return;
    setCharAt(index, last);
    if (last && index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const current = value[index] ?? "";
      if (e.key === "Backspace") {
        if (current) {
          setCharAt(index, "");
        } else if (index > 0) {
          setCharAt(index - 1, "");
          focusBox(index - 1);
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusBox(index - 1);
        e.preventDefault();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focusBox(index + 1);
        e.preventDefault();
      } else if (e.key === "Home") {
        focusBox(0);
        e.preventDefault();
      } else if (e.key === "End") {
        focusBox(length - 1);
        e.preventDefault();
      }
    };

  const handlePaste = (index: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!pasted) return;
    e.preventDefault();
    const chars = value.padEnd(length, " ").split("");
    let cursor = index;
    for (const ch of pasted) {
      if (cursor >= length) break;
      if (!pattern.test(ch)) continue;
      chars[cursor] = ch;
      cursor += 1;
    }
    const joined = chars.join("").trimEnd();
    onChange(joined);
    focusBox(Math.min(cursor, length - 1));
  };

  return (
    <div className="w-full">
      {label ? (
        <label
          id={`${fieldId}-label`}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger" : "text-fg",
          )}
        >
          {label}
        </label>
      ) : null}

      <div
        role="group"
        aria-labelledby={label ? `${fieldId}-label` : undefined}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={msgId}
        className="flex items-center gap-2"
      >
        {Array.from({ length }).map((_, index) => {
          const char = value[index] ?? "";
          return (
            <input
              key={index}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="text"
              inputMode={inputMode}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              maxLength={1}
              value={char}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste(index)}
              onFocus={(e) => e.currentTarget.select()}
              name={name ? `${name}-${index}` : undefined}
              data-error={hasError || undefined}
              className={cn(
                "size-12 rounded-full bg-surface-2 text-center text-input font-semibold tabular-nums text-fg",
                "border-[0.5px] border-border-strong",
                "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
                "hover:shadow-sm",
                "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                "data-error:border-danger data-error:focus:ring-danger",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          );
        })}
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
