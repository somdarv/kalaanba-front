# ADR-0012 — White labels on bright brand fills, below AA, knowingly

- **Status**: Accepted
- **Date**: 2026-08-19
- **Supersedes**: ADR-0010 on the label colour only. The fills it chose are unchanged.
- **Related**: ADR-0006 (OKLCH token layer), DESIGN_LANGUAGE §2.2, §6

## Context

ADR-0010 kept v2's bright fills and flipped the label dark. It measured well:
every state cleared 4.5:1 against its own dark ink, and the brand pink survived
intact rather than being darkened into the plum ADR-0006 produced.

Then it was looked at. A dark label on brand pink does not read as a primary
action, it reads as a disabled one. The product owner asked for white labels,
was shown the measured cost, and confirmed twice.

## Decision

`--on-primary`, `--on-accent`, `--on-success` and `--on-danger` are white.
The fills keep the lightness ADR-0010 gave them.

**This does not clear WCAG AA, and the numbers are recorded here rather than
softened.** White against each fill:

| role | base | hover | pressed |
| --- | --- | --- | --- |
| primary | 3.19 | **2.84** | 3.89 |
| accent | 3.14 | 2.80 | 3.83 |
| success | 3.16 | 2.81 | 3.85 |
| danger | 3.18 | 2.83 | 3.88 |

AA for normal text is 4.5:1, so all twelve fall short. Note **hover is the worst
case, not pressed**: hover lightens the fill by L +0.030 and pushes the label
further down. Button labels do not qualify for the 3:1 large-text allowance,
which needs ≥18.66px bold, and `lg` is 16px medium.

`--on-warning` and `--on-live` stay dark. Amber at L 0.770 and cyan at L 0.840
carry white at ~2.2:1 and ~1.9:1, which is illegible rather than merely sub-AA.

## Consequences

- **Cost, stated plainly**: filled controls are below AA against their own
  labels. Users with low vision, and anyone in Ghanaian midday sun on a cheap
  screen, will find them harder to read than the system promises elsewhere.
  This is a real accessibility regression, accepted for brand reasons.
- DESIGN_LANGUAGE §2.2 ("a filled control MUST clear 4.5:1 against its own
  label, in every state") is now violated by the shipped tokens. The rule stays
  in the doc: it is the right rule, and this ADR is the exception that has to be
  argued for rather than a licence to stop measuring.
- `design-tokens.test.ts` asserts the deviation explicitly. It still measures
  every fill against white and still fails if any drops below **2.75:1**, so the
  fills cannot drift further down without a test failure. The guard is
  re-pointed, not removed.

## The way back, if this is revisited

Hold the white label and drop each fill to the brightest value that clears
4.5:1: `primary L 0.594 #CF3B8F`, `accent L 0.565 #1E7CBD`,
`success L 0.551 #06893E`, `danger L 0.588 #D24535`. Darker than today, still
short of ADR-0006's plum. One-line change per token.
