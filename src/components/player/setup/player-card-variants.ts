/**
 * The three looks a player card can take.
 *
 * Why three and not one: this card is the thing a player screenshots and sends
 * to a group chat. If every card in Tamale is the same pink rectangle, it is a
 * receipt. If the person next to you has a different one, it is a card. That
 * is the whole argument, and it is worth four lines of CSS.
 *
 * **Every colour is a brand token, mixed.** No new tokens, no literals. The
 * palette is `--primary` and `--accent` blended at different ratios, which is
 * the same move `<AuthHero>`'s BrandMesh already makes. State colours are
 * deliberately absent: DESIGN_LANGUAGE §4.3 keeps success, warning and danger
 * on data, and a green card would read as a status the player has not earned.
 *
 * **The variant is derived, not random.** A random pick would hand the same
 * player a different card on every render, which is worse than one colour: it
 * makes the card feel like it belongs to the app instead of to them. The key
 * is hashed, so a given player gets the same card forever, on every device,
 * with no column in the database.
 */

export type PlayerCardVariant = {
  /** Stable internal key. Never rendered. */
  key: "flare" | "dusk" | "deep";
  /** Human name, for the design preview only. */
  name: string;
  /** The gradient wash. */
  background: string;
  /** A soft light source, sitting over the gradient. */
  glow: string;
};

export const PLAYER_CARD_VARIANTS: readonly PlayerCardVariant[] = [
  {
    key: "flare",
    name: "Flare",
    background:
      "linear-gradient(145deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 72%, var(--accent)) 58%, color-mix(in oklab, var(--primary) 40%, var(--accent)) 100%)",
    glow: "radial-gradient(120% 80% at 80% 0%, color-mix(in oklab, var(--on-primary) 22%, transparent), transparent 62%)",
  },
  {
    key: "dusk",
    name: "Dusk",
    background:
      "linear-gradient(155deg, color-mix(in oklab, var(--primary) 55%, var(--accent)) 0%, var(--primary-pressed) 62%, color-mix(in oklab, var(--primary-pressed) 70%, var(--accent)) 100%)",
    glow: "radial-gradient(110% 75% at 15% 0%, color-mix(in oklab, var(--on-primary) 20%, transparent), transparent 60%)",
  },
  {
    key: "deep",
    name: "Deep",
    background:
      "linear-gradient(150deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 70%, var(--primary)) 55%, var(--accent-pressed) 100%)",
    glow: "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--on-accent) 20%, transparent), transparent 65%)",
  },
] as const;

/**
 * Pick a card for a player. Same input, same card, always.
 *
 * A small string hash (djb2, xor variant) is plenty here: the only property
 * that matters is an even-ish spread across three buckets for arbitrary UUIDs.
 * Nothing security-sensitive rides on this.
 */
export function variantFor(seed: string): PlayerCardVariant {
  let hash = 5381;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) + hash) ^ seed.charCodeAt(index);
  }
  const bucket = Math.abs(hash) % PLAYER_CARD_VARIANTS.length;
  return PLAYER_CARD_VARIANTS[bucket]!;
}
