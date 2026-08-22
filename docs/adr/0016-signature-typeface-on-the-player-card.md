# ADR-0016: A third typeface, for the signature on a player card

- **Status:** Accepted
- **Date:** 2026-08-22
- **Work Packet:** WP-20260822-player-card-artefact
- **Affected engines:** Player & Affiliation (presentation only)

## Context

DESIGN_LANGUAGE §2.6 defines two faces: Sora for display, Inter for body. §8
requires an ADR for token additions, and a font family is a token.

A player card with no confirmed match yet is mostly empty space, and empty space
reads as an unfinished object rather than as a new player. The card is the
product's acquisition loop (§15), so the day-one version is the one most likely
to be shared and the one least able to carry itself.

Filling that space with a tagline was tried and abandoned. Every candidate
failed one of three tests: it was hype, which §8 rule 4 bans outright ("ready to
take on the world"); or it was false for the players who see it most, since a
free agent has signed nothing ("newly signed on"); or it was a caption
apologising for the absence, which makes absence the subject of an object built
to be shared.

Filling it with zeroes was rejected earlier and separately: three zeroes at
display scale reads as a verdict on the player rather than as a season that has
not started, which is the §13 category error one level down.

## Decision

**Add `--font-signature`, bound to Chic Budapest, consumed by exactly one
component.**

A card with no record carries the player's own stage name signed across it, at
an angle, under the position and market status.

The choice rests on the signature being the player's own name. It is true by
construction, it says nothing the card has to defend, and pairing a printed name
with an autograph is the oldest convention in football memorabilia. It is the
one piece of personality available that is not the platform speaking for the
player.

Constraints on the addition:

- **One weight, one style.** The bargain for a third face on a phone paying by
  the megabyte is that it stays small.
- **One consumer.** `<PlayerCardSignature>` and the canvas twin that draws the
  share graphic. Nothing else may reach for it.
- **Decorative to assistive technology.** The name is already on the card as the
  heading and as the legal name; a third announcement is noise, so the element
  is `aria-hidden`. It carries tone, not information.
- **Rotation is a `transform`**, per §3.4, so the element still occupies its
  unrotated box and the surrounding rhythm does not move.

**The face was supplied rather than picked from a catalogue.** Chic Budapest is
a licensed script the team brought to the project, self-hosted through
`next/font/local` so it is preloaded and served from our own origin exactly like
Inter and Sora.

Before it arrived the working default was Satisfy, and the search that produced
it is worth keeping because it is the constraint any replacement must clear: the
signature renders at roughly 60% opacity on a saturated card ground, so stroke
weight decides whether the name is visible at all. The formal calligraphic
scripts (Great Vibes, Allura, Mrs Saint Delafield, Herr Von Muellerhoff) are
hairline by construction and go faint against the pink. Six candidates are
rendered side by side on the design page, on the real card grounds, with a short
name and a long one, so the comparison can be redone rather than re-argued.

**The variable is named for the role**, `--font-signature-face`, so swapping the
family is one line in `layout.tsx` and touches neither `globals.css` nor the
canvas that draws the share graphic.

## Alternatives considered

**A config-served tagline** (`player.card.empty_line`). Built and then removed
before it shipped. It made the tone editable without a deploy, which is the
right instinct, but it did not solve the actual problem: every string that fit
the slot still had to be either hype, false, or an apology. Shipping the
mechanism alongside the signature would have left two mechanisms competing for
one slot.

**Reusing the §14 confidence tier.** Rejected: the tier is deliberately off the
card (JOURNAL 2026-08-21) because it read as a caveat on figures that carry
none.

**Faking handwriting with Sora at an angle.** Rejected. Sora set at an angle is
Sora at an angle; the whole value here is that a signature is handwriting.

**Leaving the space empty.** A defensible option, and still the fallback if the
font ever becomes a problem: position and market status alone make a perfectly
good card. The signature is what makes it one worth sending.

## Consequences

**Positive**

- The day-one card has something on it rather than a hole where numbers go.
- The addition is bounded: one weight, one subset, one consumer, one ADR.
- It travels into the share graphic, so the artefact most likely to be sent is
  the one that gained the most.

**Negative**

- A third font file on a data plan the player pays for. Mitigated by the single
  weight, not eliminated.
- **It ships as TTF**, which is the format it was supplied in and roughly double
  the bytes the same face would cost as WOFF2. Converting is a follow-up, not a
  blocker, but it should happen before this reaches production.
- **Licensing is not settled by this ADR.** A desktop licence does not cover
  self-hosting a webfont, and the file is now served to every visitor who opens
  a card with no record. Someone has to confirm the licence permits web
  embedding before release.
- Handwriting faces render unevenly across platforms when the webfont fails. The
  fallback stack is deliberately cursive rather than the body face: a signature
  that renders in Inter is not a quieter signature, it is a visible mistake.
- Non-latin names will fall back. Latin covers the current market; a locale that
  needs otherwise should revisit rather than widen the subset by default.

**Follow-up**

- DESIGN_LANGUAGE §2.6 needs the third face recorded against it.
- If a fourth consumer ever wants this token, that is the signal the decision
  has drifted and should be re-argued rather than extended.
- Convert `Chic-Budapest.ttf` to WOFF2 and re-point `next/font/local` at it.
- Confirm the licence covers web embedding, and record where it came from.
