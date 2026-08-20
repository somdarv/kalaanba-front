# ADR-0011 — Pitch turf tokens for the position picker

- **Status**: Accepted
- **Date**: 2026-08-19
- **Supersedes**: none
- **Related**: ADR-0006 (OKLCH token layer), ADR-0007 (config-derived option sets)

## Context

The player-setup position step renders a football pitch. The design system had
no colour for grass, and DESIGN_LANGUAGE §2 forbids referencing colour
literally: everything goes through a token. Three options were on the table:

1. Hardcode a green in the component. This is an explicit refusal trigger in
   `design-system-mandatory.instructions.md`, so it is not an option.
2. Reuse `--success`. Wrong on meaning: §4.3 says status colours never appear
   outside data, and a pitch is not a success state. The day someone tunes
   `--success` for a confirmation badge, the pitch changes colour with it.
3. Add a small, clearly scoped decorative token set. Chosen.

## Decision

Add four tokens, consumed **only** by `PitchPicker`:

```
--pitch-turf:     oklch(0.430 0.075 150)
--pitch-turf-alt: oklch(0.462 0.078 150)   /* mow stripe */
--pitch-line:     oklch(1 0 0 / 0.30)
--on-pitch:       oklch(1 0 0)
```

They are **theme-stable**: defined once in `:root` and never overridden in the
light block. The reasoning is the same one already applied to the auth hero's
black scrim. Grass is green under floodlights and green at noon; a pitch is a
depicted object, not a UI surface, and a depicted object does not invert when
the user picks a light theme.

`--on-pitch` is white and is the label role for anything drawn on turf. Turf at
L 0.430 carries white at 7.4:1, so it clears AA comfortably, unlike the brand
fills.

## Consequences

- Good: the one screen players enjoy answering gets real colour, without
  borrowing a semantic role or pinning a hex in a component.
- Good: the token set is small and named for its single consumer, so the blast
  radius of changing it is one component.
- Cost: four tokens that only one component reads. Accepted because the
  alternative is a literal in JSX, which the constitution refuses outright.
- Watch: if a second surface ever wants turf (a fixture hero, a formation
  board), these are already the right tokens. If a third arrives, revisit
  whether "pitch" deserves a full elevation recipe rather than four values.

## Not decided here

The position **options** stay config-derived (`player.positions`, ADR-0007).
This ADR adds paint, not domain data. The picker renders whatever Admin Config
serves and cannot know how many bands it will draw, which is why it draws zones
rather than pinned per-position dots.
