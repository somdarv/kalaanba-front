<!-- Converted from Match_Fixture_Engine_System_Document.pdf -->

# Kalaanba Match / Fixture Engine / System Document

Locked product direction for matches, fixtures, calendars, result confirmation, match events, venue selection, and downstream record updates. Prepared as a reference document for project docs.

| Status | Locked direction / pre-architecture planning |
| --- | --- |
| Primary principle | No official downstream update until result_confirmed = true |
| Calendar position | Calendars are core infrastructure, not a side feature |
| V1 live entry | Online-only; offline-first can come later |
| Recommended next<br>engine | Competition and Rules Engine |

Core principle: fixtures are specialized Events. Events live on calendars. Calendars connect clubs, competitions, venues, referees, fans, challenges, bookings, and training sessions.

## 1. Purpose

The Match / Fixture Engine owns the lifecycle of football matches on Kalaanba. It records who is playing, when, where, under which rules, what happened, who confirmed it, and what downstream records may be updated after confirmation.

- Create and manage friendly, competition, challenge, internal, and training-related match events.

- Coordinate match calendars across clubs, competitions, venues, referees, and followers.

- Support configurable match duration instead of assuming standard 90-minute football.

- Gate RP, standings, player stats, zone records, challenge resolution, and awards behind result

confirmation.

- Preserve audit history for edits, overrides, walkovers, abandonments, postponements, and

cancellations.

## 2. Fixture, Match, and Event Terminology

| Term | Meaning | How Kalaanba uses it |
| --- | --- | --- |
| Match | User-facing term for a game between<br>sides. | Use in simple UI: create match, match result,<br>matchday. |
| Fixture | Scheduled match inside a competition<br>or formal schedule. | Use in competition calendars, fixture lists, and<br>organizer dashboards. |
| Event | Shared base model for scheduled<br>platform activity. | Fixture, booking, training session, competition<br>day, and referee assignment can all sit on<br>calendars. |

Locked terminology: user-facing language can say Match. Competition schedule context can say Fixture. Internal documentation and architecture can use Match / Fixture Engine.

<!-- Page 2 -->

## 3. Calendars as Core Infrastructure

Calendars are central to Kalaanba because almost every serious action is time-based. A match can affect multiple calendars at once.

- Club calendar - upcoming and past matches for each club.

- Competition calendar - fixtures, rounds, matchdays, postponements, and finals.

- Venue/surface calendar - slot usage, bookings, fixtures, maintenance, and conflicts.

- Referee calendar - assignments and availability conflicts.

- Challenge calendar - accepted challenges that become scheduled matches.

- Fan/follower calendar - reminders and followed public matches.

- Training calendar - future training-session support using the same Event base.

Basic V1 conflict checks should prevent the same club, platform surface, or assigned referee from being double-booked at the same time. Manual venue text cannot be fully conflict-checked.

## 4. Match Types

| Type | Description | Primary effects |
| --- | --- | --- |
| Friendly | Club-to-club match outside a formal<br>competition or challenge. | Can be verified; limited RP if eligible; no<br>standings. |
| Competition<br>fixture | Match inside a league, cup, tournament,<br>group stage, or knockout. | Updates standings/brackets after<br>confirmation; may generate RP. |
| Challenge match | Fixture created from an accepted<br>challenge. | Resolves challenge; transfers locked RP<br>after verification. |
| Internal match | Match within one club or related squads. | Club history/training only; no Season RP or<br>ranked challenge effect. |
| Training-related<br>event | Training session or non-match football<br>activity. | Calendar/attendance; not treated as<br>competitive match. |

## 5. Configurable Match Rules and Duration

Kalaanba must not assume every match is 90 minutes. Organizers and clubs should be able to configure the format depending on match type, competition rules, or challenge agreement.

- Half length, such as 45, 35, 30, 25, or 20 minutes.

- Number of halves or custom one-period formats.

- Break duration.

- Extra time rules.

- Penalty rules.

- Squad size and format, such as 5-a-side, 7-a-side, 9-a-side, or 11-a-side.

- For competition fixtures, duration is inherited from the Competition / Rules Engine.

- For challenge matches, duration is part of accepted challenge terms.

- For friendlies, duration is set at match creation.

## 6. Locked Fixture Lifecycle

<!-- Page 3 -->

The expanded lifecycle should support normal play, live entry, verification, disputes, walkovers, postponements, cancellations, and abandoned matches. Draft -> Scheduled -> Confirmed -> Live -> Awaiting Result -> Verification Pending -> Result Confirmed -> Archived Side states: Postponed, Cancelled, Walkover, Abandoned, Disputed, Void.

