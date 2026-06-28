# WP-20260530-identity-registration

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.

| Field                | Value                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260530-identity-registration`                                                                                              |
| **Title**            | Identity Engine — Self-signup (phone OTP / email+password), email verification, channel binding                                  |
| **Opened**           | 2026-05-29                                                                                                                       |
| **Closed**           | —                                                                                                                                |
| **Owner**            | Sole developer / product owner                                                                                                   |
| **Canonical doc**    | [Identity Engine System Document](../engines/identity/Identity_Engine_System_Document.md) — §4 (auth channels), §6 (lifecycle), §7.1 (self-signup), §8 (profile surface — channel binding) |
| **Build Plan phase** | Phase 1.3 — Identity Engine (Backend WP 2 of 3)                                                                                  |
| **Repo(s)**          | `kalaanba-api` (primary), `kalaanba-front` (OAS contracts only)                                                                  |
| **Status**           | 🟢 **Stage 8 (QA) green — all gates pass; Docs + Release packet remain**                                                          |

---

## Pipeline Progress

- [x] Stage 1 — Intake (this doc)
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check
- [x] Stage 5 — Contract Design
- [x] Stage 6 — Implementation
- [x] Stage 7 — Security Review
- [x] Stage 8 — QA Plan + Tests
- [ ] Stage 9 — Docs Update
- [ ] Stage 10 — Release Packet

---

## Stage 1 — Intake

### Problem

Today the platform has exactly one path into a user account: the seeded Super Admin (`config/godmode.php`) plus the `POST /api/v1/auth/sessions` (email+password login) and `POST /api/v1/auth/otp/{request,verify}` endpoints. Those endpoints **only authenticate users that already exist** — they do not create them. There is no way for a real human to register.

The previous WP (WP-20260529) added profile/area/avatar surfaces but assumed the user row already exists. This WP delivers the self-signup primitives required by Identity Engine §4 and §7.1: phone-OTP signup, email+password signup with email verification, and the cross-channel binding endpoints (§4.3, §8.3–8.4).

### Goal

After this WP closes:

1. **Self-signup via phone+OTP** — `POST /api/v1/auth/registration` accepts `phone_e164`, `name`, `area_id`, `otp`. Creates a `users` row with `role=user`, `claimed_at=now()`, `phone_e164_hash` set; issues a Sanctum token in the same response.
2. **Self-signup via email+password** — same endpoint accepts `email`, `password`, `name`, `area_id`. Creates a `users` row with `role=user`, `claimed_at=NULL` initially, `email` set but `email_verified_at=NULL`. Returns a one-time email verification token (delivered out-of-band via Notification engine in alpha+; logged in dev). No Sanctum token until verification.
3. **Email verification** — `POST /api/v1/auth/email/verify` accepts the token, sets `email_verified_at` + `claimed_at`, returns a Sanctum token.
4. **Channel binding** — `POST /api/v1/users/me/channels/phone` (auth: required) starts adding a phone to an email-only user (sends OTP). Verified via the same `POST /api/v1/auth/otp/verify` consumed for login, but scoped to a "bind" claim so it does not issue a second login token. Mirror endpoint for email: `POST /api/v1/users/me/channels/email`.
5. **Schema upgrade** — `users.email` becomes nullable; `users.password` becomes nullable; both uniqueness constraints become partial (`WHERE archived_at IS NULL`); add `claimed_at TIMESTAMPTZ NULL`; add CHECK constraint `phone_e164_hash IS NOT NULL OR email IS NOT NULL`.
6. **Lifecycle event** — `identity.user.registered` emitted via Outbox on every successful registration (V1 channel agnostic, single shape). Email verification emits no event in V1 (Identity doc §11 lists register/claim/role/archive only; "claim" here covers email verification on a self-signup email account by moving `claimed_at` from NULL → now()).
7. **Lifecycle event** — `identity.user.claimed` emitted when an email user verifies (sets `claimed_at`). Phone signups emit `identity.user.claimed` immediately (same event shape).
8. **Config keys** — registration on/off switch, password strength rules, email-verify TTL, throttles.

### Non-goals

- **No admin-invited (PENDING_CLAIM) flow.** Owned by WP-20260531 (the third Identity backend WP) together with role management. The shadow user state + `verify-invite` machinery is explicitly out of scope here.
- **No social login** (Google/Facebook/Apple). Identity engine doc §15 open question; not in V1.
- **No password reset.** Will follow in a small follow-up WP (`WP-20260532-password-reset`) — out of scope.
- **No multi-phone / multi-email per user.** Exactly one of each.
- **No frontend implementation.** That ships in a dedicated front-end WP.

### Affected engines

- **Identity** (primary) — schema, registration, verification, binding endpoints, two new outbox event types.
- **Notification & Distribution** (consumer) — receives `identity.user.registered` and `identity.user.claimed` from the Outbox; delivers email-verify links and (eventually) welcome messages. **Email delivery itself is its concern, not ours** — Identity only hands the token to Notification via an event.
- **Zone** (consumer) — registration calls `Zone\Application\AreaExistsQuery` (same call pattern as WP-20260529 PATCH /users/me).
- **Admin Configuration & Governance** (consumer) — ~8 new config keys registered.

### Configuration keys touched

| Key                                              | Type     | Default                              | Purpose                                                          |
| ------------------------------------------------ | -------- | ------------------------------------ | ---------------------------------------------------------------- |
| `auth.registration.open`                         | bool     | `true`                               | Master switch. `false` → all `/auth/registration` calls 403.     |
| `auth.password.min_length`                       | int      | `10`                                 | Min password length.                                             |
| `auth.password.require_mixed_case`               | bool     | `true`                               | Must contain at least one upper + one lower.                     |
| `auth.password.require_number`                   | bool     | `true`                               | Must contain at least one digit.                                 |
| `auth.password.require_symbol`                   | bool     | `false`                              | Must contain at least one symbol.                                |
| `auth.email_verify.ttl_hours`                    | int      | `24`                                 | TTL of email verification token.                                 |
| `auth.throttle.registration.per_minute`          | int      | `5`                                  | Per-IP throttle for `/auth/registration`.                        |
| `auth.throttle.email_verify.per_minute`          | int      | `10`                                 | Per-IP throttle for `/auth/email/verify`.                        |
| `auth.throttle.channel_bind.per_minute`          | int      | `5`                                  | Per-IP throttle for `/users/me/channels/*`.                      |

Existing keys re-used: `auth.session.ttl_days`, `auth.throttle.otp.per_minute`, `users.profile.name_min/max`.

### Contracts touched

New OAS files under `contracts/api/identity/`:

- `auth-registration-post.yaml`
- `auth-email-verify-post.yaml`
- `users-me-channels-phone-post.yaml`
- `users-me-channels-email-post.yaml`

New event schema under `contracts/events/identity/`:

- `identity.user.registered.v1.yaml`
- `identity.user.claimed.v1.yaml`

The `contracts/events/identity/` directory does not exist yet — this WP creates it.

### Open questions

1. **Welcome notification** — should `identity.user.claimed` cause Notification to dispatch a welcome inbox message? **Proposed: yes, but the Notification side ships under WP-20260530a (a tiny follow-up).** The event shape supports it; subscription wiring is one extra step.
2. **Email verification token storage** — proposed: dedicated `email_verifications` table with `(user_id, token_hash, expires_at, consumed_at)`. Token returned to caller is the plaintext; only the hash is persisted. Modeled after Laravel's password reset table; named distinctly.
3. **Password hashing** — `bcrypt` via Laravel's default `Hash::make` (engineering-standards §10). No bespoke crypto.

---

## Stage 2 — Impact Map

Answers to Stage 1 open questions (locked in by user 2026-05-29):

1. **Welcome notification** — yes in principle; **deferred** to a follow-up WP (`WP-20260530a`). Event is emitted now; subscription wiring lands later.
2. **Email-verify token storage** — dedicated `email_verifications` table (`user_id`, `token_hash`, `expires_at`, `consumed_at`); plaintext returned in response (alpha) or shipped via Notification event (later); only hash persisted.
3. **Password hashing** — Laravel `Hash::make` (bcrypt). No bespoke crypto.

### Files to create

**Migrations**
- `database/migrations/2026_05_30_000001_relax_users_identity_constraints.php` — make `email` + `password` nullable, drop existing `users_email_unique` + `users_phone_e164_hash_unique`, add partial unique indexes filtered by `archived_at IS NULL`, add `claimed_at TIMESTAMPTZ NULL`, add CHECK `phone_e164_hash IS NOT NULL OR email IS NOT NULL`. Postgres-only paths guarded by driver check (matches pattern from `2026_05_20_223100_add_identity_fields_to_users_table.php`).
- `database/migrations/2026_05_30_000002_create_email_verifications_table.php` — UUID PK, `user_id` FK to users, `token_hash` (64-char, indexed), `expires_at`, `consumed_at` nullable, `created_at`. Engineering-standards §8: archive-don't-delete on consumption (set `consumed_at`).

**Domain (framework-free)**
- `app/Modules/Identity/Domain/Registration/RegistrationChannel.php` — enum `phone` / `email`.
- `app/Modules/Identity/Domain/Registration/PasswordPolicy.php` — value object reading rules from config snapshot; `validate(string $plain): array` returning violation codes.
- `app/Modules/Identity/Domain/EmailVerification/EmailVerificationToken.php` — value object (plaintext + hash + ttl).
- `app/Modules/Identity/Domain/Events/UserRegistered.php` — payload: `user_id`, `role`, `channel` (phone|email), `area_id`, `name`, `claimed_at` (nullable), `occurred_at`.
- `app/Modules/Identity/Domain/Events/UserClaimed.php` — payload: `user_id`, `channel`, `claimed_at`, `occurred_at`.

**Application**
- `app/Modules/Identity/Application/Registration/RegisterUserCommand.php` — DTO.
- `app/Modules/Identity/Application/Registration/RegisterUserHandler.php` — orchestrates: validate config flag → validate channel-specific inputs → consume OTP (phone) or create email-verify token (email) → create user row → emit `UserRegistered` (+ `UserClaimed` for phone path) → return either `Session` (phone) or `EmailVerificationStarted` (email).
- `app/Modules/Identity/Application/EmailVerification/ConfirmEmailCommand.php` + `Handler.php` — verifies token, sets `email_verified_at` + `claimed_at`, emits `UserClaimed`, issues Sanctum token.
- `app/Modules/Identity/Application/ChannelBinding/AddPhoneCommand.php` + `Handler.php` — starts OTP (via existing `OtpService`), returns masked phone + expiry.
- `app/Modules/Identity/Application/ChannelBinding/ConfirmPhoneCommand.php` + `Handler.php` — consumes OTP, sets `phone_e164_hash` + `last4`, emits `UserClaimed` (for the new channel — payload `channel=phone`).
- `app/Modules/Identity/Application/ChannelBinding/AddEmailCommand.php` + `Handler.php` — creates `email_verifications` row, returns token.
- `app/Modules/Identity/Application/ChannelBinding/ConfirmEmailBindingCommand.php` + `Handler.php` — consumes token, sets `email` + `email_verified_at`, emits `UserClaimed` (`channel=email`).
- `app/Modules/Identity/Application/Ports/EmailVerificationRepository.php` — interface (issue, findByPlaintext, consume).
- `app/Modules/Identity/Application/Ports/UserRegistrationRepository.php` — interface (existsByEmail, existsByPhoneHash, create).

**Infrastructure (lives in `app/Infrastructure/Identity/` per the WP-20260529 rule)**
- `app/Infrastructure/Identity/EloquentUserRegistrationRepository.php`
- `app/Infrastructure/Identity/EloquentEmailVerificationRepository.php`
- `app/Modules/Identity/Infrastructure/Events/UserRegisteredOutboxAdapter.php` + `UserClaimedOutboxAdapter.php` — wire to existing Outbox per the Outbox engine doc.

**Http**
- `app/Http/Controllers/Auth/RegistrationController.php` — `store(RegisterRequest)`.
- `app/Http/Controllers/Auth/EmailVerificationController.php` — `confirm(ConfirmEmailRequest)`.
- `app/Http/Controllers/Identity/ChannelBindingController.php` — `addPhone`, `confirmPhone`, `addEmail`, `confirmEmail`.
- `app/Http/Requests/Auth/RegisterRequest.php` — branching validator (phone path requires `phone_e164` + `otp`; email path requires `email` + `password`).
- `app/Http/Requests/Auth/ConfirmEmailRequest.php`
- `app/Http/Requests/Identity/AddPhoneRequest.php`, `ConfirmPhoneRequest.php`, `AddEmailRequest.php`, `ConfirmEmailBindingRequest.php`
- `app/Http/Resources/Auth/EmailVerificationStartedResource.php` — `{token, expires_at}` (alpha; the token field is gated behind `app.env != production` once Notification integration ships).

**Service Provider wiring**
- Update `app/Modules/Identity/Infrastructure/IdentityServiceProvider.php` (binds new ports).

**Routes**
- `routes/api.php` — 7 new routes under `v1/auth` and `v1/users/me/channels`.

**Config**
- `config/auth.php` — extend with `registration`, `password`, `email_verify`, `throttle.registration`, `throttle.email_verify`, `throttle.channel_bind` sub-arrays. (Engineering-standards §6: all configurable.)
- `config/eventbus.php` — register two new event topics if registry-based.

**Contracts**
- `contracts/api/identity/auth-registration-post.yaml`
- `contracts/api/identity/auth-email-verify-post.yaml`
- `contracts/api/identity/users-me-channels-phone-post.yaml`
- `contracts/api/identity/users-me-channels-email-post.yaml`
- `contracts/events/identity/identity.user.registered.v1.yaml`
- `contracts/events/identity/identity.user.claimed.v1.yaml`
- `contracts/events/identity/README.md` (new directory)

**Tests**
- `tests/Feature/Auth/RegistrationTest.php` — phone-path happy + bad OTP + duplicate phone + registration-closed + area-not-found + name-too-short.
- `tests/Feature/Auth/EmailRegistrationTest.php` — email-path happy + duplicate email + weak password (× rules) + email path requires verification before login.
- `tests/Feature/Auth/EmailVerificationTest.php` — token happy + expired + already-consumed + unknown.
- `tests/Feature/Identity/ChannelBindingTest.php` — add phone + already-has-phone (409) + add email + email already in use (409) + bind-OTP cannot log in.
- `tests/Architecture/IdentityRegistrationArchTest.php` — Identity\\Application has no `App\\Models\\User`, no `Illuminate\\Support\\Facades\\Hash`; Identity\\Domain has no framework deps; partial unique index migration is gated by Postgres driver.
- `tests/Unit/Identity/PasswordPolicyTest.php` — drives config-key matrix.

### Files to modify

- `database/migrations/0001_01_01_000000_create_users_table.php` — **not edited** (immutable historical migration); new migration relaxes constraints additively.
- `app/Models/User.php` — add `claimed_at` to `$casts` (`datetime`). No fillables.
- `app/Http/Controllers/Auth/SessionController.php` — add an early check: if `email_verified_at IS NULL` AND `password IS NOT NULL`, reject with `email.unverified`. Update `SessionResource` to include `email_verified` flag (additive).
- `app/Http/Resources/Auth/SessionResource.php` — additive: include `email_verified: bool`, `phone_bound: bool` (computed from hash present).
- `app/Modules/Identity/Application/MeProfileQuery.php` — no change; output already returns nullable email per WP-20260529.
- `bootstrap/app.php` — register new throttle aliases (`throttle:registration`, `throttle:email-verify`, `throttle:channel-bind`).
- `tests/Feature/Auth/SessionStoreTest.php` — add: unverified-email user cannot log in via password.

### Engine boundaries

Every action stays inside Identity. The only outbound effects are two Outbox events (`identity.user.registered`, `identity.user.claimed`) — Notification/Analytics may subscribe later. **No cross-schema reads, no cross-engine writes.** Zone is read via the existing `AreaExistsQuery` port (Application-layer, framework-free interface satisfied by `app/Infrastructure/Zone/EloquentAreaQuery.php`). 

### Pipeline gates (must pass before WP closes)

- `vendor/bin/pint` — 0 changes
- `php -d memory_limit=1G vendor/bin/phpstan analyse --no-progress` — 0 errors at level 6
- `vendor/bin/deptrac --no-progress` — 0 violations (Domain isolated; Application depends only on Domain + Ports)
- `php -d memory_limit=1G vendor/bin/pest tests/Architecture` — all green
- `php -d memory_limit=1G vendor/bin/pest tests/Feature tests/Unit` — all green; total + previously-passing tests stay green

### Rollback plan

Each new migration has a complete `down()`. The Stage 1 migration's `down()` restores `NOT NULL` on `email`/`password` and the original full unique indexes — safe only if no rows have NULL email or NULL password, so rollback requires either a fresh DB or a data backfill. Engineering-standards §8: documented in the migration's header doc comment.

---

## Stage 3 — Rules Review

Engine-doc citations (`docs/engines/identity/Identity_Engine_System_Document.md`):

### Invariants honored

1. **§6 state machine.** Phone-self-signup creates user **directly in CLAIMED** (`claimed_at = now()`). Email-self-signup creates user in **PENDING_CLAIM** (`claimed_at = NULL`); only the email-verify confirmation transitions to CLAIMED.
2. **§6 identifier uniqueness rule.** `UNIQUE (phone_e164_hash) WHERE archived_at IS NULL AND phone_e164_hash IS NOT NULL` and `UNIQUE (email) WHERE archived_at IS NULL AND email IS NOT NULL`. Migration must implement both.
3. **§7.1 config gate.** `auth.registration.open=false` → both signup paths return **403**.
4. **§7.1 validation rules.** Exactly one channel must be present; name length per `users.profile.name_min/max`; `area_id` must exist in Zone via `AreaExistsQuery`; password rules per `auth.password.*`.
5. **§8 channel invariant.** DB CHECK `phone_e164_hash IS NOT NULL OR email IS NOT NULL`.
6. **§9 role assignment is OFF-LIMITS.** Registration payload MUST NOT accept a `role` field. Defaults to `user`. Architecture test will assert this.
7. **§12.1 phone privacy.** Plaintext phone is never persisted. Hashing via existing `Kalaanba\Support\Auth\PhoneHash` (already used by `OtpController::findActiveUserByPhone`). No new hashing code.
8. **§12.3 public projection.** Existing `GET /users/{id}` already excludes email/phone/role (WP-20260529). This WP adds no new public surface. Verification token responses are 200-only and authenticated-or-fresh-signup; never indexed in public projection.
9. **Constitution Law 1.** Zone is consulted via the existing `AreaExistsQuery` port — no cross-schema join.
10. **Constitution Law 6 / engine doc §11.** All cross-engine effects ride the Outbox. Notification consumes events; we do **not** call Notification directly.
11. **Constitution Law 14.** All three POST endpoints are wrapped by the existing `idempotency` middleware (already proven in WP-20260529).

### Event names — corrected against engine doc §11

The engine doc uses **underscore** topic names. Updating the events accordingly:

| Trigger | Event topic | Notes |
| --- | --- | --- |
| Phone-path self-signup succeeds | `identity.user_registered` | `registered_via=self, registered_channel=phone`. **No `user_claimed`** event — phone signup goes straight to CLAIMED (i.e. never spent time in PENDING_CLAIM). |
| Email-path self-signup succeeds | `identity.user_registered` | `registered_via=self, registered_channel=email`. User is in PENDING_CLAIM. |
| Email-verify confirms | `identity.user_claimed` | `claimed_via=self, claimed_channel=email`. **First and only** time user_claimed fires for a self-signup user. |
| Channel binding completes (phone bound to email-only user, or email bound to phone-only user) | `identity.user_channel_bound` | `channel=phone\|email`. Distinct from `user_claimed`. |

This corrects the Stage 1 / Stage 2 sketch (which had dot-notation and an extra `user_claimed` on phone signup).

### Engine doc deviations / clarifications

- The engine doc §7.1 email path describes the verification endpoint as `GET /api/v1/auth/email/verify/{token}` (a magic link clicked from email). For V1 backend-first delivery we ship the equivalent **`POST /api/v1/auth/email/verify`** with `{ token }` in the JSON body — same semantics, REST-friendly, and idempotency-middleware-compatible. The eventual public link can dereference to a frontend page that posts. **ADR candidate** — minor; logging here, will spin out `docs/adr/ADR-2026-05-30-email-verify-method.md` if user wants formal trace.
- The engine doc §11 omits `identity.user_archived` payload schema details we'd need; **out of scope** for this WP.
- The `users.profile.name_min` / `name_max` config keys referenced in §7.1 are already registered by WP-20260529 (`config/users.php`). Re-used here without re-introducing.

### Non-deviating reuse

- `Kalaanba\Support\Auth\PhoneHash` (existing).
- `Kalaanba\Support\Auth\Otp\OtpService` (existing) — used both for phone-signup OTP and channel-binding phone OTP. The "bind" claim is enforced by the controller layer (binding endpoint does NOT call `createToken`).
- `App\Modules\Zone\Application\AreaExistsQuery` port (existing).
- Outbox writer (existing — used by previous engines).
- `idempotency` middleware (existing).
- `throttle:otp` middleware (existing) — re-used by the phone OTP request leg of registration.

### Rules-Review verdict

No engine-boundary violations. Two minor doc-vs-implementation deltas (event names normalized to engine-doc spelling; email-verify becomes POST instead of GET). Architecture-test coverage for the "no role in registration payload" rule and the "Identity Application has no User model dependency" rule will be authored in Stage 8.

---

## Stage 4 — Architecture Check

### Namespace / layer assignment (final)

`deptrac.yaml` enforces:
- `ModuleDomain` (`Kalaanba\Modules\<X>\Domain\*`) → may depend only on Support.
- `ModuleApplication` (`Kalaanba\Modules\<X>\Application\*`) → may depend on Domain + Support + Framework.
- `ModuleInfrastructure` (`Kalaanba\Modules\<X>\Infrastructure\*`) → may depend on Domain + Application + Support + Framework.
- `ModuleHttp` — unused; we keep controllers under `App\Http\Controllers\...` (existing pattern).
- Pest arch test: **no class under `Kalaanba\Modules\*` may import `App\Models\User`**. Adapters that touch the User model live under `app/Infrastructure/<Engine>/` namespace `App\Infrastructure\<Engine>` — outside deptrac's Module collector.

Final placement:

| Class | Path | Namespace | Layer |
| --- | --- | --- | --- |
| `RegistrationChannel` (enum) | `app/Modules/Identity/Domain/Registration/RegistrationChannel.php` | `Kalaanba\Modules\Identity\Domain\Registration` | Domain |
| `PasswordPolicy` (VO) | `app/Modules/Identity/Domain/Registration/PasswordPolicy.php` | `Kalaanba\Modules\Identity\Domain\Registration` | Domain — plain config array in constructor, no facades |
| `EmailVerificationToken` (VO) | `app/Modules/Identity/Domain/EmailVerification/EmailVerificationToken.php` | `Kalaanba\Modules\Identity\Domain\EmailVerification` | Domain — `DateTimeImmutable` only |
| `UserRegistered` event | `app/Modules/Identity/Domain/Events/UserRegistered.php` | `Kalaanba\Modules\Identity\Domain\Events` | Domain — readonly DTO |
| `UserClaimed` event | `app/Modules/Identity/Domain/Events/UserClaimed.php` | `Kalaanba\Modules\Identity\Domain\Events` | Domain — readonly DTO |
| `UserChannelBound` event | `app/Modules/Identity/Domain/Events/UserChannelBound.php` | `Kalaanba\Modules\Identity\Domain\Events` | Domain — readonly DTO |
| `RegisterUserCommand` + `Handler` | `app/Modules/Identity/Application/Registration/` | `Kalaanba\Modules\Identity\Application\Registration` | Application — depends on Domain + ports + `Illuminate\Contracts\Hashing\Hasher`. No `App\Models\User`. |
| `ConfirmEmailCommand` + `Handler` | `app/Modules/Identity/Application/EmailVerification/` | `Kalaanba\Modules\Identity\Application\EmailVerification` | Application |
| `Add{Phone,Email}Command/Handler`, `Confirm{Phone,Email}Command/Handler` | `app/Modules/Identity/Application/ChannelBinding/` | `Kalaanba\Modules\Identity\Application\ChannelBinding` | Application — Phone-confirm calls `OtpService::verify` directly so a controller cannot reuse the OTP for login |
| `UserRegistrationRepository` (port) | `app/Modules/Identity/Application/Ports/UserRegistrationRepository.php` | `Kalaanba\Modules\Identity\Application\Ports` | Application — interface |
| `EmailVerificationRepository` (port) | `app/Modules/Identity/Application/Ports/EmailVerificationRepository.php` | `Kalaanba\Modules\Identity\Application\Ports` | Application — interface |
| `EventOutboxPublisher` (port) | reuse existing if present; else `app/Modules/Identity/Application/Ports/EventOutboxPublisher.php` | Application | Discover during Stage 6 |
| `EloquentUserRegistrationRepository` | `app/Infrastructure/Identity/EloquentUserRegistrationRepository.php` | `App\Infrastructure\Identity` | Infra (out-of-module) — touches `App\Models\User`, kept outside `Kalaanba\Modules\*` per WP-20260529 rule |
| `EloquentEmailVerificationRepository` | `app/Infrastructure/Identity/EloquentEmailVerificationRepository.php` | `App\Infrastructure\Identity` | Infra (out-of-module) — co-located for symmetry |
| `EloquentOutboxEventPublisher` (Identity binding) | `app/Modules/Identity/Infrastructure/EventOutboxPublisher.php` | `Kalaanba\Modules\Identity\Infrastructure` | Infra (in-module) — writes to shared `outbox` table; no User import |
| `RegistrationController` | `app/Http/Controllers/Auth/RegistrationController.php` | `App\Http\Controllers\Auth` | Http |
| `EmailVerificationController` | `app/Http/Controllers/Auth/EmailVerificationController.php` | `App\Http\Controllers\Auth` | Http |
| `ChannelBindingController` | `app/Http/Controllers/Identity/ChannelBindingController.php` | `App\Http\Controllers\Identity` | Http — one controller, 4 methods |

### Dependency direction (acyclic)

```
HTTP Controllers (App\Http\...)
        │
        ▼
Application Handlers (Kalaanba\Modules\Identity\Application\...)
        │
        ├──► Domain VOs/Events (Kalaanba\Modules\Identity\Domain\...)
        ├──► Application Ports (Kalaanba\Modules\Identity\Application\Ports\...)
        └──► Illuminate\Contracts\Hashing\Hasher (Framework)
                ▲
                │ bound at runtime by IdentityServiceProvider
                │
Eloquent adapters (App\Infrastructure\Identity\...) ── implement
        │
        ├──► Application Ports (interfaces only)
        └──► App\Models\User (allowed only here)
```

No cycles. The Module layer never imports `App\Models\User`. The service-provider seam keeps the Module compile-clean.

### Cross-engine boundary

Zone is consulted via the existing port `App\Modules\Zone\Application\AreaExistsQuery` (introduced in WP-20260529). RegisterUserHandler depends on this interface. Notification is **never imported** — we only write to the Outbox.

### Architecture-test additions (Stage 8)

1. `arch('Identity Application does not reach into Infrastructure')` — existing; auto-covers new files.
2. `arch('Identity Domain is framework-free')` — existing.
3. **New:** `arch('Modules\Identity classes do not import App\Models\User')` — explicit Identity assertion.
4. `arch('Identity Application uses DateTimeImmutable not Carbon')` — existing.
5. **New:** `arch('Identity Domain Events are final readonly DTOs')` — each event class final readonly, only a constructor.
6. The "no `role` field in registration payload" rule is a runtime contract — enforced by feature test, not arch test.

### Architecture-Check verdict

Layering satisfies deptrac config + existing arch tests. `App\Infrastructure\Identity\` placement for User-touching adapters reuses the WP-20260529 pattern.

---

## Stage 5 — Contract Design

Seven contract artefacts authored.

**OpenAPI (REST):**

| File | Endpoint(s) | Notes |
| --- | --- | --- |
| `contracts/api/identity/post-auth-registration.v1.yaml` | `POST /api/v1/auth/registration` | `oneOf` request: PhoneRegistration / EmailRegistration. `oneOf` 201 response: SessionResponse / EmailVerificationStartedResponse. |
| `contracts/api/identity/post-auth-email-verify.v1.yaml` | `POST /api/v1/auth/email/verify` | 200 response is `oneOf` SessionResponse (registration path) / MeResponse (binding path). |
| `contracts/api/identity/post-users-me-channels-phone.v1.yaml` | `POST /api/v1/users/me/channels/phone` + `…/confirm` | Two paths in one OAS file (start + confirm). |
| `contracts/api/identity/post-users-me-channels-email.v1.yaml` | `POST /api/v1/users/me/channels/email` | Verification is consumed by the existing `…/email/verify` endpoint. |

All require `Idempotency-Key` header (engineering-standards §7). Error code vocabulary aligned with existing auth/identity files.

**Outbox events** (`contracts/events/identity/`):

| File | Trigger | Emitted by |
| --- | --- | --- |
| `identity.user_registered.v1.yaml` | Registration succeeds | RegisterUserHandler (both channels) |
| `identity.user_claimed.v1.yaml` | PENDING_CLAIM → CLAIMED | ConfirmEmailHandler (only) |
| `identity.user_channel_bound.v1.yaml` | Second channel added | ConfirmPhone/EmailBindingHandler |

All three carry `event_id` as a deterministic UUIDv5 so outbox replays are idempotent (Constitution §1.14).

**Conventions verified against existing files:**
- OAS file naming: `<method>-<route>.v1.yaml` (matches `post-otp-verify.v1.yaml`).
- Event YAML schema: matches `contracts/events/zone/*` shape (top-level `event_name`, `schema_version`, `engine`, `payload`, `idempotency`, `consumers`).
- Underscore event names (engine-doc §11), not dotted.

---

## Stage 6 — Implementation _(pending)_

## Stage 4 — Architecture Check _(pending)_

## Stage 5 — Contract Design _(pending)_

## Stage 6 — Implementation _(pending)_

## Stage 7 — Security Review _(complete)_

**Reviewer:** Security Reviewer chat mode  
**Date:** 2026-05-30  
**Scope:** All code delivered in Stage 6 (Batches A–D) — 31 files across migrations, Domain/Application/Infrastructure, HTTP boundary, and DI wiring.

### S.0 — Threat model summary

Surface introduced by this WP:

| Endpoint | Auth | Rate limit | Idempotency | Sensitivity |
|---|---|---|---|---|
| `POST v1/auth/registration` | none | `registration` (3/min/IP, configurable) | yes | mints session OR persists user + verification token |
| `POST v1/auth/email/verify` | none | `email-verify` (10/min/IP, configurable) | yes | consumes token, mints session OR binds email |
| `POST v1/users/me/channels/phone` | sanctum | `channel-bind` (5/min/user, configurable) | yes | issues OTP |
| `POST v1/users/me/channels/phone/confirm` | sanctum | `channel-bind` | yes | binds phone hash to user |
| `POST v1/users/me/channels/email` | sanctum | `channel-bind` | yes | issues email verify token |

Primary attacker objectives considered: (a) account takeover, (b) channel-bind hijack, (c) enumeration of registered users by phone/email, (d) OTP/token brute force, (e) replay, (f) privilege escalation via role injection, (g) PII leakage in logs/responses, (h) DoS via OTP/email flooding.

### S.1 — OWASP Top 10 (2021) walkthrough

| # | Category | Verdict | Evidence |
|---|---|---|---|
| A01 | Broken Access Control | ✅ | BindEmail path in `EmailVerificationController::respondWithMe` enforces `$authedId === $userId` → HTTP 403 `identity.channel.bind_actor_mismatch` (verified in `EmailVerificationController.php`). Registration purpose intentionally bypasses auth (no session exists yet). Channel-bind FormRequests gate via `authorize(): bool { return $this->user() !== null; }`. |
| A02 | Cryptographic Failures | ✅ | Passwords stored via `Hash::make()` (bcrypt). Email verification tokens: only SHA-256 hash persisted (`hash('sha256', $plaintext)`); plaintext built from `bin2hex(random_bytes(32))` (256 bits CSPRNG). Phone numbers stored only as hash via `PhoneHash::hash()`. Sanctum tokens generated via `createToken()` with 30-day expiry. |
| A03 | Injection | ✅ | Eloquent + query builder used throughout; no raw SQL with user input. SQLSTATE 23505/23000 mapped to `DuplicateChannelException` in `EloquentUserRegistrationRepository` rather than leaking driver errors. |
| A04 | Insecure Design | ✅ | Channel mutual-exclusion enforced in Application handler (`RegisterUserHandler::handle()`), not via brittle `required_if`. Duplicate-channel re-checked **inside DB transaction** in `ConfirmPhoneChannelBindHandler` to close TOCTOU window. Email verification dispatches on persisted `purpose` enum (`Registration` vs `BindEmail`), preventing token-purpose confusion. |
| A05 | Security Misconfiguration | ✅ | Plaintext email verification token exposed in response only when `auth.expose_email_verify_token` config is `true` (intended for log/dev notification driver only — see `ChannelBindingController::__construct(... bool $exposeEmailToken)` and `RegisterUserHandler::$exposePlaintextToken`). Default OFF. Throttle limits all configurable, no magic numbers. |
| A06 | Vulnerable Components | n/a | No new third-party packages introduced. Re-uses Sanctum, Hash, DB facade. |
| A07 | Identification & Authentication Failures | ✅ | OTP via `OtpService` (single-use, attempts capped via `auth.otp_max_attempts`, phone-keyed — replay across phones impossible). Email-verify token single-use (`consumed_at` stamped in same transaction as effect). `SessionController::store` now rejects login when `email_verified_at IS NULL` → `auth.email.not_verified`. |
| A08 | Software & Data Integrity | ✅ | All writes wrapped in `DB::transaction()`. Outbox events written in same transaction as DB mutation (transactional outbox pattern — Constitution Law 6). User UUID is natural idempotency key; `Idempotency-Key` middleware sits on every write route. |
| A09 | Security Logging & Monitoring | ✅ | Outbox events `identity.user_registered`, `identity.user_claimed`, `identity.user_channel_bound` provide append-only audit trail per Constitution Law 5. Schema-versioned (`schemaVersion: 1`). Actor + source recorded on every envelope. |
| A10 | SSRF | n/a | No outbound HTTP from this WP. |

### S.2 — Engine-specific checks

1. **Role injection guard.** `RegisterUserRequest::rules()` does not whitelist a `role` field — extra fields are dropped by `$request->validated()`. `RegisterUserHandler` ignores command attrs and forces `role: $this->defaultRole` (constructor-injected from `auth.registration_default_role` config). ✅
2. **`registered_via` allowlist.** Handler rejects anything other than `'self'` with `auth.registered_via_unsupported`. Admin-driven registration is a separate WP. ✅
3. **Plaintext token leakage.** `EmailVerificationToken` DTO carries `plaintext` only in-memory during the request that issues it. Repository persists only `token_hash`. Response includes `verification_token` only when `auth.expose_email_verify_token=true`. ✅
4. **Phone enumeration.** `RegisterUserHandler::handlePhone` checks `phoneInUse` BEFORE issuing OTP, but the OTP issuance lives in a separate endpoint (`POST v1/auth/otp/request`) — the registration endpoint receives a code that was already issued. This means a phone enumeration probe via `POST v1/auth/registration` requires the attacker to first hold a valid OTP, which is gated by `throttle:otp`. **Residual risk: low — duplicate phones still produce a distinguishable 409 `auth.phone_in_use`. Documented as accepted in engine doc §7.1.** ⚠️
5. **Email enumeration.** `RegisterUserHandler::handleEmail` returns 409 `auth.email_in_use` distinguishable from validation errors. **Same residual risk class as #4; same accepted-risk posture (industry standard, no silent enumeration via timing because email send is fire-and-forget through Notification engine).** ⚠️
6. **OTP brute force.** Capped by `auth.otp_max_attempts` inside `OtpService::verify` (verified at `OtpService.php:97`). After exhaustion → `OtpAttemptsExhaustedException`. ✅
7. **Email-verify brute force.** Token entropy = 256 bits; SHA-256 lookup; no plaintext stored. Throttle `email-verify` 10/min/IP. ✅
8. **TOCTOU on channel bind.** `ConfirmPhoneChannelBindHandler` re-checks `phoneInUse` inside the same `DB::transaction()` as the bind. PostgreSQL `READ COMMITTED` + partial-unique constraint `WHERE archived_at IS NULL` makes concurrent races impossible (one will fail with `23505`). ✅
9. **Cross-actor bind-email.** Already covered: actor-mismatch 403. ✅
10. **PII in logs.** No `Log::*` call in any new file. Outbox payloads include `name` and `area_id` (both already considered semi-public per engine doc §5). Phone E.164 + email never written to events — only hash + verification token id. ✅
11. **Time skew.** All timestamps use injected `Psr\Clock\ClockInterface` and converted to UTC immediately. Email-token expiry comparison is server-side; no client-supplied timestamps trusted. ✅
12. **Mass assignment.** `EloquentUserRegistrationRepository::create` uses an explicit column list (no `User::create($request->all())`). ✅

### S.3 — Findings

| ID | Severity | Title | Disposition |
|---|---|---|---|
| F-1 | Info | Phone/email enumeration via distinguishable 409 vs 422 | Accepted — engine doc §7.1; industry-standard tradeoff |
| F-2 | Info | `auth.expose_email_verify_token` defaults to `false` but is not gated by environment | Mitigated — flag managed in Admin Configuration, audited per Law 5 |

**No high or medium-severity findings. No remediation work required to advance to Stage 8.**

### S.4 — Out-of-scope (deferred)

- WebAuthn / passkeys (future WP).
- Step-up auth for sensitive ops (separate WP per engine doc §9).
- Account lockout after repeated failed password attempts (handled by `SessionController` rate limit only today — flagged for follow-up WP).

### S.5 — Sign-off

✅ Stage 7 PASSED. Proceed to Stage 8 (QA Plan + Tests).



## Stage 8 — QA Plan + Tests _(complete — 2026-06-21)_

All five pipeline gates green on a fresh-migrated Postgres test database:

| Gate | Result |
| --- | --- |
| `vendor/bin/pint` | clean (line-ending fixes applied) |
| `phpstan analyse` (level 6) | 0 errors |
| `vendor/bin/deptrac` | 0 violations |
| `vendor/bin/pest` | **260 passed (697 assertions)** |

### Defects found and fixed during QA

1. **`Role` enum lacked the `user` case.** `RegisterUserHandler` forces `role=user` (Identity engine doc §9 — universal default), but `Kalaanba\Support\Auth\Role` (authored in Phase 0.6 WP-A, before the 2026-05-26 default-role decision) had no `User` case and `default()` still returned `Fan`. `Role::from('user')` threw in `EloquentUserRegistrationRepository`. **Fix:** added `Role::User = 'user'` as the account-level floor, repointed `Role::default()` to it, updated `RoleTest`, and added migration `2026_05_30_000003_extend_users_role_check_with_user` so already-migrated databases pick up the widened `users_role_check` (fresh migrates already derive it from `Role::cases()`).
2. **`ConfirmEmailBindTest` fixtures created channel-less users.** Three cases built a phone-only owner via `User::factory()->create(['email' => null])` without a phone, tripping the (correct) `users_channel_present_check`. **Fix:** added `->withPhone(...)` to each owner.
3. **`ConfirmEmailRegistrationTest` unknown-token case used an 18-char token.** It was rejected by the FormRequest `min:32` rule instead of reaching the handler's `auth.email_verify.token_unknown` branch. **Fix:** use a well-formed 64-hex-char unissued token.

✅ Stage 8 PASSED. Proceed to Stage 9 (Docs Update).

## Stage 9 — Docs Update _(pending)_

## Stage 10 — Release Packet _(pending)_
