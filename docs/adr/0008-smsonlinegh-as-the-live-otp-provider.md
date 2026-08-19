# ADR-0008: SMSOnlineGH as the live OTP delivery provider

- **Status:** Accepted
- **Date:** 2026-08-19
- **Work Packet:** WP-20260819-otp-sms-provider
- **Affected engines:** Identity (owns OTP auth), Admin Configuration & Governance (owns the config keys)
- **Supersedes:** the `hubtel` stance in `docs/engines/identity/Identity_Engine_System_Document.md` §4.1 and its config table; the `whatsapp`-only allowed-value list in `contracts/config/auth/auth.otp_provider.yaml`

## Context

Kalaanba shipped to production on 2026-08-19 with phone/OTP login reachable from the
sign-in screen and **no OTP delivery at all**. `OtpProvider` had exactly one
implementation, `MockOtpProvider`, which announces the code only when `APP_ENV=local`.
In production a user could request a code, receive a `202 Accepted`, and wait forever.
Nothing on any dashboard indicated a fault.

Three sources disagreed on what the real provider was supposed to be:

| Source | Says |
|---|---|
| `docs/engines/identity/...` §4.1 + config table | **Hubtel** (`auth.otp.provider`, default `hubtel` in alpha+, `log` in dev) |
| `contracts/config/auth/auth.otp_provider.yaml` | allowed values `mock` and `whatsapp` (Phase 4) |
| `OtpProvider` interface docblock | `WhatsAppOtpProvider` ships in Phase 4 |

None had been built. The engine doc also names a key (`auth.otp.provider`) that no code
reads — the implemented key is `auth.otp_provider`.

Meanwhile the product owner holds a live, funded **SMSOnlineGH** reseller account, already
in production use by a sibling product on the same VPS, with a verified integration and a
known-good request shape.

## Decision

**SMSOnlineGH is the live OTP provider.** `auth.otp_provider` gains `smsonlinegh` as an
allowed value, implemented by `Kalaanba\Support\Auth\Otp\SmsOnlineGhOtpProvider`.

Hubtel is dropped. It was never implemented, no account exists, and nothing depends on it.
WhatsApp remains the Phase 4 intention and is unaffected — the point of the `OtpProvider`
interface is that adding it later is a new class and one config value, not a migration.

Three supporting decisions:

**1. A mock provider is refused in production.** The container throws when
`auth.otp_provider` resolves to `mock` under `APP_ENV=production`. The failure that
motivated this ADR was not that the wrong provider was configured — it was that the wrong
provider was configured *and nothing said so*. A loud failure at resolve time is strictly
better than a silent black hole.

**2. Sender ID and message wording are admin config, the API key is env-only.** Per
engineering-standards §9 and §11, credentials never enter `admin_config`. Per Constitution
Law 2, nomenclature never gets hardcoded. Those two rules cut this integration in half and
that split is deliberate, not an inconsistency.

**3. The gateway call is synchronous, which knowingly departs from engineering-standards
§13.**

## The §13 departure, in full

§13 says: *"No synchronous outbound HTTP in a request lifecycle. Outbound calls go via
queue/job with retries."* This provider calls the gateway inline instead.

The reason is §10, which outranks it here: *"Never log secrets, PII, OTPs, phone numbers."*
Laravel's database queue serialises a job's constructor arguments into the `jobs` table. A
`SendOtpSms` job therefore writes **the plaintext one-time code and the subscriber's phone
number into the database**, where they persist for the life of the row — and longer in any
backup taken meanwhile. An OTP is a short-lived bearer credential. It must not come to rest.

The alternatives were considered and rejected:

- *Queue an opaque handle instead of the code* — the worker must still obtain the plaintext
  code to send it, so the code merely moves to whatever store the handle points at. The
  problem relocates rather than disappearing.
- *Encrypt the job payload* — the decryption key sits in the same application, so this
  raises the cost of a database-only compromise without changing the outcome of an
  application compromise. Real, but not sufficient to justify the complexity.
- *Redis queue instead of database queue* — the OTP still comes to rest outside the request,
  and our Redis has `maxmemory-policy volatile-lru` with an eviction path.

The cost of going synchronous is bounded and understood:

- `smsonlinegh.timeout_seconds` (default 10) caps the added request latency.
- `POST /api/v1/auth/otp/request` is already behind `throttle:otp`, so this cannot be used
  to amplify load against us or against the gateway.
- A gateway failure surfaces as `503 auth.otp_delivery_failed` rather than a `202` the user
  cannot act on. Losing the queue's automatic retry is acceptable because the *user* is the
  retry mechanism, and a user who is told the truth can switch to the email channel.

Revisit if OTP volume ever makes 10s of tail latency material. The correct fix then is a
worker that fetches the code from a short-TTL store keyed by an opaque handle, with the
store's TTL matched to `auth.otp_ttl_seconds` — not a plaintext payload in `jobs`.

## Consequences

**Good**
- Phone login works in production for the first time.
- The failure mode is loud. A mock in production now refuses to boot the provider; a
  gateway rejection returns 503; a 200-with-failure-label is treated as failure.
- The wire-level knowledge that cost a sibling product real debugging — form encoding not
  JSON, a 200 that is not an acceptance, an auth error delivered as a 200 — is captured in
  the provider docblock and locked down by tests.
- Sender ID and copy are changeable without a deploy.

**Bad, and accepted**
- **The sender ID fails invisibly.** The gateway accepts any sender string and returns
  `HSHK_OK`; delivery then silently does not happen. No monitoring we can write detects
  this. Only a handset does. `auth.otp.sms.sender_id` must be registered with SMSOnlineGH
  before it is trusted, and it is the first thing to check when codes "send" but never
  arrive.
- OTP delivery now depends on a third party being reachable inside the request.
- SMS costs money per message, so the OTP endpoint's rate limit is now a spend control as
  well as an abuse control.
- One SMSOnlineGH account is shared with a sibling product. A key rotation there is a key
  rotation here; the two systems are coupled through that credential and neither's
  configuration says so. Worth separating accounts before either product carries real
  volume.

**Neutral**
- The Identity engine doc must be corrected (§4.1, config table, and the `auth.otp.provider`
  key name). Flagged in Stage 9 rather than silently left to drift.
- The engine doc's line *"the provider implementation (WhatsApp / SMS / Email) lives in
  Notification or its provider modules"* is not followed: this provider sits in
  `app/Support/Auth/Otp/` beside `MockOtpProvider`. It is framework-level cross-cutting code
  that depends on no engine module, which is what `app/Support/` is for
  (engineering-standards §3), and splitting one OTP driver away from its sibling and its
  interface would cost clarity for no boundary benefit. Revisit when Notification actually
  owns multi-channel dispatch.