| State | Meaning |
| --- | --- |
| Draft | Fixture is being prepared but is incomplete or not public. |
| Scheduled | Opponents, date/time, and location are set. |
| Confirmed | Required parties have accepted or organizer has confirmed. |
| Live | Match is currently being played; events may be entered. |
| Awaiting Result | Match time has passed but result has not been submitted. |
| Verification Pending | Result submitted but not yet confirmed by required parties. |
| Result Confirmed | Official result is trusted; downstream updates may fire. |
| Archived | Match is locked into history after all updates are complete. |

## 7. Result Confirmation Gate

This is the most important rule in the engine. No RP, standings, verified player stats, zone records, challenge resolution, awards, or official public history should update until result_confirmed = true. Live events and provisional scores may be displayed, but they remain provisional until the required confirmation model is satisfied.

## 8. Confirmation Models by Match Type

| Match type | Confirmation model |
| --- | --- |
| Friendly | Both club representatives confirm the result. |
| Competition fixture | Competition organizer, official, or ref-like official has stronger say and may<br>override according to rules. |
| Challenge match | 2-of-3: challenger scorer, respondent scorer, assigned referee. Any two matching<br>confirmations verify the result. |
| Referee-officiated match | Referee has strongest confirmation authority. |
| Internal match | Club admin confirms. |

Override rule: organizer or referee overrides are allowed when their role gives authority, but every override must be audited with actor, role, old value, new value, reason, time, evidence, and affected records.

<!-- Page 4 -->

## 9. Creation Pattern - Friendly Match

Friendly matches must be simple because informal football should not feel bureaucratic. Club A creates match -> selects opponent -> sets date/time -> sets match format/duration -> selects platform venue or enters manual venue text -> sends invite -> Club B accepts -> match becomes Confirmed -> match is played -> result entered -> both reps confirm -> result_confirmed = true

- Required: opponent, date, kickoff time, venue/manual location, match format/duration.

- Optional: referee, squad size, notes, visibility, GPS pin.

- V1 should avoid complex negotiation. If terms do not work, the opponent can decline; counters can

come later.

- Default visibility can be public to followers or visible on club profile, with private/unlisted option.

## 10. Creation Pattern - Competition Fixture

Competition fixtures inherit rules from the competition. Organizers create fixtures manually in V1. Auto-generation comes later. Organizer creates fixture -> selects competition/stage/round/group -> selects teams -> sets date/time -> selects platform venue/surface or manual location -> teams are notified -> match is played -> result entered -> official/organizer confirms -> result_confirmed = true -> standings/bracket updates

- Rules such as points system, half length, penalties, cards, eligibility, and tiebreakers come from

Competition / Rules Engine.

- Organizer or official has stronger confirmation authority.

- First confirmed result should lock relevant competition rules, according to the broader product brief

direction.

- Fixture updates should trigger WhatsApp/in-app notifications where enabled.

## 11. Creation Pattern - Challenge to Fixture

A challenge becomes a fixture only after the challenge is accepted. Before acceptance, the visual language is call-out/gauntlet. After acceptance and scheduling, Team A vs Team B fixture visuals are allowed. Challenge issued -> challenge accepted -> RP locked -> scheduling window opens -> clubs agree date/time/venue/rules -> challenge becomes scheduled fixture -> fans can track/predict -> match is played -> 2-of-3 verification -> result_confirmed = true -> RP transfers -> challenge resolves

- Required before fixture creation: date, kickoff time, venue/location, match duration, referee

requirement, squad eligibility, and already-locked RP stake.

- Challenge fixtures should be public by default unless hidden for moderation or safety.

- Challenge Engine owns call-out lifecycle; Fixture Engine owns match lifecycle.

## 12. Creation Pattern - Internal Match

Internal matches are for activity within the same club or related squads. They are useful records but must not affect Season RP. Club admin creates internal match -> selects internal squads/teams -> sets date/time/location -> records result if needed -> club admin confirms -> match saved as internal record

- Can support training records, attendance, internal competitions, and player development history.

- No Season RP, no ranked challenge, no RP transfer, no external zone record.

- Private by default.

<!-- Page 5 -->

## 13. Result Entry Pattern

