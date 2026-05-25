"use client";

import {
  useEffect,
  useId,
  useState,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretRight } from "@phosphor-icons/react";
import type { ZodType } from "zod";

import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "./button";
import { KeyboardFooter } from "./keyboard-footer";

/**
 * `<Form>`, `<FormSection>`, `<FormFooter>` — the form shell trio.
 *
 * - `Form` wires React Hook Form + Zod into a single declarative wrapper.
 *   It provides RHF context to descendants, handles submit + error
 *   scrolling, and exposes a render-prop signature for advanced cases.
 *
 * - `FormSection` is the visual divider between groups of related fields
 *   (e.g. "Account", "Notifications"). Optional collapsible.
 *
 * - `FormFooter` is the sticky action row at the bottom of the form. On
 *   touch devices it sits above the on-screen keyboard via
 *   `<KeyboardFooter>`; on desktop it sits in flow.
 *
 * Reference: COMPONENT_INVENTORY.md §2.17–2.19.
 */

/* ============================================================ Form ============================================================ */

export type FormProps<TValues extends FieldValues> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "children" | "defaultValue" | "onError"
> & {
  /** Zod schema. Resolved through `@hookform/resolvers/zod`. */
  schema?: ZodType<TValues>;
  /** Initial values. */
  defaultValues?: DefaultValues<TValues>;
  /** Submit success handler. */
  onSubmit: SubmitHandler<TValues>;
  /** Submit-failure handler. Called when validation fails. */
  onError?: SubmitErrorHandler<TValues>;
  /** Validation strategy. Defaults to `onBlur` — gentler than `onChange`. */
  mode?: UseFormProps<TValues>["mode"];
  /** Pre-built RHF instance. Skip `schema`/`defaultValues` if provided. */
  form?: UseFormReturn<TValues>;
  /** Form body. Either ReactNode or `(form) => ReactNode` for full access. */
  children: ReactNode | ((form: UseFormReturn<TValues>) => ReactNode);
};

/**
 * Scroll the first errored field into the viewport after a failed submit.
 * RHF doesn't do this for us; we walk `errors` in document order via the
 * registered field names.
 */
function useScrollToFirstError<TValues extends FieldValues>(
  form: UseFormReturn<TValues>,
) {
  const { errors, submitCount } = useFormState({ control: form.control });

  useEffect(() => {
    if (submitCount === 0) return;
    const names = Object.keys(errors) as Array<Path<TValues>>;
    if (names.length === 0) return;
    const first = names[0];
    // Try element registered by RHF first, then any element with that name.
    const el =
      (document.getElementById(String(first)) as HTMLElement | null) ??
      document.querySelector<HTMLElement>(`[name="${String(first)}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focusing yields better UX when the field is in view.
    el.focus({ preventScroll: true });
  }, [errors, submitCount]);
}

export function Form<TValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  mode = "onBlur",
  form: providedForm,
  children,
  className,
  noValidate = true,
  ...formProps
}: FormProps<TValues>) {
  const ownForm = useForm<TValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
  });
  const form = providedForm ?? ownForm;
  useScrollToFirstError(form);

  return (
    <FormProvider {...form}>
      <form
        {...formProps}
        noValidate={noValidate}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("flex flex-col gap-6", className)}
      >
        {typeof children === "function" ? children(form) : children}
      </form>
    </FormProvider>
  );
}

/* ===================================================== FormSection ===================================================== */

export type FormSectionProps = {
  /** Visible section heading. */
  title?: ReactNode;
  /** Short paragraph under the heading. */
  description?: ReactNode;
  /** Trailing slot (e.g. an "Add" button). Sits opposite the title. */
  action?: ReactNode;
  /** Collapsible: hides children under a chevron toggle. */
  collapsible?: boolean;
  /** Initial open state for `collapsible`. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Children — typically `<Field>` instances. */
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  action,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const headingId = useId();
  const contentId = useId();
  const isOpen = collapsible ? open : true;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        "flex w-full flex-col gap-4 rounded-card",
        // Subtle inset surface so sections feel grouped without shouting.
        "border border-border bg-surface p-5",
        className,
      )}
    >
      {title || description || action ? (
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title ? (
              collapsible ? (
                <button
                  type="button"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpen((v) => !v)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-pill text-left",
                    "text-base font-semibold text-fg",
                    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full bg-fg/8 text-fg-muted",
                      "transition-[transform,background-color,color] duration-graceful ease-out",
                      "group-hover:bg-fg/12 group-hover:text-fg",
                      isOpen ? "rotate-90" : "rotate-0",
                    )}
                  >
                    <CaretRight size={14} weight="bold" />
                  </span>
                  {title}
                </button>
              ) : (
                <h3
                  id={headingId}
                  className="text-base font-semibold text-fg"
                >
                  {title}
                </h3>
              )
            ) : null}
            {description ? (
              <p className="text-sm text-fg-muted">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}

      <div
        id={contentId}
        hidden={!isOpen}
        className={cn(
          "flex flex-col gap-5",
          // Soft reveal — opacity only; sections shouldn't translate as
          // they expand (would shove the rest of the form down jankily).
          "transition-opacity duration-graceful ease-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/* ===================================================== FormFooter ===================================================== */

export type FormFooterProps = {
  children: ReactNode;
  /** Stick to the viewport bottom (and the keyboard) on mobile. Default true. */
  sticky?: boolean;
  /** Layout direction inside the footer. Default `row`. */
  layout?: "row" | "stack";
  className?: string;
};

export function FormFooter({
  children,
  sticky = true,
  layout = "row",
  className,
}: FormFooterProps) {
  const inner = (
    <div
      className={cn(
        "flex w-full gap-3",
        layout === "row"
          ? "flex-row items-center justify-end"
          : "flex-col items-stretch",
        className,
      )}
    >
      {children}
    </div>
  );

  return sticky ? <KeyboardFooter>{inner}</KeyboardFooter> : inner;
}

/* ==================================================== SubmitButton ==================================================== */

export type FormSubmitButtonProps = Omit<ButtonProps, "type" | "loading"> & {
  /** Override loading state. Defaults to `formState.isSubmitting`. */
  loading?: boolean;
};

/**
 * `<Form.SubmitButton>` — pre-wired submit button. Disables + spins
 * while `formState.isSubmitting` is true, unless `loading` is forced.
 *
 * Must be rendered **inside** a `<Form>` (subscribes to RHF context).
 */
export function FormSubmitButton({
  loading,
  children,
  intent = "primary",
  ...rest
}: FormSubmitButtonProps) {
  const { formState } = useFormContext();
  const isLoading = loading ?? formState.isSubmitting;

  return (
    <Button
      {...rest}
      type="submit"
      intent={intent}
      loading={isLoading}
    >
      {children}
    </Button>
  );
}

// Convenience attach so consumers can write `<Form.SubmitButton>` /
// `<Form.Section>` / `<Form.Footer>` without juggling imports.
Form.SubmitButton = FormSubmitButton;
Form.Section = FormSection;
Form.Footer = FormFooter;

/* ========================================== Re-exports ========================================== */

export { useFormContext };
