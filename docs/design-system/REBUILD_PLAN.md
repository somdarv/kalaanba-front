# UI Foundation — Rebuild Plan

> **Goal**: Rebuild the component system from scratch on top of the design language in `DESIGN_LANGUAGE.md`. Result: a small, sharp, premium UI kit that ships with the rest of Phase 1.
> **Status**: **Phases 0–5 shipped.** Phase 6 (theme switcher v3) and Phase 7 (site shell) open.
> **Last updated**: 2026-08-12 (WP-20260812-oklch-token-migration)

This document is **the** checklist for the rebuild. Each session ticks one or more boxes. Don't skip ahead.

> **2026-08-12 reconciliation.** These checkboxes had drifted badly: Phase 2 showed
> `Pressable`, `Button` and `Card` unticked while all three had shipped months earlier,
> and ~60 primitives were live and exported. Anyone reading this file was told the
> project was half-built when it was not. Boxes below now reflect the repository.
> Where a box is ticked but the implementation later proved wrong, that is noted rather
> than hidden — see Phase 2.3.

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
- [x] Add elevation utility classes for the three recipes (`.elev-flat`, `.elev-raised`, `.elev-floating`) — deferred to Phase 2, then dropped on the floor. Card shipped without them and collapsed all three tiers into one as a direct result. Built 2026-08-12.
- [x] Update `app/page.tsx` to use the new token names so the landing button actually fills.
- [x] `npm run build` green; visually inspect `/`.

**Exit criteria**: every utility class referenced in markup resolves. Landing button has a pink fill, lifts on desktop hover only, presses on tap, focus-ring on keyboard. ✅

---

## Phase 2 — Primitives (the core four)

Build in this order — each unblocks the next.

### 2.1 Pressable (build first — every other primitive composes it)

- [x] Single source of truth for the interaction recipe in `DESIGN_LANGUAGE.md` §3.5.
- [x] Hover needs no `@media (hover: hover)` guard — it is a pure colour change with no positional component, so nothing sticks after a tap (§3.5, revised).
- [x] Active/press state: `scale(0.99)` + fill step to `-pressed` + inset shadow — visible on both touch and desktop.
- [x] `:focus-visible` ring (no ring on tap, ring on keyboard). Own hue (200), not the brand — fixed 2026-08-12.
- [x] `min-h-11 min-w-11` enforced for hit area ≥ 44×44 px, plus `tapExpand` for controls that render visually smaller.
- [ ] Unit test: hit area ≥ 44×44 survives a size-class override.

### 2.2 Button + IconButton

- [x] Composes `Pressable`.
- [x] Variants: `primary | secondary | accent | ghost | danger | success`.
- [x] Sizes: `sm | md | lg`. **Corrected 2026-08-12** — `sm` keeps its compact 36px box but recovers a 44px *hit area* via `tapExpand`, which is what §9.1 actually asks for. It previously shipped a 36px target.
- [x] States: hover (fill step), focus-ring, active-scale, loading, disabled.
- [x] Leading/trailing icon slots.
- [x] `IconButton` shares the variant matrix, square + circular; `xs`/`sm` use `tapExpand`.
- [ ] Unit test: keyboard navigation, disabled blocks click, loading suppresses click, hit area ≥ 44×44.

### 2.3 Card

- [x] Tones: `flat | raised | floating` (recipes from §2.4).
- [x] `interactive` flag → composes `Pressable` for border-strong + surface step (hover) + active state (touch).
- [x] Sub-components: `Card.Header`, `Card.Content`, `Card.Footer`.
- [x] Inset top highlight on `raised`.

