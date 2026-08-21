import Link from "next/link";

import { Wordmark } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The brand in the nav: the real Kalaanba lock, in brand pink, linking home.
 *
 * This is the supplied artwork rather than a rebuild of it. The asset is one
 * lock — the mark and the "Kalaanba" letterforms together — shipped as a single
 * alpha master that `<Wordmark>` paints through a CSS mask, so it takes its
 * colour from `currentColor` (DESIGN_LANGUAGE §2: code never references a
 * colour literally). `text-primary` is therefore the whole of "make it pink",
 * and a brand rehue carries it with no new asset.
 *
 * An earlier pass set this as type, a pink KB tile beside a two-tone KALAANBA,
 * because the mask cannot render two colours from one channel. That was a
 * reconstruction of the brand rather than the brand. The real lock wins; it
 * has a mark the type version never had.
 *
 * Sized by height only. `.kx-wordmark` carries the art's 1748:316 ratio, so the
 * width follows and the lock can never stretch.
 */

export type BrandLockProps = {
  className?: string;
};

export function BrandLock({ className }: BrandLockProps) {
  return (
    <Link
      href="/"
      aria-label="Kalaanba, home"
      className={cn(
        "kx-chrome rounded-control inline-flex shrink-0 items-center",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        className,
      )}
    >
      {/* label="" so the mark drops to aria-hidden: the link already carries
          the accessible name, and a screen reader should hear it once. */}
      <Wordmark label="" className="h-6 text-primary sm:h-7" />
    </Link>
  );
}
