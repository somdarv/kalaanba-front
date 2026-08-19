# Kalaanba — Design Language

> **Tagline**: _Solid. Proactive. Premium._
> **Status**: Built. Token layer is v3 (OKLCH) per `ADR-0006`.
> **Last updated**: 2026-08-12 (WP-20260812-oklch-token-migration)

This document is the **source of truth** for how Kalaanba looks, moves, and responds. Every primitive, every screen, every animation must follow these rules — or update them via an ADR.

> **2026-08-12 reconciliation.** Between May and August this document drifted from the
> code, and in most cases the code had made the better call. A measured audit
> (`token-audit.html`, `ADR-0006`) resolved every conflict; the sections below now
> describe what is actually built. The three that changed materially: §2 (tokens are
> OKLCH, and brand fill is split from brand ink), §3.5 (pressables do not lift on
> hover), and §9.1 (sub-44px controls expand their hit area rather than lowering the
> floor).

---

## 1. North Star — Three Principles

### 1.1 Solid

Weight, depth, and intention in every surface. Borders carry the structure; shadows whisper, not shout. No floating, no haze, no "uncertain" elements. A user should feel the product is **built**, not assembled.

### 1.2 Proactive

The UI moves _with_ the user. Hover gives feedback before the click. Focus is loud. Pressed states are immediate. The product anticipates — search starts narrowing as you type, primary actions glow on hover, the cursor always tells you what's clickable. Nothing is passive.

### 1.3 Premium

Restraint is the brand. One primary action per viewport. Generous whitespace. Tight display tracking. Quiet defaults. The "wow" moments (aurora hero, score reveals) are deliberate, not constant. The product trusts itself enough to be calm.

---

## 2. Tokens

Tokens live in `src/app/globals.css`. **Code never references colors literally — only via these tokens.**

### 2.1 Naming convention

- Semantic, not brand-literal: `--primary` not `--pink`.
- **Colour is authored in OKLCH** (`oklch(L C H)`). L is perceptually uniform, so an equal ΔL is an equal perceived step — the property that makes a ramp checkable instead of a matter of taste. See `ADR-0006`.
- **Neutrals are hue-locked to 264.** A neutral that drifts off 264 is a bug.
- **Fill and ink are separate roles.** A colour tuned to carry a white label (L ≈ 0.55) is too dark to be legible *as text* on a dark surface, and a colour tuned for text (L ≈ 0.76) cannot carry a white label. Every brand and state colour therefore has both: `--primary` (fill) and `--primary-ink` (text/icon).
- Paired foreground/background: every fillable token gets an `--on-X` partner.
- Internal-key names are stable; the _value_ may change per theme/season.

### 2.2 Color tokens (the full set)

```
/* Ground — hue locked 264, uniform ΔL 0.040 */
--bg               oklch(0.165 0.018 264)
--surface          oklch(0.205 0.020 264)
--surface-elev     oklch(0.245 0.022 264)
--surface-overlay  oklch(0.285 0.024 264)

/* Ink */
--fg               oklch(0.970 0.005 264)
--fg-muted         oklch(0.760 0.018 264)
--fg-subtle        oklch(0.580 0.016 264)

/* Lines. --border is structural; --border-strong defines a control
   boundary and therefore clears 3:1 (WCAG 1.4.11). */
--border  --border-strong  --divider

/* Brand — fill / hover / pressed / ink. Hover is L +0.030, pressed
   L −0.050; hue and chroma hold. Never mix toward white. */
--primary  --primary-hover  --primary-pressed  --primary-ink  --on-primary
--accent   --accent-hover   --accent-pressed   --accent-ink   --on-accent

/* State — adjacent hues are >= 40 degrees apart */
--success  --success-hover  --success-pressed  --success-ink  --on-success
--warning  --warning-ink    --on-warning
--danger   --danger-hover   --danger-pressed   --danger-ink   --on-danger

/* Live — in-play matches ONLY. One electric hue, rationed so it still
   means something. Consumed only by <LiveIndicator>. */
--live  --live-ink  --on-live

/* Focus — its own hue (200), never the brand. Paired with
   outline-offset it lands on the ground behind the control. */
--ring  --focus-ring  --ring-offset
```

