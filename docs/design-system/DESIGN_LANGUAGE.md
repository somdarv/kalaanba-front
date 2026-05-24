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

### 3.1 Motion is feedback, not decoration

- **State changes (CSS)**: hover, focus, press, disabled — every interactive primitive owns these in CSS. No JS, no Framer. Reasons: zero hydration cost, SSR-correct, accessible without React state.
- **Orchestration (Framer Motion)**: page transitions, dialog enter/exit, list reordering, chart reveals, `<LiveSurface>` aurora. Anything that involves multiple elements moving in sequence.

### 3.2 Interaction recipe (applies to every interactive primitive)

| State          | Effect                                                           |
| -------------- | ---------------------------------------------------------------- |
| Default        | Token-defined                                                    |
| Hover          | `translateY(-1px)` + border step up + (if filled) shadow step up |
| Focus-visible  | `--focus-ring` outline 2px offset 2px                            |
| Active / Press | `translate(0)` + `scale(0.985)` + shadow step down               |
| Disabled       | `opacity: 0.5` + `pointer-events: none` + `cursor: not-allowed`  |

### 3.3 Reduced motion

`prefers-reduced-motion: reduce` collapses all transitions to 1ms **except** elements marked `.kx-alive` (the LiveSurface escape hatch — opt-in).

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
