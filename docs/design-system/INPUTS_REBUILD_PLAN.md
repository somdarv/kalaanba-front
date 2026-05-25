# Input Suite Rebuild Plan

**Owner**: design-system rebuild
**Source of truth for visuals**: `src/components/_archive/showcase/inputs.tsx` (legacy `Kx*` components — visual reference only; do NOT re-use their tokens or one-off CSS vars).
**Tokens / language**: `docs/design-system/DESIGN_LANGUAGE.md` (the canonical `--surface-*`, `--border*`, `--primary`, `--fg-*` system).

---

## Hard rules that apply to every component below

1. **Width is fluid.** Every input wrapper is `w-full` by default. No fixed widths. Caller controls width via the parent.
2. **Border weight is hairline** (`border-[0.5px]` on resting state).
3. **Focus / active ring is SOLID brand pink** (`ring-2 ring-primary`, full alpha). No `--focus-ring` alpha-mix, no blue browser default.
4. **Hover** only deepens the border (`border-border-strong`). No pink tint on hover.
5. **Disabled** = `opacity-50` + `cursor-not-allowed` + non-interactive.
6. **No `Kx*` prefix.** Names match the design-system index (`TextField`, `PasswordField`, …).
7. **One file ≤ 400 LOC** (engineering standards §1). Split helpers into siblings when needed.
8. **No design-language one-off CSS vars.** Use existing tokens only. Propose ADR if a token is missing.
9. **Showcase entry mandatory.** Each component lands with its variants demoed in `src/app/showcase/showcase-client.tsx`.
10. **Tests where they pay back.** Unit tests for stateful behaviour (PasswordField toggle, NumberInput clamp, OTP focus walk, Calendar selection).

---

## Batches

Each batch lands together in one round-trip with the user, then we move on.

### ✅ Batch 0 — Foundations (DONE)

- [x] `NotificationBell` — outlined surface (`bg-surface-2 + border-border`), pink badge only.
- [x] `TextField` focus ring → solid pink, no alpha dim.
- [x] `TextField` border weight → hairline `border-[0.5px]`.

### Batch 1 — TextField polish + sibling variants

- [x] Verify `TextField` against legacy `KxTextField`:
  - leading-icon, trailing-slot layouts visually balanced.
  - `lg` size pads larger.
  - `disabled` state correct.
- [x] Add showcase entries: default / with leading icon / with trailing icon / with both / lg / disabled / error / hint / fluid full-width.

### Batch 2 — PasswordField

- [x] New file `src/components/ui/password-field.tsx`.
- [x] Wraps `TextField`; trailing slot = eye / eye-slash icon toggle.
- [x] Default `autoComplete="current-password"`, `inputMode="text"`, `enterKeyHint="done"`.
- [ ] Unit test: toggle flips `type` between `password` and `text`.  *(deferred — landing alongside Batch 4 batch of tests)*
- [x] Showcase entry.

### Batch 3 — Textarea

- [x] New file `src/components/ui/textarea.tsx`.
- [x] Same border / focus / hairline language as `TextField`.
- [x] Auto-grow (CSS `field-sizing: content` with min-rows fallback; opt-out via `autoGrow={false}`).
- [x] Optional char counter prop (`showCount` + `maxLength`).
- [x] Showcase entry.

### Batch 4 — NumberInput (player-age stepper)

- [x] New file `src/components/ui/number-input.tsx`.
- [x] `–` and `+` icon-button tiles on either side, numeric input in the middle.
- [x] Clamp `min` / `max`. Step keyboard support (ArrowUp / ArrowDown / Home / End).
- [x] Unit test: clamp + step.
- [x] Showcase entry.

### Batch 5 — CountrySelector

- [ ] New file `src/components/ui/country-selector.tsx`.
- [ ] Custom dropdown (no `<select>`): flag + name + dial code, search-filterable.
- [ ] Uses our own `Popover` primitive (build one in `src/components/ui/popover.tsx` if not present).
- [ ] Country list lives in `src/lib/countries.ts` (already exists? verify; add if missing).
- [ ] Showcase entry: standalone + as TextField leading slot for phone input.

### Batch 6 — Select / Dropdown (generic)

- [ ] New file `src/components/ui/select.tsx`.
- [ ] Custom dropdown over native `<select>`.
- [ ] Supports `options: { value, label, leading? }[]`, `placeholder`, `searchable?`.
- [ ] Built on the same `Popover` as Batch 5.
- [ ] Showcase entry.

### Batch 7 — OTPInput (verification code)

- [ ] New file `src/components/ui/otp-input.tsx`.
- [ ] N boxes (default 6), each `border-[0.5px]` resting, solid pink border on focus (NO ring — solid border only, per design feedback).
- [ ] Paste-spread support, arrow-key navigation, backspace walk.
- [ ] Unit test: focus walk + paste.
- [ ] Showcase entry.

### Batch 8 — DatePicker (custom calendar)

- [ ] New file `src/components/ui/date-picker.tsx`.
- [ ] Trigger = `TextField` with calendar trailing icon.
- [ ] Popover calendar — month / year nav, week grid, single-date selection.
- [ ] Visual reference: legacy `KxDatePicker`.
- [ ] Showcase entry.

### Batch 9 — ImagePicker

- [ ] New file `src/components/ui/image-picker.tsx`.
- [ ] Drop zone OR click-to-pick; shows thumbnail preview on selection.
- [ ] Constrain by `accept`, `maxSizeBytes`.
- [ ] Showcase entry.

### Batch 10 — PositionPicker (pitch position)

- [ ] New file `src/components/ui/position-picker.tsx`.
- [ ] Pitch SVG with tappable position dots (GK / DEF / MID / FWD slots).
- [ ] Visual reference: legacy `KxPositionPicker` (if present) — to verify in legacy showcase.
- [ ] Showcase entry.

---

## Progress log (latest first)

- **2026-05-25** — 🧹 **Hard reset.** All input components (`TextField`, `SearchField`, `PasswordField`, `Textarea`, `NumberInput`) deleted from `src/components/ui/`, exports removed from `src/components/ui/index.ts`, and all input sections removed from the showcase. Reason: the executed batches were not distinct enough — padding/margin and visual separation were wrong, the "comment area" got a single-line input instead of a textarea. Suite to be re-designed from scratch before re-implementation. Tracker reverted to "not started" for Batches 0–4.
- **2026-05-25** — Batch 3 (Textarea) + Batch 4 (NumberInput) shipped. 5 unit tests passing for NumberInput.
- **2026-05-25** — Batch 1 (TextField polish + showcase variants) + Batch 2 (PasswordField) shipped.
- **2026-05-25** — Plan created. Batch 0 (NotificationBell, TextField focus, TextField hairline border) shipped.