Hue map: primary 350 · danger 30 · warning 75 · success 150 · live 195 · accent 245.

**Rule:** every color token MUST be registered in `@theme inline` so Tailwind utilities exist (`bg-primary`, `text-primary-ink`, `border-border-strong`, etc.).

**Rule:** a filled control MUST clear 4.5:1 against its own label, in every state.

### 2.3 Shape tokens

The scale has a tight end and a generous end. Dense data (fixture rows, table cells) takes the tight end; panels take the generous end. Using card radii for data rows is what makes football data read as consumer app.

```
--radius-row      0.625rem  /* 10px — list + fixture rows, table cells */
--radius-control  0.75rem   /* 12px — inputs, selects, textarea */
--radius-card     1.25rem   /* 20px — cards */
--radius-panel    1.75rem   /* 28px — hero / feature panels */
--radius-pill     999px     /* buttons, chips, filters, status */
```

### 2.4 Elevation — _recipes_, not loose shadows

Premium = combined recipes. Each tier is a **prescription**: background + border + shadow + optional inset highlight.

| Tier         | Use cases                           | Recipe                                                                       |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------- |
| **flat**     | Inline regions, list rows, dividers | `bg-surface` + `border-border`                                               |
| **raised**   | Cards, panels, sticky bars          | `bg-surface-elev` + `border-border` + `--highlight-inset` + `shadow-sm`      |
| **floating** | Modals, popovers, toasts, dropdowns | `bg-surface-overlay` + `border-border-strong` + `shadow-lg` + `blur(18px)`   |

The inset top highlight on `raised` and the blur on `floating` are what separate this from "flat web".

**These are implemented as `.elev-flat` / `.elev-raised` / `.elev-floating` in `globals.css`.** Compose the class; do not re-derive the recipe. `<Card tone>` is the typed entry point.

The tiers only read because the ground ramp steps by a uniform ΔL 0.040. In v2 the `surface → surface-elev` step was ΔL 0.022 and "raised" was invisible, which is how `Card` ended up collapsing all three tiers into one.

### 2.5 Motion tokens

Canonical values live in **§3.2** — that is the single definition. (This section previously listed a second, conflicting set: `cubic-bezier(0.16, 1, 0.3, 1)` at 140ms/320ms. The code follows §3.2; the duplicate is removed.)

### 2.6 Typography

- **Display**: `Sora` — hero 64/1.05 tracking `-0.025em`, h1 40/1.1 `-0.02em`, h2 32/1.15 `-0.015em`. **Tight tracking on display is non-negotiable** — it's the single biggest "premium" signal.
- **Body**: `Inter` — 16/1.55 default, 14/1.5 secondary, 12 uppercase `0.14em` for eyebrows (`<Eyebrow>`).
- **Numeric**: `--font-numeric-features` (`"tnum" 1, "cv11" 1, "ss01" 1`), applied via the `.kx-numeric` class and owned by `<StatValue>`. Do not reach for Tailwind's `tabular-nums` directly in a component — that is what left ten call sites each holding their own half of this rule.

---

## 3. Motion Rules

### 3.1 Feel — _cozy yet authoritative_

Motion should feel like a well-built physical control: a soft, welcoming arrival and a confident, firm settle. Never spongy, never abrupt. The product should breathe, not bounce.

### 3.2 Motion tokens (canonical — register all in `@theme inline`)

```
/* Easings */
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1);   /* default — soft landing */
--ease-entrance: cubic-bezier(0.16, 1.05, 0.4, 1); /* hint of overshoot for arrivals */
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);       /* confident, snappy exit */

/* Durations */
--dur-quick:      160ms;  /* state changes (hover, focus, press) */
--dur-graceful:   280ms;  /* entries, transitions */
--dur-deliberate: 420ms;  /* large overlays (sheets, dialogs) */
```

Animations ≤ 240ms on small screens — slow eases feel laggy on a phone. The motion utilities ship `@media (max-width: 640px)` overrides that drop graceful/deliberate by ~15%.

### 3.3 Where motion lives

