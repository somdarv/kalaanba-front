import Link from "next/link";

import { Wordmark } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The brand lock in the nav: the KB monogram beside the wordmark, linking home.
 *
 * The monogram is built from type rather than loaded, because the brand folder
 * holds exactly one asset (`kalaanba-wordmark.png`) and there is no square mark
 * in it. Type on a `--primary` fill is the closest honest thing, and it costs
 * no request. Flagged for the brand: a real monogram should replace this.
 *
 * The wordmark stays single-colour. The supplied artwork is one alpha master
 * painted through a CSS mask so it can take `currentColor` (see `<Wordmark>`),
 * and a mask cannot render "KALA" dark and "ANBA" pink from one channel. The
 * two-tone lock in the reference needs either a second asset or an inline SVG
 * with the letterforms as paths. Neither exists yet.
 *
 * On a phone the wordmark drops and the monogram carries the brand alone; a
 * 360px bar has to spend its width on the controls, not the logo.
 */

export type BrandLockProps = {
  /** Hide the wordmark below `sm`. On by default. */
  compactOnMobile?: boolean;
  className?: string;
};

export function BrandLock({
  compactOnMobile = true,
  className,
}: BrandLockProps) {
  return (
    <Link
      href="/"
      aria-label="Kalaanba, home"
      className={cn(
        "kx-chrome inline-flex items-center gap-2.5 rounded-control",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[0.75rem]",
          "bg-primary text-on-primary",
          "font-display text-sm font-bold tracking-tight",
        )}
      >
        KB
      </span>
      <Wordmark
        size="sm"
        label=""
        className={cn("text-fg", compactOnMobile && "hidden sm:inline-block")}
      />
    </Link>
  );
}
