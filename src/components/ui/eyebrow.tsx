/**
 * Eyebrow — the small uppercase tracked label above a heading.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §4.1 ("`<Eyebrow>` — the 12px
 *    uppercase tracked label") — specified in May, never built until now.
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.6 ("12 uppercase `0.14em`
 *    for eyebrows")
 *
 * Presentational only. It carries no semantics of its own, so it renders a
 * `<span>` by default; pass `as="h2"` where the eyebrow genuinely is the
 * section heading and a real heading level is owed to screen readers.
 */

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EyebrowTone = "muted" | "subtle" | "primary" | "live";

const TONES: Record<EyebrowTone, string> = {
  muted: "text-fg-muted",
  subtle: "text-fg-subtle",
  primary: "text-primary-ink",
  live: "text-live-ink",
};

export type EyebrowProps = HTMLAttributes<HTMLElement> & {
  tone?: EyebrowTone;
  /** Render as a different element when the eyebrow is a real heading. */
  as?: ElementType;
  children: ReactNode;
};

export function Eyebrow({
  tone = "subtle",
  as: Tag = "span",
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "text-[0.75rem] leading-none font-semibold tracking-[0.14em] uppercase",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
