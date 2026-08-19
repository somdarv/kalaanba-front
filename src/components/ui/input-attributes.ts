import type { HTMLAttributes, InputHTMLAttributes } from "react";

/**
 * Purpose-keyed input attribute defaults.
 *
 * DESIGN_LANGUAGE.md §9.3: "Every `<input>` declares `inputmode`,
 * `autocomplete`, and `enterkeyhint` appropriate to its purpose (TextField
 * API enforces or warns)." This module is that enforcement — one table, so
 * a field's browser behaviour is a single declared `purpose` instead of six
 * attributes re-derived (and forgotten) at every call site.
 *
 * A purpose fixes the whole bundle: which soft keyboard opens, what the
 * Enter key says, whether the password manager offers to fill, whether iOS
 * capitalises and autocorrects, and the fallback placeholder. Caller-passed
 * props always win over the table — these are defaults, not a cage.
 */

export type InputPurpose =
  | "text"
  | "name"
  | "given-name"
  | "family-name"
  | "username"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "current-password"
  | "new-password"
  | "one-time-code"
  | "integer"
  | "decimal"
  | "postal-code"
  | "organization"
  | "street-address"
  | "off";

export type ResolvedInputAttributes = {
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  inputMode: HTMLAttributes<HTMLElement>["inputMode"];
  autoComplete: string;
  enterKeyHint: HTMLAttributes<HTMLElement>["enterKeyHint"];
  autoCapitalize: "none" | "sentences" | "words" | "characters";
  autoCorrect: "on" | "off";
  spellCheck: boolean;
  placeholder: string;
};

/**
 * `enterKeyHint` is "next" for anything that normally sits mid-form and
 * "done" for terminal fields, so the on-screen keyboard's action key tells
 * the truth about what pressing it will do.
 */
export const INPUT_ATTRIBUTES: Record<InputPurpose, ResolvedInputAttributes> = {
  text: {
    type: "text",
    inputMode: "text",
    autoComplete: "on",
    enterKeyHint: "next",
    autoCapitalize: "sentences",
    autoCorrect: "on",
    spellCheck: true,
    placeholder: "",
  },
  name: {
    type: "text",
    inputMode: "text",
    autoComplete: "name",
    enterKeyHint: "next",
    autoCapitalize: "words",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Kwame Mensah",
  },
  "given-name": {
    type: "text",
    inputMode: "text",
    autoComplete: "given-name",
    enterKeyHint: "next",
    autoCapitalize: "words",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Kwame",
  },
  "family-name": {
    type: "text",
    inputMode: "text",
    autoComplete: "family-name",
    enterKeyHint: "next",
    autoCapitalize: "words",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Mensah",
  },
  username: {
    type: "text",
    inputMode: "text",
    autoComplete: "username",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "kwame.mensah",
  },
  email: {
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "you@example.com",
  },
  tel: {
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "024 123 4567",
  },
  url: {
    type: "url",
    inputMode: "url",
    autoComplete: "url",
    enterKeyHint: "go",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "https://",
  },
  search: {
    type: "search",
    inputMode: "search",
    autoComplete: "off",
    enterKeyHint: "search",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Search…",
  },
  "current-password": {
    type: "password",
    inputMode: "text",
    autoComplete: "current-password",
    enterKeyHint: "done",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "••••••••",
  },
  "new-password": {
    type: "password",
    inputMode: "text",
    autoComplete: "new-password",
    enterKeyHint: "done",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "At least 8 characters",
  },
  "one-time-code": {
    type: "text",
    inputMode: "numeric",
    autoComplete: "one-time-code",
    enterKeyHint: "done",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "••••••",
  },
  integer: {
    type: "text",
    inputMode: "numeric",
    autoComplete: "off",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "0",
  },
  decimal: {
    type: "text",
    inputMode: "decimal",
    autoComplete: "off",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "0.00",
  },
  "postal-code": {
    type: "text",
    inputMode: "text",
    autoComplete: "postal-code",
    enterKeyHint: "next",
    autoCapitalize: "characters",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "GA-123-4567",
  },
  organization: {
    type: "text",
    inputMode: "text",
    autoComplete: "organization",
    enterKeyHint: "next",
    autoCapitalize: "words",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Accra Lions FC",
  },
  "street-address": {
    type: "text",
    inputMode: "text",
    autoComplete: "street-address",
    enterKeyHint: "next",
    autoCapitalize: "words",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "House number and street",
  },
  off: {
    type: "text",
    inputMode: "text",
    autoComplete: "off",
    enterKeyHint: "next",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "",
  },
};

/**
 * Native `type` values that imply a purpose on their own, so a call site
 * that already says `type="email"` gets the right keyboard without also
 * having to say `purpose="email"`.
 */
const PURPOSE_BY_TYPE: Record<string, InputPurpose> = {
  email: "email",
  tel: "tel",
  url: "url",
  search: "search",
  password: "current-password",
  text: "text",
};

/**
 * Resolves the attribute bundle for a field. `purpose` wins; otherwise the
 * native `type` is used to infer one; otherwise the generic text bundle.
 *
 * Warns in development when neither is declared and the field is therefore
 * falling back to a keyboard nobody chose (§9.3 "enforces or warns").
 */
export function resolveInputAttributes(
  purpose: InputPurpose | undefined,
  type: string | undefined,
  fieldLabel?: string,
): ResolvedInputAttributes {
  if (purpose) return INPUT_ATTRIBUTES[purpose];

  const inferred = type ? PURPOSE_BY_TYPE[type] : undefined;
  if (inferred) return INPUT_ATTRIBUTES[inferred];

  if (process.env.NODE_ENV !== "production" && (type ?? "text") === "text") {
    console.warn(
      `[TextField] ${fieldLabel ? `"${fieldLabel}" ` : ""}declares neither ` +
        "`purpose` nor a specific `type`, so it falls back to a generic text " +
        "keyboard with autocorrect on. Pass a `purpose` " +
        "(DESIGN_LANGUAGE.md §9.3).",
    );
  }

  return INPUT_ATTRIBUTES.text;
}
