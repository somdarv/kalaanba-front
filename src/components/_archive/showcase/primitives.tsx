"use client";

import Image from "next/image";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* =====================================================================
   KX PRIMITIVES — Isolated UI Kit (scoped under .kx-root)
   Tokens consumed via CSS variables (var(--kx-*)).
   Animations: subtle, fast, ease-out. Icons sit quiet on buttons,
   nudge on hover. Roundedness is generous and consistent.
   ===================================================================== */

/* --------------------------- Button --------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "blue";
type ButtonSize = "sm" | "md" | "lg";

type KxButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  full?: boolean;
};

const btnSize: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[12px] gap-1.5",
  md: "h-9 px-4 text-[13px] gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

const btnVariant: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)] hover:brightness-95 active:brightness-90",
  blue:
    "bg-[var(--kx-blue)] text-[var(--kx-on-blue)] shadow-[var(--kx-shadow-md)] hover:brightness-95 active:brightness-90",
  secondary:
    "bg-[var(--kx-card)] text-[var(--kx-fg)] border border-[var(--kx-border-strong)] hover:bg-[var(--kx-card-2)] hover:border-[var(--kx-fg-muted)]",
  ghost:
    "bg-transparent text-[var(--kx-fg-muted)] hover:bg-[color-mix(in_oklab,var(--kx-fg)_8%,transparent)] hover:text-[var(--kx-fg)]",
};

export const KxButton = forwardRef<HTMLButtonElement, KxButtonProps>(function KxButton(
  {
    className,
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    loading,
    full,
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight outline-none cursor-pointer",
        "transition-[background-color,box-shadow,filter,border-color,color] duration-200 ease-[var(--kx-ease)]",
        "focus-visible:shadow-[0_0_0_3px_var(--kx-ring)]",
        "disabled:pointer-events-none disabled:opacity-60",
        btnSize[size],
        btnVariant[variant],
        full && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: "kx-spin 0.7s linear infinite" }}
        />
      ) : leadingIcon ? (
        <span className="inline-flex">{leadingIcon}</span>
      ) : null}
      <span>{children}</span>
      {trailingIcon ? (
        <span className="inline-flex">{trailingIcon}</span>
      ) : null}
    </button>
  );
});

/* --------------------------- IconButton --------------------------- */

type IconButtonVariant = "primary" | "soft" | "ghost" | "blue";
type IconButtonSize = "sm" | "md" | "lg";

type KxIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  pill?: boolean;
};

const iconBtnSize: Record<IconButtonSize, string> = {
  sm: "h-8 w-8 [&_svg]:h-[14px] [&_svg]:w-[14px]",
  md: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-11 w-11 [&_svg]:h-[18px] [&_svg]:w-[18px]",
};

const iconBtnVariant: Record<IconButtonVariant, string> = {
  primary:
    "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)] hover:brightness-95 active:brightness-90",
  blue:
    "bg-[var(--kx-blue)] text-[var(--kx-on-blue)] hover:brightness-95 active:brightness-90",
  soft:
    "bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[color-mix(in_oklab,var(--kx-fg)_10%,var(--kx-card-2))]",
  ghost:
    "bg-transparent text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] hover:bg-[color-mix(in_oklab,var(--kx-fg)_8%,transparent)]",
};

