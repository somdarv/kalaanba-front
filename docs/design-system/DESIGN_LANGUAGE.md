# Kalaanba — Design Language

> **Tagline**: _Solid. Proactive. Premium._
> **Status**: Spec — implementation begins per `REBUILD_PLAN.md`.
> **Last updated**: 2026-05-24

This document is the **source of truth** for how Kalaanba looks, moves, and responds. Every primitive, every screen, every animation must follow these rules — or update them via an ADR.

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
- Paired foreground/background: every fillable token gets an `--on-X` partner. Example: `--primary` (bg) ↔ `--on-primary` (text/icon color readable on it). Swap the brand color, every pairing rebalances.
- Internal-key names are stable; the _value_ may change per theme/season.

### 2.2 Color tokens (the full set)

```
/* Brand */
--primary             /* the seed action color — today f55694 (pink) */
--primary-hover       /* lighten 4% */
--primary-pressed     /* darken 6% */
--on-primary          /* foreground on primary bg */

--accent              /* secondary brand — today 56b7f5 (blue) */
--on-accent

/* Neutrals */
--bg                  /* canvas */
--surface             /* default raised surface (cards, sheets) */
--surface-elev        /* one step higher (hover, nested cards) */
--surface-overlay     /* modals, popovers, toasts (with blur) */
--fg                  /* primary text */
--fg-muted            /* secondary text */
--fg-subtle           /* tertiary / disabled text */

/* Lines */
--border              /* default 1px line — barely there */
--border-strong       /* emphasised line / hover state */
--divider             /* horizontal rule */

/* State */
--success     --on-success
--warning     --on-warning
--danger      --on-danger

/* Focus */
--focus-ring          /* always derived from --primary at ~35% alpha */
```

**Rule:** every color token MUST be registered in `@theme inline` so Tailwind utilities exist (`bg-primary`, `text-on-primary`, `border-border-strong`, etc.).

### 2.3 Shape tokens

```
--radius-pill       999px
--radius-button     1.1rem    /* ~17.6px */
--radius-control    1.25rem   /* inputs, chips */
--radius-card       1.6rem
--radius-card-lg    2rem      /* hero / feature cards */
```

### 2.4 Elevation — _recipes_, not loose shadows

Premium = combined recipes. Each tier is a **prescription**: background + border + shadow + optional inset highlight.

| Tier         | Use cases                           | Recipe                                                                                                      |
| ------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **flat**     | Inline regions, list rows, dividers | `bg-surface` + `border-border`                                                                              |
| **raised**   | Cards, panels, sticky bars          | `bg-surface-elev` + `border-border-strong` + `shadow-md` + inset highlight `0 1px 0 rgba(255,255,255,0.04)` |
| **floating** | Modals, popovers, toasts, dropdowns | `bg-surface-overlay` + `border-border-strong` + `shadow-lg` + `backdrop-blur(18px)`                         |

The inset top highlight on `raised` and the blur on `floating` are what separate this from "flat web".

### 2.5 Motion tokens

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* the only public easing */
--dur-quick:    140ms                         /* state changes (hover, press, focus) */
--dur-graceful: 320ms                         /* enter / exit, sheet open, modal */
```

One ease, two durations. Anything outside this needs justification.

### 2.6 Typography

- **Display**: `Sora` — hero 64/1.05 tracking `-0.025em`, h1 40/1.1 `-0.02em`, h2 32/1.15 `-0.015em`. **Tight tracking on display is non-negotiable** — it's the single biggest "premium" signal.
- **Body**: `Inter` — 16/1.55 default, 14/1.5 secondary, 12 uppercase `0.14em` for eyebrows.
- **Numeric**: tabular-nums + stylistic set on score/stat components only (`font-feature-settings: "tnum" 1, "cv11" 1`).

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

| State                            | Effect                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| Default                          | Token-defined                                                                       |
| Hover (`@media (hover: hover)`)  | `translateY(-1px)` + border step up + (if filled) shadow step up — desktop/pen only |
| Focus-visible                    | `--focus-ring` outline 2px offset 2px                                               |
| Active / Press (touch + desktop) | `translate(0)` + `scale(0.985)` + tint shift + shadow step down                     |
| Disabled                         | `opacity: 0.5` + `pointer-events: none` + `cursor: not-allowed`                     |

Hover effects **must** be wrapped in `@media (hover: hover) and (pointer: fine)` so they don't stick on touch devices after a tap. Active state is the primary feedback channel on touch.

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

**Composed pieces** (`src/components/site/` or `src/components/<feature>/`):

- `<LiveSurface variant="aurora" | "mesh" | "glass">` — the one opt-in flourish primitive that rehouses the aurora/mesh keyframes. Used on landing/hero only.
- `<Eyebrow>` — the 12px uppercase tracked label.
- `<StatBlock>` — numeric display with tabular-nums.

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
- Visual size may be smaller; the hit area is padded out with invisible space (`min-h-11 min-w-11` or equivalent).
- This applies to **every** interactive: buttons, icon buttons, chips, badges-as-links, tab labels, list rows, close affordances. Sub-44 hit areas are a refusal trigger.

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
