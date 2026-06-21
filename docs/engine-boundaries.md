# Engine Boundaries — Quick Reference

This is the canonical at-a-glance for "what each engine owns and never owns". Full rules live in `docs/engines/<engine>/`. Cross-engine effects flow **only** through versioned events in `contracts/events/` via the transactional outbox.

| Engine                             | Slug                        | Canonical doc                                                                                         | Owns                                                        | Never owns                                        |
| ---------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| Identity                           | `identity`                  | [Identity](engines/identity/Identity_Engine_System_Document.md)                                       | User accounts, OTP auth, role + scope, profile, claim flow  | Football truth, club roles, player stats          |
| Club                               | `club`                      | [Club](engines/club/Club_Engine_System_Document.md)                                                   | Club identity, club-level roles, verification, related-club flags | Match truth, RP, stats                      |
| Player & Affiliation               | `player-affiliation`        | [Player](engines/player-affiliation/Player_Affiliation_Engine_System_Document.md)                     | Player identity, ghost claims, affiliations, verified stats | Match verification, RP                            |
| Match / Fixture                    | `match-fixture`             | [Match](engines/match-fixture/Match_Fixture_Engine_System_Document.md)                                | Match lifecycle, events, lineups                            | Verification verdict, RP, standings               |
| Season                             | `season`                    | [Season](engines/season/Season_Engine_UPDATED.md)                                                     | Calendar, cutoffs, archives, reset                          | RP math, per-match eligibility                    |
| RP Economy                         | `rp-economy`                | [RP Economy](engines/rp-economy/RP_Economy_Engine_System_Document.md)                                 | Season/Locked/Lifetime RP, append-only ledger, stakes       | Verification, challenge lifecycle                 |
| Challenge                          | `challenge`                 | [Challenge](engines/challenge/Challenge_Engine_RP_Economy_and_Systems_Map_UPDATED.md)                 | Lifecycle, counters, stake-lock trigger                     | RP math, verification, moderation                 |
| Trust & Verification               | `trust-verification`        | [Trust](engines/trust-verification/Trust_Verification_Engine_System_Document.md)                      | Clearance, dispute resolution, decision trace               | RP math, lifecycle states                         |
| Zone                               | `zone`                      | [Zone](engines/zone/Zone_Engine_UPDATED.md)                                                           | Zone/belt mapping, zone scores                              | Match truth, club identity                        |
| Venue / Surface / Booking          | `venue-surface-booking`     | [Venue](engines/venue-surface-booking/Venue_Surface_Booking_Engine_System_Document.md)                | Venue identity, surface calendar, bookings, payments        | Match verification, RP                            |
| Referee / Officiator               | `referee-officiator`        | [Referee](engines/referee-officiator/Referee_Officiator_Engine_System_Document.md)                    | Assignment, report, reliability signals                     | Trust verdict, RP                                 |
| Notification & Distribution        | `notification-distribution` | [Notification](engines/notification-distribution/Notification_Distribution_Engine_System_Document.md) | Targeting, channel, delivery, audit                         | Truth, moderation verdicts                        |
| Fan Buzz / Feed / Discovery        | `fan-buzz`                  | [Buzz](engines/fan-buzz/Fan_Buzz_Feed_Discovery_Engine_System_Document.md)                            | Attention signals, ranking, badges                          | **Football truth, RP, awards** (Deptrac-enforced) |
| Moderation & Safety                | `moderation-safety`         | [Moderation](engines/moderation-safety/Moderation_and_Safety_Engine_System_Document.md)               | Public content safety, holds, escalation                    | Football truth, RP                                |
| Admin Configuration & Governance   | `admin-governance`          | [Admin](engines/admin-governance/Admin_Configuration_Governance_Engine_System_Document.md)            | Config registry, approvals, audit logs                      | Domain truth                                      |
| Competition & Rules                | `competition-rules`         | [Competition](engines/competition-rules/Competition_and_Rules_Engine_System_Document.md)              | Competition container + rules, standings                    | Match truth, RP math                              |
| Awards & Recognition               | `awards-recognition`        | [Awards](engines/awards-recognition/Awards_and_Recognition_Engine_System_Document.md)                 | Weekly/seasonal recognition, badges                         | RP math, verification                             |
| Analytics, Insights & Intelligence | `analytics`                 | [Analytics](engines/analytics/Analytics_Insights_Intelligence_Engine_System_Document.md)              | Events, metrics, dashboards                                 | **Source-of-truth for any domain**                |

## Hard architectural rules (from `Build_Plan.md`)

1. No cross-schema joins. Cross-engine reads go through API contracts or projections.
2. RP mutated only via `rp_ledger` append entries.
3. Money is integer minor units (pesewas). Never floats.
4. Archive, never delete.
5. Fan Buzz has zero write access to RP / Match / Competition schemas. Deptrac-enforced.
6. Trust gates **records**; Moderation gates **public surfaces**. Never confused.
7. Outbox pattern is mandatory for any user-triggered write with cross-engine effects.
8. `Idempotency-Key` required on every user-write endpoint.
