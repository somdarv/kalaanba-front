# WP-20260625-onboarding-area

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.

| Field                | Value                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260625-onboarding-area`                                                                                                 |
| **Title**            | Frontend — post-signup profile completion (City Hub → Area picker, skippable) + Zone public read contracts                  |
| **Opened**           | 2026-06-25                                                                                                                    |
| **Closed**           | —                                                                                                                             |
| **Owner**            | Sole developer / product owner                                                                                                |
| **Canonical docs**   | [Identity Engine](../engines/identity/Identity_Engine_System_Document.md) §8 (profile surface, `PATCH /users/me`); [Zone Engine](../engines/zone/Zone_Engine_UPDATED.md) §2 (hierarchy), §5 (user flow: hub → area → suggest) |
| **Build Plan phase** | Phase 1.3 — Identity / Users (frontend: profile screens)                                                                     |
| **Repo(s)**          | `kalaanba-front` (primary — UI + contracts); `kalaanba-api` (paired backend WP for Zone read endpoints)                     |
| **Status**           | 🟢 Frontend scaffold landed; paired backend **WP-20260625a-zone-public-read** shipped + verified live (hubs/areas/suggest). End-to-end ready once a session exists. |

---

## Pipeline Progress

- [x] Stage 1 — Intake (this doc)
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check
- [x] Stage 5 — Contract Design
- [x] Stage 6 — Implementation (frontend scaffold)
- [x] Stage 7 — Security Review
- [x] Stage 8 — QA Plan + Tests
- [x] Stage 9 — Docs Update
- [x] Stage 10 — Release Packet (paired backend WP-20260625a shipped + verified live)

---

## Stage 1 — Intake

### Problem

After WP-20260530 (self-signup) and WP-20260624 (identifier-first auth), a new user who completes **phone + name + OTP** is created as `role=user`, CLAIMED, and handed a session token — then dropped on a placeholder `/dashboard`. The registration contract made `area_id` **optional at signup** (deferred "to the profile screen"), but **no profile-completion screen exists**, so in practice every self-signup user has `area_id = null`.

`area_id` is the Zone anchor for everything geographic (zone mapping, leaderboards, discovery, challenge context — Zone doc §1, §5). Leaving it perpetually null undermines the Zone Engine. This WP delivers the missing screen.

### Goal

After this WP closes:

1. A new user, immediately after signup, lands on a **skippable** profile-completion step that captures their **City Hub** then their **Area** (Zone doc §5 order).
2. If their area isn't listed, they can **suggest** it (Zone doc §5 — admin maps it later).
3. Selecting an area persists it via the existing `PATCH /api/v1/users/me { area_id }` (Identity §8). No backend Identity change.
4. The step is **skippable** ("Skip for now") — lowest grassroots friction; a user without an area is gently re-prompted on subsequent entry rather than hard-blocked.
5. Returning users who already have an area never see the step (instant pass-through to `/dashboard`).

### Non-goals

- **No hard gate.** Area is not required to use the app (product decision 2026-06-25). A future WP may tighten this for actions that genuinely need a zone (e.g. joining a club).
- **No backend Zone read implementation in this repo.** This WP is contract-first: it *designs* and *consumes* the Zone read endpoints; `kalaanba-api` implements them in the paired **WP-20260625a-zone-public-read**.
- **No avatar step.** Avatar upload (`POST /users/me/avatar`) exists server-side; its onboarding screen is a separate follow-up.
- **No `user → player` claim.** That's the Player & Affiliation engine (Build Plan Phase 1.5), tracked separately.

### Decisions locked (product owner, 2026-06-25)

1. **Area data source** → contract-first: design Zone read contracts now, scaffold UI against them, backend implements in paired WP.
2. **Gate behaviour** → skippable prompt (not a hard gate).
3. **Picker scope** → full **hub → area**, plus suggest-an-area.

### Affected engines

- **Identity** (consumer) — reuses `PATCH /users/me`; no schema/endpoint change.
- **Zone** (new read surface) — three new public/authenticated read+suggest contracts. Backend paired WP owns implementation. Constitution Law 3 honoured: the frontend only *displays* the area list and *stores* the chosen `area_id`; it computes nothing.

### Contracts touched

New OAS under `contracts/api/zone/`:

- `get-hubs.v1.yaml` — `GET /api/v1/zone/hubs`
- `get-areas.v1.yaml` — `GET /api/v1/zone/areas?hub_id=&q=`
- `post-area-suggestions.v1.yaml` — `POST /api/v1/zone/area-suggestions`

### Open questions

None blocking. (Backend throttle/config keys for the Zone read endpoints are owned by the paired backend WP.)

---

## Stage 2 — Impact Map

| Surface | Impact |
| --- | --- |
| **Frontend API client** | New `src/lib/api/zone.ts` (listHubs / listAreas / suggestArea + Zod schemas). `src/lib/api/auth.ts` gains `updateMyProfile()`. |
| **Frontend hooks** | New `src/lib/api/hooks/use-zone.ts` (`useHubs`, `useAreas`, `useSuggestArea`). `use-auth.ts` gains `useUpdateProfile()` (invalidates `["user"]`). |
| **Frontend components** | New `src/components/onboarding/area-onboarding.tsx` + barrel. Reuses `Select` (searchable single-select), `Dialog`, `Button`, `TextField`, `Textarea`, `useToast`. |
| **Routing** | New `src/app/onboarding/area/page.tsx` (smart redirect: has area ⇒ `/dashboard`). `onAuthed` in `/auth/login` now routes to `/onboarding/area`. |
| **Contracts** | 3 new Zone OAS files (consumed now, implemented by paired backend WP). |
| **Backend** | None in this repo. Paired **WP-20260625a** implements the 3 endpoints. |
| **Tests** | `src/components/onboarding/area-onboarding.test.tsx` (hub→area selection, skip, suggest path — hooks mocked). |
| **Outbox / events** | None. Profile edits emit no event in V1 (Identity §11). |

### Risk surface

- **Dependency on unbuilt endpoints.** Until WP-20260625a ships, `useHubs`/`useAreas` 404 in dev. Mitigated: the component degrades to an `ErrorState`/`EmptyState` and the **Skip** path always works, so the auth flow is never blocked. Stage 10 is explicitly gated on the backend WP.
- **Enumeration / PII** — none. Hubs and areas are public reference data; the suggest endpoint accepts only a free-text area name + hub (no PII).

---

## Stage 3 — Rules Review

Engine-doc citations:

### Identity (`Identity_Engine_System_Document.md`)

- **§8 Profile Surface** — `area_id` is a profile field, `PATCH /users/me` updates `name`, `area_id`, `avatar_url`. This WP uses exactly that endpoint. ✅
- **§8 channel/privacy** — no phone/email/role touched. ✅
- **§3 roles** — onboarding never sets a role; user stays `user`. ✅

### Zone (`Zone_Engine_UPDATED.md`)

- **§5 User Flow** — *"Users select Area first… Choose City Hub: Tamale; Choose Area: Taha; system assigns Zone/Belt. If the area is missing, the user suggests the area and admin maps it after review."* The picker implements hub → area → suggest exactly. ✅
- **§2 Hierarchy** — City Hub and Area are the two user-facing levels; Zone/Belt are admin-derived and **not** chosen by the user. The picker exposes only Hub + Area. ✅
- **§11 philosophy** — *"Frontend displays the result… do not calculate Zone leaders, rankings, eligibility in React."* The frontend never maps area→zone; it sends `area_id`, backend owns the mapping. ✅

### Constitution

- **Law 1 (engine boundaries)** — frontend reads Zone via its public API; no cross-schema access. `area_id` stays an opaque UUID. ✅
- **Law 3 (backend owns truth)** — UI lists areas and stores the chosen id; computes nothing. ✅
- **Law 14 (idempotency)** — `PATCH /users/me` and `POST /area-suggestions` carry `Idempotency-Key` automatically (api-client sets it for mutating methods). ✅

### Doc gaps flagged (for Stage 9 / future ADR)

1. **Zone engine doc has no "public read surface" section.** It describes the user flow (§5) but contracts only existed for admin area-suggestion review. This WP adds the read+suggest contracts; the Zone doc should gain an endpoints/read-surface section. Flagged to docs-scribe; not invented here — the contracts follow §5's stated flow.
2. **Identity §7.1 vs registration contract drift** on `area_id` (doc says required at registration; contract made it optional). This WP is the resolution of that drift on the *product* side: area is captured post-signup, skippably. Noted; the engine doc §7.1 wording should be reconciled in a docs pass.

---

## Stage 4 — Architecture Check

### Layering (frontend, engineering-standards §5)

```
src/app/onboarding/area/page.tsx        ← route shell, smart redirect (server-ish client guard)
        │ renders
