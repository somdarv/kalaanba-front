"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Eye,
  EyeSlash,
  Minus,
  Plus,
  UploadSimple,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* =====================================================================
   KX INPUTS — full set, scoped under .kx-root
   - Labels are decoupled from inputs (clicking a label does NOT focus
     the field; only clicking inside the input area focuses it).
   - Soft, slow focus state: gentle border + tiny halo, no big ring.
   - Tones: default / success / warning / danger.
   - Optional left/right icon "tile" sitting on a soft background.
   ===================================================================== */

export type InputTone = "default" | "success" | "warning" | "danger";
export type InputSize = "md" | "lg";

const SIZE: Record<InputSize, { box: string; text: string; iconPx: number }> = {
  md: { box: "h-12", text: "text-sm",   iconPx: 18 },
  lg: { box: "h-14", text: "text-[15px]", iconPx: 20 },
};

const TONE_BORDER: Record<InputTone, string> = {
  default: "[--kx-input-accent:var(--kx-pink)]",
  success: "[--kx-input-accent:var(--kx-success)]",
  warning: "[--kx-input-accent:var(--kx-warning)]",
  danger:  "[--kx-input-accent:var(--kx-danger)]",
};

const TONE_TEXT: Record<InputTone, string> = {
  default: "text-[var(--kx-fg-muted)]",
  success: "text-[var(--kx-success)]",
  warning: "text-[var(--kx-warning)]",
  danger:  "text-[var(--kx-danger)]",
};

/* --------------------------- Field shell helpers --------------------------- */

function FieldLabel({ id, children }: { id: string; children: ReactNode }) {
  // NOTE: deliberately NOT using <label htmlFor> — clicking the label should
  // not steal focus and should not toggle the field's active styling.
  return (
    <div
      id={id}
      className="mb-2 select-none [font-family:var(--kx-font-display)] text-[12px] font-semibold tracking-tight text-[var(--kx-fg)]"
    >
      {children}
    </div>
  );
}

function FieldMessage({
  id,
  hint,
  message,
  tone,
}: {
  id?: string;
  hint?: string;
  message?: string;
  tone: InputTone;
}) {
  const text = message ?? hint;
  if (!text) return null;
  return (
    <div
      id={id}
      className={cn(
        "mt-2 text-xs leading-5",
        message ? TONE_TEXT[tone] : "text-[var(--kx-fg-muted)]",
      )}
    >
      {text}
    </div>
  );
}

/* Inline icon slot: bare icon, no background tile. */
function FieldIcon({
  children,
  active,
  side,
  tone,
}: {
  children: ReactNode;
  active: boolean;
  side: "left" | "right";
  tone: InputTone;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center transition-colors duration-300 ease-[var(--kx-ease)]",
        active
          ? tone === "default"
            ? "text-[var(--kx-fg)]"
            : "text-[var(--kx-input-accent)]"
          : "text-[var(--kx-fg-muted)]",
        side === "left" ? "pr-3" : "pl-3",
      )}
    >
      {children}
    </span>
  );
}

/* The visual frame: just a soft surface that responds gently on focus. */
function fieldFrame(opts: {
  size: InputSize;
  tone: InputTone;
  active: boolean;
  disabled?: boolean;
  pill?: boolean;
}) {
  return cn(
    "relative flex items-center px-4 text-[var(--kx-fg)]",
    "bg-[var(--kx-card-2)] border border-transparent",
    "transition-[background-color,border-color,box-shadow,color] duration-300 ease-[var(--kx-ease-out)]",
    SIZE[opts.size].box,
    "rounded-full",
    opts.tone !== "default" && "border-[var(--kx-input-accent)]",
    opts.active &&
      "bg-[var(--kx-card)] border-[var(--kx-input-accent)] shadow-[0_0_0_3px_var(--kx-ring)]",
    opts.disabled && "opacity-60 pointer-events-none",
  );
}

/* --------------------------- KxTextField --------------------------- */

