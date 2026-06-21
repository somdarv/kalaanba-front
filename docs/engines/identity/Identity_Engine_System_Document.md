# Kalaanba Identity Engine / System Document

Canonical product direction for user accounts, authentication, role assignment, scope-based authorization, profile data, self-signup and admin-invited registration, account lifecycle, and the privacy contract around personal identifiers.

| Status | Locked direction / Phase 1.3 implementation in progress |
| --- | --- |
| Primary actor | Every human on the platform — Fan, Player, Club Admin, Hub Admin, Referee, Facility Manager, Kalaanba Admin, Super Admin |
| Key principle | One human = one user row. One user row = one set of claims about who they are and what they can do. |
| Public trust signal | Verified phone (E.164) + completed profile (name + area). Role is not public except for Referee, Facility Manager, and Admin badges. |
| Internal trust detail | Role enum, phone hash, claim state, scope bindings, last-seen timestamp, archive timestamp. |
| V1 stance | User chooses **phone (OTP)** or **email (password + email verification)** at signup — mirrors the TikTok model. Open self-signup on either channel. Admin-invited pre-registration always uses phone + OTP (no email-invite flow in V1). |
| Related engines | Club Engine (Club Admin / Captain roles call invite endpoint), Player & Affiliation (claims an existing user from a ghost player row), Trust & Verification (consumes role + scope), Admin Configuration & Governance (config keys: OTP, registration, avatar driver), Notification & Distribution (delivers OTPs + invite messages), Zone Engine (area_id reference) |

## 1. Purpose of the Identity Engine

The Identity Engine defines who a human is on Kalaanba and what that human is allowed to do. It is the **identity spine** — the layer underneath every other engine. Clubs, players, matches, RP, awards, moderation, admin tools, and notifications all need to know which user is acting, whether that user is real, and what their role and scope authorize.

In simple terms: Identity answers **who is this person, can they prove they own this phone, what role do they hold, and what scope (which hub, which club, which venue) does that role apply to**.

Identity is **not** an opinion about football truth — it never determines match outcomes, never mints RP, never verifies a club's existence. It only establishes the human actor behind every other engine's events.

## 2. User Definition

A **user** is one human identified by:

- A globally unique `id` — UUIDv7-ordered string (Laravel `HasUuids` / `Str::orderedUuid()`, see [ADR-0003](../../adr/0003-uuidv7-user-identity.md)).
- **At least one** of: a hashed phone number (`phone_e164_hash`) **or** a verified email (`email` + `email_verified_at`). The user chooses which channel to register with; the other can be linked later from the profile screen.
- A display name.
- A role (enum) and zero or more scope bindings (separate table).

A user with only a phone is fully valid; a user with only an email is fully valid. Both channels coexist on the same user row — there is no separate "email account" vs "phone account". Whichever channel is present must be **verified** before the account leaves PENDING_CLAIM.

A user is **never deleted**. Accounts are archived (`archived_at` set) and remain queryable for historical references. Phone-hash uniqueness is enforced only across non-archived users — archive frees the phone for re-registration if needed.

## 3. Role Catalog

| Role key | Display label | Description |
|---|---|---|
| `user` | User | Default for self-signup. Covers Fan, Player (when claimed via Player engine), and Club member — those are facets of a user, not separate roles. Has no platform-wide privileges. |
| `referee` | Referee | Officiates matches; high trust weight; submits referee reports. Granted by Kalaanba Admin or Super Admin only. |
| `facility_manager` | Facility Manager | Manages a Venue / Surface / Booking facility. Scope-bound to one or more facility IDs. Granted by Super Admin. |
| `hub_admin` | Hub Admin | Manages one City Hub: areas, zones, local competitions, disputes. Scope-bound to a `city_hub_id`. Granted by Super Admin. |
| `kalaanba_admin` | Kalaanba Admin | Platform-wide moderation and verification reviewer. Granted by Super Admin. |
| `super_admin` | Super Admin | Full system access. Every action audit-logged. Granted only via initial seed or by an existing Super Admin through governance. |

**Public role badges** — only `referee`, `facility_manager`, and the admin tier (`hub_admin`, `kalaanba_admin`, `super_admin` rendered as a single "Admin" badge) are surfaced on public profiles. `user` is never displayed as a badge — it is the universal default and would carry no information.

