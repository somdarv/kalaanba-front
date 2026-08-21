# ADR-0013 — Secondary's hover is a brand tint, not a neutral step

- **Status**: Accepted
- **Date**: 2026-08-20
- **Supersedes**: nothing. Amends `DESIGN_LANGUAGE` §2.1.1 for two tokens.
- **Related**: ADR-0006 (OKLCH design tokens), ADR-0010, ADR-0012

## Context

`<Button intent="ghost">` and `<Button intent="secondary">` sit next to each
other on two different screens doing the same job: the other way out.

- `/onboarding/area` — "Save and continue" (primary) over "Skip for now" (ghost)
- `/auth/login` — "Continue" (primary) over "Use email instead" (secondary)

They hover completely differently, and the owner picked it out by eye on
2026-08-20 without knowing why.

Ghost hovers to `--hover-overlay`, which in the light theme is
`oklch(0.680 0.200 350 / 0.07)` — **the brand hue at 7%**. Over a white control
that composites to `#FEF3F9`, a pale pink wash.

Secondary hovered to `--secondary-hover`, `oklch(0.905 0.000 264)` — `#DFDFDF`,
a flat grey. Its resting fill in the light theme is `--surface-elev`, which is
pure white, so the gesture read as a white button turning grey.

That grey is not an accident and it was not wrong when it was written.
`DESIGN_LANGUAGE` §2.1.1 (the "slate" rule) says neutrals at L ≥ 0.90 in the
light theme carry chroma 0.000, and it names this exact token pair as the worst
of the three offenders it was written against: `#DCE0E8` / `#CFD4DE`, an R−B
spread of −12 and −15, a visible cool cast on every hover on paper. De-slating
them to C 0.000 on 2026-08-19 fixed a real bug.

The bug it did not fix is that the product now had two philosophies for one
gesture: quiet interaction washes brand, except on secondary, where it steps to
grey.

## Decision

**In the light theme, secondary's hover and pressed fills are its own resting
surface pulled toward brand.** Computed as white mixed 12% / 20% toward
`--primary` in oklab, then written out as the static result:

```css
--secondary-hover:  oklch(0.962 0.024 350); /* #FFECF5 */
--secondary-active: oklch(0.936 0.040 350); /* #FFE0EE */
```

Ghost washes at 7% / 12%; secondary takes 12% / 20% because it replaces a fill
rather than washing over nothing, and has to read as a definite state change on
a control that is already white.

**The dark theme keeps its neutral step**, `oklch(0.285 0.024 264)` /
`oklch(0.325 0.026 264)`, unchanged.

That is not an inconsistency, it is the same rule applied twice. The thing
secondary is being matched to is `--hover-overlay`, and `--hover-overlay` is
brand pink in the light theme and near-white in the dark one. So in each theme
secondary now hovers the way the ghost button beside it hovers. Pulling the
dark pair toward `--primary` would also drag the hue 264 → 313 and land on
`#332939`, a plum the product does not have anywhere else.

### Why not `color-mix()`

The first cut of this shipped the rule literally, as
`color-mix(in oklab, var(--primary) 12%, var(--surface-elev))`. It was caught in
the build output before merge.

Lightning CSS compiles a `color-mix` custom property into a plain declaration
plus an `@supports` override, and the plain declaration it emits is:

```css
--secondary-active: var(--primary);
```

So a browser without `color-mix` (pre-Chrome 111 / pre-Safari 16.2, both 2023)
gets **solid brand pink**, carrying `--fg` dark label text at a contrast ratio
that fails outright. `:active` fires on touch, so this is not a
hover-only desktop edge case, and budget Android on older WebViews is a real
share of this product's market.

Static `oklch()` has no such trap: Lightning CSS gives it an honest hex/lab
fallback. The cost is that the pair no longer tracks `--primary` automatically
if the brand is ever rehued. The comment in `globals.css` records the recipe so
it can be recomputed.

## §2.1.1 amendment

§2.1.1 is a rule about **neutrals**. Its stated defect is a few thousandths of
blue at hue 264 that is invisible at L 0.20 and reads unmistakably as slate at
L 0.98, measured as a negative R−B spread. A deliberate brand tint at hue 350
is the opposite artefact: chosen, warm, positive R−B, and already shipped
system-wide as `--hover-overlay`.

§2.1.1 keeps its full force over every neutral it was written for — control
fills, dividers, hairlines, skeleton bases, disabled fills. It does not govern
an interaction surface that is intentionally carrying the brand.

The rule's "no exceptions without an ADR" clause is why this file exists.

## Consequences

- Every `intent="secondary"` button changes hover and pressed appearance in the
  light theme. 18 call sites, all picking it up from the token with no edits.
- Contrast is unaffected: the label is `--fg` on a fill at L 0.962 / 0.936, far
  from any AA boundary.
- The dark theme is untouched, so half the product sees no change at all.
- The values do not track `--primary`. Rehue the brand and these two need
  recomputing by hand; the recipe is in the `globals.css` comment.

## Alternatives rejected

**Switch the login button to `intent="ghost"`.** One call site, no ADR, and it
gets the exact wash the owner pointed at. Rejected because it also drops the
resting fill: "Use email instead" is a real alternative path on a screen with
two ways forward, not a skip link, and the bordered white box is what gives it
standing next to a filled brand CTA. It also fixes one screen and leaves the
other 17 secondary buttons hovering grey.

**Leave it alone and call it a neutral.** Defensible on the letter of §2.1.1,
but it keeps two philosophies for one gesture in the same product, which is the
thing that got noticed without anyone looking for it.
