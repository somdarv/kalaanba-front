"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { TextField, type TextFieldProps } from "./text-field";
import { cn } from "@/lib/cn";

/**
 * PasswordField — TextField + reveal toggle.
 *
 * Composes the base TextField recipe (pill, hairline border, solid pink
 * focus ring) and adds an accessible eye / eye-slash toggle in the right
 * slot. Sensible defaults for autocomplete & enterKeyHint.
 *
 * DESIGN_LANGUAGE.md §1.2 Proactive: the toggle gives immediate feedback;
 * §3.5 interaction recipe: hit area ≥ 32 px circular target.
 */
export type PasswordFieldProps = Omit<
  TextFieldProps,
  "type" | "rightSlot" | "leftIcon"
> & {
  /** Optional left icon (e.g. a Lock glyph). */
  leftIcon?: TextFieldProps["leftIcon"];
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { autoComplete = "current-password", enterKeyHint = "done", ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const { disabled } = props;

    return (
      <TextField
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        enterKeyHint={enterKeyHint}
        rightSlot={
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className={cn(
              "grid size-9 place-items-center rounded-full text-fg-muted mr-1",
              "transition-colors duration-quick ease-out",
              "hover:bg-(--hover-overlay) hover:text-fg",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              "disabled:cursor-not-allowed",
            )}
          >
            {visible ? (
              <EyeSlash size={18} weight="bold" />
            ) : (
              <Eye size={18} weight="bold" />
            )}
          </button>
        }
        {...props}
      />
    );
  },
);