export const KxIconButton = forwardRef<HTMLButtonElement, KxIconButtonProps>(function KxIconButton(
  { className, variant = "soft", size = "md", pill = true, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-grid place-items-center outline-none cursor-pointer",
        "transition-[background-color,box-shadow,color,filter] duration-200 ease-[var(--kx-ease)]",
        "focus-visible:shadow-[0_0_0_3px_var(--kx-ring)]",
        "disabled:pointer-events-none disabled:opacity-60",
        pill ? "rounded-full" : "rounded-full",
        iconBtnSize[size],
        iconBtnVariant[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

/* --------------------------- Card --------------------------- */

type CardTone = "surface" | "subtle" | "outline";

type KxCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  interactive?: boolean;
  padded?: boolean | "sm" | "md" | "lg";
};

const cardTone: Record<CardTone, string> = {
  surface: "bg-[var(--kx-card)] shadow-[var(--kx-shadow-md)]",
  subtle: "bg-[var(--kx-card-2)]",
  outline: "bg-transparent border border-[var(--kx-border-strong)]",
};

export function KxCard({
  className,
  tone = "surface",
  interactive = false,
  padded = true,
  ...props
}: KxCardProps) {
  const padClass =
    padded === false
      ? ""
      : padded === "sm"
        ? "p-4 sm:p-5"
        : padded === "lg"
          ? "p-7 sm:p-8"
          : "p-5 sm:p-6";

  return (
    <div
      className={cn(
        "rounded-[var(--kx-r-card)] text-[var(--kx-fg)]",
        "transition-[transform,box-shadow,background-color] duration-300 ease-[var(--kx-ease-out)]",
        interactive && "hover:-translate-y-0.5 hover:shadow-[var(--kx-shadow-lg)] cursor-pointer",
        cardTone[tone],
        padClass,
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------- Avatar --------------------------- */

type AvatarSize = "sm" | "md" | "lg" | "xl";

const avatarSize: Record<AvatarSize, { box: string; text: string; dot: string }> = {
  sm: { box: "h-9 w-9",   text: "text-[11px]", dot: "h-2 w-2  -bottom-0 -right-0" },
  md: { box: "h-11 w-11", text: "text-xs",    dot: "h-2.5 w-2.5 bottom-0 right-0" },
  lg: { box: "h-14 w-14", text: "text-sm",    dot: "h-3 w-3 bottom-0.5 right-0.5" },
  xl: { box: "h-20 w-20", text: "text-base",  dot: "h-3.5 w-3.5 bottom-1 right-1" },
};

export function KxAvatar({
  name,
  src,
  size = "md",
  status,
  ring = false,
  className,
}: {
  name: string;
  src?: string;
  size?: AvatarSize;
  status?: "online" | "verified" | "idle" | "live";
  ring?: boolean;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const dotColor =
    status === "online" || status === "live"
      ? "bg-[var(--kx-pink)]"
      : status === "verified"
        ? "bg-[var(--kx-blue)]"
        : "bg-[var(--kx-fg-muted)]";

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-visible rounded-full font-semibold",
        "transition-transform duration-200 ease-[var(--kx-ease)]",
        ring && "ring-2 ring-[var(--kx-pink)] ring-offset-2 ring-offset-[var(--kx-bg)]",
        avatarSize[size].box,
        avatarSize[size].text,
        className,
      )}
    >
      <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg)]">
        {src ? (
          <Image src={src} alt={name} fill sizes="80px" className="object-cover" unoptimized />
        ) : (
          initials
        )}
      </span>
      {status ? (
        <span
          aria-hidden
          className={cn(
            "absolute rounded-full ring-2 ring-[var(--kx-bg)]",
            dotColor,
            avatarSize[size].dot,
          )}
        />
      ) : null}
    </span>
  );
}

/* --------------------------- Badge --------------------------- */

type BadgeTone = "primary" | "blue" | "neutral" | "live";

const badgeTone: Record<BadgeTone, string> = {
  primary: "text-[var(--kx-pink)] bg-[color-mix(in_srgb,var(--kx-pink)_14%,transparent)]",
  blue:    "text-[var(--kx-blue)] bg-[color-mix(in_srgb,var(--kx-blue)_14%,transparent)]",
  neutral: "text-[var(--kx-fg-muted)] bg-[var(--kx-card-2)]",
  live:    "text-[var(--kx-pink)] bg-[color-mix(in_srgb,var(--kx-pink)_14%,transparent)]",
};

export function KxBadge({
  className,
  tone = "neutral",
  withDot,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; withDot?: boolean }) {
  const showDot = withDot ?? tone === "live";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        badgeTone[tone],
        className,
      )}
      {...props}
    >
      {showDot ? (
        <span className="relative grid h-2 w-2 place-items-center" aria-hidden>
          <span
            className="absolute inline-flex h-2 w-2 rounded-full bg-current"
            style={{ animation: "kx-pulse-ring 1.6s ease-out infinite" }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}

/* --------------------------- TextField / SearchField --------------------------- */

/* --------------------------- Switch --------------------------- */

export function KxSwitch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("inline-flex items-center gap-3 select-none", disabled && "opacity-60")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-[background-color] duration-300 ease-[var(--kx-ease)] outline-none",
          "focus-visible:shadow-[0_0_0_3px_var(--kx-ring)]",
          checked
            ? "bg-[var(--kx-pink)]"
            : "bg-[color-mix(in_oklab,var(--kx-fg-muted)_35%,transparent)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[var(--kx-card)] shadow-[var(--kx-shadow-sm)]",
            "ring-1 ring-[var(--kx-border-strong)]",
            "transition-transform duration-300 ease-[var(--kx-ease-out)]",
            checked && "translate-x-4",
          )}
        />
      </button>
      {label ? <span className="text-sm text-[var(--kx-fg)]">{label}</span> : null}
    </label>
  );
}

