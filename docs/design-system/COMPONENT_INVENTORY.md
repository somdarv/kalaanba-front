# Kalaanba Component Inventory

> The full set of UI components we will build, why each exists, what it depends on, and what it derives from. Grounded in `PRODUCT.md` (MVP scope + Tamale pilot) and `.github/copilot-instructions.md` (engine list for forward-compat).

**Reading order**: [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) → [REBUILD_PLAN.md](./REBUILD_PLAN.md) → this file.

**Status legend**: 🟢 MVP must-have · 🟡 v1.1 · 🔵 v2+ (forward-compat, build only when its engine ships). Build order roughly follows tier → category order in this file.

**Notation**: `Base ▸ Derived` means the derived component composes the base — never duplicates its logic.

---

## Tier 0 — Foundation (atoms, built before everything else)

Everything else composes these. They have no app-level dependencies; they only consume design tokens.

| #       | Component                     | Purpose                                                                                                                                                      | Variants                                                            | Composes    | Used by                                                                                                |
| ------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| 0.1 🟢  | `Pressable`                   | Canonical interaction recipe (hover lift / active press / focus-visible ring / 44 px floor / cozy-ease). Every clickable thing in the app routes through it. | as `button` \| `a` \| `Link`; loading; disabled; full-bleed; subtle | tokens only | `Button`, `IconButton`, `Card` (when clickable), `ListItem`, `Tab`, `NavItem`, `Chip`, `BottomNavItem` |
| 0.2 🟢  | `Icon`                        | Lucide icon wrapper with size scale (`xs/sm/md/lg`) + stroke calibration.                                                                                    | size · tone (current / muted / on-primary / danger / success)       | —           | everywhere                                                                                             |
| 0.3 🟢  | `Spinner`                     | Indeterminate progress mark (canonical pink ring).                                                                                                           | size (`xs/sm/md/lg`); tone                                          | tokens      | `Button.loading`, `LiveSurface`, table loading rows                                                    |
| 0.4 🟢  | `Skeleton`                    | Shimmering placeholder for any cold-load surface. Animation pauses with reduced-motion.                                                                      | shape (text / line / block / circle / card); width prop             | tokens      | every list, card, table, profile                                                                       |
| 0.5 🟢  | `Stack` / `HStack` / `VStack` | Layout primitives — gap, align, justify, wrap, dividers. Replace ad-hoc flex everywhere.                                                                     | gap (`0.5/1/2/3/4/6/8`); align; justify; wrap; divider              | —           | every screen                                                                                           |
| 0.6 🟢  | `Box`                         | Token-aware div with surface / padding / radius / elevation shorthand.                                                                                       | surface (`bg`, `surface`, `elev`, `overlay`); padding; radius; elev | tokens      | wrappers, panels                                                                                       |
| 0.7 🟢  | `Divider`                     | Hairline using `--divider`. Horizontal / vertical / inset.                                                                                                   | orientation; inset                                                  | tokens      | lists, sections                                                                                        |
| 0.8 🟢  | `VisuallyHidden`              | a11y label wrapper.                                                                                                                                          | —                                                                   | —           | every icon-only `IconButton`                                                                           |
| 0.9 🟢  | `Portal`                      | Renders into a stable root for overlays.                                                                                                                     | —                                                                   | —           | `Dialog`, `BottomSheet`, `Toast`, `Tooltip`, `Popover`                                                 |
| 0.10 🟢 | `FocusTrap`                   | Focus containment + restore-on-close.                                                                                                                        | —                                                                   | —           | `Dialog`, `BottomSheet`, `Drawer`                                                                      |
| 0.11 🟢 | `ScrollLock`                  | Body-scroll lock that respects `overscroll-behavior: contain`.                                                                                               | —                                                                   | —           | `Dialog`, `BottomSheet`, `Drawer`                                                                      |

---

## Tier 1 — Buttons & link controls

