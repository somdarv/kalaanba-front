# ADR-0004: Identifier-first progressive authentication

- **Status:** Accepted
- **Date:** 2026-06-24
- **Work Packet:** WP-20260624-identifier-first-auth
- **Affected engines:** Identity (authentication model, §4); Notification & Distribution (OTP / email transport — unchanged)

## Context

The Identity Engine System Document §4 locks a **channel-choice signup** model:

> "V1 supports two authentication channels — the user chooses at signup (TikTok-style)."

The shipped UI mirrors this literally: a `/auth/login` screen with a phone⇄email toggle and a **separate** `/auth/signup` page. The person is forced to declare, up front, both *which channel* they want **and** *whether they are new or returning*. That is two decisions the product does not need from them and that grassroots users routinely get wrong (tapping "sign up" when they already have an account, or vice-versa), producing duplicate-attempt friction and orphaned half-accounts.

Product direction (the auth-flow spec, 2026-06-24) replaces this with **identifier-first progressive auth**, modelled on Uber / WhatsApp / TikTok:

- One neutral entry screen. The person enters a single identifier (phone **or** email). The system never asks "do you have an account?".
- The system detects new-vs-returning **after** entry and branches the copy and the flow accordingly ("Welcome back" only once an account is actually matched).
- Typo protection is channel-appropriate: the **OTP step itself** is the phone typo-guard (a wrong number never receives a code); **email** has no such natural guard, so existence must be resolved *before* asking for a password, and new email accounts get a verification link.

This contradicts the locked §4. Per `engine-docs-mandatory.instructions.md` ("if the doc contradicts the spec, the doc wins until an ADR overrides it"), the model change requires this ADR before any code lands.

### The branch signal

To branch copy/flow, the frontend needs to know whether an identifier maps to an existing active account **before** committing to a path. No such capability exists today. Two shapes were considered:

- Fold the signal into existing endpoints (e.g. `/auth/otp/request` returns `account_exists`). Rejected: it overloads a state-mutating, OTP-dispatching endpoint with a read concern, and still leaves **email** (which must branch *before* any action) without a signal.
- A dedicated lookup endpoint. Chosen.

### The enumeration tradeoff

Any "does this identifier have an account?" capability is an **account-enumeration oracle** and brushes against the Identity §12 Privacy Contract. The product owner has accepted a **bounded** enumeration risk in exchange for the cleaner UX (the same tradeoff Uber/Google/TikTok accept), provided it is mitigated. This ADR records that decision and the mitigations.

## Decision

**Identity adopts identifier-first progressive authentication as the V1 self-service auth model**, superseding the channel-choice framing in §4. No change to the underlying account model: one human = one user row, phone and/or email channels, the PENDING_CLAIM → CLAIMED lifecycle, role/scope, and the privacy contract are all unchanged. **Only the entry experience and the addition of a lookup signal change.**

### 1. New endpoint — `POST /api/v1/auth/lookup`

- Request: `{ "identifier": "<phone E.164 | email>" }`. The server infers the channel from the shape (leading `+` and digits ⇒ phone; otherwise email).
- Response: `{ "data": { "exists": boolean, "channel": "phone" | "email" } }`.
- **Read-only** — never mutates state, never dispatches an OTP or email. Therefore **no `Idempotency-Key`** is required (it is not a user-triggered write).
- **Returns no PII** — never echoes a masked phone, a name, an avatar, or any account attribute. Only the boolean + the inferred channel.
- `exists` is computed against **non-archived** users only (consistent with the §6 identifier-uniqueness rule), so an archived account reads as `exists=false` and its identifier is re-registerable.

### 2. Flow (frontend orchestration over existing endpoints)