> **Shipped wrong, fixed 2026-08-12.** The first implementation declared `flat | raised`
> and resolved **both to the same string** (`bg-surface shadow-md`) — the prop was a
> no-op. It also dropped the border entirely, inverting §4.3 ("border-strong carries
> depth before shadow does"), and never implemented the inset highlight. The underlying
> ramp could not have carried three tiers anyway: `surface → surface-elev` was ΔL 0.022.
> The v3 token migration made the steps uniform, and the recipes now live in
> `globals.css` as `.elev-*` so sheets and popovers compose the same thing.

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

- [x] **`Overlay`** — shared base for sheets/dialogs: backdrop, focus-trap, Escape handling, scroll-lock with `overscroll-behavior: contain`.
- [x] **`BottomSheet`** — primary modal surface on mobile. Swipe-to-dismiss (Framer drag handlers), optional snap points, safe-area-aware (`padding-bottom: env(safe-area-inset-bottom)`). On `@media (min-width: 768px)` becomes a centered `Dialog` (same component, different presentation).
- [x] **`BottomNav`** — anchored to thumb zone, 44×44 tap targets, safe-area-padded. Hides on desktop (≥ 1024 px) where top/side nav takes over.
- [x] **`KeyboardFooter`** — sticky CTA bar that stays above the on-screen keyboard. Uses `interactiveWidget=resizes-content` viewport meta + `env(safe-area-inset-bottom)`. Required pattern for login, OTP, single-purpose forms.
- [x] **`Toast`** — bottom-center on mobile, top-right on desktop. Above safe-area.
- [x] Global viewport meta set in `app/layout.tsx`: `width=device-width, initial-scale=1, viewport-fit=cover, interactiveWidget=resizes-content`.
- [x] Global app shell uses `min-h-dvh` not `min-h-screen`.
- [x] `<meta name="theme-color">` pair (dark + light media-queried) in layout head.

**Exit criteria**: design-preview page demonstrates BottomSheet, BottomNav, KeyboardFooter, Toast working at 360 px. No horizontal scroll on any preview at 360 px. iOS Safari URL-bar collapse no longer jitters layout.

---

## Phase 3 — Overlays & feedback

- [x] `Tooltip` (Floating UI or Radix) — desktop-only (hover-gated); on touch becomes a long-press popover or is suppressed.
- [x] `Dialog` — desktop centered modal (`BottomSheet`'s desktop face, shared `Overlay`).
- [x] (`BottomSheet` and `Toast` already shipped in Phase 2.5.)
- [x] Reduced-motion check on all four.

---

## Phase 4 — Form & navigation

- [x] `Select` (Radix or headless).
- [x] `Checkbox`, `Radio`, `Switch`.
- [x] `Tabs` (segmented + underline variants).
- [x] `Skeleton` (shimmer keyframe).
- [x] React Hook Form integration helpers.

---

## Phase 5 — Living surfaces

- [x] `<LiveSurface variant="aurora" | "mesh" | "glass">` — wraps the existing aurora/mesh keyframes from `globals.css` as a clean primitive.
- [x] Reduced-motion behaviour documented (opt-in via `.kx-alive`).
- [x] One use case demoed on a hero block.

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
- **2026-08-12** — **Token layer v3 (OKLCH).** WP-20260812-oklch-token-migration, `ADR-0006`. Audit (`token-audit.html`) scored the v2 system 11/20 and found 4 of 5 filled buttons failing WCAG AA for their own labels, a focus ring at 1.00:1 against the button it marked, an elevation ramp whose "raised" step was ΔL 0.022, brand and danger 25° apart, and 36px/28px touch targets shipping in feature code. All fixed at the token source. Added the tight end of the radius scale, `.elev-*` recipes, `.kx-tap-expand`, `.kx-numeric`, and six football primitives (`Eyebrow`, `StatValue`/`StatBlock`, `Crest`, `LiveIndicator`, `ScoreLine`, `FixtureRow`). Dropped the unused Archivo font and two dead tokens; defined `--radius-tile`, which was referenced by `club-requests-manager` but had never existed. Docs reconciled to the built system.

---

## Phase 8 — Football primitives ✅ (2026-08-12)

The inventory was strong on generic app furniture and empty on the domain.

- [x] `Eyebrow` — 12px uppercase tracked label (specified §4.1 in May, never built).
- [x] `StatValue` / `StatBlock` — sole owner of `.kx-numeric` (§2.6).
- [x] `Crest` — club identity, initials fallback, neutral plate.
- [x] `LiveIndicator` — only permitted consumer of `--live`.
- [x] `ScoreLine` — display-scale numerals; marks non-`result_confirmed` as provisional (Law 7).
- [x] `FixtureRow` — dense tappable row on `--radius-row`.
- [ ] `StandingsTable` — tabular numerals, sticky first column, form guide.

**Exit criteria**: all six on `/showcase` at 360px and 1280px, no horizontal scroll. ✅

---

## Phase 9 — Suite-wide v3 migration ✅ (2026-08-12)

The core four went first; the remaining ~55 primitives were still on v2 patterns.
Swept in one pass, 45 files:

- [x] Brand/state used as **text** → `-ink` roles (57 occurrences). This was a live
      regression: darkening the fills to pass AA made `text-primary` ~3.9:1 as text.
- [x] Keyboard focus rings → `--ring`; field-active borders/rings → `-ink`. One
      exception, documented: `Slider`'s white thumb keeps `--primary`.
- [x] `bg-surface-2` → `bg-surface-elev` (the v2 alias, 25 files).
- [x] `rounded-full` → `rounded-pill` (31 files) — the shape token is `--radius-pill`.
- [x] Input suite unified on `--radius-control`; text fields were pills and OTP was
      `rounded-xl`, three radii across one family.
- [x] `Fab` off the white-mix hover onto `--accent-hover` / `--accent-pressed`.
- [x] Hardcoded `180ms` (Popover) and `220ms` (ScrollTo) → `--dur-graceful`.
- [x] Defined `--radius-tile`, referenced by `club-requests-manager` but never declared,
      so that row had been rendering with square corners.

**Exit criteria**: zero residual v2 patterns (`white/black` color-mix hovers, brand-as-text,
`bg-surface-2`, `rounded-full`) — verified 0 of each. Build green, 96 tests pass. ✅