| #      | Component     | Purpose                                                                                           | Variants                                                                                                                                                                                                              | Composes                                | Used by                                                           |
| ------ | ------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| 1.1 🟢 | `Button`      | Primary text button. The default action surface.                                                  | **intent**: primary · secondary · ghost · destructive · success · subtle. **size**: sm (`h-11` floor) · md (`h-12`) · lg (`h-14`). **width**: auto · full. **state**: loading · disabled. leading/trailing icon slot. | `Pressable` `Spinner` `Icon`            | every form, CTA, modal footer                                     |
| 1.2 🟢 | `IconButton`  | Tap-target wrapper for an `Icon`. Always ≥ 44 × 44, always has `aria-label`.                      | intent (same as Button); size (sm 44 / md 48 / lg 56); shape (square / round).                                                                                                                                        | `Pressable` `Icon` `VisuallyHidden`     | nav bars, toolbars, list items                                    |
| 1.3 🟢 | `LinkButton`  | Visually-button-looking `<Link>` (Next.js client routing). Same API as Button.                    | intent + size + width                                                                                                                                                                                                 | `Pressable` (as Link)                   | landing CTA, dashboard nav                                        |
| 1.4 🟢 | `ButtonGroup` | Horizontal cluster with shared press surface and inter-button divider.                            | size; intent; orientation                                                                                                                                                                                             | `Button`                                | "Confirm / Dispute" pairs                                         |
| 1.5 🟢 | `Chip`        | Filter-style toggle pill, also used as filter tag.                                                | selectable · removable · static; size (sm/md); tone (neutral / primary / success / warning / danger)                                                                                                                  | `Pressable` `Icon`                      | competition filter row, zone selector, position picker            |
| 1.6 🟢 | `Fab`         | Floating action button. Bottom-right (desktop) / above `BottomNav` respecting safe-area (mobile). | size (md/lg); intent; extended (with label)                                                                                                                                                                           | `IconButton` (or `Button` for extended) | "Add fixture" on competition dashboard, "Add event" on live entry |

---

## Tier 2 — Form primitives

Every form field built on these. React Hook Form + Zod outside the components.

| #       | Component              | Purpose                                                                                                                             | Variants                                                                                                            | Composes                                 | Used by                                                                    |
| ------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| 2.1 🟢  | `Field`                | Label + control slot + helper text + error slot wrapper. The form atom.                                                             | required marker; size (sm/md)                                                                                       | `Stack`                                  | every input                                                                |
| 2.2 🟢  | `TextField`            | Single-line input. `inputMode`, `autoComplete`, `enterKeyHint` are **required** props. `--text-input` font-size to defeat iOS zoom. | type (text/email/url/tel/numeric); state (default / error / success / disabled); leading/trailing icon; affix; size | `Field` `Icon`                           | every form                                                                 |
| 2.3 🟢  | `Textarea`             | Multi-line. Auto-grow option.                                                                                                       | rows; auto-grow; max-rows; state                                                                                    | `Field`                                  | dispute reason, fixture notes                                              |
| 2.4 🟢  | `PhoneField`           | Intl-aware tel input (Ghana default, +233 mask). Phone is the universal identifier — this is heavily used.                          | size; state                                                                                                         | `TextField`                              | OTP request, ghost create, member invite                                   |
| 2.5 🟢  | `OtpField`             | 6-digit cell input, auto-advance, paste-friendly, autocomplete=`one-time-code`, `inputMode=numeric`.                                | length (4/6); state; resend countdown slot                                                                          | `Field` `Pressable`                      | OTP screen                                                                 |
| 2.6 🟢  | `Select`               | Native-mobile-preferred select (uses `<select>` on touch, custom listbox on desktop).                                               | size; state; multi (v1.1)                                                                                           | `Field` `Pressable` `Popover`            | venue picker, surface picker, format picker                                |
| 2.7 🟢  | `Combobox`             | Searchable select with virtualization. Used when the option list grows (players, clubs).                                            | size; multi; async (with debounce + Spinner)                                                                        | `Field` `TextField` `Popover` `ListItem` | team picker, scorer picker, free-agent search                              |
| 2.8 🟢  | `Switch`               | Boolean toggle. Native-feeling tap target (≥ 44 px touchable strip).                                                                | size (sm/md); state (loading)                                                                                       | `Pressable`                              | mute switch, settings                                                      |
| 2.9 🟢  | `Checkbox`             | Single bool or part of a group. Indeterminate.                                                                                      | size; state                                                                                                         | `Pressable` `Icon`                       | "I agree", bulk row select                                                 |
| 2.10 🟢 | `Radio` / `RadioGroup` | Mutually exclusive.                                                                                                                 | size; state; layout (stack / inline)                                                                                | `Pressable`                              | format selector (single round-robin only for MVP, ships for v1.1 knockout) |
| 2.11 🟢 | `SegmentedControl`     | iOS-style pill-grouped radio. The canonical small-cardinality picker on mobile.                                                     | size; full-width                                                                                                    | `Pressable`                              | informal/formal club, theme switcher (settings only)                       |
| 2.12 🟢 | `Stepper`              | +/- numeric input. Useful for squad-size cap, match-duration minutes.                                                               | min/max/step; size                                                                                                  | `IconButton` `TextField`                 | competition rules form                                                     |
| 2.13 🟢 | `DateField`            | Date input. Native `<input type="date">` on touch, custom calendar on desktop.                                                      | min/max; size; state                                                                                                | `Field` `Popover` `Calendar`             | fixture date                                                               |
| 2.14 🟢 | `TimeField`            | Time picker. Same native-first strategy.                                                                                            | step (minutes); 12/24 hr                                                                                            | `Field`                                  | fixture kick-off                                                           |
| 2.15 🟢 | `Calendar`             | Month grid. Single / range select. Surfaces booking density (heat dots).                                                            | view (month); selection (single / range); minDate/maxDate                                                           | `Stack` `Pressable`                      | DateField popover, booking calendar (v2)                                   |
| 2.16 🟡 | `FileDropzone`         | Photo/evidence upload with thumbnail strip. Drag on desktop, tap-camera on mobile.                                                  | accept; max-size; multi                                                                                             | `Field` `Icon`                           | player photo, evidence upload (Trust v2)                                   |
| 2.17 🟢 | `Form`                 | Form-shell that wires React Hook Form + Zod resolver + submit-loading + scroll-to-error.                                            | onSubmit; schema                                                                                                    | `Stack`                                  | every form                                                                 |
| 2.18 🟢 | `FormSection`          | Visual section divider within a long form (title, description, content).                                                            | collapsible                                                                                                         | `Stack` `Divider`                        | competition create, live match entry                                       |
| 2.19 🟢 | `FormFooter`           | Sticky action row at form bottom. On mobile, sticks to bottom respecting safe-area; on desktop, sits in flow.                       | sticky-mobile                                                                                                       | `Stack` `Button` `KeyboardFooter`        | every multi-section form                                                   |