- **State changes → CSS.** Hover, focus, press, disabled — every interactive primitive owns these in plain CSS. Zero hydration cost, SSR-correct, accessible without React state.
- **Orchestration → Framer Motion.** Page transitions, dialog enter/exit, list reordering, chart reveals, `<LiveSurface>` aurora. Anything that involves multiple elements moving in sequence.
- **Framer is lazy-loaded** per route shell that needs it — never imported at the root.

### 3.4 Animatable properties

- **Default**: `transform` and `opacity` only — GPU-composited, free.
- **Allowed exception**: `width` / `height` / `max-height` for special components where the geometric change _is_ the animation (e.g. accordion, expanding card, growth bar). These are expensive — keep them under `--dur-graceful`, never run them in lists, and pair with `will-change` only while animating.
- **Never animated**: `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-width`.

### 3.5 Interaction recipe (applies to every interactive primitive)

Both touch and pointer matter — Kalaanba runs on phones and on desk admin tools. Hover is desktop-only; tap state is universal. The CSS below guarantees both.

| State                            | Effect                                                                    |
| -------------------------------- | ------------------------------------------------------------------------- |
| Default                          | Token-defined                                                             |
| Hover                            | Fill steps to its `-hover` token (L +0.030); borders step to `-strong`. **No positional motion.** |
| Focus-visible                    | `--focus-ring` outline 2px, offset 2px                                    |
| Active / Press (touch + desktop) | `scale(0.99)` + fill steps to `-pressed` (L −0.050) + `--shadow-pressed` inset |
| Disabled                         | `opacity: 0.5` + `cursor: not-allowed`                                    |

**Revised 2026-05, confirmed 2026-08.** This table previously specified `translateY(-1px)` on hover. `pressableBase` deliberately does not implement it: pressables stay anchored in space, and the press-compression carries the tactility instead — a 1% scale-down is 1:1 with the user's physical intent and reads as tactile rather than synthetic. The code was right; the doc is now corrected.

Because hover is a pure colour change with no positional component, it does not stick on touch after a tap, and no `@media (hover: hover)` guard is required for it. Any effect that *does* move or reveal something still needs that guard. Active state remains the primary feedback channel on touch.

The focus ring uses its own hue (200), never the brand. v2 used `--primary` at 35% alpha, which put a pink ring on the pink primary button — 1.00:1 against its own fill, i.e. invisible exactly where it mattered most.

### 3.6 Reduced motion

`prefers-reduced-motion: reduce` collapses all transitions to 1ms **except** elements marked `.kx-alive` (the LiveSurface escape hatch — opt-in).

### 3.7 Tap discipline

- `-webkit-tap-highlight-color: transparent` is set globally; the `:active` recipe replaces it.
- Focus rings appear via `:focus-visible` only (no ring on tap, ring on keyboard).

---

## 4. Component System

### 4.1 Catalogue (target — built per REBUILD_PLAN)

**Primitives** (`src/components/ui/`):

- `Button` — variants `primary | secondary | ghost | danger`, sizes `sm | md | lg`, with leading/trailing icon + loading.
- `IconButton` — circular, same variants/sizes.
- `Card` — `flat | raised`, `interactive` flag.
- `TextField` — label, hint, error, left icon, right slot. `SearchField` preset.
- `Select` — token-styled native or headless.
- `Checkbox` / `Radio` / `Switch` — custom styled.
- `Badge` — variants tied to state colors.
- `Avatar` — sizes + initials fallback.
- `Tooltip` — `floating` recipe.
- `Dialog` / `Sheet` — `floating` recipe + Framer enter/exit.
- `Toast` — `floating` recipe + slide-in.
- `Tabs` — segmented + underlined variants.
- `Skeleton` — shimmer animation only here, gated by `--dur-graceful`.
- `Pressable` — single source of truth for the touch+hover interaction recipe (active scale, hover-guard, tap-highlight kill, focus-visible ring). Every other interactive primitive composes this rather than reimplementing.

**Mobile chrome** (`src/components/ui/` — first-class, not afterthoughts):

- `BottomSheet` — primary modal surface on mobile. Swipe-to-dismiss, optional snap points, safe-area aware. On desktop (`@media (min-width: 768px)`) degrades to a centered `Dialog`. Both share the same `Overlay` base.
- `BottomNav` — primary navigation on mobile, anchored to the thumb zone, `env(safe-area-inset-bottom)`-padded. On desktop, swaps to a top/side nav.
- `KeyboardFooter` — sticky CTA bar that lifts above the on-screen keyboard (via `interactiveWidget=resizes-content` + safe-area). Used on login, checkout, OTP entry, any single-purpose form.
- `Toast` — anchored bottom-center on mobile, top-right on desktop. Above safe-area inset.

