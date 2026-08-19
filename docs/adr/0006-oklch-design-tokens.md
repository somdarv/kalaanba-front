# ADR-0006: OKLCH design tokens and the fill/ink role split

- **Status:** Proposed
- **Date:** 2026-08-12
- **Work Packet:** WP-20260812-oklch-token-migration
- **Affected engines:** None — presentation layer only. No domain truth, contract, or config key is touched.

## Context

`DESIGN_LANGUAGE.md` §8 requires an ADR for token additions or renames, and
`design-system-mandatory.instructions.md` makes the design language binding until an
ADR overrides it. This change does both, so it needs one.

A measured audit of the v2 token layer (`docs/design-system/token-audit.html`) found
three defects that share a single root cause — sRGB hex cannot express a perceptually
uniform step, so the system had no way to check its own spacing:

1. **Elevation.** §2.4 specifies three tiers. `--surface` → `--surface-elev` was a
   lightness step of ΔL 0.022 while the step below it was ΔL 0.047 — the "raised" tier
   was half-size and did not read as separate. `Card` had quietly collapsed
   `flat` and `raised` to one identical recipe, and the inset top highlight §2.4 calls
   "what separates this from flat web" was never implemented.
2. **Contrast.** Brand colours sat at L 0.68 (pink) and L 0.75 (blue) and were used as
   *fills* under white labels. Four of five filled button intents failed WCAG AA for
   their own label: primary 3.16:1, accent 2.21:1, success 3.30:1, danger 3.76:1.
3. **Semantic collision.** `--pink` (H 359.9) and `--danger` (H 25.3) sat 25° apart at
   near-identical chroma and lightness, despite the token file asserting they were
   "clearly" distinct. Brand and destructive were one glance apart at badge scale.

Two further findings were structural rather than chromatic: the focus ring was pink at
35% alpha, i.e. pink-on-pink and effectively invisible on the primary button; and
because `cn` is `twMerge`, size classes composed after `pressableBase` silently beat
`min-h-11`, shipping 36px and 28px touch targets in violation of §9.1.

Separately, the component inventory had ~60 generic primitives and nothing capable of
rendering a scoreline, a fixture, or a club crest — the objects the product exists to
display.

## Decision

**1. Colour is authored in OKLCH.** Every token is declared as `oklch(L C H)`. L is
perceptually uniform, so an equal ΔL is an equal perceived step — which is the property
that makes the elevation ramp checkable rather than a matter of taste.

**2. Neutrals are hue-locked.** All neutrals sit at hue 264 and step by a uniform
ΔL 0.040 (dark) / 0.035 (light). A neutral that drifts off 264 is a bug. This makes the
v2 `--fg-muted` failure — a dead grey at C 0.000 inside a blue-black family —
structurally impossible to reintroduce.

**3. Brand fill and brand ink are separate roles.** `--primary` is tuned to carry a
white label (5.23:1). `--primary-ink` is the same hue tuned for text on a dark surface
(7.71:1). One colour cannot do both jobs, and v2's attempt to make it is what produced
the contrast failures. The same split applies to accent, success, warning and danger.

**4. State moves lightness only.** Hover is L +0.030, pressed is L −0.050, with hue and
chroma held. v2 mixed toward white, which desaturated the brand into chalk and dropped
the label below AA. Every state of every fill is verified in-gamut and ≥ 4.5:1.

**5. Adjacent semantic hues are ≥ 40° apart.** primary 350, danger 30, warning 75,
success 150, live 195, accent 245.

**6. `--live` is a semantic role, not an accent.** One electric hue reserved for in-play
matches, consumed only by `<LiveIndicator>`. Spending it decoratively would destroy the
signal.

**7. Focus gets its own hue (200) plus `outline-offset`.** The ring lands on the ground
behind the control (10.8:1 on `--bg`) and never overlaps the fill it marks.