---

## Tier 3 — Surfaces (containers)

| #      | Component    | Purpose                                                                                       | Variants                                                                                             | Composes                | Used by                        |
| ------ | ------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------ |
| 3.1 🟢 | `Card`       | The default content container. Clickable cards route their press surface through `Pressable`. | elevation (flat / raised / floating); padding; clickable; intent border (success / warning / danger) | `Box` `Pressable`       | every dashboard, list, profile |
| 3.2 🟢 | `Panel`      | Like Card but designed to hold form sections — flatter, no shadow.                            | padding                                                                                              | `Box`                   | inside `Form`                  |
| 3.3 🟢 | `EmptyState` | Illustrated placeholder for an empty list with a primary CTA.                                 | size (sm/md); icon; title; description; action slot                                                  | `Stack` `Icon` `Button` | every list view                |
| 3.4 🟢 | `ErrorState` | Recoverable error (no content available). Always offers retry.                                | size; severity                                                                                       | `Stack` `Icon` `Button` | data-fetch fallbacks           |
| 3.5 🟢 | `Section`    | Page-level grouping (heading + optional action + content).                                    | spacing; heading level                                                                               | `Stack`                 | every page                     |

---

## Tier 4 — Overlays & sheets

| #      | Component           | Purpose                                                                                                                                          | Variants                                             | Composes                          | Used by                                                            |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| 4.1 🟢 | `Overlay`           | Backdrop primitive. Owns z-index, scroll-lock, focus-trap, overscroll-contain, click-outside, ESC. **All other modal-y things compose this.**    | dim level (subtle / standard / heavy); dismissable   | `Portal` `FocusTrap` `ScrollLock` | `Dialog`, `BottomSheet`, `Drawer`                                  |
| 4.2 🟢 | `Dialog`            | Centered modal with header / body / footer slots. ≥ 768 px or non-touch only — on mobile, **morphs to `BottomSheet`** automatically.             | size (sm/md/lg); destructive header tint             | `Overlay` `Stack` `IconButton`    | confirm result, dispute, settings sub-pages                        |
| 4.3 🟢 | `BottomSheet`       | Bottom-anchored sheet with snap points (`peek / half / full`), swipe-to-dismiss, safe-area-inset-bottom padding. Mobile's primary modal pattern. | snapPoints; dismissable; nested-scroll-safe          | `Overlay` `Stack`                 | mobile filters, fixture actions, scorer picker, ghost-claim wizard |
| 4.4 🟢 | `Drawer`            | Side-anchored sheet (left / right). Mobile menu, desktop filter rail.                                                                            | side; size                                           | `Overlay` `Stack`                 | mobile main menu, competition filters                              |
| 4.5 🟢 | `Popover`           | Light pop-up anchored to a trigger. Desktop primary, mobile fallback.                                                                            | placement; offset; size                              | `Portal` `Pressable`              | `Combobox` listbox, `Select` listbox, `Menu`                       |
| 4.6 🟢 | `Menu` / `MenuItem` | Action menu (kebab triggers).                                                                                                                    | placement; size; with icons                          | `Popover` `Pressable` `Icon`      | card kebabs, profile header                                        |
| 4.7 🟢 | `Tooltip`           | Tiny hover hint. **Desktop-only** (`@media (hover: hover) and (pointer: fine)`) — no-op on touch.                                                | placement; delay                                     | `Popover`                         | icon explainers (admin only mostly)                                |
| 4.8 🟢 | `ConfirmDialog`     | Pre-fab destructive / important confirmation.                                                                                                    | tone (default / danger); confirm label; cancel label | `Dialog` `Button`                 | result confirm, club leave, fixture delete (archive)               |
| 4.9 🟢 | `ActionSheet`       | Mobile-style action list (cancel button at bottom).                                                                                              | items; destructive item                              | `BottomSheet` `Pressable`         | "Share to WhatsApp / Copy link / Cancel", fixture row actions      |

