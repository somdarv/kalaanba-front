"use client";

/**
 * Avatar — user / club identity thumbnail.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §4.1 ("Avatar — sizes + initials
 *    fallback")
 *  - docs/design-system/REBUILD_PLAN.md §2.5 ("Avatar sizes `sm | md | lg | xl`
 *    + initials fallback + ring on hover (desktop only)")
 *  - docs/design-system/DESIGN_LANGUAGE.md §3.5 (interaction recipe:
 *    hover desktop-only, focus-visible ring, no positional motion)
 *
 * Rendering priority:
 *  1. `src` image (next/image, object-cover)
 *  2. `initials` text (derived from `name` or explicit `initials` prop)
 *  3. Neutral placeholder icon
 *
 * The `interactive` prop wraps the avatar in a `<button>` for cases where
 * clicking should trigger an action (e.g. open profile), keeping the hit
 * target ≥ 44 px on all sizes.
 */

import Image from "next/image";
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

/** Pixel sizes map — 1:1 with the tailwind classes below so `next/image` gets exact px. */
const SIZE_PX: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

/** Derive 1–2 character initials from a display name. */
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

function PlaceholderIcon({ size }: { size: AvatarSize }) {
  const px = SIZE_PX[size];
  const stroke = px <= 32 ? 1.5 : 1.75;
  return (
    <svg
      width={Math.round(px * 0.5)}
      height={Math.round(px * 0.5)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

type BaseAvatarProps = {
  /** Source URL for the avatar image. Falls back to initials → icon. */
  src?: string | null;
  /** Alt text for the image. Falls back to `name` when omitted. */
  alt?: string;
  /** Full display name — used to derive initials and as default alt text. */
  name?: string;
  /**
   * Explicit initials override. When omitted, initials are derived from
   * `name` (first + last capital letter).
   */
  initials?: string;
  size?: AvatarSize;
  /** Add a 2-px ring that visually separates the avatar from the background. */
  ring?: boolean;
  className?: string;
};

type NonInteractiveProps = BaseAvatarProps &
  HTMLAttributes<HTMLSpanElement> & {
    /** When false (default) renders a `<span>`. */
    interactive?: false;
  };

type InteractiveProps = BaseAvatarProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** When true renders a `<button>` with 44 px hit-floor and hover + focus styling. */
    interactive: true;
    /** Accessible label for the button. Required when `interactive` is true. */
    "aria-label": string;
  };

export type AvatarProps = NonInteractiveProps | InteractiveProps;

function AvatarInner({
  src,
  alt,
  name,
  initials,
  size = "md",
}: {
  src?: string | null;
  alt?: string;
  name?: string;
  initials?: string;
  size: AvatarSize;
}) {
  const px = SIZE_PX[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? name ?? "avatar"}
        width={px}
        height={px}
        className="size-full object-cover"
        aria-hidden={!alt && !name ? true : undefined}
      />
    );
  }

  const text = initials ?? (name ? deriveInitials(name) : "");
  if (text) {
    return (
      <span aria-hidden="true" className="font-semibold leading-none select-none">
        {text}
      </span>
    );
  }

  return <PlaceholderIcon size={size} />;
}

const sharedClasses = (size: AvatarSize, ring: boolean) =>
  cn(
    "relative inline-flex items-center justify-center shrink-0 overflow-hidden",
    "rounded-pill",
    "bg-surface-elev text-fg-muted",
    ring && "ring-2 ring-border ring-offset-2 ring-offset-bg",
    SIZE_CLASS[size],
  );

export const Avatar = forwardRef<HTMLSpanElement | HTMLButtonElement, AvatarProps>(
  function Avatar(props, ref) {
    const { src, alt, name, initials, size = "md", ring = false, className } = props;

    const innerEl = (
      <AvatarInner src={src} alt={alt} name={name} initials={initials} size={size} />
    );

    if (props.interactive === true) {
      const {
        // strip base props
        src: _src, alt: _alt, name: _name, initials: _initials,
        size: _size, ring: _ring, interactive: _ia,
        className: _cls,
        ...buttonRest
      } = props;

      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={cn(
            sharedClasses(size, ring),
            // 44 px min hit target on all sizes (§3.7 — DESIGN_LANGUAGE)
            "min-h-11 min-w-11",
            // Hover ring step — desktop only via plain hover: (consistent with
            // Button/Card; no @media guard needed in the CSS for this use case)
            "hover:ring-2 hover:ring-primary",
            "transition-[box-shadow] duration-[var(--dur-quick)] ease-[var(--ease-out)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            className,
          )}
          {...buttonRest}
        >
          {innerEl}
        </button>
      );
    }

    const { interactive: _ia, ...spanRest } = props as NonInteractiveProps;

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cn(sharedClasses(size, ring), className)}
        {...(spanRest as HTMLAttributes<HTMLSpanElement>)}
      >
        {innerEl}
      </span>
    );
  },
);
