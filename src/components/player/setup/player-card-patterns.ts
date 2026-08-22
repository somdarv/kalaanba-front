/**
 * The surface texture on a player card: a repeating pattern, plus grain.
 *
 * The gradient gives the card its colour. On its own, at the size this card is
 * now, it reads as a swatch — a large flat field of one hue is the thing that
 * makes a design look printed rather than made. Pattern and grain are what give
 * it a material.
 *
 * **Patterns are shapes, not colours.** Every mask here is white-on-transparent
 * and the colour comes from `currentColor` on the layer, the same move
 * `<Wordmark>` makes ("`.kx-wordmark` paints through a CSS mask, so the mark
 * takes its colour from `currentColor`"). It is what lets one pattern sit on
 * all three card grounds without naming a colour, and a `var()` inside a data
 * URI does not resolve, so a baked fill would have been a literal.
 *
 * **Two ways to lay one down.** `repeat` tiles a small seamless motif;
 * `no-repeat` with `size: "cover"` stretches one large artwork over the whole
 * card. The second exists because allover artwork does not need to tile: it
 * only needs to be bigger than the card, and asking a drawing to also be
 * seamless on both axes is a constraint that buys nothing here.
 *
 * ## Adding a supplied pattern
 *
 * White artwork on a transparent background, PNG. Add an entry below, then
 * point a gradient at it in `player-card-variants.ts` — patterns are paired to
 * gradients by hand, not hashed.
 *
 * - **Allover artwork** (the usual case): portrait, at least 800px on the short
 *   edge, `size: "cover"`, `repeat: "no-repeat"`. 4:5 matches the card, so
 *   nothing is cropped. Seamlessness does not matter.
 * - **A true tile**: square, seamless on BOTH axes, 512 or 1024, `size` set to
 *   the tile size in px and `repeat: "repeat"`. Check the seam on both axes
 *   before trusting it.
 *
 * **Opacity is capped, and the cap is load-bearing.** White at `soft-light`
 * lightens the ground it crosses, which eats the card's contrast headroom. The
 * `--card-*` grounds are set to the brightest values that still clear 4.5:1
 * against white THROUGH a full-strength pattern at `MAX_PATTERN_OPACITY`, so
 * raising a pattern's opacity above that cap silently pushes the card below AA.
 * `design-tokens.test.ts` measures the composite and will fail if either side
 * of that bargain moves. This was learned the hard way: the first artwork
 * shipped at 0.16 and took the card to 4.19:1.
 *
 * Keep the file under ~100KB. These players pay for their data, and a card
 * background is decoration (DESIGN_LANGUAGE §9.6). A white-on-transparent mask
 * palettises extremely well: the shipped artwork went 1.7MB to 89KB as an
 * 8-level indexed PNG with no visible loss, because a mask only ever needs one
 * channel and this one is mostly flat.
 */

/**
 * The most any pattern may print. See the note above: the card grounds are
 * derived from this number, so the two move together or not at all.
 */
export const MAX_PATTERN_OPACITY = 0.12;

export type PlayerCardPatternKey =
  | "folk"
  | "shards"
  | "zigzag"
  | "mesh"
  | "weave"
  | "halftone";

export type PlayerCardPattern = {
  /** Stable internal key. Never rendered. */
  key: PlayerCardPatternKey;
  /** Human name, for the design preview only. */
  name: string;
  /** Mask image. Shape only — the layer supplies the colour. */
  mask: string;
  /** `mask-size`: a tile size in px, or `cover` for one large artwork. */
  size: string;
  repeat: "repeat" | "no-repeat";
  /**
   * How strongly it prints, 0 to 1.
   *
   * Tuned per pattern rather than shared, because coverage differs: the
   * halftone puts far less ink on the card than the mesh does, so an opacity
   * that reads as texture on one reads as dirt on the other.
   */
  opacity: number;
  /**
   * Blend mode for the layer.
   *
   * In practice this is always `soft-light`, and that is a contrast result
   * rather than a taste one. `normal` lerps the ground straight toward white,
   * which costs more contrast per unit of visible texture than `soft-light`
   * does: the geometry below failed AA at 0.07 on `normal` and passes
   * comfortably at the same opacity on `soft-light`. To use `normal` at all,
   * a white pattern has to drop to about 0.045, which is too faint to see.
   *
   * The union keeps `normal` because a DARK pattern would want it and would
   * raise contrast rather than spend it. Nothing draws one yet.
   */
  blend: "normal" | "soft-light";
};

/** Minimal-safe encoding for an SVG going into a CSS `url()`. */
function svgUrl(svg: string): string {
  const encoded = svg
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/#/g, "%23");
  return `url("data:image/svg+xml,${encoded}")`;
}

const SVG = "http://www.w3.org/2000/svg";

/**
 * The supplied artwork: football folk-art, allover.
 *
 * Balls, nets, florals, birds and towers at roughly a third coverage. Dense
 * enough that it needs `soft-light` and a low opacity to stay a texture rather
 * than becoming the subject — the player's name is the subject.
 *
 * Laid down as one `cover` image rather than tiled. The source is seamless
 * left to right but not top to bottom (measured: 1.3 of 255 on the horizontal
 * seam, 51.6 on the vertical), so tiling it would have printed a visible line
 * across every card.
 */
export const FOLK: PlayerCardPattern = {
  key: "folk",
  name: "Folk",
  mask: 'url("/images/patterns/football-folk.png")',
  size: "cover",
  repeat: "no-repeat",
  opacity: MAX_PATTERN_OPACITY,
  blend: "soft-light",
};