Authorized users enter the result and match events, then the system waits for the right confirmation model before making anything official. Authorized user enters final score -> adds scorers/cards/assists/subs/lineups if available -> system marks Verification Pending -> required parties confirm -> result_confirmed = true -> downstream engines fire Downstream engines after confirmation: Competition, RP, Player, Zone, Challenge, Notification, Season, Awards.

## 14. Match Event Data

The engine should support rich match event data, even if the V1 interface rolls it out in phases.

- Goals

- Assists

- Yellow and red cards

- Substitutions

- Lineups

- Minutes played

- Player positions

- Squad numbers per fixture

- Own goals and penalties later

- Match status events such as kickoff, halftime, full-time, abandonment, and walkover

Practical UI scope: start with score, scorers, cards, and lineups. Add deeper event detail gradually.

## 15. Walkover Pattern

Walkover is a distinct outcome, not a normal scoreline. It should generate no player stats. Fixture exists -> one side fails to appear or forfeits -> authorized person declares walkover -> reason/evidence recorded -> affected club notified -> dispute window opens -> walkover confirmed -> result_confirmed = true -> no player stats generated -> standings/RP/reliability update according to rules

| Context | Who can declare/confirm walkover |
| --- | --- |
| Friendly | Both reps agree, or admin resolves. |
| Competition | Organizer/official declares. |
| Challenge | Referee or 2-of-3 verification confirms. |

- Capture winning club, no-show/forfeit club, reason, evidence if any, declared by, time declared, dispute

window, and default score if competition rules require it.

## 16. Postponement and Reschedule Pattern

Postponed means the match is still valid but moved to another time. Cancelled means it will not happen. Request postponement -> select reason -> notify affected parties -> approve or auto-approve based on authority -> choose new date/time/venue -> fixture returns to Scheduled/Confirmed

| Context | Authority |
| --- | --- |
| Friendly | Either club can request; both should accept new date. |

<!-- Page 6 -->

| Context | Authority |
| --- | --- |
| Competition | Organizer controls. |
| Challenge | Both clubs agree unless referee/admin rules due to weather, safety, or venue issue. |

- Reasons: weather, venue unavailable, team unavailable, referee unavailable, safety/security,

emergency, competition decision, other.

## 17. Abandoned Match Pattern

Abandoned means the match started but could not finish. It never auto-confirms. Match marked abandoned -> reason recorded -> current score/time recorded -> referee/official/team reps submit reports -> organizer/admin reviews with reps involved -> ruling selected -> result_confirmed only after ruling

| Possible ruling | Meaning |
| --- | --- |
| Replay | Play the full match again. |
| Result stands | Current or ruled result becomes official. |
| Void | Match has no official result. |
| Walkover | One side is awarded the match. |
| Reschedule | Match is moved and replayed later. |

V1 can support Replay, Result stands, Void, and Walkover. Resume-from-minute can come later.

## 18. Cancelled Match Pattern

Cancelled matches are not deleted. They remain in audit/history but do not affect stats, RP, standings, or records unless a competition rule explicitly defines a consequence. Cancellation requested -> reason captured -> authority confirms -> affected parties notified -> fixture status becomes Cancelled -> no stats -> no RP -> no standings effect unless rules say otherwise

## 19. Venue Selection and Surface Link

| Venue option | Behavior |
| --- | --- |
| Platform venue/surface | Select venue and surface. System can check availability, attach to venue calendar,<br>and link booking later. |
| Manual venue text | Enter venue/location text. Optional landmark or GPS pin. Fixture exists without full<br>facility data layer. |

V1 rule: manual venue text is allowed. Platform venue selection is optional. If a platform venue/surface is selected, the event should eventually connect to venue calendar, surface availability, booking record, venue zone, and facility page.

## 20. Online Live Entry for V1

Offline-first live entry is valuable but hard. For V1, live match entry should be online-only. The architecture should not block future offline sync, but the first shipped workflow should be simpler.

- Live entry works when internet is available.

- If live entry fails, safe manual result entry after match must still work.

- Result confirmation remains required before official updates.

<!-- Page 7 -->

- Future offline-first support can add local event queues, client-side event IDs, sync conflict handling, and

deduplication.

## 21. Audit Trail

Every meaningful match change must be auditable. This protects trust when scores, scorers, cards, walkovers, abandonments, or overrides are contested.

- Who changed it

- Role and permission used

- Old value

- New value

- Timestamp

- Reason

- Evidence if any

- Device/session/source where useful

- Affected downstream records

## 22. Eligibility Flags

A match should not be assumed to affect everything. The engine should expose flags for downstream systems.

