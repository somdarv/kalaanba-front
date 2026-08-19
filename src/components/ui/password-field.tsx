"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { TextField, type TextFieldProps } from "./text-field";
import type { InputPurpose } from "./input-attributes";
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
  "type" | "rightSlot" | "leftIcon" | "purpose"
> & {
  /** Optional left icon (e.g. a Lock glyph). */
  leftIcon?: TextFieldProps["leftIcon"];
  /**
   * `current-password` (default) offers the saved credential; `new-password`
   * asks the manager to *generate* one and stops it filling the old value
   * into a signup or reset form (DESIGN_LANGUAGE §9.3).
   */
  purpose?: Extract<InputPurpose, "current-password" | "new-password">;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { purpose = "current-password", ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const { disabled } = props;

    return (
      <TextField
        ref={ref}
        purpose={purpose}
        // Revealing swaps the native type but must NOT swap the purpose —
        // the autofill token and keyboard stay pinned to the password bundle.
        type={visible ? "text" : "password"}
        rightSlot={
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className={cn(
              "grid size-9 place-items-center rounded-pill text-fg-muted mr-1",
              "transition-colors duration-quick ease-out",
              "hover:bg-(--hover-overlay) hover:text-fg",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring",
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
