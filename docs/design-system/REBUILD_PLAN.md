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

- [x] Rename brand tokens to semantic in `globals.css`: `--pink`/`--blue` retained as literal source, semantic `--primary` / `--accent` aliases added (keeps `--kx-*` aliases for archive).
- [x] Add missing tokens per `DESIGN_LANGUAGE.md` §2.2: `--primary-hover` (color-mix), `--primary-pressed` (color-mix), `--surface-elev`, `--surface-overlay`, `--fg-subtle`, `--focus-ring`, `--on-primary`, `--on-accent`.
- [x] Register **every** semantic token in `@theme inline` so Tailwind utilities resolve: `bg-primary`, `bg-primary-hover`, `bg-primary-pressed`, `text-on-primary`, `bg-accent`, `text-on-accent`, `bg-surface-elev`, `bg-surface-overlay`, `text-fg-subtle`, `outline-focus-ring`, etc.
- [x] Add motion tokens: `--ease-out`, `--ease-entrance`, `--ease-exit`, `--dur-quick (160ms)`, `--dur-graceful (280ms)`, `--dur-deliberate (420ms)`. Mobile override (`@media (max-width: 640px)`) shaves graceful → 240ms, deliberate → 360ms.
- [x] Add input token: `--font-input: max(16px, 1rem)` and Tailwind alias `--text-input` (prevents iOS zoom on focus).
- [x] Set globals: `-webkit-tap-highlight-color: transparent` on `body`, `color-scheme: dark light` on `:root`, `.kx-chrome` opt-in class for `user-select: none` on chrome elements.
- [ ] Add elevation utility classes for the three recipes (`.elev-flat`, `.elev-raised`, `.elev-floating`) — deferred to Phase 2 where they'll be co-built with Card.
- [x] Update `app/page.tsx` to use the new token names so the landing button actually fills.
- [x] `npm run build` green; visually inspect `/`.

**Exit criteria**: every utility class referenced in markup resolves. Landing button has a pink fill, lifts on desktop hover only, presses on tap, focus-ring on keyboard. ✅

---

## Phase 2 — Primitives (the core four)

Build in this order — each unblocks the next.

### 2.1 Pressable (build first — every other primitive composes it)