| Flag | Meaning |
| --- | --- |
| verified | Kalaanba trusts that the match happened and the result is reliable. |
| rpEligible | RP Engine may award/transfer Season RP if all rules pass. |
| statsEligible | Player stats may become verified after confirmation. |
| standingsEligible | Competition standings/brackets may update. |
| zoneEligible | Zone records may update. |
| challengeLinked | Match is tied to an accepted challenge. |
| competitionLinked | Match belongs to a competition. |

## 23. Engine Integrations

| Engine/System | Fixture relationship |
| --- | --- |
| Calendar/Event Engine | Fixtures are Events and appear on relevant calendars. |
| Competition/Rules Engine | Competition fixtures inherit rules and update standings after confirmation. |
| RP Economy Engine | Awards or transfers RP only after result confirmation and eligibility checks. |
| Season Engine | Controls whether fixture can count for current season. |
| Zone Engine | Consumes club zones, venue zone, and match result for inter-zone records. |
| Challenge Engine | Challenge fixtures resolve challenge lifecycle after verified result. |
| Player Engine | Updates appearances, goals, assists, cards, positions, and career stats. |

<!-- Page 8 -->

| Engine/System | Fixture relationship |
| --- | --- |
| Venue Engine | Links fixture to venue/surface calendar and booking where applicable. |
| Notification Engine | Sends fixture scheduled, postponed, result, and standings messages. |
| Trust/Verification Engine | Owns confidence, dispute, verification, and override trust rules. |

## 24. V1 Scope

V1 should prove match organization and trusted record creation without overbuilding every matchday feature.

- Manual fixture creation.

- Friendly and competition fixtures.

- Challenge-linked fixture readiness if Challenge Engine is not yet shipped.

- Online live entry.

- Score, scorers, cards, lineups, and optional substitutions.

- Configurable match duration.

- Manual venue text and optional platform venue/surface selection.

- Basic calendar entries for clubs and competitions.

- Dual confirmation and organizer/referee authority depending on match type.

- Result confirmed gate.

- Walkover, postponement, cancellation, and abandoned states.

- Audit trail.

- WhatsApp-friendly result card trigger.

## 25. Deferred / Later

- Automated fixture generation.

- Full offline-first live match sync.

- Deep event tracking beyond initial UI.

- Resume-from-minute abandoned match handling.

- Advanced referee assignment automation.

- Full booking-to-fixture handoff automation.

- Goal alerts if deferred from first build.

- Advanced calendar subscriptions for fans and clubs.

## 26. Configurable Defaults

| Default | Current value |
| --- | --- |
| User-facing term | Match |
| Schedule/competition term | Fixture |
| V1 fixture generation | Manual |

<!-- Page 9 -->

| Default | Current value |
| --- | --- |
| V1 live entry | Online-only |
| Platform venue required? | No. Manual venue text allowed. |
| Result gate | result_confirmed = true required before official downstream updates |
| Walkover player stats | No player stats generated |
| Abandoned match | Never auto-confirm; admin/organizer resolution required |
| Duration | Configurable by rules, challenge terms, or match setup |

Platform-wide configuration rule: any numerical value, threshold, window, weight, duration, cap, limit, or penalty should be configurable from admin settings later.

## 27. Locked Summary

Kalaanba treats a Match/Fixture as a specialized Event. Calendars are core infrastructure because matches connect clubs, competitions, venues, referees, challenges, fans, bookings, and training sessions. Matches can be friendly, competition-based, challenge-based, internal, or training-related. Match duration is configurable and must not assume 90 minutes. The lifecycle runs from Draft to Archived, with side states for postponement, cancellation, walkover, abandonment, dispute, and void. Nothing official updates until result_confirmed = true. Friendly matches require both club reps; competition fixtures give organizer/official stronger authority; challenge matches use 2-of-3 verification; referee-officiated matches give the referee the strongest say; internal matches are confirmed by club admin. Walkover produces no player stats. Abandoned matches never auto-confirm. V1 supports manual fixture creation, online live entry, manual venue text, optional platform venue selection, audit trail, and safe confirmation before records become official.

## 28. Recommended Next Engine

Recommended next engine: Competition and Rules Engine. Reason: competition fixtures inherit match duration, scoring rules, tiebreakers, disciplinary rules, eligibility, confirmation authority, and standings behavior from competition rules. The Match / Fixture Engine can record the event, but the Competition / Rules Engine decides how that event affects the competition.