type CommonFieldProps = {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  fieldSize?: InputSize;
  pill?: boolean;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightSlot?: ReactNode;
};

type KxTextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  CommonFieldProps;

export const KxTextField = forwardRef<HTMLInputElement, KxTextFieldProps>(
  function KxTextField(
    {
      label,
      hint,
      message,
      tone = "default",
      fieldSize = "md",
      pill = false,
      className,
      leftIcon,
      rightIcon,
      rightSlot,
      onFocus,
      onBlur,
      disabled,
      id,
      name,
      ...props
    },
    ref,
  ) {
    const reactId = useId();
    const fieldId = id ?? name ?? `kx-${reactId}`;
    const labelId = `${fieldId}-label`;
    const msgId = `${fieldId}-msg`;
    const [focused, setFocused] = useState(false);
    const active = focused;

    return (
      <div className={cn("block", TONE_BORDER[tone], className)}>
        {label ? <FieldLabel id={labelId}>{label}</FieldLabel> : null}
        <div className={fieldFrame({ size: fieldSize, tone, active, disabled, pill })}>
          {leftIcon ? (
            <FieldIcon active={active} side="left" tone={tone}>
              {leftIcon}
            </FieldIcon>
          ) : null}
          <input
            ref={ref}
            id={fieldId}
            name={name}
            disabled={disabled}
            aria-labelledby={label ? labelId : undefined}
            aria-invalid={tone === "danger" ? true : undefined}
            aria-describedby={hint || message ? msgId : undefined}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "min-w-0 flex-1 bg-transparent outline-none",
              "placeholder:text-[var(--kx-fg-muted)]",
              SIZE[fieldSize].text,
            )}
            {...props}
          />
          {rightSlot ? (
            <div className="shrink-0 pl-2 grid place-items-center text-[var(--kx-fg-muted)]">
              {rightSlot}
            </div>
          ) : rightIcon ? (
            <FieldIcon active={active} side="right" tone={tone}>
              {rightIcon}
            </FieldIcon>
          ) : null}
        </div>
        <FieldMessage id={msgId} hint={hint} message={message} tone={tone} />
      </div>
    );
  },
);

/* --------------------------- KxPasswordField --------------------------- */

type KxPasswordFieldProps = Omit<KxTextFieldProps, "type" | "rightIcon" | "rightSlot">;

export function KxPasswordField(props: KxPasswordFieldProps) {
  const [shown, setShown] = useState(false);
  return (
    <KxTextField
      {...props}
      type={shown ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "Hide password" : "Show password"}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full",
            "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
            "transition-colors duration-200 ease-[var(--kx-ease)]",
          )}
        >
          {shown ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
        </button>
      }
    />
  );
}

/* --------------------------- KxTextarea --------------------------- */

type KxTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  className?: string;
  rows?: number;
  showCount?: boolean;
  maxLength?: number;
};

