"use client";

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * `<Field>` — the form atom.
 *
 * One wrapper that owns:
 *   - the visible `<label>` (associated by `htmlFor` ↔ control id)
 *   - the hint slot under the control
 *   - the error slot under the control (replaces hint when present)
 *   - the `aria-describedby` / `aria-invalid` linkage
 *   - a `required`/`optional` marker beside the label
 *
 * The control inside reads its `id`, `aria-describedby`, `aria-invalid`,
 * `disabled`, and `required` from `useFieldContext()` instead of
 * receiving them as props. Bare `<input>`s, custom widgets, or our own
 * primitives (TextField, Select, etc. — which still keep their inline
 * label for compactness) can all opt in.
 *
 * Use `Field` whenever:
 *   - you need a label/hint/error around an input that doesn't ship its own
 *     (custom widgets, RHF-controlled bare inputs);
 *   - you need to group two related controls under one label;
 *   - you're building inside a `<Form>` and want consistent spacing.
 *
 * Layout: stacked, gap-2. No surface — Field is invisible, the control
 * provides the surface.
 *
 * Reference: COMPONENT_INVENTORY.md §2.1.
 */

export type FieldSize = "sm" | "md";

export type FieldContextValue = {
  /** Stable id generated from `useId()` or override via prop. */
  id: string;
  /** Space-separated id list for `aria-describedby`. */
  describedById?: string;
  /** True when an `error` slot is present. */
  hasError: boolean;
  /** Required marker visible in the label. */
  required: boolean;
  /** Forwarded to the control's `disabled` prop. */
  disabled: boolean;
  /** Visual sizing hint — useful for the control's own height/padding. */
  size: FieldSize;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Hook for the inner control. Returns the Field's context, or `null`
 * when the control is rendered standalone (no Field wrapper). Controls
 * should merge these onto their props as a default — explicit props
 * passed by the caller always win.
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export type FieldProps = {
  /** Visible label text. Required for a11y unless `aria-label` is set
   *  on the control itself. */
  label?: ReactNode;
  /** Helper text below the control. Hidden when `error` is present. */
  hint?: ReactNode;
  /** Error message below the control. Overrides `hint`. */
  error?: ReactNode;
  /** Show a `*` next to the label and set `aria-required` on the control. */
  required?: boolean;
  /** Show "Optional" muted next to the label. Mutually exclusive with
   *  `required`. */
  optional?: boolean;
  /** Forwarded to the control via context. */
  disabled?: boolean;
  /** Override the generated id. */
  id?: string;
  /** Tighter spacing for dense forms. Defaults to `md`. */
  size?: FieldSize;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** The control. Usually a single input/select/textarea. */
  children: ReactNode;
};

export function Field({
  label,
  hint,
  error,
  required = false,
  optional = false,
  disabled = false,
  id,
  size = "md",
  className,
  children,
}: FieldProps) {
  const reactId = useId();
  const fieldId = id ?? `kx-field-${reactId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedById = errorId ?? hintId;
  const hasError = Boolean(error);

  const ctx = useMemo<FieldContextValue>(
    () => ({
      id: fieldId,
      describedById,
      hasError,
      required,
      disabled,
      size,
    }),
    [fieldId, describedById, hasError, required, disabled, size],
  );

  const labelTextSize = size === "sm" ? "text-xs" : "text-sm";
  const messageTextSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <FieldContext.Provider value={ctx}>
      <div className={cn("block w-full", className)}>
        {label ? (
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label
              htmlFor={fieldId}
              className={cn(
                "block font-medium",
                labelTextSize,
                hasError ? "text-danger" : "text-fg",
                disabled && "opacity-60",
              )}
            >
              {label}
              {required ? (
                <span
                  aria-hidden
                  className="ml-0.5 text-danger"
                >
                  *
                </span>
              ) : null}
            </label>
            {optional && !required ? (
              <span
                className={cn(
                  "text-fg-muted",
                  messageTextSize,
                )}
              >
                Optional
              </span>
            ) : null}
          </div>
        ) : null}

        {children}

        {error ? (
          <p
            id={errorId}
            className={cn("mt-1.5 text-danger", messageTextSize)}
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={hintId}
            className={cn("mt-1.5 text-fg-muted", messageTextSize)}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
