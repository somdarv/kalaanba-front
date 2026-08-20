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
 * **One-tap fill is a first-class path, not paste's poor relation.** On a
 * phone the code is almost never typed: it is tapped off the keyboard
 * suggestion the moment the SMS lands. That arrives as a normal `change`
 * carrying all six digits at once, so `handleChange` spreads a multi-character
 * value across the boxes exactly the way `handlePaste` does.
 *
 * Visual recipe matches the rest of the input suite: tall rounded-rectangle
 * boxes on `bg-control-surface` that flex to fill the row (so the group is the same
 * width as a full-width button beneath it), hairline border, brand ring on
 * focus, danger border + ring on error, and a faint placeholder per empty box.
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
  /** Faint placeholder shown in each empty box. */
  placeholder?: string;
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
  placeholder = "•",
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

  /**
   * Spread `text` across the boxes from `start`, keeping only characters that
   * match `pattern`, and park the caret on the last box written. A code that
   * arrives whole (an autofill, or a paste of the full thing) always starts
   * at box 0 no matter which box received it — landing "123456" in box 4
   * would otherwise keep two digits and drop four.
   */
  const fillFrom = (start: number, text: string): string | null => {
    const accepted = Array.from(text).filter((ch) => pattern.test(ch));
    if (accepted.length === 0) return null;
    const from = accepted.length >= length ? 0 : start;
    const chars = value.padEnd(length, " ").split("");
    let cursor = from;
    for (const ch of accepted) {
      if (cursor >= length) break;
      chars[cursor] = ch;
      cursor += 1;
    }
    const next = chars.join("").trimEnd();
    onChange(next);
    focusBox(Math.min(cursor, length - 1));
    return next;
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const current = value[index] ?? "";

    // One-tap SMS autofill — the iOS QuickType bar, Gboard's "from Messages"
    // suggestion, Android's credential picker — delivers the WHOLE code into
    // the focused box in a single change event. Taking only the last
    // character (which is what this did) threw five of the six digits away,
    // so tapping the code on the keyboard looked like it did nothing.
    //
    // Two characters is the ordinary "typed over an existing digit" case —
    // the browser reports old + new when the caret sits after the digit — and
    // must NOT be read as a fill.
    const typedOverExisting =
      current !== "" && raw.length === 2 && raw.startsWith(current);
    if (raw.length > 1 && !typedOverExisting) {
      const next = fillFrom(index, raw);
      // Each box is controlled to a single character, but React only writes
      // the DOM when the controlled value actually changes — fill the same
      // code twice and it skips, leaving all six characters sitting in this
      // one box. Put the box back to its single character by hand.
      e.target.value = next?.[index] ?? "";
      return;
    }

    // Take only the last typed character (handles repeats / IMEs).
    const last = raw.slice(-1);
    if (last && !pattern.test(last)) return;
    setCharAt(index, last);
    if (raw.length > 1) e.target.value = last;
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
    fillFrom(index, pasted);
  };

  return (
    <div className="w-full">
      {label ? (
        <label
          id={`${fieldId}-label`}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger-ink" : "text-fg",
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
              // `one-time-code` on EVERY box, not just the first. The keyboard
              // only offers the SMS suggestion for the field that has focus,
              // so putting it on box 0 alone meant the affordance vanished the
              // moment someone typed a digit and moved on — exactly when the
              // message tends to land. `handleChange` spreads whatever the
              // platform drops in, so any box can receive the whole code.
              autoComplete="one-time-code"
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              // Deliberately the full code length, not 1. `maxlength` is
              // enforced against autofill and paste as well as typing, so a
              // 1-char cap silently truncates the six digits the keyboard
              // hands over — the box would take "1" and drop "23456", which
              // is the whole reason one-tap fill never worked here. Typing
              // still yields one character per box: the value is controlled
              // to a single char and `handleChange` spreads the rest.
              maxLength={length}
              value={char}
              placeholder={placeholder}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste(index)}
              onFocus={(e) => e.currentTarget.select()}
              name={name ? `${name}-${index}` : undefined}
              data-error={hasError || undefined}
              className={cn(
                // Tall rounded rectangle that flexes to fill the row, so the
                // group spans the same width as a full-width button below it.
                "h-14 min-w-0 flex-1 rounded-control bg-control-surface text-center text-lg font-semibold tabular-nums text-fg",
                "border border-control-border",
                "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
                "hover:shadow-sm",
                "placeholder:font-normal placeholder:text-fg-subtle",
                "focus:outline-none focus:border-primary-ink focus:ring-1 focus:ring-primary-ink",
                "data-error:border-danger-ink data-error:focus:ring-danger-ink",
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
            hasError ? "text-danger-ink" : "text-fg-muted",
          )}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
