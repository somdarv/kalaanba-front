# WP-20260624-identifier-first-auth

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.

| Field                | Value                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260624-identifier-first-auth`                                                                                             |
| **Title**            | Identity Engine — Identifier-first progressive authentication (single entry + account lookup)                                   |
| **Opened**           | 2026-06-24                                                                                                                       |
| **Closed**           | —                                                                                                                                |
| **Owner**            | Sole developer / product owner                                                                                                   |
| **Canonical doc**    | [Identity Engine System Document](../engines/identity/Identity_Engine_System_Document.md) — §4 (auth model), §6 (uniqueness), §12 (privacy) |
| **ADR**              | [ADR-0004 — Identifier-first progressive auth](../adr/0004-identifier-first-progressive-auth.md)                                |
| **Build Plan phase** | Phase 1.3 — Identity Engine (frontend auth UX)                                                                                  |
| **Repo(s)**          | `kalaanba-api` (lookup endpoint), `kalaanba-front` (flow + client)                                                              |
| **Status**           | 🟢 **All 10 stages green — ready for PR**                                                                                        |

---

## Pipeline Progress

- [x] Stage 1 — Intake
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check (ADR-0004)
- [x] Stage 5 — Contract Design
- [x] Stage 6 — Implementation
- [x] Stage 7 — Security Review
- [x] Stage 8 — QA Plan + Tests
- [x] Stage 9 — Docs Update
- [x] Stage 10 — Release Packet

---

## Stage 1 — Intake

### Problem

The shipped auth UI forced two decisions before anything could happen: *which channel* (phone/email toggle) **and** *new vs returning* (`/auth/login` vs a separate `/auth/signup`). Grassroots users routinely guess wrong — tapping signup when they have an account or vice-versa — producing friction and orphaned half-accounts. The product wants a single, neutral entry that detects returning-vs-new **after** the identifier is entered ("we detect; we don't ask").

### Goal

One entry screen. The person enters a phone or email; the system resolves existence and branches copy + flow. "Welcome back" only appears for genuinely returning users.

---

## Stage 4 — Architecture Check → ADR-0004

The spec contradicted the **locked** Identity §4 ("user chooses channel at signup, TikTok-style"). Per the engine-docs rule, the doc wins until an ADR overrides it — so [ADR-0004](../adr/0004-identifier-first-progressive-auth.md) re-baselines the **entry model** to identifier-first. The account model (§2/§6/§7/§12) is unchanged. The only net-new capability is a read-only branch signal.

---

## Stage 5 — Contract Design

- **NEW** `contracts/api/identity/post-auth-lookup.v1.yaml` — `POST /auth/lookup { identifier } → { exists, channel }`. Read-only (no `Idempotency-Key`), no PII, strictly throttled, channel inferred from shape.
- **NEW** config key `contracts/config/auth/auth.throttle.lookup.per_minute.yaml` (default 5).
- All other branches reuse existing contracts: `otp/request`, `otp/verify`, `registration`, `sessions`, `email/verify`.

---

## Stage 6 — Implementation

**Backend (`kalaanba-api`)**

- `LookupController` (thin) → `LookupAccountHandler` (application; reuses `UserRegistrationRepository::{emailInUse,phoneInUse}` + `PhoneHash`) → `LookupResult` DTO.
- `LookupRequest` form request; route under new `throttle:lookup` limiter (keyed by `sha1(identifier)` + IP).
- Email normalised `mb_strtolower(trim(...))` to match registration storage.

**Frontend (`kalaanba-front`)**

- `lookupAccount()` client + `useLookup()` hook + `LookupResultSchema`.
- `src/components/auth/flow/` — `AuthFlow` orchestrator (step state machine) + `IdentifierStep`, `PhoneOtpStep` (request-on-mount + throttled resend), `PhoneProfileStep`, `EmailLoginStep`, `EmailCreateStep`; reuses `EmailVerifyPending`.
- `/auth/login` renders `<AuthFlow>`; `/auth/signup` redirects to it; the "Create an account" link is gone.
- Deleted superseded `phone-auth-form.tsx` / `email-auth-form.tsx`.
- **Fix:** the api client unwraps the `{data,meta}` envelope and validates inner `data` (per `client.test.ts`), but `auth.ts` schemas + `use-auth.ts` consumers were written against the full envelope. Corrected `SessionResponseSchema`, `OtpRequestResponseSchema`, `RegistrationResponseSchema` to inner shapes and updated the 6 consumers.

---

## Stage 7 — Security Review

Lookup is an intentional, unauthenticated account-existence oracle. Mitigations (ADR-0004 §3):

- Strict rate limit keyed by identifier + IP (`auth.throttle.lookup.per_minute`, default 5); identifier hashed in the limiter key.
- Response carries only `{ exists, channel }` — no name/avatar/role/masked phone. Test asserts no PII leak.
- Always `200` same-shape (no 404 oracle); archived accounts read `exists=false`.
- Terminal steps keep generic copy (wrong-password message does not reveal existence).
- No identifier logged in plaintext (phone hashed / email omitted).

---

## Stage 8 — QA Plan + Tests

- **Backend** `tests/Feature/Auth/LookupTest.php` — 9 cases: known/unknown phone + email, case-insensitive email, archived→false, no-PII, invalid identifier (422 `auth.identifier_invalid`), no-Idempotency-Key, rate limit (429). phpstan clean; 28 architecture tests green.
- **Frontend** `auth-flow.test.tsx` — 6 cases: neutral entry (no signup link), email returning→password, email new→create, phone→OTP request, recognised phone→"Welcome back", empty-identifier validation guards lookup. Full suite 30/30 green.

---

## Stage 10 — Release Packet

- **Migrations:** none.
- **Config flags:** `auth.throttle.lookup.per_minute` (default 5) — register in admin config; safe default.
- **Rollback:** revert the PR; the lookup endpoint is additive and unused by other engines. `/auth/signup` redirect and the client-schema fix revert cleanly.
- **Follow-ups (flagged, out of scope):**
  1. The OTP/registration endpoints return Laravel-native validation errors (`{errors:{...}}`), not the standard `{error:{code}}` envelope, so the client collapses them to a generic message. Precise spec copy for *expired* / *too-many-attempts* OTP states needs the backend to emit the standard error envelope.
  2. `/auth/forgot-password` is linked from the returning-email step but not yet built.
  3. Email new-user step collects a name (registration requires it) — a minor addition over the screen-by-screen spec, framed as "start your career".