---

## Tier 5 — Navigation & shell

| #       | Component                     | Purpose                                                                                                           | Variants                                               | Composes                      | Used by                                      |
| ------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------- | -------------------------------------------- |
| 5.1 🟢  | `AppShell`                    | Top-level layout (header + main + bottom-nav slot). Sets `min-h-dvh`, safe-area-inset bottom, scroll regions.     | with-bottomnav; with-sidebar (desktop)                 | `Stack`                       | all logged-in screens                        |
| 5.2 🟢  | `Header`                      | Sticky top bar. Logo + nav slots + actions. No theme toggle in chrome (theme lives in Settings).                  | transparent-on-scroll; compact                         | `Stack` `IconButton` `Avatar` | every screen                                 |
| 5.3 🟢  | `BottomNav` / `BottomNavItem` | Mobile bottom tab bar. ≥ 56 px tall + safe-area. Hidden on desktop.                                               | item count (3–5); badge dot                            | `Pressable` `Icon`            | mobile shell                                 |
| 5.4 🟢  | `Sidebar` / `SidebarItem`     | Desktop primary nav. Hidden on mobile (replaced by `BottomNav` + `Drawer`).                                       | collapsed                                              | `Pressable` `Icon`            | desktop shell                                |
| 5.5 🟢  | `Tabs` / `Tab`                | In-page section switcher (Standings / Fixtures / Stats).                                                          | underline · pill; full-width on mobile                 | `Pressable`                   | tournament page, profile page                |
| 5.6 🟢  | `Breadcrumbs`                 | Desktop context trail. Collapses to back-arrow on mobile.                                                         | —                                                      | `Pressable` `Icon`            | admin nested pages                           |
| 5.7 🟢  | `Pagination` / `LoadMore`     | Cursor-based on mobile (`LoadMore` button); page-numbered on desktop.                                             | mobile / desktop variant                               | `Button`                      | long lists                                   |
| 5.8 🟢  | `KeyboardFooter`              | Sticky action bar that sits _above_ the on-screen keyboard. Uses `interactiveWidget=resizes-content` + safe-area. | action slot                                            | `Stack` `Button`              | every form submit on mobile                  |
| 5.9 🟢  | `Stepper` (wizard)            | Multi-step flow indicator with current/completed states. **Not the numeric stepper (2.12).**                      | orientation (horizontal / vertical); compact on mobile | `Stack` `Icon`                | club create, competition create, ghost claim |
| 5.10 🟢 | `PageHeader`                  | Page title + subtitle + meta + actions. Becomes sticky-condensed on scroll.                                       | size; with-tabs                                        | `Stack` `Avatar` `Button`     | every named screen                           |

