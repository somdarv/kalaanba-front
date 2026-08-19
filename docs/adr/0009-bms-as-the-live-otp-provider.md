# ADR-0009: BMS (Bulk Messaging Solutions) as the live OTP provider

- **Status:** Accepted
- **Date:** 2026-08-19
- **Work Packet:** WP-20260819-bms-otp-provider
- **Affected engines:** Identity (owns OTP auth), Admin Configuration & Governance (owns the config keys)
- **Supersedes:** ADR-0008's **vendor choice only**. Every structural decision in ADR-0008 stands unchanged — see "What ADR-0008 still governs".

## Context

ADR-0008 (accepted the same day, hours earlier) chose SMSOnlineGH as the live OTP provider,
because it was the account that existed and had a verified integration. It shipped and the
gateway accepted our sends.

It could not actually deliver. The sender ID `Kalaanba` is **not registered** on that
SMSOnlineGH account — the only approved sender there is `MefsCuisine`, which belongs to a
sibling product. As ADR-0008 itself warned, that failure is invisible: the gateway accepts any
sender string, answers `HSHK_OK` with a batch reference, and silently delivers nothing. The
warning was written and then immediately came true.

The product owner holds a **BMS (Bulk Messaging Solutions)** account with a project named
`Kalaanba`, an active API key, a GHS 20.00 wallet, and — decisively — the sender ID
**`Kalaanba` in "Approved" status**.

## Decision

**BMS is the live OTP provider.** `auth.otp_provider` gains `bms`, implemented by
`Kalaanba\Support\Auth\Otp\BmsOtpProvider`.

**The SMSOnlineGH driver is retained, not deleted.** It works, it is tested, and its account
holds 302 messages of credit. Keeping it makes provider failover a single config value rather
than a deploy, which is exactly what the `OtpProvider` interface is for. It is now a standby.

### Establishing the contract

BMS's documentation site is a JavaScript application that renders nothing to a fetcher, so the
contract was established by **probing the live gateway** rather than reading docs. That turned
out to matter, and the ADR records it because the next person will otherwise trust the docs.

Verified 2026-08-19:

```
POST https://api.mnotify.com/api/sms/quick?key=API_KEY
Content-Type: application/json
{"recipient":["233244123456"],"sender":"Kalaanba","message":"…",
 "is_schedule":false,"schedule_date":""}
```

**The host is `api.mnotify.com`, and that is not a mistake.** BMS is the current brand of
mNotify; `bms.africa` is the marketing site and does not serve the API. Anyone "correcting"
the base URL to a bms.africa host will stop every OTP.

Observed responses:

| Condition | Status | Body |
|---|---|---|
| Invalid key | `401` | `{"error":"invalid api key. please make sure your api key is valid and enabled"}` |
| Sender > 11 chars | `422` | `{"status":"error","errors":{"sender":["The sender field must not be greater than 11 characters."]}}` |
| Empty recipient | `422` | `{"status":"error","errors":{"recipient":["The recipient field is required."]}}` |
| Accepted | `200` | `{"status":"success","code":"2000","summary":{"total_sent":1,"total_rejected":0,"credit_used":1,…}}` |

This gateway is markedly better behaved than SMSOnlineGH: it uses **honest HTTP status codes**
rather than reporting auth failures as `200`. Two details still bite:

1. **`code` is the string `"2000"`, not the integer `2000`.** A strict comparison against an
   int fails every send.
2. **A malformed recipient is reported as a success.** Sending to the literal string
   `"not-a-number"` returned `200`, `status: success`, `total_sent: 1` — distinguishable from
   a real send only by `credit_used: 0`. The driver therefore also requires `total_rejected`
   to be zero.

We deliberately do **not** additionally require `credit_used > 0`. An account on a bundled or
promotional plan can legitimately bill zero, and refusing those would break delivery over a
billing arrangement rather than a real fault. Phone numbers are E.164-validated far upstream,
so the malformed-recipient path should be unreachable; `total_rejected` is the belt to that
braces.

## What ADR-0008 still governs

Only the vendor changed. These decisions are unchanged and are **not** re-litigated here:

- **The gateway call is synchronous**, departing from engineering-standards §13, because a
  queued job would serialise the plaintext OTP and the subscriber's phone number into the
  `jobs` table (§10). The full argument and the rejected alternatives are in ADR-0008.
- **A mock provider is refused under `APP_ENV=production`.**
- **API keys are env-only; sender ID and message wording are admin config** (Law 2, §9, §11).
- **Delivery failure returns `503 auth.otp_delivery_failed`**, never a `202` the user cannot
  act on.

## Consequences

**Good**
- OTP delivery works, because the sender ID is actually approved — the thing ADR-0008 could
  not assert.
- Two working drivers. Provider failover is now one admin-config change, no deploy.
- BMS's honest status codes make failures diagnosable, and its 422 body names the offending
  field, so "sender is wrong" and "number is wrong" are distinguishable in a log.
- The contract is pinned by tests built from **captured live responses**, not from docs.

**Bad, and accepted**
- Two SMS vendors now, each with its own credential, wallet, and sender-approval state. That
  is real operational surface. It is justified only while OTP reliability matters more than
  tidiness; revisit once BMS has carried real volume.
- The API host does not match the vendor name, which will confuse someone. Called out in the
  config file, the provider docblock, `.env.example`, and here.
- BMS's wallet is GHS 20.00. There is no low-balance alert. A silently drained wallet stops
  every phone login, and the first symptom will be users unable to log in.
- The plausible-success trap means our confidence rests on `total_rejected` being honest. We
  have verified it is populated; we have not verified it is populated correctly in every
  failure mode.

**Neutral**
- SMSOnlineGH's 302 remaining messages are not wasted; that account is the standby.
- The Identity engine doc still needs correcting (§4.1 names Hubtel, and uses a key name no
  code reads). Carried forward from ADR-0008, still outstanding for Stage 9.