/* --------------------------- Tabs --------------------------- */

export function KxTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--kx-card-2)] p-1.5",
        className,
      )}
      role="tablist"
    >
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "relative inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium",
              "transition-[color,background-color,box-shadow] duration-200 ease-[var(--kx-ease)]",
              active
                ? "bg-[var(--kx-card)] text-[var(--kx-fg)] shadow-[var(--kx-shadow-sm)]"
                : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
            )}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Progress --------------------------- */

export function KxProgress({
  value,
  max = 100,
  className,
  indeterminate,
}: {
  value?: number;
  max?: number;
  className?: string;
  indeterminate?: boolean;
}) {
  const pct = indeterminate ? 100 : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[var(--kx-card-2)]", className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[var(--kx-pink)] transition-[width] duration-700 ease-[var(--kx-ease-out)]"
        style={{ width: `${pct}%` }}
      />
      {indeterminate ? (
        <div
          aria-hidden
          className="absolute inset-y-0 w-1/3 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--kx-on-pink) 70%, transparent), transparent)",
            animation: "kx-progress 1.4s ease-in-out infinite",
          }}
        />
      ) : null}
    </div>
  );
}

/* --------------------------- Tooltip --------------------------- */

export function KxTooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-medium",
          "bg-[var(--kx-card)] text-[var(--kx-fg)] border border-[var(--kx-border-strong)] shadow-[var(--kx-shadow-md)]",
          "opacity-0 translate-y-1 transition-all duration-200 ease-[var(--kx-ease-out)]",
          "group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0",
          side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* --------------------------- Toast --------------------------- */

export function KxToast({
  title,
  description,
  tone = "primary",
  icon,
}: {
  title: string;
  description?: string;
  tone?: "primary" | "blue" | "neutral";
  icon?: ReactNode;
}) {
  const accent =
    tone === "primary"
      ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)]"
      : tone === "blue"
        ? "bg-[var(--kx-blue)] text-[var(--kx-on-blue)]"
        : "bg-[var(--kx-card-2)] text-[var(--kx-fg)]";
  return (
    <div
      role="status"
      className="flex w-full max-w-sm items-start gap-3 rounded-[var(--kx-r-card)] bg-[var(--kx-card)] p-4 shadow-[var(--kx-shadow-lg)] border border-[var(--kx-border)]"
      style={{ animation: "kx-toast-in 0.32s var(--kx-ease-out) both" }}
    >
      <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", accent)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[var(--kx-fg)]">{title}</div>
        {description ? (
          <div className="mt-0.5 text-[13px] text-[var(--kx-fg-muted)]">{description}</div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------- Skeleton --------------------------- */

export function KxSkeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block rounded-[var(--kx-r-tile)] overflow-hidden", className)}
      style={{
        background:
          "linear-gradient(90deg, var(--kx-card-2) 0%, color-mix(in srgb, var(--kx-fg) 8%, var(--kx-card-2)) 50%, var(--kx-card-2) 100%)",
        backgroundSize: "200% 100%",
        animation: "kx-shimmer 1.6s linear infinite",
      }}
    />
  );
}

/* --------------------------- NotificationBell --------------------------- */

export function KxNotificationBell({
  hasUnread = true,
  onClick,
}: {
  hasUnread?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className={cn(
        "relative inline-grid h-11 w-11 place-items-center rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)]",
        "transition-[transform,background-color,color] duration-200 ease-[var(--kx-ease)]",
        "hover:bg-[var(--kx-card)] hover:text-[var(--kx-fg)] hover:scale-[1.04] active:scale-[0.94]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--kx-ring)]",
      )}
    >
      <BellIcon />
      {hasUnread ? (
        <span className="absolute top-2 right-2 grid place-items-center" aria-hidden>
          <span
            className="absolute h-2.5 w-2.5 rounded-full bg-[var(--kx-pink)] opacity-70"
            style={{ animation: "kx-pulse-ring 1.8s ease-out infinite" }}
          />
          <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--kx-pink)] ring-2 ring-[var(--kx-bg)]" />
        </span>
      ) : null}
    </button>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10.5 21a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}