export function KxTextarea({
  label,
  hint,
  message,
  tone = "default",
  className,
  rows = 4,
  showCount,
  maxLength,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  id,
  name,
  disabled,
  ...props
}: KxTextareaProps) {
  const reactId = useId();
  const fieldId = id ?? name ?? `kx-${reactId}`;
  const labelId = `${fieldId}-label`;
  const msgId = `${fieldId}-msg`;
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState<string>(
    typeof defaultValue === "string" ? defaultValue : "",
  );
  const liveValue =
    typeof value === "string" ? value : internal;

  return (
    <div className={cn("block", TONE_BORDER[tone], className)}>
      {label ? <FieldLabel id={labelId}>{label}</FieldLabel> : null}
      <div
        className={cn(
          "relative rounded-[var(--kx-r-btn)] bg-[var(--kx-card-2)] border border-transparent px-4 py-3",
          "transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--kx-ease-out)]",
          tone !== "default" && "border-[var(--kx-input-accent)]",
          focused && "bg-[var(--kx-card)] border-[var(--kx-input-accent)] shadow-[0_0_0_3px_var(--kx-ring)]",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <textarea
          id={fieldId}
          name={name}
          rows={rows}
          maxLength={maxLength}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={tone === "danger" ? true : undefined}
          aria-describedby={hint || message ? msgId : undefined}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            if (value === undefined) setInternal(e.target.value);
            onChange?.(e);
          }}
          className="block w-full resize-y bg-transparent text-sm leading-6 outline-none placeholder:text-[var(--kx-fg-muted)]"
          {...props}
        />
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <FieldMessage id={msgId} hint={hint} message={message} tone={tone} />
        {showCount && maxLength ? (
          <div className="ml-auto text-[11px] tabular-nums text-[var(--kx-fg-muted)]">
            {liveValue.length}/{maxLength}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------- KxSelect (custom dropdown) --------------------------- */

export type KxSelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

type KxSelectProps<T extends string> = {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  fieldSize?: InputSize;
  className?: string;
  placeholder?: string;
  options: KxSelectOption<T>[];
  value: T | null;
  onChange: (next: T) => void;
  leftIcon?: ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function KxSelect<T extends string>({
  label,
  hint,
  message,
  tone = "default",
  fieldSize = "md",
  className,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  leftIcon,
  disabled,
  name,
  id,
}: KxSelectProps<T>) {
  const reactId = useId();
  const fieldId = id ?? name ?? `kx-${reactId}`;
  const labelId = `${fieldId}-label`;
  const msgId = `${fieldId}-msg`;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o.value === value)),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((o) => o.value === value) ?? null;

  useOutsideClose(rootRef, () => setOpen(false));

  // Close on Esc, navigate with arrows.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => {
        const next = e.key === "ArrowDown" ? h + 1 : h - 1;
        return clamp(next, 0, options.length - 1);
      });
    } else if (e.key === "Enter" || e.key === " ") {
      if (open) {
        e.preventDefault();
        const opt = options[highlighted];
        if (opt && !opt.disabled) {
          onChange(opt.value);
          setOpen(false);
        }
      } else {
        e.preventDefault();
        setOpen(true);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={cn("block", TONE_BORDER[tone], className)} ref={rootRef}>
      {label ? <FieldLabel id={labelId}>{label}</FieldLabel> : null}
      <div className="relative">
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hint || message ? msgId : undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          className={cn(
            fieldFrame({ size: fieldSize, tone, active: open, disabled, pill: false }),
            "w-full text-left outline-none",
          )}
        >
          {leftIcon ? (
            <FieldIcon active={open} side="left" tone={tone}>
              {leftIcon}
            </FieldIcon>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              SIZE[fieldSize].text,
              selected ? "text-[var(--kx-fg)]" : "text-[var(--kx-fg-muted)]",
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <span
            className={cn(
              "ml-3 grid place-items-center text-[var(--kx-fg-muted)]",
              "transition-transform duration-300 ease-[var(--kx-ease)]",
              open && "rotate-180 text-[var(--kx-fg)]",
            )}
            aria-hidden
          >
            <CaretDown size={16} weight="bold" />
          </span>
        </button>

        {open ? (
          <div
            ref={listRef}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className={cn(
              "absolute left-0 right-0 top-[calc(100%+8px)] z-30",
              "kx-scroll max-h-72 overflow-y-auto rounded-[var(--kx-r-btn)]",
              "bg-[var(--kx-card)] border border-[var(--kx-border-strong)] shadow-[var(--kx-shadow-lg)] p-1.5",
            )}
            style={{ animation: "kx-popover 0.18s var(--kx-ease-out) both" }}
          >
            {options.map((opt, idx) => {
              const isActive = opt.value === value;
              const isHighlighted = idx === highlighted;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  key={opt.value}
                  disabled={opt.disabled}
                  onMouseEnter={() => setHighlighted(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-[calc(var(--kx-r-btn)-0.5rem)] px-3 py-2.5 text-left",
                    "transition-[background-color,color] duration-200 ease-[var(--kx-ease)]",
                    isHighlighted ? "bg-[var(--kx-card-2)]" : "bg-transparent",
                    opt.disabled && "opacity-50 pointer-events-none",
                  )}
                >
                  {opt.icon ? (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)] group-hover:text-[var(--kx-fg)]">
                      {opt.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--kx-fg)]">
                      {opt.label}
                    </span>
                    {opt.description ? (
                      <span className="mt-0.5 block text-[12px] text-[var(--kx-fg-muted)]">
                        {opt.description}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full",
                      isActive ? "bg-[var(--kx-pink)] text-white" : "text-transparent",
                      "transition-colors duration-200 ease-[var(--kx-ease)]",
                    )}
                    aria-hidden
                  >
                    <Check size={12} weight="bold" />
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <FieldMessage id={msgId} hint={hint} message={message} tone={tone} />
    </div>
  );
}

/* --------------------------- KxDatePicker (custom calendar) --------------------------- */

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildMonth(view: Date): Date[] {
  const first = startOfMonth(view);
  // Monday-first offset: JS getDay() returns 0..6 with 0=Sun
  const shift = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - shift);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

type KxDatePickerProps = {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  fieldSize?: InputSize;
  className?: string;
  placeholder?: string;
  value: Date | null;
  onChange: (next: Date) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function KxDatePicker({
  label,
  hint,
  message,
  tone = "default",
  fieldSize = "md",
  className,
  placeholder = "Pick a date",
  value,
  onChange,
  disabled,
  id,
  name,
  minDate,
  maxDate,
}: KxDatePickerProps) {
  const reactId = useId();
  const fieldId = id ?? name ?? `kx-${reactId}`;
  const labelId = `${fieldId}-label`;
  const msgId = `${fieldId}-msg`;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(value ?? new Date());
  const rootRef = useRef<HTMLDivElement | null>(null);
  useOutsideClose(rootRef, () => setOpen(false));

  const cells = useMemo(() => buildMonth(view), [view]);
  const today = useMemo(() => new Date(), []);

  const inRange = (d: Date) => {
    if (minDate && d < stripTime(minDate)) return false;
    if (maxDate && d > stripTime(maxDate)) return false;
    return true;
  };

  return (
    <div className={cn("block", TONE_BORDER[tone], className)} ref={rootRef}>
      {label ? <FieldLabel id={labelId}>{label}</FieldLabel> : null}
      <div className="relative">
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hint || message ? msgId : undefined}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            fieldFrame({ size: fieldSize, tone, active: open, disabled, pill: false }),
            "w-full text-left outline-none",
          )}
        >
          <FieldIcon active={open} side="left" tone={tone}>
            <CalendarBlank size={SIZE[fieldSize].iconPx} weight="bold" />
          </FieldIcon>
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              SIZE[fieldSize].text,
              value ? "text-[var(--kx-fg)]" : "text-[var(--kx-fg-muted)]",
            )}
          >
            {value ? fmtDate(value) : placeholder}
          </span>
          <span className="ml-3 text-[var(--kx-fg-muted)]" aria-hidden>
            <CaretDown size={16} weight="bold" />
          </span>
        </button>

        {open ? (
          <div
            role="dialog"
            aria-modal="false"
            className={cn(
              "absolute left-0 top-[calc(100%+8px)] z-30 w-[320px]",
              "rounded-[var(--kx-r-card)] bg-[var(--kx-card)] border border-[var(--kx-border-strong)] shadow-[var(--kx-shadow-lg)] p-4",
            )}
            style={{ animation: "kx-popover 0.2s var(--kx-ease-out) both" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView((v) => addMonths(v, -1))}
                className="grid h-9 w-9 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[var(--kx-card-2)] transition-colors"
                aria-label="Previous month"
              >
                <CaretLeft size={18} weight="bold" />
              </button>
              <div className="[font-family:var(--kx-font-display)] text-sm font-semibold tracking-tight text-[var(--kx-fg)]">
                {MONTHS[view.getMonth()]} {view.getFullYear()}
              </div>
              <button
                type="button"
                onClick={() => setView((v) => addMonths(v, 1))}
                className="grid h-9 w-9 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[var(--kx-card-2)] transition-colors"
                aria-label="Next month"
              >
                <CaretRight size={18} weight="bold" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1 text-center">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)] py-1"
                >
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((d) => {
                const inMonth = d.getMonth() === view.getMonth();
                const isToday = isSameDay(d, today);
                const isSelected = value ? isSameDay(d, value) : false;
                const enabled = inRange(d);
                return (
                  <button
                    type="button"
                    key={d.toISOString()}
                    disabled={!enabled}
                    onClick={() => {
                      onChange(d);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative h-9 w-full rounded-full text-[13px] tabular-nums",
                      "transition-[background-color,color,transform] duration-200 ease-[var(--kx-ease)]",
                      enabled ? "hover:bg-[var(--kx-card-2)]" : "opacity-30 pointer-events-none",
                      inMonth ? "text-[var(--kx-fg)]" : "text-[var(--kx-fg-muted)]",
                      isSelected &&
                        "bg-[var(--kx-pink)] text-white hover:bg-[var(--kx-pink)] shadow-[var(--kx-shadow-pink)]",
                      !isSelected && isToday && "ring-1 ring-[var(--kx-pink)]",
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                className="text-[12px] font-medium text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] transition-colors"
                onClick={() => {
                  const t = new Date();
                  setView(t);
                  onChange(t);
                  setOpen(false);
                }}
              >
                Today
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--kx-card-2)] px-3 py-1.5 text-[12px] font-medium text-[var(--kx-fg)] hover:bg-[var(--kx-card)] transition-colors"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <FieldMessage id={msgId} hint={hint} message={message} tone={tone} />
    </div>
  );
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(d: Date, n: number) {
  const next = new Date(d);
  next.setMonth(next.getMonth() + n);
  return next;
}

/* --------------------------- KxNumberInput --------------------------- */

type KxNumberInputProps = {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  className?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  fieldSize?: InputSize;
};

export function KxNumberInput({
  label,
  hint,
  message,
  tone = "default",
  className,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  disabled,
  fieldSize = "md",
}: KxNumberInputProps) {
  const reactId = useId();
  const fieldId = `kx-${reactId}`;
  const labelId = `${fieldId}-label`;
  const msgId = `${fieldId}-msg`;
  const [focused, setFocused] = useState(false);

  const set = (n: number) => onChange(clamp(n, min, max));

  return (
    <div className={cn("block", TONE_BORDER[tone], className)}>
      {label ? <FieldLabel id={labelId}>{label}</FieldLabel> : null}
      <div className={fieldFrame({ size: fieldSize, tone, active: focused, disabled })}>
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => set(value - step)}
          disabled={disabled || value <= min}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[var(--kx-card)] transition-colors disabled:opacity-40 ml-1"
        >
          <Minus size={16} weight="bold" />
        </button>
        <input
          id={fieldId}
          type="number"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hint || message ? msgId : undefined}
          value={Number.isFinite(value) ? value : ""}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) set(n);
          }}
          disabled={disabled}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-center [font-family:var(--kx-font-display)] font-semibold tabular-nums outline-none",
            SIZE[fieldSize].text,
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]",
          )}
        />
        {unit ? (
          <span className="mr-1 text-xs text-[var(--kx-fg-muted)]">{unit}</span>
        ) : null}
        <button
          type="button"
          aria-label="Increase"
          onClick={() => set(value + step)}
          disabled={disabled || value >= max}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[var(--kx-card)] transition-colors disabled:opacity-40 mr-1"
        >
          <Plus size={16} weight="bold" />
        </button>
      </div>
      <FieldMessage id={msgId} hint={hint} message={message} tone={tone} />
    </div>
  );
}

/* --------------------------- KxOTPInput --------------------------- */

export function KxOTPInput({
  label,
  hint,
  message,
  tone = "default",
  className,
  length = 6,
  value,
  onChange,
  disabled,
}: {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  className?: string;
  length?: number;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = useMemo(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  const setChar = (i: number, ch: string) => {
    const next = chars.slice();
    next[i] = ch.slice(-1);
    onChange(next.join(""));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      if (chars[i]) {
        setChar(i, "");
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        const next = chars.slice();
        next[i - 1] = "";
        onChange(next.join(""));
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  return (
    <div className={cn("block", TONE_BORDER[tone], className)}>
      {label ? <FieldLabel id={`otp-label`}>{label}</FieldLabel> : null}
      <div className="flex items-center gap-2">
        {chars.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={c}
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => {
              const ch = e.target.value.replace(/\D/g, "");
              if (ch) {
                setChar(i, ch);
                if (i < length - 1) refs.current[i + 1]?.focus();
              } else {
                setChar(i, "");
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
              if (!pasted) return;
              e.preventDefault();
              onChange(pasted.padEnd(length, "").slice(0, length));
              const focusAt = Math.min(pasted.length, length - 1);
              refs.current[focusAt]?.focus();
            }}
            onKeyDown={(e) => handleKey(e, i)}
            className={cn(
              "h-14 w-12 rounded-[var(--kx-r-btn)] bg-[var(--kx-card-2)] text-center [font-family:var(--kx-font-display)] text-xl font-bold tabular-nums",
              "border border-transparent transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--kx-ease-out)]",
              "outline-none focus:bg-[var(--kx-card)] focus:border-[var(--kx-input-accent)] focus:shadow-[0_0_0_3px_var(--kx-ring)]",
              tone !== "default" && "border-[var(--kx-input-accent)]",
              disabled && "opacity-60 pointer-events-none",
            )}
          />
        ))}
      </div>
      <FieldMessage hint={hint} message={message} tone={tone} />
    </div>
  );
}

/* --------------------------- KxFileInput --------------------------- */

export function KxFileInput({
  label,
  hint,
  message,
  tone = "default",
  className,
  accept,
  multiple,
  onFiles,
  disabled,
}: {
  label?: string;
  hint?: string;
  message?: string;
  tone?: InputTone;
  className?: string;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const accept_ = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list);
      setFiles(arr);
      onFiles?.(arr);
    },
    [onFiles],
  );

  return (
    <div className={cn("block", TONE_BORDER[tone], className)}>
      {label ? <FieldLabel id="file-label">{label}</FieldLabel> : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          accept_(e.dataTransfer.files);
        }}
        className={cn(
          "flex items-center gap-4 rounded-[var(--kx-r-btn)] bg-[var(--kx-card-2)] p-4",
          "border border-dashed border-[var(--kx-border-strong)]",
          "transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--kx-ease-out)]",
          dragActive &&
            "bg-[var(--kx-card)] border-[var(--kx-input-accent)] shadow-[0_0_0_3px_var(--kx-ring)]",
          disabled && "opacity-60 pointer-events-none",
        )}
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--kx-r-btn)] bg-[var(--kx-card)] text-[var(--kx-fg-muted)]">
          <UploadSimple size={20} weight="bold" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-[var(--kx-fg)]">
            {files.length === 0
              ? "Drop a file or click to upload"
              : `${files.length} file${files.length === 1 ? "" : "s"} selected`}
          </div>
          <div className="mt-0.5 truncate text-[12px] text-[var(--kx-fg-muted)]">
            {files.length === 0
              ? accept
                ? `Accepts ${accept}`
                : "Any file type"
              : files.map((f) => f.name).join(", ")}
          </div>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-full bg-[var(--kx-pink)] px-4 py-2 text-[12px] font-semibold text-white shadow-[var(--kx-shadow-pink)] hover:brightness-[1.05] active:scale-[0.97] transition-[transform,filter] duration-200 ease-[var(--kx-ease)]"
        >
          Choose
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => accept_(e.target.files)}
        />
      </div>
      <FieldMessage hint={hint} message={message} tone={tone} />
    </div>
  );
}

