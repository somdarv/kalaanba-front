---
description: "Always-on rule: before writing, reviewing, or modifying any UI / CSS / Tailwind / component / layout code in kalaanba-front, READ docs/design-system/DESIGN_LANGUAGE.md (and REBUILD_PLAN.md when scaffolding new primitives) and CITE the specific section you relied on."
applyTo: "kalaanba-front/**"
---

# Design System Is Mandatory

The Kalaanba design system documents under `docs/design-system/` are the **source of truth** for how the product looks, moves, and responds. They are layered on top of `engineering-standards.instructions.md` §5 (Frontend Best Practices) — never in place of them.

Treat the design language the same way you'd treat an engine doc: **never write UI code without first reading it.**

## When this rule fires

This rule applies to **every** turn that involves:

- Creating, editing, or reviewing any file under `src/components/`, `src/app/**/page.tsx`, `src/app/**/layout.tsx`, or `src/app/globals.css`.
- Adding Tailwind classes, custom CSS, design tokens, motion, or animations.
- Building or modifying any primitive (Button, Card, TextField, BottomSheet, etc.).
- Building or modifying any composed UI piece (site header, hero, dashboard, forms, modals, toasts, navigation).
- Touching theme behaviour (dark/light, `data-theme`, theme-color meta, color-scheme).
- Touching motion behaviour (Framer Motion, CSS transitions, keyframes, easings).
- Touching anything that renders on mobile (which is everything — Kalaanba is mobile-first).

If the turn touches the front-end UI surface at all, this rule fires.

## What you MUST do

1. **Read the canonical doc**: `docs/design-system/DESIGN_LANGUAGE.md`. At minimum the sections relevant to your change:
   - §1 Three principles — the north star (solid · proactive · premium).
   - §2 Tokens — naming convention + the full color/shape/elevation set.
   - §3 Motion rules — _cozy yet authoritative_ feel, motion tokens, where motion lives (CSS vs Framer), animatable properties, the interaction recipe (§3.5).
   - §4 Component system — what exists, what composes what.
   - §9 **Mobile-first rules (mandatory)** — touch targets, viewport, forms, theme/system chrome, gestures, perf budget, definition of "mobile-ready" (§9.7).
2. **For new primitives or larger scaffolding work**, also read `docs/design-system/REBUILD_PLAN.md` to find the right phase and the per-component Definition of Done.
3. **Cite explicitly** in your response. Format: `Per docs/design-system/DESIGN_LANGUAGE.md §<n>.<n> ...`. A bare link is not enough — quote or paraphrase the specific rule you relied on.
4. **If the doc is silent** on the point you need, say so. Then either (a) propose an ADR in `docs/adr/`, or (b) ask the user. Do **not** invent the rule.
5. **If the doc contradicts existing code**, the doc wins until an ADR overrides it. Flag the contradiction.

## Hard refusal triggers (these are bugs — refuse the request, propose the compliant fix)

You **MUST refuse** to write UI code that:

- Hardcodes a color, shadow, radius, duration, or easing instead of using a token.
- References Tailwind classes (`bg-primary`, `text-on-primary`, `ease-out`, `font-display`, etc.) that aren't registered in `@theme inline` inside `globals.css`.
- Has any interactive element with a hit area below **44 × 44 px** (DESIGN_LANGUAGE §9.1).
- Uses `100vh` instead of `100dvh` (§9.2).
- Has a hover effect not wrapped in `@media (hover: hover) and (pointer: fine)` — hover effects stick on touch (§3.5, §9.1).
- Has an `<input>` with `font-size < 16px` (iOS auto-zooms on focus — §9.3).
- Adds a sticky bottom element without `padding-bottom: env(safe-area-inset-bottom)` (§9.2).
- Animates `top` / `left` / `right` / `bottom` / `margin` / `padding` / `border-width` (§3.4). `width`/`height` is an allowed exception only for special components where the geometric change _is_ the animation (§3.4) — must be justified.
- Imports Framer Motion at the root layout (it must be lazy-loaded per route — §3.3, §9.6).
- Imports anything from `src/components/_archive/` or `src/app/legacy/` in new code (§7).
- Puts a theme-switch toggle in the header or any chrome surface (§5 — settings only).
- Uses raw `<img>` instead of `next/image` for content images.
- Uses raw `<a>` instead of `next/link` for internal routes.

## Companion docs (read alongside the design language when relevant)

- `docs/design-system/REBUILD_PLAN.md` — phased build plan + per-component Definition of Done. Required reading before scaffolding a new primitive.
- `docs/design-system/README.md` — index + reading order.
- `.github/instructions/engineering-standards.instructions.md` §5 — front-end best practices (TS strict, Zod at boundaries, RHF, TanStack Query, accessibility, etc.).
- `docs/JOURNAL.md` (read-only — Sankofa owns writes) — historical decisions and reversals, including why the v2 theme switcher was removed.
- `docs/Architecture/Build_Plan.md` — current WP-20260524-ui-rebuild entry pointing here.

## Enforcement

- Implementer (Stage 6) pre-flight checklist refuses to proceed without a design-language citation when the change touches UI.
- QA Engineer (Stage 8) refuses sign-off if the implementation fails the mobile-ready checklist (§9.7) or any refusal trigger above.
- PR template includes a "Design language cited" checkbox for UI PRs.

## Refusal trigger (the meta-rule)

If you find yourself about to write UI code without having opened `docs/design-system/DESIGN_LANGUAGE.md` this turn — **stop**. Open the doc. Then proceed.