**Club-level roles** — Owner, Co-founder, Admin, Manager, Captain, Scorer, Media Manager, Member, Viewer — are **not** stored on the `users` table. They are owned by the [Club Engine](../club/Club_Engine_System_Document.md) as memberships of `(user_id, club_id)`. The Identity Engine knows nothing about them; the Club Engine resolves them per request.

## 4. Authentication Model

V1 supports **two authentication channels** — the user chooses at signup (TikTok-style):

### 4.1 Phone + OTP

1. User submits an E.164 phone number (`+233244123456`) to `POST /api/v1/auth/otp/request`.
2. The platform issues a 6-digit OTP via the active provider (mock in dev; **Hubtel** in alpha+) — see Admin Configuration `auth.otp.provider` (default `hubtel`; falls back to `log` driver when env credentials are absent).
3. User submits the OTP to `POST /api/v1/auth/otp/verify` to acquire a Sanctum personal access token (30-day expiry by default; config key `auth.session.ttl_days`).

### 4.2 Email + Password

1. User submits email + password to `POST /api/v1/auth/sessions` (existing endpoint).
2. If `email_verified_at` is `NULL`, the response includes `email_verification_required: true` and a `verify_url` magic-link token is dispatched via the Notification Engine using the **Brevo** transactional email provider (config `notification.email.provider`, default `brevo`; falls back to the `log` driver when env credentials are absent).
3. Once the user clicks the link (`GET /api/v1/auth/email/verify/{token}`), `email_verified_at` is set and full session capability unlocks.
4. Same Sanctum token shape as the OTP flow.

### 4.3 Cross-channel