/* --------------------------- KxCheckbox --------------------------- */

export function KxCheckbox({
  checked,
  onChange,
  label,
  hint,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-start gap-3 select-none cursor-pointer",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span
        className={cn(
          "relative grid h-5 w-5 shrink-0 place-items-center rounded-md mt-0.5",
          "border-2 transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--kx-ease-out)]",
          checked
            ? "bg-[var(--kx-pink)] border-[var(--kx-pink)] shadow-[0_0_0_3px_var(--kx-ring)]"
            : "bg-transparent border-[var(--kx-border-strong)]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "text-white transition-opacity duration-200 ease-[var(--kx-ease)]",
            checked ? "opacity-100" : "opacity-0",
          )}
        >
          <Check size={12} weight="bold" />
        </span>
      </span>
      {label || hint ? (
        <span className="min-w-0">
          {label ? <span className="block text-sm text-[var(--kx-fg)]">{label}</span> : null}
          {hint ? <span className="mt-0.5 block text-xs text-[var(--kx-fg-muted)]">{hint}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

/* --------------------------- KxRadioGroup --------------------------- */

export function KxRadioGroup<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string; hint?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)} role="radiogroup">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group flex items-center gap-3 rounded-[var(--kx-r-btn)] p-3 text-left border",
              "transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--kx-ease-out)]",
              active
                ? "bg-[color-mix(in_oklab,var(--kx-pink)_10%,var(--kx-card))] border-[var(--kx-pink)] shadow-[0_0_0_3px_var(--kx-ring)] hover:bg-[color-mix(in_oklab,var(--kx-pink)_14%,var(--kx-card))]"
                : "bg-[var(--kx-card-2)] border-transparent hover:bg-[var(--kx-card)] hover:border-[var(--kx-border-strong)]",
            )}
          >
            <span
              className={cn(
                "relative grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                "transition-[border-color] duration-300 ease-[var(--kx-ease)]",
                active
                  ? "border-[var(--kx-pink)]"
                  : "border-[var(--kx-border-strong)] group-hover:border-[var(--kx-fg-muted)]",
              )}
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full bg-[var(--kx-pink)]",
                  "transition-transform duration-300 ease-[var(--kx-ease-out)]",
                  active ? "scale-100" : "scale-0",
                )}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-[var(--kx-fg)]">{opt.label}</span>
              {opt.hint ? (
                <span className="mt-0.5 block text-xs text-[var(--kx-fg-muted)]">{opt.hint}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- KxSlider --------------------------- */

export function KxSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("block", className)}>
      {label || showValue ? (
        <div className="mb-2 flex items-baseline justify-between">
          {label ? (
            <div className="[font-family:var(--kx-font-display)] text-[12px] font-semibold tracking-tight text-[var(--kx-fg)]">
              {label}
            </div>
          ) : null}
          {showValue ? (
            <div className="[font-family:var(--kx-font-display)] text-sm font-bold tabular-nums text-[var(--kx-fg)]">
              {value}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="relative h-10 select-none">
        <div
          className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--kx-card-2)]"
          aria-hidden
        />
        <div
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--kx-pink)] transition-[width] duration-200 ease-[var(--kx-ease)]"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-white shadow-[var(--kx-shadow-md)] ring-2 ring-[var(--kx-pink)] transition-[left] duration-200 ease-[var(--kx-ease)]"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
        />
      </div>
    </div>
  );
}

/* --------------------------- helpers --------------------------- */

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function useOutsideClose(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) fn();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, fn]);
}
