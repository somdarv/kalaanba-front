/**
 * Crest — club identity at a consistent scale.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §4.2 ("Primitives are headless of
 *    feature logic — they accept props, render markup, do not fetch")
 *  - docs/design-system/DESIGN_LANGUAGE.md §6 ("All images with semantic
 *    content have meaningful alt. Decorative images have alt=''")
 *
 * Distinct from `<Avatar>` on purpose. An avatar is a person and is round;
 * a crest is an institution, is not round, and must sit on a neutral plate
 * so that clubs with light marks and clubs with dark marks both read against
 * the same surface. Grassroots clubs mostly have no crest at all, so the
 * initials fallback is the common case here, not the exception.
 */

import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CrestSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * `2xl` is the crest as the SUBJECT of a screen rather than an adornment on a
 * row — the club badge step, where it is the only object on the page and every
 * other size left it floating in a column of empty space.
 *
 * It is the one size that is RESPONSIVE, because it is the one size large
 * enough for the viewport to matter: 176px on a phone, 224px from `sm` up. The
 * intrinsic number below is the LARGER of the two, so the file is never
 * upscaled on the screens that show it biggest and is merely scaled down on a
 * phone.
 *
 * These numbers drive `next/image`'s intrinsic width, which is why a call site
 * cannot just pass a bigger class: the file would render at the mapped size
 * and get upscaled by the browser.
 */
const SIZE_PX: Record<CrestSize, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
  "2xl": 224,
};

const SIZE_CLASS: Record<CrestSize, string> = {
  xs: "size-5 text-[0.5rem] rounded-[0.3rem]",
  sm: "size-7 text-[0.625rem] rounded-[0.4rem]",
  md: "size-9 text-xs rounded-[0.5rem]",
  lg: "size-12 text-sm rounded-row",
  xl: "size-18 text-lg rounded-control",
  // Corner steps up with the plate: at 144px `--radius-control` reads as a
  // barely-softened square. `--radius-card` is the next token up (§2.3) and
  // stops just short of proportional, which is the firmer edge the player card
  // settled on for the same reason (JOURNAL 2026-08-21).
  "2xl": "size-44 sm:size-56 text-4xl sm:text-5xl rounded-card",
};

/** Club initials: up to 3 characters, so "Real Tamale United" reads RTU. */
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 3).toUpperCase();
  return parts
    .slice(0, 3)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export type CrestProps = HTMLAttributes<HTMLSpanElement> & {
  /** Club name — drives initials and the accessible name. */
  name: string;
  /** Crest image URL. Most grassroots clubs will not have one. */
  src?: string | null;
  size?: CrestSize;
  /**
   * Decorative when the club name is already announced next to the crest,
   * which is the usual case in a fixture row. Avoids double announcement.
   */
  decorative?: boolean;
};

export function Crest({
  name,
  src,
  size = "md",
  decorative = false,
  className,
  ...rest
}: CrestProps) {
  const px = SIZE_PX[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        "bg-surface-elev text-fg-muted border-border border font-semibold",
        SIZE_CLASS[size],
        className,
      )}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name })}
      {...rest}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={px}
          height={px}
          className="size-full object-contain p-0.5"
        />
      ) : (
        <span aria-hidden="true" className="leading-none tracking-tight select-none">
          {deriveInitials(name)}
        </span>
      )}
    </span>
  );
}