- [ ] Single source of truth for the interaction recipe in `DESIGN_LANGUAGE.md` §3.5.
- [ ] Wraps hover effects in `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.
- [ ] Active/press state: `scale(0.985)` + tint shift + shadow step down — visible on both touch and desktop.
- [ ] `:focus-visible` ring (no ring on tap, ring on keyboard).
- [ ] `min-h-11 min-w-11` enforced for hit area ≥ 44×44 px.
- [ ] Unit test: hover doesn't apply on `(hover: none)` simulated viewport.

### 2.2 Button + IconButton

- [ ] Composes `Pressable`.
- [ ] Variants: `primary | secondary | ghost | danger`.
- [ ] Sizes: `sm (h-11) | md (h-12) | lg (h-13)` — sm is **44 px floor**, not 36 px. Use padding to vary visual weight.
- [ ] States: hover-lift (desktop only), focus-ring, active-scale, loading, disabled.
- [ ] Leading/trailing icon slots.
- [ ] `IconButton` shares the variant matrix but is square + circular, min 44×44.
- [ ] Unit test: keyboard navigation, disabled blocks click, loading suppresses click, hit area ≥ 44×44.

### 2.3 Card

- [ ] Tones: `flat | raised` (recipes from §2.4).
- [ ] `interactive` flag → composes `Pressable` for hover lift + border-strong (desktop) + active state (touch).
- [ ] Sub-components: `Card.Header`, `Card.Content`, `Card.Footer`.
- [ ] Inset top highlight on `raised`.

### 2.4 TextField + SearchField

- [x] Label, hint, error, left icon, right slot.
- [x] Sizes: `md (h-12) | lg (h-13)` — input min-height 44 px.
- [x] **`font-size: var(--font-input)`** (≥ 16 px) on the input itself to prevent iOS zoom.
- [x] API requires `inputMode`, `autoComplete`, `enterKeyHint` (typed props; dev warning if missing on a known semantic field).
- [x] Focus state: border-primary + ring inset + label color shift.
- [x] Error state: border-danger + ring-danger + message color.
- [x] `SearchField` preset (search icon + clear button when value; `enterKeyHint="search"`).

### 2.5 Badge + Avatar

- [x] `Badge` variants tied to state colors (`neutral | primary | success | warning | danger`).
- [x] `Avatar` sizes (`sm | md | lg | xl`) + initials fallback + ring on hover (desktop only).

**Exit criteria**: all five primitives exported from `src/components/ui/index.ts`, used on a private design-preview page at `src/app/(internal)/design/page.tsx` for visual QA at 360px and 1280px.

---

## Phase 2.5 — Mobile chrome (first-class, not afterthoughts)

Kalaanba runs primarily on phones. These primitives are part of the foundation, not later additions.

- [ ] **`Overlay`** — shared base for sheets/dialogs: backdrop, focus-trap, Escape handling, scroll-lock with `overscroll-behavior: contain`.
- [ ] **`BottomSheet`** — primary modal surface on mobile. Swipe-to-dismiss (Framer drag handlers), optional snap points, safe-area-aware (`padding-bottom: env(safe-area-inset-bottom)`). On `@media (min-width: 768px)` becomes a centered `Dialog` (same component, different presentation).
- [ ] **`BottomNav`** — anchored to thumb zone, 44×44 tap targets, safe-area-padded. Hides on desktop (≥ 1024 px) where top/side nav takes over.
- [ ] **`KeyboardFooter`** — sticky CTA bar that stays above the on-screen keyboard. Uses `interactiveWidget=resizes-content` viewport meta + `env(safe-area-inset-bottom)`. Required pattern for login, OTP, single-purpose forms.
- [ ] **`Toast`** — bottom-center on mobile, top-right on desktop. Above safe-area.
- [ ] Global viewport meta set in `app/layout.tsx`: `width=device-width, initial-scale=1, viewport-fit=cover, interactiveWidget=resizes-content`.
- [ ] Global app shell uses `min-h-dvh` not `min-h-screen`.
- [ ] `<meta name="theme-color">` pair (dark + light media-queried) in layout head.

**Exit criteria**: design-preview page demonstrates BottomSheet, BottomNav, KeyboardFooter, Toast working at 360 px. No horizontal scroll on any preview at 360 px. iOS Safari URL-bar collapse no longer jitters layout.

---

## Phase 3 — Overlays & feedback

- [ ] `Tooltip` (Floating UI or Radix) — desktop-only (hover-gated); on touch becomes a long-press popover or is suppressed.
- [ ] `Dialog` — desktop centered modal (`BottomSheet`'s desktop face, shared `Overlay`).
- [ ] (`BottomSheet` and `Toast` already shipped in Phase 2.5.)
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

A primitive ships only when **all** of the following hold:

1. ✅ Implements every state from `DESIGN_LANGUAGE.md §3.5`.
2. ✅ Keyboard-accessible without mouse.
3. ✅ Focus-visible ring present, contrast ≥ 3:1.
4. ✅ Reduced-motion respected.
5. ✅ Unit test for interaction + a11y attribute.
6. ✅ Appears on the internal design-preview page.
7. ✅ No `_archive/` import.
8. ✅ Uses only tokens (no hardcoded colors, durations, or sizes).
9. ✅ **Mobile-ready per `DESIGN_LANGUAGE.md §9.7`**: renders at 360 px width with no horizontal scroll; every hit area ≥ 44×44 px; hover effects guarded by `@media (hover: hover) and (pointer: fine)`; active/press state visible without hover; safe-area-padded if sticky-bottom; `font-size ≥ 16px` on any input it contains.

---

## Session log

Tick boxes above as each session lands work. Append a one-line note here per session for traceability — Sankofa will also log in `JOURNAL.md`.

- **2026-05-24** — Plan authored. `src/components/ui/` cleared. Ready for Phase 1.
- **2026-05-24** — Mobile-first + cozy/authoritative folded into DESIGN_LANGUAGE §3 / §9; new Phase 2.5 added; `design-system-mandatory.instructions.md` created.
- **2026-05-24** — **Phase 1 complete.** Semantic tokens registered, motion tokens (3 eases × 3 durations + mobile override) live, `--font-input` token added, tap-highlight killed, `color-scheme: dark light`. Landing button rebuilt with full interaction recipe. Build ✅ / tests ✅ (1 file, 8 tests).
