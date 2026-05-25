"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { CaretDown, MagnifyingGlass, Phone } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { COUNTRIES, findCountry, type Country } from "@/lib/countries";
import { Popover } from "./popover";

/**
 * PhoneInput — country dial-code picker fused to a phone number input.
 *
 * The value is the LOCAL number digits only (no dial code, no spaces).
 * `country` (ISO 3166 alpha-2) is the separately controlled country
 * selection; together they form the canonical E.164-ish value as
 * `${country.dialCode}${value}`.
 *
 * Format-as-you-type uses a simple chunking strategy that groups
 * digits in 3-3-4 (or 3-3-3) clusters. It's display-only; the value
 * we emit to the consumer is always digit-only so the backend can
 * normalise without re-stripping spaces.
 */

export type PhoneInputProps = {
  /** Country ISO 3166-1 alpha-2 code. */
  country: string;
  onCountryChange: (next: string) => void;
  /** Local number digits (no dial code, no spaces). */
  value: string;
  onChange: (next: string) => void;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  fluid?: boolean;
  countries?: Country[];
  name?: string;
  "aria-label"?: string;
};

function formatLocal(digits: string): string {
  // Simple grouping. Works well for most West-African 10-digit numbers
  // and degrades gracefully for shorter/longer strings.
  const len = digits.length;
  if (len <= 3) return digits;
  if (len <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (len <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
}

export function PhoneInput({
  country,
  onCountryChange,
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Phone number",
  disabled,
  fluid = true,
  countries = COUNTRIES,
  name,
  "aria-label": ariaLabel,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const chipRef = useRef<HTMLButtonElement | null>(null);
  const fieldId = useId();
  const msgId = `${fieldId}-msg`;
  const hasError = Boolean(error);

  const selected = findCountry(country) ?? countries[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries, query]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Strip everything except digits — the canonical value is digit-only.
    const digits = e.target.value.replace(/\D+/g, "");
    onChange(digits);
  };

  const display = formatLocal(value);

  return (
    <div className={cn(fluid && "w-full")}>
      {label ? (
        <label
          htmlFor={fieldId}
          className={cn(
            "mb-1.5 block text-sm font-medium",
            hasError ? "text-danger" : "text-fg",
          )}
        >
          {label}
        </label>
      ) : null}

      <div
        data-error={hasError || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          "group relative flex h-12 w-full items-center gap-1 rounded-full bg-surface-2 pl-1.5 pr-4",
          "border-[0.5px] border-border-strong",
          "transition-[box-shadow,border-color,background-color] duration-quick ease-out",
          "hover:shadow-sm",
          "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
          "data-error:border-danger data-error:focus-within:ring-danger",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        )}
      >
        <button
          ref={chipRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country: ${selected?.name ?? country}`}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-surface-elev px-3 text-sm font-medium text-fg",
            "border-[0.5px] border-border",
            "transition-[background-color,border-color] duration-quick ease-out",
            "hover:border-border-strong",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
            "disabled:cursor-not-allowed",
          )}
        >
          <span aria-hidden className="text-base leading-none">
            {selected?.flag ?? "🏳️"}
          </span>
          <span className="tabular-nums">{selected?.dialCode ?? "+"}</span>
          <CaretDown
            size={14}
            weight="bold"
            className={cn(
              "text-fg-muted transition-transform duration-quick ease-out",
              open && "rotate-180",
            )}
          />
        </button>

        <span
          aria-hidden
          className="text-fg-subtle"
        >
          <Phone size={16} weight="bold" className="ml-1" />
        </span>

        <input
          id={fieldId}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          value={display}
          onChange={handleInput}
          placeholder={placeholder}
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          aria-label={label ? undefined : ariaLabel}
          className={cn(
            "min-w-0 flex-1 bg-transparent pl-2 text-input tabular-nums text-fg outline-none",
            "placeholder:text-fg-subtle",
            "disabled:cursor-not-allowed",
          )}
        />

        <Popover
          open={open}
          onClose={() => {
            setOpen(false);
            setQuery("");
          }}
          anchorRef={chipRef}
          matchTriggerWidth={false}
        >
          <div className="w-72 p-2">
            <div className="mb-2 flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4">
              <MagnifyingGlass size={16} weight="bold" className="text-fg-muted" />
              <input
                type="text"
                autoFocus
                placeholder="Search country…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-input text-fg outline-none placeholder:text-fg-subtle"
              />
            </div>
            <ul role="listbox" className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-fg-muted">
                  No countries match.
                </li>
              ) : (
                filtered.map((c) => {
                  const active = c.code === country;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          onCountryChange(c.code);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm",
                          "transition-[background-color] duration-quick ease-out",
                          active
                            ? "bg-surface-elev text-fg"
                            : "text-fg hover:bg-(--hover-overlay)",
                        )}
                      >
                        <span aria-hidden className="text-lg leading-none">
                          {c.flag}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-fg-muted">
                          {c.dialCode}
                        </span>
                      </button>
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
