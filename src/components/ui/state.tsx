"use client";

/**
 * `EmptyState` / `ErrorState` — Tier 3.3 / 3.4 fallback companions.
 *
 * Design intent (COMPONENT_INVENTORY 3.3/3.4, DESIGN_LANGUAGE §3.4
 * elevation flat surfaces, §3.5 interaction recipe):
 *   - Both are centred, vertically-stacked panels meant to drop into the
 *     same slot a List / Table / dashboard widget would occupy. They are
 *     never silent — every empty list and every fetch-fail path gets one.
 *   - Visual rhythm: soft circular icon pill → title → muted description
 *     → action(s). Same icon-pill treatment we use on collapsible
 *     FormSection chevrons + NotificationBell, so the language is
 *     consistent across "secondary surface" affordances.
 *   - `ErrorState` defaults to a retry button when `onRetry` is provided;
 *     `EmptyState` defers entirely to the caller's `action` slot so it
 *     can read "Add your first match" / "Invite a teammate" / etc.
 *
 * Shared `StateShell` keeps the centred layout + size variants in one
 * place so the two surfaces stay visually identical when they replace
 * each other (e.g. loading → empty → error transitions).
 */

import { useState, type ReactNode } from "react";
import { CaretDown, WarningCircle, Tray } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

/* ========================================== shared ========================================== */

export type StateSize = "sm" | "md" | "lg";

type StateShellProps = {
  size: StateSize;
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  children?: ReactNode;
  tone?: "neutral" | "danger";
  className?: string;
};

function StateShell({
  size,
  icon,
  title,
  description,
  primary,
  secondary,
  children,
  tone = "neutral",
  className,
}: StateShellProps) {
  const paddingY =
    size === "sm" ? "py-8" : size === "lg" ? "py-16" : "py-12";
  const iconSize =
    size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-14 w-14";
  const titleSize =
    size === "sm"
      ? "text-base"
      : size === "lg"
        ? "text-2xl"
        : "text-lg";
  const descriptionSize = size === "sm" ? "text-xs" : "text-sm";
  const iconBg =
    tone === "danger" ? "bg-danger/10 text-danger-ink" : "bg-fg/8 text-fg-muted";

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        paddingY,
        "px-6",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mb-4 inline-flex items-center justify-center rounded-pill",
          iconSize,
          iconBg,
        )}
      >
        {icon}
      </span>
      <h3
        className={cn(
          "font-display font-semibold tracking-tight text-fg",
          titleSize,
        )}
      >
        {title}
      </h3>
      {description ? (
        <p
          className={cn(
            "mt-1.5 max-w-md text-fg-muted",
            descriptionSize,
          )}
        >
          {description}
        </p>
      ) : null}
      {primary || secondary ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {primary}
          {secondary}
        </div>
      ) : null}
      {children ? <div className="mt-5 w-full max-w-md">{children}</div> : null}
    </div>
  );
}

/* ========================================== EmptyState ========================================== */

export type EmptyStateProps = {
  /** Phosphor icon (or any ReactNode). Defaults to `Tray`. */
  icon?: ReactNode;
  /** Primary headline — keep it short and human ("No matches yet"). */
  title: ReactNode;
  /** One-line description of what this surface would normally contain. */
  description?: ReactNode;
  /** Primary call-to-action. Usually a `<Button>`. */
  action?: ReactNode;
  /** Optional secondary action ("Learn more", etc.). */
  secondaryAction?: ReactNode;
  /** Layout scale — defaults to `md`. */
  size?: StateSize;
  className?: string;
};

/**
 * Illustrated placeholder for an empty list / dashboard widget / search
 * result. Composes `StateShell` with the neutral tone.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <StateShell
      size={size}
      tone="neutral"
      icon={icon ?? <Tray size={size === "sm" ? 20 : size === "lg" ? 32 : 26} weight="duotone" />}
      title={title}
      description={description}
      primary={action}
      secondary={secondaryAction}
      className={className}
    />
  );
}

/* ========================================== ErrorState ========================================== */

export type ErrorStateProps = {
  /** Phosphor icon. Defaults to `WarningCircle`. */
  icon?: ReactNode;
  /** Headline. Defaults to "Something went wrong". */
  title?: ReactNode;
  /** Human-friendly description of what failed. */
  description?: ReactNode;
  /**
   * When provided, renders a primary "Try again" button that calls this
   * handler. Pass `retryLabel` to customise the button text.
   */
  onRetry?: () => void | Promise<void>;
  /** Override the retry button label. */
  retryLabel?: ReactNode;
  /** Optional secondary action (e.g. "Contact support"). */
  secondaryAction?: ReactNode;
  /**
   * Optional technical details (error message, stack trace) tucked
   * behind a disclosure. Hidden by default — only useful for ops.
   */
  details?: ReactNode;
  /** Layout scale — defaults to `md`. */
  size?: StateSize;
  className?: string;
};

/**
 * Recoverable error surface — always offers a retry path when a handler
 * is provided. Composes `StateShell` with the danger tone (soft red icon
 * pill, never an alarming full-bleed red background).
 */
export function ErrorState({
  icon,
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  secondaryAction,
  details,
  size = "md",
  className,
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = onRetry
    ? async () => {
        setRetrying(true);
        try {
          await onRetry();
        } finally {
          setRetrying(false);
        }
      }
    : undefined;

  const primary = handleRetry ? (
    <Button intent="primary" size="md" loading={retrying} onClick={handleRetry}>
      {retryLabel}
    </Button>
  ) : null;

  return (
    <StateShell
      size={size}
      tone="danger"
      icon={icon ?? <WarningCircle size={size === "sm" ? 20 : size === "lg" ? 32 : 26} weight="duotone" />}
      title={title}
      description={description}
      primary={primary}
      secondary={secondaryAction}
      className={className}
    >
      {details ? <ErrorDetails>{details}</ErrorDetails> : null}
    </StateShell>
  );
}

/* ========================================== ErrorDetails ========================================== */

function ErrorDetails({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-card border border-border bg-surface text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-2.5",
          "text-xs font-medium text-fg-muted",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        )}
      >
        <span>Technical details</span>
        <CaretDown
          size={14}
          weight="bold"
          className={cn(
            "transition-transform duration-quick ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
      {open ? (
        <pre className="max-h-48 overflow-auto border-t border-divider px-4 py-3 text-[11px] leading-relaxed text-fg-muted whitespace-pre-wrap">
          {children}
        </pre>
      ) : null}
    </div>
  );
}
