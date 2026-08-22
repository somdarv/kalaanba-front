/**
 * The three looks a player card can take.
 *
 * Why three and not one: this card is the thing a player screenshots and sends
 * to a group chat. If every card in Tamale is the same pink rectangle, it is a
 * receipt. If the person next to you has a different one, it is a card. That
 * is the whole argument, and it is worth four lines of CSS.
 *
 * **Every colour is a token.** No literals. The palette is the `--card-*` set
 * (ADR-0014), which is theme-stable for the same reason `--pitch-*` is
 * (ADR-0011): a card in a WhatsApp thread must not depend on the theme its
 * sender was using. State colours are deliberately absent — DESIGN_LANGUAGE
 * §4.3 keeps success, warning and danger on data, and a green card would read
 * as a status the player has not earned.
 *
 * **Why these are darker than `--primary`.** The card carries a full name, a
 * stat row and a meta bar at 12-14px. ADR-0012's 3.19:1 latitude covers a
 * one-word button label, not a paragraph of small text, so the card grounds sit
 * at the lightness that clears 4.5:1 against white. The lighter stop in each
 * pair is the ceiling and the one the token test measures.
 *
 * **The variant is derived, not random.** A random pick would hand the same
 * player a different card on every render, which is worse than one colour: it
 * makes the card feel like it belongs to the app instead of to them. The key
 * is hashed, so a given player gets the same card forever, on every device,
 * with no column in the database.
 */

import {
  FOLK,
  SHARDS,
  ZIGZAG,
  type PlayerCardPattern,
} from "./player-card-patterns";

export type PlayerCardVariant = {
  /** Stable internal key. Never rendered. */
  key: "flare" | "dusk" | "deep";
  /** Human name, for the design preview only. */
  name: string;
  /** The gradient wash. */
  background: string;
  /**
   * The artwork this ground wears.
   *
   * Paired by hand rather than hashed on its own salt, which is what the first
   * pass did. A drawing that sings on the pink is not automatically the right
   * one on the blue, and a hash cannot know the difference — it can only
   * guarantee the pairing is arbitrary. Two axes of variation are worth less
   * than three combinations someone chose.
   */
  pattern: PlayerCardPattern;
  /**
   * A soft light source, sitting over the gradient.
   *
   * Anchored to the TOP of the panel, and capped at 12% white. Both are
   * contrast constraints rather than taste: a white glow lifts whatever it
   * sits on, and at 12% over the lightest ground it lands at 3.68:1 — fine
   * under the head row, which is a wordmark and one display-size number
   * (§6 allows 3:1 for large display), and not fine anywhere the small text
   * lives. The small text lives below it, where the gradient is deepest.
   */
  glow: string;
};

export const PLAYER_CARD_VARIANTS: readonly PlayerCardVariant[] = [
  {
    key: "flare",
    name: "Flare",
    background:
      "linear-gradient(158deg, var(--card-flare) 0%, color-mix(in oklab, var(--card-flare) 55%, var(--card-flare-deep)) 52%, var(--card-flare-deep) 100%)",
    pattern: SHARDS,
    glow: "radial-gradient(120% 62% at 82% -8%, color-mix(in oklab, var(--on-card) 12%, transparent), transparent 64%)",
  },
  {
    key: "dusk",
    name: "Dusk",
    background:
      "linear-gradient(158deg, var(--card-dusk) 0%, color-mix(in oklab, var(--card-dusk) 50%, var(--card-dusk-deep)) 54%, var(--card-dusk-deep) 100%)",
    pattern: ZIGZAG,
    glow: "radial-gradient(115% 60% at 18% -8%, color-mix(in oklab, var(--on-card) 12%, transparent), transparent 62%)",
  },
  {
    key: "deep",
    name: "Deep",
    background:
      "linear-gradient(158deg, var(--card-deep) 0%, color-mix(in oklab, var(--card-deep) 52%, var(--card-deep-deep)) 52%, var(--card-deep-deep) 100%)",
    pattern: FOLK,
    glow: "radial-gradient(120% 62% at 50% -10%, color-mix(in oklab, var(--on-card) 12%, transparent), transparent 66%)",
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
