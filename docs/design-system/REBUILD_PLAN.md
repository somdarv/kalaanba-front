# UI Foundation — Rebuild Plan

> **Goal**: Rebuild the component system from scratch on top of the design language in `DESIGN_LANGUAGE.md`. Result: a small, sharp, premium UI kit that ships with the rest of Phase 1.
> **Status**: Ready to begin.
> **Last updated**: 2026-05-24

This document is **the** checklist for the rebuild. Each session ticks one or more boxes. Don't skip ahead.

---

## Pre-flight (current state — 2026-05-24)

- ✅ Old theme system (provider, toggle, bootstrap script) removed.
- ✅ CSS light + dark token blocks preserved in `globals.css`.
- ✅ Design language spec written (`DESIGN_LANGUAGE.md`).
- ✅ Archive (`_archive/`) preserved; `/legacy/showcase` route still builds.
- ⏳ `src/components/ui/` cleared (this session) — see Phase 0 below.

---

## Phase 0 — Reset

- [x] Move `_archive/` reference to design-system docs.
- [x] Clear `src/components/ui/` (delete current broken primitives + barrel).
- [x] Confirm `/legacy/showcase` still renders via `_archive/`.
- [x] Confirm `app/page.tsx` still renders (or stub a placeholder if it imported now-deleted code).
- [x] `npm run build` green.

**Exit criteria**: clean slate. No live UI primitives in `src/components/ui/`. Legacy showcase still browsable for reference.

---

## Phase 1 — Tokens

- [ ] Rename brand tokens to semantic in `globals.css`: `--pink`/`--blue` → `--primary`/`--accent` (keep `--kx-*` aliases for archive).
- [ ] Add missing tokens per `DESIGN_LANGUAGE.md` §2.2: `--primary-hover`, `--primary-pressed`, `--surface-elev`, `--surface-overlay`, `--fg-subtle`, `--focus-ring`.
- [ ] Register **every** semantic token in `@theme inline` so Tailwind utilities resolve: `bg-primary`, `text-on-primary`, `border-border-strong`, `bg-surface-elev`, etc.
- [ ] Add motion tokens: `--dur-quick`, `--dur-graceful`. Make `--ease-out` the single public ease.
- [ ] Add elevation utility classes for the three recipes (`.elev-flat`, `.elev-raised`, `.elev-floating`) — or commit to Tailwind utility recipes only.
- [ ] Update `app/page.tsx` to use the new token names so the landing button actually fills.
- [ ] `npm run build` green; visually inspect `/`.

**Exit criteria**: every utility class referenced in markup resolves. Landing button has a pink fill.

---

## Phase 2 — Primitives (the core four)

Build in this order — each unblocks the next.

### 2.1 Button + IconButton

- [ ] Variants: `primary | secondary | ghost | danger`.
- [ ] Sizes: `sm (h-9) | md (h-11) | lg (h-13)`.
- [ ] States: hover-lift, focus-ring, active-scale, loading, disabled.
- [ ] Leading/trailing icon slots.
- [ ] `IconButton` shares the variant matrix but is square + circular.
- [ ] Unit test: keyboard navigation, disabled blocks click, loading suppresses click.

### 2.2 Card

- [ ] Tones: `flat | raised` (recipes from §2.4).
- [ ] `interactive` flag → hover lift + border-strong.
- [ ] Sub-components: `Card.Header`, `Card.Content`, `Card.Footer`.
- [ ] Inset top highlight on `raised`.

### 2.3 TextField + SearchField

- [ ] Label, hint, error, left icon, right slot.
- [ ] Sizes: `md (h-11) | lg (h-13)`.
- [ ] Focus state: border-primary + ring inset + label color shift.
- [ ] Error state: border-danger + ring-danger + message color.
- [ ] `SearchField` preset (search icon + clear button when value).

### 2.4 Badge + Avatar

- [ ] `Badge` variants tied to state colors (`neutral | primary | success | warning | danger`).
- [ ] `Avatar` sizes (`sm | md | lg | xl`) + initials fallback + ring on hover.

**Exit criteria**: all four primitives exported from `src/components/ui/index.ts`, used on a private design-preview page at `src/app/(internal)/design/page.tsx` for visual QA.

---

## Phase 3 — Overlays & feedback

- [ ] `Tooltip` (Floating UI or Radix).
- [ ] `Dialog` (Radix headless + Framer enter/exit).
- [ ] `Sheet` (mobile bottom sheet variant of Dialog).
- [ ] `Toast` (Sonner or custom; `floating` recipe).
- [ ] Reduced-motion check on all four.

---

## Phase 4 — Form & navigation

- [ ] `Select` (Radix or headless).
- [ ] `Checkbox`, `Radio`, `Switch`.
- [ ] `Tabs` (segmented + underline variants).
- [ ] `Skeleton` (shimmer keyframe).
- [ ] React Hook Form integration helpers.

---

## Phase 5 — Living surfaces

- [ ] `<LiveSurface variant="aurora" | "mesh" | "glass">` — wraps the existing aurora/mesh keyframes from `globals.css` as a clean primitive.
- [ ] Reduced-motion behaviour documented (opt-in via `.kx-alive`).
- [ ] One use case demoed on a hero block.

---

## Phase 6 — Theme switcher v3

- [ ] ADR drafted: cookie-based SSR-stable choice, no client bootstrap.
- [ ] Cookie middleware reads `theme=auto|light|dark`, sets `data-theme` on `<html>` at SSR.
- [ ] Settings page: segmented control (`Auto / Light / Dark`).
- [ ] **No header chrome toggle.** Settings only.
- [ ] Visual QA on both themes across all primitives.

---

## Phase 7 — Composed site shell

- [ ] `<SiteHeader>` (live replacement of `_archive/site/site-header.tsx`).
- [ ] `<SiteFooter>`.
- [ ] Landing hero using `<LiveSurface variant="aurora">` for the one wow moment.
- [ ] Decommission `/legacy/showcase` route (or keep behind a feature flag).

---

## Definition of done — per-component

A primitive ships only when:

1. ✅ Implements every state from `DESIGN_LANGUAGE.md §3.2`.
2. ✅ Keyboard-accessible without mouse.
3. ✅ Focus-visible ring present, contrast ≥ 3:1.
4. ✅ Reduced-motion respected.
5. ✅ Unit test for interaction + a11y attribute.
6. ✅ Appears on the internal design-preview page.
7. ✅ No `_archive/` import.
8. ✅ Uses only tokens (no hardcoded colors, durations, or sizes).

---

## Session log

Tick boxes above as each session lands work. Append a one-line note here per session for traceability — Sankofa will also log in `JOURNAL.md`.

- **2026-05-24** — Plan authored. `src/components/ui/` cleared. Ready for Phase 1.
