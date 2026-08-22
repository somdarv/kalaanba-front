"use client";

import { cn } from "@/lib/cn";

/**
 * The player's own name, signed across a card that has no record yet.
 *
 * **Why a signature and not a slogan.** The slot needed something with warmth,
 * and every tagline that fit was either hype ("ready to take on the world"),
 * false for a free agent ("newly signed on"), or a caption apologising for the
 * empty space. A signature is none of those: it is the player's own name, so it
 * is true by construction, it says nothing the card has to defend, and a signed
 * card is the oldest convention in football memorabilia. The printed name and
 * the autograph sitting together is what a signed card IS.
 *
 * **The stage name, not the legal one.** A footballer signs the name on the
 * back of the shirt. It is also the shorter of the two, which matters at an
 * angle in a fixed width.
 *
 * **Decorative to a screen reader.** The name is already on the card twice, as
 * the heading and as the legal name. A third announcement is noise, so this is
 * `aria-hidden` — it carries tone, not information (§6: colour and styling are
 * never the only signal, and here they are not a signal at all).
 *
 * **Rotation is a `transform`.** DESIGN_LANGUAGE §3.4 keeps layout properties
 * out of anything that moves, and a rotated element that still occupies its
 * unrotated box is exactly what keeps the surrounding rhythm predictable.
 */

export type PlayerCardSignatureProps = {
  name: string;
  /** Degrees. Negative tilts up to the right, the way a hand signs. */
  angle?: number;
  className?: string;
};

export function PlayerCardSignature({
  name,
  angle = -7,
  className,
}: PlayerCardSignatureProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-signature text-on-card/60 pointer-events-none block max-w-full",
        "truncate text-center text-4xl leading-tight select-none sm:text-5xl",
        className,
      )}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {name}
    </span>
  );
}