**8. Sub-44px controls expand their hit area, they do not lower the floor.** The
`.kx-tap-expand` class grows the pointer target with a pseudo-element. It is
deliberately not a Tailwind utility, so `twMerge` cannot drop it and layer order cannot
demote it. This is the mechanism §9.1 already prescribed ("visual size may be smaller;
the hit area is padded out with invisible space") and which v2 did not implement.

**9. The shape scale gains a tight end.** `--radius-row` (10px) and `--radius-control`
(12px) join `--radius-card` (20px) and `--radius-panel` (28px). v2 had only pills and
25–32px, so dense football data had nothing to sit in that did not read as a soft
consumer card.

**10. Six football primitives enter `src/components/ui/`:** `Eyebrow`, `StatValue` /
`StatBlock`, `Crest`, `LiveIndicator`, `ScoreLine`, `FixtureRow`. They are purely
presentational — they accept props and render markup, per §4.2. They never compute a
score, a standing, or a verification state (Constitution Law 3), they key on stable
internal status strings while taking display labels as props (Law 4), and `ScoreLine`
marks any status outside `result_confirmed` as provisional (Law 7).

**11. Focus indication and field-active affordance are separate roles.** They had been
conflated on `--primary`, which is why the ring disappeared on brand-coloured controls.

| Role | Job | Token |
| --- | --- | --- |
| Keyboard focus indicator | "keyboard focus is here" — identical on every control | `--ring` (hue 200) |
| Field-active affordance | "this field is live / errored" — fires on mouse and touch too | `--primary-ink` / `--danger-ink` |

Every `focus-visible:ring-*` in the suite now resolves to `--ring`. `focus-within:`,
`data-open:`, `data-focused:` and `data-error:` borders and rings resolve to the ink
roles. One documented exception: `Slider`'s thumb ring stays `--primary`, because the
thumb is white and the ink role is a pale pink that would not read against it.

**12. The input suite shares one radius.** Text fields were `rounded-pill` (999px), OTP
was `rounded-xl` (12px), and the rest sat on `--radius-control` — three radii across one
family. All are `--radius-control` (12px) now, which is what §2.3 already specified. A
fully-round input reads consumer-app; the tight rectangle is the sports register.

## Alternatives considered

**Keep hex, fix the individual values by hand.** Rejected. It fixes today's numbers and
leaves the system with no way to detect the next uneven ramp. The elevation bug survived
three months precisely because nothing could measure it.

**Adopt a full colour library (Radix Colors, Tailwind palette).** Rejected. Both are
excellent and neither is a football product. The brand is already pink; the problem was
never the hue, it was that one lightness was asked to do two jobs.

**Drop pink entirely for a Premier-League-style deep purple.** Considered seriously —
the reference material points that way. Rejected for this ADR because it is a brand
decision, not an engineering one, and the fill/ink split fixes the measured defects
without spending the brand. Re-opening the hue is a separate, cheaper decision once
this lands: it is now a one-line change to `--primary`'s H.

**Force every control to a literal 44px box.** Rejected. It would destroy dense
toolbars and filter rows, and §9.1 does not ask for it — it asks for a 44px *hit area*.

**Put the football primitives in `src/components/match/`.** Rejected. They hold no
feature logic and fetch nothing, which makes them primitives by §4.2's own definition;
`Avatar`, `Badge` and `Progress` are equally domain-shaped and already live in `ui/`.

## Consequences

**Positive**

- All filled controls clear WCAG AA for their labels; the focus ring is visible on every
  intent; sub-44px targets are gone.
- The elevation ramp is uniform and `Card`'s `tone` prop does something for the first time.
- Hover no longer desaturates the brand.
- Adding a theme or reskinning the brand is now a lightness/hue edit, not a hand-tuning
  exercise across 60 components.
- The product can render a scoreline.

**Negative**

- OKLCH requires Chrome 111+ / Safari 15.4+ / Firefox 113+. The codebase already shipped
  `color-mix(in oklab, …)` throughout, so this raises no floor that was not already there,
  but it is a hard floor with no fallback.
- Every surface shifts slightly. Screenshots and any visual-regression baselines are stale.
- `--radius-card` moves 25.6px → 20px and `--radius-control` 20px → 12px. Deliberate, and
  visible everywhere.
- **Text fields stop being pills.** This is the largest single visual change in the
  packet and it touches every form in the app.
- The migration swept 45 primitive files. Nothing in it changes component logic — the
  edits are token and class-name substitutions — but the blast radius is the whole UI
  layer, so it wants a walkthrough rather than a spot check.

**Follow-up work / risks**

- `DESIGN_LANGUAGE.md` §2.2, §2.3, §2.4, §2.6, §3.5 and §4.1 need reconciling to this
  decision; `REBUILD_PLAN.md` checkboxes are stale against the built system.
- The `--kx-*` archive block is frozen at v2 literals so `/legacy/showcase` stays a true
  comparison. It should be deleted with the archive, not migrated.
- No visual-regression harness exists, so nothing prevents the next silent drift. A
  contrast unit test over the token set would be the cheapest guard.
- The brand-hue question (pink vs a deeper institutional ground) is deferred, not closed.