---

## Tier 6 — Feedback & status

| #      | Component           | Purpose                                                                                   | Variants                                                | Composes                 | Used by                            |
| ------ | ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------ | ---------------------------------- |
| 6.1 🟢 | `Toast` / `Toaster` | Transient feedback. Bottom-center on mobile, top-right on desktop. Honors safe-area.      | intent (info / success / warning / danger); with action | `Portal` `Icon` `Button` | every mutation success/failure     |
| 6.2 🟢 | `Banner`            | Persistent in-flow notice (e.g. "Phone unverified", "Result pending confirmation").       | intent; dismissable; with action                        | `Stack` `Icon` `Button`  | profile header, fixture page       |
| 6.3 🟢 | `Alert`             | Inline form-level error summary.                                                          | intent                                                  | `Stack` `Icon`           | form top-of-page errors            |
| 6.4 🟢 | `ProgressBar`       | Determinate progress.                                                                     | size; intent                                            | `Box`                    | upload, evidence submission        |
| 6.5 🟢 | `Pulse`             | Tiny animated dot (alive ping). Used to signal "live", "new". Pauses with reduced-motion. | tone                                                    | `Box`                    | live match indicator, unread badge |
| 6.6 🟢 | `LiveBadge`         | "LIVE" pill with `Pulse`.                                                                 | size                                                    | `Pulse` `Box`            | live fixture cards                 |

---

## Tier 7 — Data display

