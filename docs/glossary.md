# Kalaanba Glossary

Living dictionary of project-specific terms. Add a new entry when a new term is introduced in a Work Packet (Docs Scribe owns this; Sankofa references it).

| Term              | Definition                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Account lookup    | Read-only `POST /auth/lookup` returning `{ exists, channel }` for an identifier — the identifier-first branch signal. No PII, strictly throttled (ADR-0004).                |
| Agent OS          | The pipeline of chat modes + prompts + contracts + instructions that constrains how Copilot contributes to this repo.                           |
| Identifier-first auth | Entry model where the person enters one identifier (phone/email) and the system detects returning-vs-new via Account lookup — no explicit login/signup choice (ADR-0004). |
| Build Plan        | `docs/Architecture/Build_Plan.md` — the 9-stage execution tracker. Distinct from the per-change pipeline.                                       |
| City Hub          | A city-scoped administrative tier in the Geography Engine (e.g. Tamale City Hub).                                                               |
| Decision Trace    | Structured JSON attached to every Trust clearance recording rule inputs and verdict.                                                            |
| Engine            | One of 17 bounded contexts. Each owns a schema, a Laravel module, an engine doc, and a set of events.                                           |
| Fan Buzz          | Attention/engagement signal. Drives visibility only — never mints RP, settles challenges, or verifies matches.                                  |
| Ghost player      | Player record created in a lineup before the human user claims it via OTP.                                                                      |
| Idempotency-Key   | Required header on user-triggered writes; deduplicated in Redis (24h TTL).                                                                      |
| Lifetime RP       | Cumulative, never-resets RP balance shown on club profiles.                                                                                     |
| Locked RP         | RP held in escrow during a Challenge (stake).                                                                                                   |
| Outbox            | Per-module table holding pending domain events; relay worker dispatches to Redis Streams.                                                       |
| Pesewa            | Minor unit of Ghana Cedi (1 GHS = 100 pesewas). All monetary amounts stored as integer pesewas.                                                 |
| Result confirmed  | Hard gate. The boolean that unlocks Trust evaluation, which then gates RP / stats / standings.                                                  |
| RP                | Respect Points — the non-monetary in-platform currency.                                                                                         |
| RP ledger         | Append-only ledger; the source of truth for all RP balances (projected).                                                                        |
| Sankofa           | The continuous-documentation subagent. Owns `docs/JOURNAL.md` exclusively.                                                                      |
| Season            | April 1 → Feb 28/29 cycle. Season RP resets at start of each season; Lifetime RP does not.                                                      |
| Season RP         | Per-season RP balance. Resets every April 1.                                                                                                    |
| Stood-ground cost | RP cost paid by the respondent on a Challenge draw, defaulting from Admin Config.                                                               |
| Trust clearance   | Per-match record of `verificationStatus`, `trustLevel`, `cautionLevel`, plus per-domain clearances (RP / stats / standings / archive / review). |
| Work Packet (WP)  | The structured unit of work that flows through all 10 pipeline stages. ID format: `WP-YYYYMMDD-slug`.                                           |
| Zone              | Sub-hub geography unit. Zone pulse + zone leaderboards are derived projections.                                                                 |