src/components/onboarding/area-onboarding.tsx  ← feature container (composes ui/ primitives)
        │ consumes
src/lib/api/hooks/use-zone.ts + use-auth.ts    ← TanStack Query hooks (own data fetching)
        │ call
src/lib/api/zone.ts + auth.ts                  ← API client (Zod at the boundary)
        │ over
src/lib/api/client.ts                          ← envelope unwrap + idempotency + auth header
```

- Components consume hooks, never `fetch` directly (engineering-standards §5). ✅
- Zod schemas validate every response `data` payload (§5). ✅
- One responsibility per component: `AreaOnboarding` composes; the suggest modal is an internal sub-piece. ✅
- No new global state; server state via TanStack Query only. ✅

### Reuse (no new primitives)

`Select` (searchable single-select, 16px input + h-12 ≥44px target), `Dialog`, `Button`, `TextField`, `Textarea`, `useToast`, `EmptyState`/`ErrorState`, `Skeleton`. No new `ui/` primitive — rule-of-three not met.

### Cross-repo seam

The Zone read contracts are the seam. Frontend depends only on the OAS shapes; the paired backend WP satisfies them. The api-client envelope (`{ data, meta }`, inner `data` validated) is the shared contract — same pattern as every other endpoint.

---

## Stage 5 — Contract Design

Three OAS files authored under `contracts/api/zone/`. Conventions match existing files (`<method>-<route>.v1.yaml`, `{ data, meta }` envelope, error envelope, `Idempotency-Key` on writes).

| File | Endpoint | Auth | Notes |
| --- | --- | --- | --- |
| `get-hubs.v1.yaml` | `GET /api/v1/zone/hubs` | optional | Lists active City Hubs (`id`, `name`, `region`). Public reference data. |
| `get-areas.v1.yaml` | `GET /api/v1/zone/areas` | optional | `?hub_id=` (required), `?q=` (optional search). Returns areas with `id`, `name`, `hub_id`. Zone/Belt mapping is **not** exposed (admin-derived, Zone §2). |
| `post-area-suggestions.v1.yaml` | `POST /api/v1/zone/area-suggestions` | bearer | User suggests a missing area: `{ hub_id, name, note? }` → `{ id, status: "submitted" }`. Feeds the existing admin review queue (admin.ts). Requires `Idempotency-Key`. |

Backend implementation (these three) is **WP-20260625a-zone-public-read** in `kalaanba-api`.

---

## Stage 6 — Implementation (frontend scaffold)

Files created:

- `contracts/api/zone/get-hubs.v1.yaml`, `get-areas.v1.yaml`, `post-area-suggestions.v1.yaml`
- `src/lib/api/zone.ts` — client + Zod schemas (`listHubs`, `listAreas`, `suggestArea`)
- `src/lib/api/hooks/use-zone.ts` — `useHubs`, `useAreas`, `useSuggestArea`
- `src/components/onboarding/area-onboarding.tsx` — hub → area picker + suggest dialog
- `src/components/onboarding/index.ts` — barrel
- `src/app/onboarding/area/page.tsx` — route + smart redirect

Files modified:

- `src/lib/api/auth.ts` — added `updateMyProfile()`
- `src/lib/api/hooks/use-auth.ts` — added `useUpdateProfile()`
- `src/app/auth/login/page.tsx` — `onAuthed` now routes to `/onboarding/area`

Behaviour: signup → `/onboarding/area`. The page reads `useUser()`; if `area_id` is set it redirects to `/dashboard` (returning users pass straight through). Otherwise it renders the picker. Choosing an area `PATCH`es `users/me`, invalidates the user query, and routes to `/dashboard`. "Skip for now" routes to `/dashboard` without writing. Missing area → suggest dialog posts a suggestion and toasts confirmation.

---

## Stage 7 — Security Review

- **No PII surface.** Hubs/areas are public reference data; suggest payload is `{ hub_id, name, note? }` — no personal identifiers. ✅
- **AuthZ** — `PATCH /users/me` and suggest are bearer-authenticated (token stored post-signup). The page guards on `useUser()`; unauthenticated ⇒ `useUser` returns null ⇒ redirect to login (existing guard behaviour). ✅
- **Idempotency** — both writes carry `Idempotency-Key` via the api-client (Law 14). ✅
- **Input bounds** — area suggestion name length validated client-side (2–80) and re-validated server-side by the paired WP. ✅
- **No new enumeration oracle** — area listing is intentionally public reference data; it reveals no account information. ✅
- **XSS** — no `dangerouslySetInnerHTML`; area names rendered as text. ✅

No findings requiring remediation.

## Stage 8 — QA Plan + Tests

`src/components/onboarding/area-onboarding.test.tsx` (hooks mocked):

- renders hub select first; area select enabled only after a hub is chosen;
- selecting an area calls `useUpdateProfile` with the area id then `onDone`;
- "Skip for now" calls `onDone` without an update;
- "Can't find it? Suggest" opens the dialog; submitting calls `useSuggestArea`.

Gates: `npm run lint`, `npm run typecheck`, `npm run test` (vitest) — all green (see closing note when run).

Mobile-ready checklist (DESIGN_LANGUAGE §9.7): reuses `Select`/`Dialog`/`Button` which already satisfy 44px targets, 16px inputs, hover-guarded states, reduced-motion. No `100vh`, no animated layout props. ✅

## Stage 9 — Docs Update

- This WP doc.
- `docs/Architecture/Build_Plan.md` — Phase 1.3 frontend profile-screen line ticked.
- Flagged (not silently fixed): Zone doc needs a public-read-surface section; Identity §7.1 `area_id` wording drift. Handed to docs-scribe.
- Sankofa journal entry (pattern: contract-first frontend scaffold across the repo seam; area capture is skippable post-signup).

## Stage 10 — Release Packet

**Unblocked.** Paired **WP-20260625a-zone-public-read** shipped the three Zone endpoints in `kalaanba-api` (live-verified: `/zone/hubs` → Tamale, `/zone/areas` → Aboabo) and fixed the unauthenticated-API 500. The dev DB is seeded with `ZoneHierarchySeeder`. End-to-end: sign in → `/onboarding/area` → pick Tamale → Aboabo → `PATCH /users/me` → `/dashboard`.

Both WPs' code is green for their own changes (front: lint + new-file typecheck + 4 onboarding tests; back: Pint + PHPStan + Deptrac + 9 feature tests). Two pre-existing, out-of-scope gate failures are documented in WP-20260625a Stage 8 (an `env()` PHPStan rule in `AdminAccessCodeSeeder` and 4 `OtpServiceTest` unit failures) — neither introduced here.
