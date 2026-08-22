# ADR-0014 — Theme-stable player card tokens

- **Status**: Accepted
- **Date**: 2026-08-21
- **Supersedes**: none
- **Related**: ADR-0006 (OKLCH token layer), ADR-0011 (pitch turf tokens), ADR-0012 (white labels on bright brand fills)
- **Work Packet**: WP-20260821-player-card-hero

## Context

The player card was rebuilt around a fuller composition: the ghost name behind
the identity band, a three-up verified-record row (Player & Affiliation §15),
and a meta bar carrying position, market status and availability. That change
moved the card from "two tags on a gradient" to a surface carrying a paragraph
of small text at 11–14px.

Its colours were `color-mix()` blends of `--primary`, `--primary-pressed`,
`--accent` and `--accent-pressed`. Two problems followed from that, and neither
was visible while the card only held a name.

**1. It inherited a deviation it does not qualify for.** ADR-0012 accepted white
labels on bright brand fills at 2.80–3.89:1, below the §2.2 requirement of
4.5:1. The argument was specifically about button labels: one short word, high
familiarity, brand identity at stake. A full name, a stat row and a meta bar are
not one short word. Building the card from those fills would have taken a
knowing, scoped, one-word deviation and spread it across every string on the
product's most-shared surface.

**2. A shareable artefact was inheriting the reader's theme.** §15 calls the
card the acquisition loop and asks for "static share images for WhatsApp and a
live URL that stays current". `--primary` and `--accent` are identical across
themes today, but `--primary-pressed` participates in blends that sit next to
theme-varying tokens, and nothing recorded that the card must not follow the
theme. The next person to tune a brand token for the light theme would have
changed what lands in a group chat.

## Decision

Add a small, clearly scoped, **theme-stable** token set consumed only by
`PlayerCard` and `player-card-variants.ts`:

```
--card-flare:      oklch(0.576 0.190 350)   /* white 4.83 bare, 4.53 through a pattern */
--card-flare-deep: oklch(0.400 0.150 350)
--card-dusk:       oklch(0.564 0.155 315)   /* white 4.94 bare, 4.53 through a pattern */
--card-dusk-deep:  oklch(0.360 0.120 295)
--card-deep:       oklch(0.545 0.130 245)   /* white 4.91 bare, 4.52 through a pattern */
--card-deep-deep:  oklch(0.370 0.100 255)
--on-card:         oklch(1 0 0)
```

### Amended the same day: the pattern is part of the ground

The values above are not the ones this ADR first recorded. It originally set the
three grounds to the brightest that clear 4.5:1 **bare** (L 0.590 / 0.583 /
0.563), which was correct for the card as it existed that morning: a gradient
with type on it.

The card then gained a white pattern layer, and white at `soft-light` lightens
whatever it crosses. The first artwork shipped at 0.16 opacity and took the
surface to **4.19:1** — below the floor this ADR exists to hold, with the
contrast test still green, because the test measured the bare gradient and the
bare gradient was never what a reader saw.

The rule that follows: **a decorative layer that changes luminance is part of
the ground, and the ground is what has to clear AA.** The grounds above are now
the brightest that clear 4.5:1 *through* a full-strength pattern at
`MAX_PATTERN_OPACITY` (0.12), and `design-tokens.test.ts` measures the
composite for every pattern that exists rather than the gradient alone. The two
numbers are joined: raising the opacity cap or lightening a ground breaks the
other, and the test says so by name.

Two things fell out of measuring it properly:

- **CSS composites blend modes in gamma-encoded sRGB, not linear light.** Doing
  the arithmetic in linear light overstates the remaining headroom, so the test
  encodes, blends, then decodes before measuring.
- **`normal` blend is not usable for a white pattern here.** It lerps the ground
  straight toward white and costs more contrast per unit of visible texture than
  `soft-light` does. The reserve geometry failed at 0.07 on `normal` and passes
  comfortably at the same opacity on `soft-light`; to use `normal` at all a
  white pattern has to drop to roughly 0.045, which is too faint to see. Every
  pattern is `soft-light`, and that is a contrast result rather than a taste.

Defined once in `:root`, never overridden in the light block, exactly as
ADR-0011 does for `--pitch-*`. The reasoning transfers without modification: a
pitch is a depicted object rather than a UI surface, and so is a card that
exists to be screenshotted. A depicted object does not invert when the reader
picks a light theme.

Each look is a two-stop gradient. The **light stop is the ceiling** and clears
4.5:1 against `--on-card`; the deep stop only ever adds margin. The white glow
overlay is capped at 12% and anchored to the top of the panel, where the only
content is the wordmark and the shirt number at display size — 3.68:1 at worst
there, inside the 3:1 large-display allowance in DESIGN_LANGUAGE §6. Every
string below it sits on the ungloved gradient.

`design-tokens.test.ts` pins five guarantees: the bare AA floor, the composite
AA floor through every pattern that exists, the opacity cap those grounds were
derived from, the light/deep ordering, and the absence of any light-theme
override.

## Consequences

**Good.**

- The most-shared surface in the product clears WCAG AA for normal text. It is
  the first brand-coloured surface in the system that does.
- A card renders identically for sender and receiver, on any theme, which is
  what an artefact has to do.
- ADR-0012's deviation stays where it was argued — on button labels — instead of
  quietly widening to whatever else happens to use a brand fill.

**Costs, stated plainly.**

- The card is visibly deeper than `--primary`. It no longer matches a primary
  button placed beside it. This is the intended trade and it should not be
  "fixed" by lightening the grounds; lightening them breaks the test.
- The grounds are darker again than the first pass, to pay for the pattern. Any
  future decorative layer that lightens the card spends from the same budget and
  has to be measured the same way.
- Seven more tokens in a system that is deliberately small. The scope guard is
  the same one `--pitch-*` uses: two files consume them, and the ADR names them.
- The compliant lightnesses for `--primary`/`--accent` are now demonstrated to
  be usable in production. That strengthens the case for revisiting ADR-0012,
  which is a conversation this ADR deliberately does not open.

## Alternatives rejected

1. **Keep deriving from `--primary`/`--accent` and accept sub-AA small text.**
   Multiplies a scoped deviation across a paragraph. §6 calls contrast
   non-negotiable and no ADR covers this case.
2. **Darken a scrim over the existing gradients.** The scrim has to darken in
   both themes, and there is no always-dark token to mix toward: `--bg` is near
   black in dark and pure white in light, so the same scrim would lighten the
   card in the light theme and make the problem worse.
3. **Shrink the card back to identity only, avoiding the small text.** Gives up
   §15's named content (appearances, goals, assists) to preserve a colour.