```
Entry (neutral) ─ identifier ─► POST /auth/lookup ─► { exists, channel }
  channel=phone:
     POST /auth/otp/request (always)               ─► OTP screen
        exists=true  → POST /auth/otp/verify         → session (login)
        exists=false → profile setup (name) →
                       POST /auth/registration        → session (new user)
  channel=email:
        exists=true  → password screen →
                       POST /auth/sessions            → session (login)
        exists=false → create-password screen →
                       POST /auth/registration        → email-verify pending →
                       GET  /auth/email/verify/{token} → session
```

The phone OTP step remains the typo-guard. `lookup` only selects **copy and routing**; the OTP/registration endpoints retain their own authoritative validation, so a lookup that is racing a concurrent archive/registration cannot produce an inconsistent outcome — the terminal endpoint is the source of truth.

### 3. Enumeration mitigations (mandatory, enforced in this WP)

- **Strict rate limiting** via a dedicated `throttle:lookup` limiter, keyed by **both** IP and submitted identifier. Config key `auth.throttle.lookup.per_minute` (default `5`, the §11 strict-auth tier).
- **No PII in the response** (see §1) and **no PII in logs** — the identifier is never logged in plaintext (phone hashed, email omitted), per §12 / engineering-standards §10.
- **Uniform behaviour** — the endpoint returns the same response shape and `200` regardless of existence; it never 404s on a missing account (which would itself be an oracle with different latency/shape).
- **Generic security copy is preserved on the terminal steps** — e.g. wrong-password copy stays generic ("That password isn't right"), so the *password* step never becomes a second oracle.

## Alternatives considered

- **A: Keep channel-choice signup, only restyle.** Rejected — does not deliver the product requirement (the "we detect, we don't ask" model); leaves the duplicate-attempt friction.
- **B: No lookup; action-first email (submit password, backend replies login-or-create).** Privacy-preferable, but the product owner explicitly chose the cleaner lookup-driven UX (see the WP intake). Retained as the fallback if enumeration abuse is observed in alpha.
- **C: Existence signal folded into `/auth/otp/request`.** Rejected — overloads a mutating endpoint and does not cover the email branch.

## Consequences

### Positive
- One entry screen; the person makes one decision (their identifier), not three.
- "Welcome back" is only ever shown to genuinely returning users — copy integrity.
- No new account model, no migration — purely additive endpoint + a frontend restructure.
- New-user phone flow falls naturally into profile setup after the number is proven.

### Negative
- Introduces a bounded account-enumeration surface. Mitigated as above; fallback B documented if abused.
- The `/auth/login` vs `/auth/signup` split collapses — old deep links to `/auth/signup` must redirect into the unified entry (handled in this WP).

### Neutral
- §4 of the Identity doc is updated to cite this ADR; the locked account model (§2, §6, §7, §12) is untouched.

## Implementation checklist (WP-20260624-identifier-first-auth)

- [x] ADR-0004 authored.
- [ ] Contract `contracts/api/identity/post-auth-lookup.v1.yaml`.
- [ ] Backend: `LookupController`, `LookupAccount` application service, `LookupRequest`, route under `throttle:lookup`; `auth.throttle.lookup.per_minute` config + limiter registration; feature test (exists / not-found / archived / throttle / no-PII).
- [ ] Frontend: `lookupAccount()` client + `useLookup()` hook + Zod schemas.
- [ ] Frontend: progressive `AuthFlow` orchestrator + entry/OTP/profile/password/verify screens + spec copy + error/edge/resend/back-paths.
- [ ] Wire `/auth/login` to the flow; redirect `/auth/signup`; remove explicit "Create an account" link from entry.
- [ ] Update Identity §4 to cite this ADR; glossary; Build Plan.

## References

- `docs/engines/identity/Identity_Engine_System_Document.md` §4 (auth model), §6 (identifier uniqueness), §11/§12 (privacy + throttling).
- `.github/instructions/engineering-standards.instructions.md` §7 (API design), §11 (security — strict auth rate limits).
- The auth-flow spec (WP-20260624 intake) — identifier-first progressive auth, screen-by-screen copy.
- ADR-0003 — UUIDv7 user identity.