**Football primitives** (`src/components/ui/` — added 2026-08-12, `ADR-0006`):

The system was strong on generic app furniture and empty on the domain — there was no way to render the object the product exists to render. All six are purely presentational per §4.2: they accept props and render markup, never fetch, and never compute (Constitution Law 3).

- `Eyebrow` — the 12px uppercase tracked label.
- `StatValue` / `StatBlock` — numeric display; sole owner of `.kx-numeric`.
- `Crest` — club identity at consistent scale. Distinct from `Avatar`: a crest is an institution, is not round, and sits on a neutral plate so light and dark marks both read. Initials fallback is the common case for grassroots clubs, not the exception.
- `LiveIndicator` — the in-play signal and the only permitted consumer of `--live`.
- `ScoreLine` — two crests, two display-scale numerals, a status. Marks anything outside `result_confirmed` as provisional (Law 7).
- `FixtureRow` — the dense, tappable atom of every fixture list.

`ScoreLine` and `FixtureRow` key on stable internal status strings (`scheduled`, `live`, `result_confirmed`, …) and take display labels as props, per Law 4. They never render a hardcoded status string.

**Composed pieces** (`src/components/site/` or `src/components/<feature>/`):

- `<LiveSurface variant="aurora" | "mesh" | "glass">` — the one opt-in flourish primitive that rehouses the aurora/mesh keyframes. Used on landing/hero only. (Currently lives in `ui/`.)

### 4.2 Naming & layering

- Primitives are **headless of feature logic** — they accept props, render markup, do not fetch.
- Hooks live in `src/hooks/`. Components consume hooks.
- API access lives in `src/lib/api/`. Generated from OpenAPI where possible.
- No business calculation in UI (per Constitution Law 3).

### 4.3 Composition rules

- **One primary action per viewport.** Two filled `Button variant="primary"` in the same screen = design bug.
- **Status colors never appear on default CTAs.** Pink is brand; success/warning/danger only on data.
- **Border-strong carries depth before shadow does.** If a card looks flat with just `border-strong + inset highlight`, do not add a shadow.

---

## 5. Theming Future

The runtime theme switcher was removed in this session because it stuttered and felt cheap (see `JOURNAL.md` 2026-05-24). The CSS still ships both dark + light token blocks under `:root` and `:root[data-theme="light"]`.

When we rebuild:

- **System-resolved by default.** No FOUC because the user's chosen value is set via cookie + server-rendered on first paint.
- **Explicit choice** stored as `theme=auto|light|dark` cookie. SSR reads it, sets `data-theme` on `<html>` before hydration.
- **UI surface**: a 3-state segmented control (`Auto / Light / Dark`) in **settings only** — never header chrome. That's the single biggest cure for the "cheap toggle" feel.

ADR will be drafted before implementation.

---

## 6. Accessibility (non-negotiable)

- Every interactive element keyboard-reachable.
- Focus rings preserved (never `outline: none` without a replacement).
- Color is never the only signal — pair with icon, label, or shape.
- Contrast: body text ≥ 4.5:1, large display ≥ 3:1, focus ring ≥ 3:1 against adjacent surfaces.
- All images with semantic content have meaningful `alt`. Decorative images have `alt=""`.
- Reduced-motion respected globally; LiveSurface explicitly opts in via `.kx-alive`.

---

## 7. What's archived (do not copy)

`src/components/_archive/` and `src/app/legacy/` preserve the previous "kx-\*" language for visual reference. **Do not import from these paths in new code.** They are excluded from typecheck/eslint and may rot. The `/legacy/showcase` route stays built so designers can compare old vs new.

---

## 8. Change process

- Token additions or renames → ADR in `docs/adr/`.
- New primitive → entry in `REBUILD_PLAN.md` + storybook-style page in `src/app/(internal)/design/` (future).
- Motion or color tweaks → bump version stamp at top of this file + journal entry.

---

