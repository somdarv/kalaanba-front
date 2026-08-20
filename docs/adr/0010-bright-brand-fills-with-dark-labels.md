# ADR-0010: Bright brand fills with dark labels

- **Status**: Accepted
- **Date**: 2026-08-19
- **Work Packet**: WP-20260819-auth-split-screen
- **Supersedes**: ADR-0006 decision 3, on one point only (the label colour). Every
  other decision in 0006 stands.

## Context

ADR-0006 found a real defect: v2 used bright brand colours as **fills** under
**white** labels, and four of five filled intents failed WCAG AA.

| role        | v2 fill   | vs white label |
| ----------- | --------- | -------------- |
| `--primary` | `#F55694` | 3.16:1 ✗       |
| `--danger`  | `#EF4444` | 3.76:1 ✗       |
| `--success` | `#16A34A` | 3.30:1 ✗       |
| `--accent`  | `#56B7F5` | 2.21:1 ✗       |

0006 fixed the ratio by **darkening the fill** while holding the white label
fixed. That worked — every fill reached ~5.2:1 — but it treated the label as a
constant when it was only ever a default. The cost was the brand: `--primary`
went `#F55694` → `#C62685`, from a bright pink to a plum, and the same
flattening hit accent and success.

That cost was raised in this session as "the contrast work is the problem".
Measuring the alternative shows the constraint was never brightness:

| role        | v2 fill   | vs white | vs dark ink |
| ----------- | --------- | -------- | ----------- |
| `--primary` | `#F55694` | 3.16:1 ✗ | **5.32:1 ✓** |
| `--accent`  | `#56B7F5` | 2.21:1 ✗ | **7.60:1 ✓** |
| `--success` | `#16A34A` | 3.30:1 ✗ | **5.11:1 ✓** |

A bright fill is not a contrast failure. A bright fill **under a white label**
is. Holding the label fixed while moving the fill was the wrong degree of
freedom to spend.

The system already contained the counter-example: `--warning` and `--live` have
carried dark labels (`--on-warning`, `--on-live` at L 0.200) since 0006. Only
four of the six roles were forced onto white.

## Decision

**1. Brand and state fills return to v2's lightness band and carry a dark label.**
Each role's `--on-*` becomes `oklch(0.200 0.030 <fill hue>)`, matching the
convention `--on-warning` and `--on-live` already used.

| role        | fill                     | hex       | vs its own ink |
| ----------- | ------------------------ | --------- | -------------- |
| `--primary` | `oklch(0.680 0.200 350)` | `#ED58A9` | 5.72:1         |
| `--accent`  | `oklch(0.655 0.130 245)` | `#4097DA` | 5.74:1         |
| `--success` | `oklch(0.640 0.150 150)` | `#36A558` | 5.71:1         |
| `--danger`  | `oklch(0.675 0.180 30)`  | `#F1624F` | 5.72:1         |

**2. The pressed state is now the worst case, and is the value that was solved
for.** ADR-0006 decision 4 (hover L +0.030, pressed L −0.050) is unchanged, but
its contrast polarity inverts: under a white label a darker fill was *safer*,
under a dark label it is *riskier*. Base lightness was chosen so that pressed —
not base — clears 4.5:1, with margin:

| role        | base   | hover  | pressed          |
| ----------- | ------ | ------ | ---------------- |
| `--primary` | 5.72:1 | 6.43:1 | **4.68:1**       |
| `--accent`  | 5.74:1 | 6.48:1 | **4.73:1**       |
| `--success` | 5.71:1 | 6.37:1 | **4.67:1**       |
| `--danger`  | 5.72:1 | 6.43:1 | **4.69:1**       |

DESIGN_LANGUAGE §2.2 ("a filled control MUST clear 4.5:1 against its own label,
in every state") therefore still holds, and holds by measurement rather than by
assumption. Every state is in sRGB gamut.

**3. `--*-ink` roles are untouched.** The fill/ink split from 0006 decision 3 is
the part that was right. Only the pairing of fill-to-label changes.

## Alternatives considered

**Literal revert to v2 (bright fills, white labels).** Rejected. It is what was
first asked for, but it restores the exact defect 0006 existed to fix — primary
at 3.16:1, accent at 2.21:1 — and contradicts DESIGN_LANGUAGE §2.2 and §6.

**Keep white labels, lighten the fills as far as AA allows.** Rejected as
ineffective. The ceiling is `L 0.580` (4.82:1); one step further, `L 0.600`, is
already 4.43:1 and fails. That is two lightness steps above the current value
and nowhere near v2's `L 0.682` — it would not read as the recovered brand.

**Change the brand hue instead (the deep purple 0006 parked).** Not revisited
here. It remains a brand decision, and this ADR is about the fill/label pairing.

## Consequences

**Positive**

- The brand pink comes back at full strength, and closer to the official logo
  mark (`#EA058D`) than the plum it replaces.
- Contrast improves rather than regresses: 5.72:1 against 0006's 5.23:1.
- Six of six filled roles now share one pattern instead of four-plus-two.

**Negative**

- `--on-primary` and its siblings invert. Fifteen files read them. The
  primitives (`Button`, `Fab`, `Chip`, `Checkbox`, `IconButton`, `Calendar`,
  `Combobox`) and the genuine `bg-primary` surfaces (`player-card`,
  `pitch-picker`, `choice-controls`, `clubs/near-you`) flip correctly, because
  they pair the token with the fill it belongs to.
- **One call site was misusing the token and had to change.** `<AuthHero>` set
  `text-on-primary` over a *photograph*, not over a `--primary` fill. Under this
  ADR that would render near-black type on a dark-scrimmed image. It now uses
  literal `white`, on the same reasoning the file already applies to its literal
  black scrim: a photograph does not change with the theme.
- Any visual-regression baseline containing a filled control is stale.

**Follow-up / risks**

- The light-theme `--secondary-hover` / `--secondary-active` were not revisited
  and may want retuning against the brighter fills.
- Filled controls on light ground should be walked through once: a bright fill
  on paper is a smaller lightness step than it was on the dark ground.