/**
 * The second artwork: angular shards, bold and diagonal.
 *
 * Denser than the folk drawing (45% coverage against 35%) and built from large
 * solid shapes rather than line work, so it reads as banding across the card
 * rather than as grain. That is why it sits on the cap rather than above it.
 *
 * Seamless on neither axis (measured 124 and 114 of 255), so `cover` again.
 * Its source is roughly 9:16 against the card's 4:5, so `cover` crops about a
 * third off the height. Nothing is lost: the drawing has no subject.
 */
export const SHARDS: PlayerCardPattern = {
  key: "shards",
  name: "Shards",
  mask: 'url("/images/patterns/football-shards.png")',
  size: "cover",
  repeat: "no-repeat",
  opacity: MAX_PATTERN_OPACITY,
  blend: "soft-light",
};

/**
 * The third artwork: hatched zigzag.
 *
 * Bold chevrons with fine diagonal hatching inside them. The hatch is the only
 * thing here that needed care: fine regular lines are what moire, so this one
 * keeps 12 alpha levels rather than the 8 the other two use, and the downscale
 * runs a box filter so the lines are prefiltered rather than point-sampled.
 * That costs about 25KB and it is worth it — banded hatching reads as a
 * compression artefact, which is the one thing a card must never look like.
 *
 * Seamless on neither axis (74 and 119 of 255), so `cover` like the others.
 */
export const ZIGZAG: PlayerCardPattern = {
  key: "zigzag",
  name: "Zigzag",
  mask: 'url("/images/patterns/football-zigzag.png")',
  size: "cover",
  repeat: "no-repeat",
  opacity: MAX_PATTERN_OPACITY,
  blend: "soft-light",
};

/**
 * Geometry, held in reserve.
 *
 * These carried the card before the artwork arrived and are kept because they
 * cost nothing and answer the "what if we need a quiet one" question. They are
 * deliberately abstract: the obvious pattern for a Ghanaian football product is
 * kente, and kente is not decoration — the strips carry names and meaning, and
 * inventing a plausible-looking one is how you ship something that reads as
 * careless to the people it is for. Real kente or adinkra belongs here as
 * artwork, drawn by someone with the standing to draw it.
 */
export const GEOMETRIC_PATTERNS: readonly PlayerCardPattern[] = [
  {
    key: "mesh",
    name: "Mesh",
    // The back of a goal net. An X per tile, which repeats into a continuous
    // diamond lattice — the join lands mid-line where there is nothing to see.
    mask: svgUrl(
      `<svg xmlns='${SVG}' width='22' height='22'><path d='M0 0L22 22M22 0L0 22' stroke='black' stroke-width='1.15' fill='none'/></svg>`,
    ),
    size: "22px 22px",
    repeat: "repeat",
    opacity: 0.07,
    blend: "soft-light",
  },
  {
    key: "weave",
    name: "Weave",
    // One direction only, so it reads as cloth rather than as a grid. Three
    // strokes per tile: the main diagonal and the two corner fragments that
    // complete their neighbours across the seam.
    mask: svgUrl(
      `<svg xmlns='${SVG}' width='18' height='18'><path d='M0 18L18 0M-4 4L4 -4M14 22L22 14' stroke='black' stroke-width='1.6' fill='none'/></svg>`,
    ),
    size: "18px 18px",
    repeat: "repeat",
    opacity: 0.075,
    blend: "soft-light",
  },
  {
    key: "halftone",
    name: "Halftone",
    // Print dots. Corners plus centre is the seamless arrangement: each corner
    // dot is a quarter, and four tiles reassemble it.
    mask: svgUrl(
      `<svg xmlns='${SVG}' width='20' height='20'><g fill='black'><circle cx='0' cy='0' r='1.6'/><circle cx='20' cy='0' r='1.6'/><circle cx='0' cy='20' r='1.6'/><circle cx='20' cy='20' r='1.6'/><circle cx='10' cy='10' r='1.6'/></g></svg>`,
    ),
    size: "20px 20px",
    repeat: "repeat",
    opacity: 0.1,
    blend: "soft-light",
  },
] as const;

/**
 * Every pattern that exists, for the design preview only.
 *
 * Real cards do not pick from this list. A pattern belongs to a gradient (see
 * `player-card-variants.ts`), so the pairing is curated rather than hashed:
 * a drawing that sings on the pink is not automatically the right one on the
 * blue, and a hash cannot know the difference.
 */
export const ALL_PATTERNS: readonly PlayerCardPattern[] = [
  FOLK,
  SHARDS,
  ZIGZAG,
  ...GEOMETRIC_PATTERNS,
] as const;

/**
 * Film grain.
 *
 * `fractalNoise` rather than `turbulence`, desaturated to grey, then blended
 * rather than laid on top — grain that adds its own colour is a grey veil, and
 * grain that modulates the colour underneath is a material. `stitchTiles` is
 * what makes the tile seamless; without it every repeat shows its edge.
 *
 * Rendered once into a small tile and repeated, never across the whole panel.
 * An SVG filter is expensive per pixel it covers, and DESIGN_LANGUAGE §9.6 puts
 * a performance budget on exactly this kind of decoration.
 */
export const CARD_GRAIN = {
  image: svgUrl(
    `<svg xmlns='${SVG}' width='140' height='140'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(#g)'/></svg>`,
  ),
  scale: "140px 140px",
  opacity: 0.22,
} as const;