- A user who registered via phone may add an email later from `PATCH /users/me` (requires sending a verification link to the new email before it's bound).
- A user who registered via email may add a phone later (requires OTP verification before it's bound).
- Login is always via the channel that's verified — if both are bound, the user picks which channel to use per session.

### 4.4 Session model

Sanctum personal access tokens, one per device, named via the `device_name` request field. Tokens are revocable individually (`DELETE /api/v1/auth/sessions/current`) or in bulk by Super Admin.

### 4.5 Throttling

`auth.otp`, `auth.sessions`, and `auth.email_verify` route groups carry Laravel rate-limiting (config: `auth.throttle.otp.per_minute`, `auth.throttle.session.per_minute`, `auth.throttle.email_verify.per_minute`). Idempotency keys are required on every state-mutating auth route.

## 5. Authorization Model

Authorization combines two orthogonal axes:

| Axis | Where it lives | Example |
|---|---|---|
| **Role** | `users.role` enum column | `hub_admin` |
| **Scope** | `user_scopes` table — `(user_id, scope_type, scope_id)` rows | `hub_admin` for `city_hub_id=NORTH_TAMALE_UUID` |

A route or a Filament page may require a role (e.g. "any Hub Admin") and optionally a scope (e.g. "Hub Admin **of the hub this resource belongs to**"). Both checks run before the controller handler — the role check via the `role:` middleware, the scope check via a per-resource policy.

**Scope types** (initial set; extensible via Admin Config registry `identity.scope_types`):

- `city_hub` — bound to one `city_hub_id` from the Zone Engine.
- `club` — bound to one `club_id` from the Club Engine; carries a Club Engine role (Owner / Admin / Manager / etc).
- `facility` — bound to one `facility_id` from Venue Engine.
- `competition` — bound to one `competition_id` from Competition & Rules. Used by Competition viewers / stewards / referees-of-record etc. distinct from the organizer who created it.
- `competition_organizer` — bound to one `competition_id`; identifies the human who owns and runs that competition (creates fixtures, confirms results per the competition's rules, settles disputes). Separated from `competition` to allow finer policy (organizers override; viewers don't).

**Super Admin shortcut** — `super_admin` bypasses all scope checks. Their actions are audit-logged with explicit "scope=*" entries. This is the only role with system-wide write power.

**Scope assignment audit** — every scope grant or revocation writes to `user_scope_changes` (append-only): actor, target user, scope type, scope id, action (grant/revoke), reason, at. Identity never lets scope changes happen via request payload — only through the dedicated service layer.

## 6. User Lifecycle

```
              ┌────────────┐
   self-      │  PENDING   │   admin-invited pre-registration
   signup ─►  │   CLAIM    │  ◄─── (Club Admin or Captain via
              └─────┬──────┘         /clubs/{id}/invites)
                    │ OTP-verified
                    ▼
              ┌────────────┐
              │  CLAIMED   │  ◄── normal active state
              └─────┬──────┘
                    │ Super Admin archive action
                    ▼
              ┌────────────┐
              │  ARCHIVED  │  ◄── soft-deleted; phone freed; row preserved
              └────────────┘
```

| State | `claimed_at` | `archived_at` | What's allowed |
|---|---|---|---|
| PENDING_CLAIM | `NULL` | `NULL` | Receive invite OTP (phone channel) **or** verification link (email channel). Cannot log in until verification completes. Cannot be assigned a role above `user`. |
| CLAIMED | timestamp | `NULL` | Full account capabilities per role + scope. |
| ARCHIVED | (preserved) | timestamp | Read-only. Cannot log in. Phone hash uniqueness no longer applies — phone can be re-registered. |

**Identifier uniqueness rule** — `UNIQUE (phone_e164_hash) WHERE archived_at IS NULL AND phone_e164_hash IS NOT NULL` **and** `UNIQUE (email) WHERE archived_at IS NULL AND email IS NOT NULL`. A phone or email freed by archive can register a new account; historical references to the archived account survive.

## 7. Registration Paths

V1 supports two registration paths into the **CLAIMED** state.

### 7.1 Self-Signup (open)

Anyone with a phone **or** email may register. The user picks the channel at signup; the other can be linked later from the profile screen.

**Phone path** (default for mobile-first grassroots reach):

1. `POST /api/v1/auth/otp/request` with `phone_e164`.
2. `POST /api/v1/auth/registration` with `phone_e164`, `name`, `area_id`, `otp` → creates user row with `role=user`, `claimed_at=now()`.
3. Response includes a Sanctum token.

**Email path** (for users without a phone or who prefer email):

1. `POST /api/v1/auth/registration` with `email`, `password`, `name`, `area_id` → creates user row with `role=user`, `claimed_at=NULL`, dispatches a verification link via Notification Engine.
2. User clicks the magic link → `GET /api/v1/auth/email/verify/{token}` sets `email_verified_at=now()`, transitions to CLAIMED.
3. Subsequent `POST /api/v1/auth/sessions` (email + password) returns a Sanctum token.

**Config gate** — `auth.registration.open` (default `true`). When `false`, both paths return 403 and self-signup is closed (invite-only mode).

**Validation** — phone or email uniqueness checked against non-archived users; exactly one of the two channels must be present; name length per `users.profile.name_min/max`; area must exist in Zone Engine's `areas` table; password (when present) per `auth.password.{min_length,require_mixed_case,require_number,require_symbol}` config keys.

### 7.2 Admin-Invited Pre-Registration

A Club Admin or Team Captain (Club Engine roles) may invite a player by phone number before that player has signed up:

1. Caller hits `POST /api/v1/clubs/{club_id}/invites` with `phone_e164`, `name`, intended Club Engine role (e.g. `member`, `captain`). Email-invites are **not** supported in V1 — the grassroots invite use-case is phone-first by design.
2. Identity Engine creates a shadow user in **PENDING_CLAIM** state: phone hash stored, name stored, `role=user` (account-level), `claimed_at=NULL`. Club Engine attaches a pending club membership row.
3. Notification Engine delivers an invite OTP via WhatsApp / SMS pointing to the claim flow.
4. Invitee hits `POST /api/v1/auth/otp/verify-invite` with OTP → user moves to CLAIMED, pending club membership becomes active.
5. Audit entry written to `user_invites_log` (caller, target user, club, role, at).

**Scope of this engine** — Identity owns the shadow user state machine + the OTP claim verification. The `/clubs/{id}/invites` endpoint itself is **Club Engine territory** (it knows which clubs the caller may invite to), but it delegates user-shell creation to an Identity Engine service.

**Phase 1.3 deliverable** — the Identity-owned primitives only: shadow user state, `POST /auth/otp/verify-invite`, `user_invites_log` table, and a super-admin-only test endpoint (`POST /api/v1/admin/users/invite`) so the primitive is verifiable independently of the Club Engine.

### 7.3 What is **not** a registration path

- **Ghost player claim** (Player & Affiliation engine, Phase 1.5) — links an existing `players` row to a user. May or may not create a user; if it does, it goes through the same `POST /auth/otp/verify-invite` machinery defined above.
- **Admin promotion** — a Super Admin promoting an existing user from `user` to `hub_admin` is a role change, not a registration. Covered in Section 9.

## 8. Profile Surface

A user profile carries the minimum fields needed for the platform to function as a football identity layer:

| Field | Type | Required | Visibility | Notes |
|---|---|---|---|---|
| `id` | UUIDv7 | yes | public (on own profile only) | PK |
| `name` | string (config min/max) | yes | public | display name |
| `phone_e164_hash` | string | conditional | never public | SHA-256 of `+CCNNNNNNNN` form, salted via `PHONE_HASH_SALT` env. Required if `email` is absent. |
| `phone_e164_last4` | string(4) | conditional | private (own profile only) | last 4 digits for self-recognition. Set iff `phone_e164_hash` is set. |
| `email` | string | conditional | private | Required if `phone_e164_hash` is absent. |
| `email_verified_at` | timestamp | conditional | private | Required to be non-null for CLAIMED state if `email` is the active channel. |
| `area_id` | UUID | yes | public (renders area name) | opaque reference to Zone Engine's `areas.id`; **no FK** (Constitution Law 1 — Zone is a different schema) |
| `avatar_url` | string | no | public | Either a local-disk URL or a Cloudinary delivery URL; driver chosen by config `users.avatar.driver` (`local` or `cloudinary`) |
| `role` | enum | yes | partial (referee, facility_manager, admin rendered as badges) | see Section 3 |
| `claimed_at` | timestamp | no | private | NULL while PENDING_CLAIM |
| `archived_at` | timestamp | no | private | NULL while active |
| `last_seen_at` | timestamp | no | private | updated on every authenticated request |

**Channel invariant** — a database CHECK constraint enforces `phone_e164_hash IS NOT NULL OR email IS NOT NULL`. A user cannot exist with neither channel.

**Endpoints**

- `GET /api/v1/users/me` — returns the authenticated user's full profile (incl. which channels are bound + verified).
- `PATCH /api/v1/users/me` — updates `name`, `area_id`, `avatar_url`. Cannot change role, phone, email, archive flags via this endpoint.
- `POST /api/v1/users/me/channels/phone` — starts the process of binding a phone to an email-only user (or replacing a phone). Sends OTP. Confirmed via `POST /auth/otp/verify` against a special claim.
- `POST /api/v1/users/me/channels/email` — starts the process of binding an email to a phone-only user (or replacing an email). Sends magic link.
- `GET /api/v1/users/{id}` — public-safe projection: `id`, `name`, `area_name` (resolved from Zone), `avatar_url`, public badges. Phone fields and email are never in this response.
- `POST /api/v1/users/me/avatar` — uploads to the configured avatar driver, returns the URL to store in `avatar_url`.

**Avatar driver abstraction** — `AvatarDriver` interface with `LocalAvatarDriver` and `CloudinaryAvatarDriver` implementations. Driver selected per `users.avatar.driver` config key. Default `local` until Cloudinary credentials (`CLOUDINARY_URL` env) are configured. Local driver writes to `storage/app/public/avatars/{userId}/{contentHash}.{ext}` served via Laravel's `public` disk + `storage:link`; Cloudinary driver uploads via the `cloudinary/cloudinary_php` SDK and returns the secure delivery URL, which carries on-the-fly transformations for resized variants (`/w_60,h_60,c_fill,g_face/...`).

## 9. Role Assignment + Admin Promotion

Roles are **never** assignable via a public endpoint and **never** included in a registration payload. The only path to a non-`user` role is:

1. An existing Super Admin (or in alpha+, a Kalaanba Admin within a governance-approved workflow) calls `POST /api/v1/admin/users/{id}/role` with `new_role`, `reason`, and optional `scope` array.
2. Identity Engine validates the transition (e.g. cannot promote a PENDING_CLAIM user above `user`; cannot remove the last `super_admin`).
3. Writes the new role to `users.role`, writes scope bindings to `user_scopes`, writes an audit row to `user_role_changes` (actor, target, old role, new role, reason, at).
4. Emits `identity.user_role_changed` event (Section 11).

**Filament admin surface** — the existing `/admin` UserResource page exposes a "Change Role" action wired through the service above. No raw column edit on role.

## 10. Configurability — Admin Config Keys

All Identity tunables are read from Admin Configuration. No magic constants in domain code.

| Config key | Type | Default | Description |
|---|---|---|---|
| `auth.otp.provider` | string | `mock` | Active OTP provider key. |
| `auth.otp.code_length` | int | `6` | OTP digit count. |
| `auth.otp.provider` | string | `hubtel` (alpha+) / `log` (dev) | OTP SMS provider key. `hubtel` is the production driver; `log` writes OTPs to the application log for dev/test. |
| `auth.otp.ttl_seconds` | int | `300` | OTP validity window. |
| `auth.otp.max_attempts` | int | `5` | Verification attempts per issued OTP. |
| `auth.session.ttl_days` | int | `30` | Sanctum token lifetime. |
| `auth.throttle.otp.per_minute` | int | `3` | Per-IP OTP request rate. |
| `auth.throttle.session.per_minute` | int | `10` | Per-IP login attempt rate. |
| `auth.allow_password_login` | bool | `false` (prod), `true` (dev) | Email+password fallback flag. |
| `auth.registration.open` | bool | `true` | Whether self-signup is allowed. |
| `users.profile.name_min` | int | `2` | Minimum display-name length. |
| `users.profile.name_max` | int | `60` | Maximum display-name length. |
| `users.avatar.driver` | string | `local` | `local` \| `cloudinary`. Credentials env-only via `CLOUDINARY_URL`. |
| `users.avatar.cloudinary.folder` | string | `kalaanba-{env}/avatars` | Folder prefix inside Cloudinary; namespaces by environment. |
| `users.avatar.cloudinary.upload_preset` | string | `kalaanba_avatars` | Unsigned preset name for future direct browser uploads. |
| `users.avatar.max_bytes` | int | `2097152` | Avatar file size cap (2 MiB). |
| `users.avatar.allowed_mime` | string[] | `["image/jpeg","image/png","image/webp"]` | Allowed avatar MIME types. |
| `identity.scope_types` | string[] | `["city_hub","club","facility","competition","competition_organizer"]` | Active scope-type registry. |
| `auth.password.min_length` | int | `10` | Minimum password length for email channel. |
| `auth.password.require_mixed_case` | bool | `true` | Require both upper and lower case. |
| `auth.password.require_number` | bool | `true` | Require at least one digit. |
| `auth.password.require_symbol` | bool | `false` | Require at least one special character. |
| `auth.email_verify.ttl_minutes` | int | `60` | Magic-link expiry for email verification. |
| `notification.email.provider` | string | `brevo` (alpha+) / `log` (dev) | Transactional email provider key. `brevo` is the production driver; `log` writes emails to the application log for dev/test. |
| `auth.throttle.email_verify.per_minute` | int | `2` | Per-IP magic-link request rate. |
| `identity.archive.grace_period_days` | int | `30` | Days to retain login access before final archive (reserved). |

Display labels for roles (`role.user.label`, `role.hub_admin.label`, etc.) are also config-driven, so internationalization and rebranding can happen without code change. Internal role keys never change.

## 11. Events Emitted

Identity is event-first. Other engines react to these:

| Event name | Trigger | Payload (high level) | Consumers |
|---|---|---|---|
| `identity.user_registered` | After self-signup succeeds | `user_id, registered_via=self, registered_channel=phone\|email, area_id, at` | Analytics, Notification (welcome) |
| `identity.user_invited` | After admin-invite shadow user created | `user_id, invited_by, club_id?, at` | Analytics, Notification (send invite OTP) |
| `identity.user_claimed` | After PENDING_CLAIM → CLAIMED transition | `user_id, claimed_via=self\|invite, claimed_channel=phone\|email, at` | Analytics, Club (activate pending memberships), Notification (welcome) |
| `identity.user_channel_bound` | After a user adds a second channel (phone-only adds email, or vice versa) | `user_id, channel=phone\|email, at` | Analytics, Notification |
| `identity.user_role_changed` | After admin role change | `user_id, actor_id, old_role, new_role, scopes_added, scopes_removed, at` | Analytics, Notification (notify user), Admin Audit |
| `identity.user_archived` | After Super Admin archive | `user_id, actor_id, reason, at` | Analytics, Club (suspend memberships), Notification |
| `identity.session_created` | After successful OTP verify or password login | `user_id, device_name, at` | Analytics (login funnel) |
| `identity.session_revoked` | After token deletion | `user_id, device_name, at` | Analytics |

All events flow through the existing outbox table. No engine queries `users` directly across schemas — they consume these events.

## 12. Privacy Contract

Personal identifiers are treated as restricted from day one:

1. **Phone numbers are never stored in plaintext.** Only `phone_e164_hash` (SHA-256 with salt) + `phone_e164_last4`. Recovery of the original phone is impossible without the user submitting it again.
2. **The phone-hash salt** lives in `PHONE_HASH_SALT` env var, never in source. Rotation requires a coordinated re-registration drive — documented as an Admin runbook for alpha+.
3. **`/api/v1/users/{id}`** (public projection) **never** returns email, phone fields, role enum, archive timestamps, or scope bindings.
4. **Avatar URLs** in `r2` mode use signed URLs with a config-driven TTL (`users.avatar.signed_url_ttl_seconds`, default 3600). Local-driver avatars are served from `public/storage/avatars/` (Laravel storage symlink).
5. **Minor protection** — when a user is linked to a Player row flagged `is_minor` (Player & Affiliation), their public projection drops the avatar and shows only first name + age band. This is enforced by the Player engine's projection layer, not Identity, but Identity exposes a `is_minor_protected` boolean on `GET /users/me` so the frontend can render appropriately.

## 13. Audit Trail

| Table | Purpose | Append-only? |
|---|---|---|
| `user_role_changes` | Every role mutation | yes |
| `user_scope_changes` | Every scope grant / revoke | yes |
| `user_invites_log` | Every admin-invite issuance | yes |
| `admin_audit_log` (existing — Admin Governance) | Every Super Admin / Kalaanba Admin action that touches a user | yes |

All four tables carry `actor_id` (string, opaque UUID), `target_id`, action, reason (free text), and a millisecond timestamp. None of them are deletable — only super-admin-readable.

## 14. Boundaries — What Identity Does **Not** Own

- **Football truth** — no opinion on match outcomes, lineups, or stats.
- **Club identity** — club roles (Owner / Admin / Manager / Captain / etc.) are Club Engine state, joined via `(user_id, club_id)` memberships.
- **Player identity** — player rows (claimed or ghost), affiliations, transfers are Player & Affiliation Engine.
- **Trust verdicts** — `verificationStatus`, `trustLevel`, `cautionLevel` are Trust & Verification.
- **Notification delivery** — Identity emits events; Notification Engine handles channels.
- **OTP transport** — Identity calls a provider via the `OtpService` interface; the provider implementation (WhatsApp / SMS / Email) lives in Notification or its provider modules.
- **Area / Zone / Hub names** — Identity stores `area_id` as opaque UUID; Zone Engine owns the lookup. Frontend resolves via the Zone read API.

## 15. Open Questions (V1 → V2 candidates)

1. **Social login** — Should Identity support Google / Apple / WhatsApp Business OAuth as alternative paths to CLAIMED? Deferred to V2; OTP-first is sufficient for grassroots reach.
2. **Multi-phone per user** — A user changes phones; do we allow a "switch phone" flow that retains identity, or force archive + re-register? Deferred.
3. **Inactivity archive** — Should users inactive for N months auto-archive? Config key reserved (`identity.archive.grace_period_days`) but no cron yet. Decide before alpha.
4. **Hub Admin self-nomination** — Brief implies a Hub Admin governance process. V1: super_admin appoints only. V2: governance workflow with community vetting.
5. **Account deletion request** (GDPR-style right to be forgotten) — V1: archive only; full erasure requires Super Admin action that pseudonymizes `name`, drops `phone_e164_last4`, retains `phone_e164_hash` salt-rotated to break correlation. Documented but not implemented in Phase 1.3.

---

**Document control**

- Status: Locked direction
- Last updated: 2026-05-26
- Owner: Identity Spine (no single engine team; cross-cutting)
- Related ADRs: [ADR-0002 — Filament admin gating](../../adr/0002-filament-admin-gating.md), [ADR-0003 — UUIDv7 user identity](../../adr/0003-uuidv7-user-identity.md)
- Implementation status: Foundation shipped via WP-20260522-identity-foundation; Phase 1.3 (this document's scope) in progress