## 9. Mobile-first rules (mandatory)

Kalaanba is consumed primarily on phones. Every primitive, layout, and screen ships mobile-first; desktop is a progressive enhancement.

### 9.1 Touch targets

- **Minimum hit area: 44 × 44 px** (iOS HIG). 48 × 48 preferred for primary actions.
- Visual size may be smaller; the hit area is padded out with invisible space.
- This applies to **every** interactive: buttons, icon buttons, chips, badges-as-links, tab labels, list rows, close affordances. Sub-44 hit areas are a refusal trigger.

**Mechanism (mandatory).** A control whose visual box is under 44px uses `tapExpand`
(the `.kx-tap-expand` class), which grows the *pointer* target with a pseudo-element and
leaves layout untouched. It must **not** simply lower `min-h-*`.

This is not a style preference — it is load-bearing. `cn` is `twMerge`, so a size class
composed after `pressableBase` wins the conflict: `min-h-9` silently beat the `min-h-11`
floor, and v2 shipped 36px Button `sm`, 28px Chip `sm`, and 36px Accept/Decline actions
on a phone. `.kx-tap-expand` is deliberately not a Tailwind utility, so `twMerge` cannot
drop it and layer order cannot demote it.

Do not apply it to a control that wraps other interactive elements — the pseudo-element
would sit over them.

### 9.2 Viewport & layout

- Use `100dvh`, **never** `100vh` (fixes iOS Safari URL-bar collapse jitter).
- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover, interactiveWidget=resizes-content`.
- Container edge padding: `padding-inline: max(1rem, env(safe-area-inset-left/right))`.
- Sticky bottom bars: `padding-bottom: env(safe-area-inset-bottom)`.
- Design first at **360 px** width (smallest common Android); breakpoints `sm 640`, `md 768`, `lg 1024`, `xl 1280` are progressive enhancements.
- Density: mobile = comfortable default; desktop opts into compact via `@media (min-width: 1024px)`.

### 9.3 Form inputs (iOS zoom trap)

- Inputs use `font-size: max(16px, 1rem)`. Below 16 px iOS auto-zooms on focus — never acceptable.
- Token: `--font-input: max(16px, 1rem)` — TextField composes this.
- Every `<input>` declares `inputmode`, `autocomplete`, and `enterkeyhint` appropriate to its purpose (TextField API enforces or warns).
- Single-CTA forms (login, OTP, checkout) wrap the action in `<KeyboardFooter>` so it stays visible above the keyboard.

### 9.4 Theme & system chrome

- `<meta name="theme-color">` is paired (`media="(prefers-color-scheme: dark)"` and `light`) and updated dynamically when the user picks an explicit theme. iOS status bar and Android system bar then follow.
- `color-scheme: dark light` on `:root` so native form controls render in the right palette.
- PWA-future: `apple-mobile-web-app-status-bar-style` set when manifest ships.

### 9.5 Gestures & scroll

- `overscroll-behavior: contain` on scroll regions inside sheets and lists — kills pull-to-refresh hijacks and bounce leak.
- Sheets dismiss via swipe-down on touch (Framer drag handlers); on desktop, dismiss via Escape + backdrop click.
- No long-press-to-select on UI chrome — `user-select: none` on headers, nav, buttons.

### 9.6 Performance budget

- Animations ≤ 240 ms on small screens (see §3.2 token override).
- Framer Motion is **lazy-loaded** per route — never imported at the root.
- Images: `next/image` with explicit dimensions; never raw `<img>` for content.
- Bundle: keep landing route's first-load JS under 150 kB gzipped.

### 9.7 Definition of "mobile-ready"

A primitive or screen is mobile-ready when **all** of the following hold:

1. Renders correctly at 360 px width with no horizontal scroll.
2. Every interactive hit area ≥ 44 × 44 px.
3. Hover effects are wrapped in `@media (hover: hover) and (pointer: fine)`.
4. Active/press state is visible without hover.
5. If it contains a sticky bottom element, it pads with `env(safe-area-inset-bottom)`.
6. If it contains form inputs, font-size ≥ 16 px and a sticky CTA pattern is used for single-purpose forms.
7. Reduced-motion honored.

QA (Stage 8) refuses sign-off if any of the seven are missing.
