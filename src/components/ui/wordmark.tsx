import { cn } from "@/lib/cn";

/**
 * `<Wordmark>` — the Kalaanba logo.
 *
 * The artwork ships as a single alpha master (`/images/brand/kalaanba-wordmark.png`)
 * that `.kx-wordmark` paints through a CSS mask, so the mark takes its colour
 * from `currentColor` rather than from the file. Per DESIGN_LANGUAGE §2 no
 * component may name a colour literally, and per §5 the default theme is dark
 * with a light opt-in — a mark with its colour baked in would be wrong on one
 * of them. Set the colour the way you set any other ink:
 *
 *   <Wordmark />                              -- inherits (theme ink)
 *   <Wordmark className="text-primary" />     -- brand pink
 *   <Wordmark className="text-on-primary" />  -- white, over art or a fill
 *
 * `inline-block` is load-bearing: it makes `width: auto` shrink-to-fit, which
 * is what lets `aspect-ratio` derive the width from the height. As a block box
 * the mark would stretch to the container instead.
 *
 * Presentational only (§4.2) — it renders, it does not fetch or navigate. Wrap
 * it in `next/link` at the call site if the mark should go home.
 */
export type WordmarkSize = "sm" | "md" | "lg";

/** Heights only — `.kx-wordmark` derives each width from the art's ratio. */
const SIZES: Record<WordmarkSize, string> = {
  sm: "h-5",
  md: "h-7",
  lg: "h-10",
};

export type WordmarkProps = {
  size?: WordmarkSize;
  /**
   * Accessible name (§6 — the mark carries content, so it needs one). Pass an
   * empty string where adjacent text already names the brand, and the mark
   * drops to `aria-hidden` instead of repeating it to a screen reader.
   */
  label?: string;
  className?: string;
};

export function Wordmark({
  size = "md",
  label = "Kalaanba",
  className,
}: WordmarkProps) {
  return (
    <span
      {...(label
        ? { role: "img" as const, "aria-label": label }
        : { "aria-hidden": true })}
      className={cn("kx-wordmark inline-block w-auto", SIZES[size], className)}
    />
  );
}