| #      | Component                  | Purpose                                                                                                 | Variants                                                     | Composes                      | Used by                                           |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------- | ------------------------------------------------- |
| 7.1 🟢 | `List` / `ListItem`        | Vertical list. ListItem has leading slot (avatar/icon), title, subtitle, trailing slot, optional press. | density (cozy / compact); divider; interactive               | `Stack` `Divider` `Pressable` | every dashboard list, settings, fixtures, members |
| 7.2 🟢 | `Table`                    | Tabular data. **Mobile: horizontal-scrollable with sticky first column.**                               | density; sticky-header; sticky-first-col                     | `Stack`                       | standings, stats, ledger (RP v2)                  |
| 7.3 🟢 | `StatTile`                 | Single metric block (label + value + delta).                                                            | size; intent (positive / negative / neutral)                 | `Box`                         | dashboard hero, profile stats                     |
| 7.4 🟢 | `StatRow`                  | Horizontal scroll-snap row of `StatTile`s on mobile.                                                    | gap                                                          | `HStack` `StatTile`           | dashboards                                        |
| 7.5 🟢 | `KeyValueList`             | Read-only label/value rows (compact form-like display).                                                 | density; orientation                                         | `Stack`                       | profile, fixture meta                             |
| 7.6 🟢 | `Tag`                      | Static label (not interactive — that's `Chip`).                                                         | tone (neutral / primary / success / warning / danger / info) | `Box`                         | position, role, status                            |
| 7.7 🔵 | `Chart.Line` / `Chart.Bar` | Reputation-over-time, fixture density. Lazy-loaded (recharts).                                          | size; tone                                                   | —                             | profile (v1.1), analytics (v2)                    |

---

## Tier 8 — Media

| #      | Component     | Purpose                                                                                      | Variants                                                                               | Composes         | Used by                                 |
| ------ | ------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------- | --------------------------------------- |
| 8.1 🟢 | `Avatar`      | Person avatar. `next/image`, lazy, fallback to initials, optional verification badge corner. | size (xs / sm / md / lg / xl); shape (circle / squircle); fallback; verifiedBadge slot | `Box` `Icon`     | every player/user surface               |
| 8.2 🟢 | `AvatarGroup` | Stacked overlapping avatars + "+N".                                                          | size; max                                                                              | `Avatar`         | team roster preview, match lineup       |
| 8.3 🟢 | `ClubCrest`   | Club/team identity mark. Auto-generates initial-on-color fallback when no crest uploaded.    | size                                                                                   | `Box` `Image`    | every match card, standings row, header |
| 8.4 🟢 | `Image`       | `next/image` wrapper with shimmer skeleton + error fallback + sensible defaults.             | aspect; sizes; priority                                                                | `Skeleton`       | content images                          |
| 8.5 🟡 | `Gallery`     | Photo strip with lightbox.                                                                   | —                                                                                      | `Image` `Dialog` | match gallery (v1.1)                    |
| 8.6 🔵 | `VideoPlayer` | HLS player wrapper for evidence video.                                                       | —                                                                                      | —                | Trust evidence (v2)                     |

---

## Tier 9 — Live & realtime (the Kalaanba signature surfaces)

The "alive" feel of the app. Honor reduced-motion. Pause when offscreen (`IntersectionObserver`).

| #      | Component         | Purpose                                                                                                    | Variants                              | Composes               | Used by                       |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------- | ----------------------------- |
| 9.1 🟢 | `LiveSurface`     | Wrapper that opts a region into the alive-class (escapes reduced-motion blanket, runs ambient animations). | intensity (subtle / standard / vivid) | `Box`                  | live match panel              |
| 9.2 🟢 | `LiveScore`       | Big animated score with last-event ripple.                                                                 | size (md / lg / hero)                 | `Stack` `Pulse`        | live match panel              |
| 9.3 🟢 | `MatchClock`      | Live ticking clock with half/period state. Pauses correctly on half-time / final whistle.                  | size                                  | `Box`                  | live match                    |
| 9.4 🟢 | `EventTicker`     | Reverse-chronological live feed of match events (goal / card / sub) with entrance animation.               | dense / spacious                      | `List` `Avatar` `Icon` | live match                    |
| 9.5 🟡 | `GoalCelebration` | One-shot full-screen confetti + name when goal logged. Reduced-motion → static toast.                      | —                                     | `Portal`               | live entry (v1.1 goal alerts) |

---

## Tier 10 — Football domain primitives

The components that are _not_ generic and that make Kalaanba look like Kalaanba.

| #        | Component           | Purpose                                                                                                                         | Variants                                                                                                    | Composes                                       | Used by                                   |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| 10.1 🟢  | `MatchCard`         | Fixture summary: two teams + crest + score (or kickoff time) + venue + status tag. The single most-rendered surface in the app. | state (scheduled / live / completed / postponed / cancelled); size (compact / standard / hero); withActions | `Card` `ClubCrest` `Tag` `LiveBadge`           | competition page, dashboards, public page |
| 10.2 🟢  | `MatchRow`          | Compact one-line fixture for dense lists.                                                                                       | state                                                                                                       | `ListItem` `ClubCrest`                         | "next 7 days" rail, search results        |
| 10.3 🟢  | `ResultCard`        | Post-match shareable summary (the WhatsApp asset preview).                                                                      | tone (home-win / away-win / draw)                                                                           | `Card` `ClubCrest` `Stack`                     | post-match, share-to-WhatsApp preview     |
| 10.4 🟢  | `StandingsTable`    | Mobile-scroll horizontal table; sticky team col; trend arrow per row; tiebreaker indicator.                                     | density; show-form (last 5)                                                                                 | `Table` `ClubCrest` `Tag`                      | tournament page                           |
| 10.5 🟢  | `FixturesList`      | Grouped-by-date fixture list with sticky date headers.                                                                          | density                                                                                                     | `List` `MatchRow` `MatchCard`                  | tournament page, club page                |
| 10.6 🟢  | `TeamRoster`        | Player list with position group sections, captain / GK markers.                                                                 | density                                                                                                     | `List` `Avatar` `Tag`                          | team page, lineup picker                  |
| 10.7 🟢  | `LineupPitch`       | Visual 11-on-a-pitch layout. Drag to swap (v1.1). MVP: read-only.                                                               | formation (4-3-3 / 4-4-2 / 3-5-2 / custom)                                                                  | `Avatar` `Box`                                 | match lineup                              |
| 10.8 🟢  | `PlayerProfileCard` | Hero block: avatar + name + position + verified badge + claimed/ghost state.                                                    | size; with-actions                                                                                          | `Card` `Avatar` `Tag` `Button`                 | player page                               |
| 10.9 🟢  | `GhostClaimCTA`     | Conspicuous claim-this-profile banner (only when viewing a ghost profile).                                                      | size                                                                                                        | `Banner` `Button`                              | ghost player pages                        |
| 10.10 🟢 | `EventGlyph`        | Tiny icon-and-minute pair for in-match events (⚽ 23' / 🟨 41' / 🔁 67').                                                       | event type                                                                                                  | `Icon`                                         | `EventTicker`, match summary              |
| 10.11 🟢 | `ScoreInput`        | The +/- score editor used during live entry. Big finger targets.                                                                | size; max                                                                                                   | `IconButton`                                   | live entry                                |
| 10.12 🟢 | `EventLogger`       | Quick-add buttons for goal / yellow / red / sub, opens a `BottomSheet` for player + minute.                                     | —                                                                                                           | `BottomSheet` `Combobox` `Stepper`             | live entry                                |
| 10.13 🟢 | `VenuePicker`       | Combobox + "use my location" + on-map preview.                                                                                  | with-map                                                                                                    | `Combobox` `Map`                               | fixture create                            |
| 10.14 🟢 | `SurfacePicker`     | Surface-of-venue select with availability hint.                                                                                 | —                                                                                                           | `Select`                                       | fixture create                            |
| 10.15 🟢 | `ZonePicker`        | Club activity-area selector. Multi-zone or single. Map + chip list dual-view.                                                   | multi                                                                                                       | `MapPreview` `Chip` `Combobox`                 | club create                               |
| 10.16 🟢 | `MapPreview`        | MapLibre wrapper. Lazy-loaded. Static fallback image on cold render.                                                            | interactive; height                                                                                         | —                                              | `VenuePicker`, `ZonePicker`, venue page   |
| 10.17 🟢 | `WhatsAppShare`     | Share-to-WhatsApp helper (renders `wa.me` link + native share-sheet fallback).                                                  | inline / button                                                                                             | `Button` `Icon`                                | result, fixture, tournament page          |
| 10.18 🟡 | `VerifiedBadge`     | Trust verification mark, hover/tap reveals tier + last-verified.                                                                | tier (none / partial / full)                                                                                | `Tooltip` (desktop) / `Popover` (touch) `Icon` | every player and stat                     |

---

## Tier 11 — Marketing-only (landing & public surfaces)

These don't need to compose into the app — they live in the marketing route group.

| #       | Component       | Purpose                                  | Composes             |
| ------- | --------------- | ---------------------------------------- | -------------------- |
| 11.1 🟢 | `Hero`          | Landing hero with tagline + primary CTA. | `Stack` `LinkButton` |
| 11.2 🟢 | `Feature`       | Three-column feature row.                | `Card` `Icon`        |
| 11.3 🟢 | `Testimonial`   | Quote block with avatar + zone.          | `Card` `Avatar`      |
| 11.4 🟢 | `PricingTeaser` | "Pilot is free" callout.                 | `Card` `Button`      |
| 11.5 🟢 | `FAQ`           | Disclosure list.                         | `Pressable` `Icon`   |
| 11.6 🟢 | `CTASection`    | Bottom-of-page call-to-action band.      | `Stack` `LinkButton` |

---

## Tier 12 — Engine-specific (forward-compat, build only with the engine)

These map 1:1 to engines in `.github/copilot-instructions.md`. They are noted now so we don't paint ourselves into a corner — but **do not build them until the engine they belong to enters its build window** (`docs/Architecture/Build_Plan.md`).

| Engine                          | Components                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| RP Economy 🔵                   | `RpWalletCard`, `RpLedgerRow`, `RpBalanceChip` (Lifetime / Season / Locked), `StakeLockConfirm` (BottomSheet)    |
| Challenge 🔵                    | `ChallengeCard`, `ChallengeIssueWizard` (Wizard via Stepper), `CounterModal` (BottomSheet), `StoodGroundConfirm` |
| Trust & Verification 🔵         | `TrustBadge`, `EvidenceUploader` (FileDropzone), `DisputeForm`, `VerdictBanner`                                  |
| Zone 🔵                         | `ZoneScoreCard`, `ZoneLeaderboard`, `BeltBadge`                                                                  |
| Venue / Surface / Booking 🔵    | `BookingCalendar` (Calendar + density heat), `BookingPaymentSheet`, `SurfaceAvailabilityRow`                     |
| Referee 🔵                      | `AssignmentCard`, `RefereeReportForm`, `ReliabilityBadge`                                                        |
| Notification 🔵                 | `NotificationCenter` (Drawer + List), `ChannelPreferenceRow`, `FrequencyTierSelect`                              |
| Fan Buzz 🔵                     | `BuzzFeedCard`, `ReactionStrip`, `BuzzRankList`, `AttentionBadge` (explicitly distinct from `VerifiedBadge`)     |
| Moderation 🔵                   | `ReportModal` (Dialog/BottomSheet), `ModerationHoldBanner`, `EscalationQueueRow`                                 |
| Admin Governance 🔵             | `ConfigKeyTable`, `ApprovalQueueRow`, `AuditLogRow`, `EffectiveDateBadge`                                        |
| Competition & Rules 🟢 (subset) | `RulesEditor` (FormSection composition), `TiebreakerOrderer` (drag list)                                         |
| Awards & Recognition 🔵         | `AwardBadge`, `WeeklyAwardCard`, `AwardGalleryGrid`                                                              |
| Analytics 🔵                    | Dashboard widgets composing `StatTile` / `Chart.*`                                                               |

---

## Build order (the actual sequence)

Aligned with `REBUILD_PLAN.md`:

1. **Phase 2** — Tier 0 + Tier 1 (Pressable → Button → IconButton → Chip → Fab)
2. **Phase 2.5** — Tier 0.9–0.11 + Tier 4 (Portal, FocusTrap, ScrollLock, Overlay, BottomSheet, Drawer, Dialog) + Tier 5.8 (KeyboardFooter) + Tier 5.1 (AppShell with safe-area)
3. **Phase 3** — Tier 4.5–4.9 (Popover, Menu, Tooltip, ConfirmDialog, ActionSheet) + Tier 5.3 (BottomNav) + Tier 6 (Toast / Banner / Pulse / LiveBadge)
4. **Phase 4** — Tier 2 (all form primitives) + Tier 5.2, 5.5, 5.9, 5.10 (Header, Tabs, Wizard Stepper, PageHeader)
5. **Phase 5** — Tier 3 (Card, Panel, EmptyState, ErrorState, Section) + Tier 7 (List, Table, StatTile, etc.) + Tier 8 (Avatar, ClubCrest, Image)
6. **Phase 6** — Tier 9 (LiveSurface family) + Tier 10 football domain components
7. **Phase 7** — Tier 11 marketing components
8. **Engine windows** — Tier 12 components ship inside their engine's build window only.

---

## Cross-cutting rules (apply to every component above)

These come from `DESIGN_LANGUAGE.md` and the design-system mandatory instruction file — repeated here for the agent doing the implementation:

1. **Every interactive thing composes `Pressable`.** No bespoke hover/active/focus recipes.
2. **Every touch target ≥ 44 × 44.** Even when the visual is smaller, pad the hit area.
3. **Every form control sets `font-size: var(--font-input)`.** iOS won't zoom.
4. **Every overlay composes `Overlay`.** No bespoke z-index management, no bespoke focus-trap.
5. **Every sticky-bottom thing uses `pb-[env(safe-area-inset-bottom)]` (or `KeyboardFooter`).**
6. **Every list / table / card supports `Skeleton` and `EmptyState`.** No silent empty states.
7. **Every component supports `data-theme="light"`** by reading tokens, never by hardcoding light values.
8. **Every component honors `prefers-reduced-motion`.** Either inherit the global reduce, or opt in via `LiveSurface`.
9. **Every component is visually verified at 360 px AND 1280 px.** Both screenshots in the PR.
10. **Hover-only behavior is wrapped** — Tailwind v4's `hover:` is already `@media (hover: hover)`-guarded; never write touch-firing hover effects.

---

## How to add a new component

1. Re-read `DESIGN_LANGUAGE.md` (mandatory).
2. Find its tier in this file. If it doesn't fit any tier, propose where it belongs in the PR.
3. Build it composing the components in the tier(s) above it — never inline a recipe.
4. Add a story to `src/components/showcase/` (Phase 5+).
5. Add a Vitest test that asserts behavior, not implementation.
6. Add a row to this file in the same PR.
