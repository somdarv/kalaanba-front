<!-- Converted from Analytics_Insights_Intelligence_Engine_System_Document.pdf -->

# Kalaanba Analytics, Insights & Intelligence Engine System Document

Locked product direction for event tracking, micro data capture, product intelligence, funnels, dashboards, reports, and platform learning from day one.

| Field | Locked Value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Analytics, Insights & Intelligence Engine |
| Core principle | Capture the smallest meaningful data point from day one,<br>preserve it cleanly, and make it possible to understand how<br>people and entities interact with Kalaanba. |
| Day-one stance | Analytics is foundational infrastructure, not a later reporting<br>feature. |
| Data model stance | Event-first. Every major workflow and product interaction emits<br>structured events. |
| Source-of-truth stance | Analytics observes and summarizes. It does not replace domain<br>engines as the official source of truth. |
| Privacy stance | Capture rich signals safely. Expose analytics according to role,<br>permission, sensitivity, and purpose. |
| Final principle | If it happens on Kalaanba and it can teach us something, it should<br>be captured safely, clearly, and in context. |

<!-- Page 2 -->

## Document Map

- Purpose and why this engine matters

- Core philosophy and day-one data stance

- What the engine owns and does not own

- Core analytics definitions

- Event-first architecture and micro data capture

- Standard event payload and naming convention

- Raw events, derived metrics, insights, and intelligence layers

- Analytics categories across users, clubs, players, matches, challenges, venues, competitions, fan activity,

notifications, trust, moderation, and admin operations

- Funnels, dashboards, reports, and entity-level analytics

- Data access, privacy, governance, quality, retention, and safety rules

- Engine outputs, affected engines, V1 scope, deferred scope, guardrails, and locked summary

## 1. Purpose

The Analytics, Insights & Intelligence Engine is Kalaanba's data nervous system. It captures structured events from every meaningful user action, engine event, workflow step, status change, public interaction, admin decision, and operational outcome. It then turns those events into metrics, dashboards, insights, reports, and future intelligence. In simple terms, this engine answers: what happened, who did it, where did it happen, when did it happen, what context was involved, what changed after it happened, and what can Kalaanba learn from it? Day-one rule: Analytics must not start after launch. It must begin from alpha because the earliest product behavior is where the strongest learning happens.

## 2. Why This Engine Matters

Kalaanba is not a static app. It is a living football system made of clubs, players, matches, challenges, competitions, venues, referees, fans, notifications, awards, moderation, admin reviews, bookings, and public discovery. Each of these systems produces signals. If those signals are not captured from day one, Kalaanba loses the ability to learn from real behavior. The goal is not only to know how many users signed up. The goal is to understand how users behave inside each flow: where they hesitate, what they repeat, what they ignore, what they share, what makes them return, what causes disputes, which venues convert, which notifications work, which competitions draw attention, and which product surfaces create actual football activity.

- A club may start creating a match and abandon at venue selection.

- A fan may view a challenge card three times before tracking it.

- A captain may see a result confirmation notification but fail to act.

- A facility manager may open a booking request but delay approval.

- A player may open a ghost claim link but never complete the profile.

- A competition page may receive repeat visits after every standings update.

- A venue may receive many views but few bookings because of price, trust, or slot availability.

These small signals become product truth. They guide user acquisition, retention, feature prioritization, business decisions, admin support, venue sales, and future recommendations.

## 3. Core Philosophy

- Capture the smallest meaningful data point from day one.

- Preserve raw events before summarizing them into dashboards.

- Store enough context to answer future questions that are not known today.

- Do not use analytics as the official source of truth for football outcomes.

<!-- Page 3 -->

- Separate raw events, derived metrics, and official domain records.

- Make every important funnel measurable.

- Make every entity analyzable: user, club, player, venue, match, challenge, competition, zone, referee,

notification, award, and admin workflow.

- Expose data carefully according to permission, sensitivity, and purpose.

- Use analytics to learn, not to punish automatically.

- Build for later intelligence, but do not depend on AI for V1.

Working distinction: Analytics = what happened. Insights = what it means. Intelligence = what Kalaanba can recommend, predict, or improve later.

## 4. What This Engine Owns

| Owns | Examples |
| --- | --- |
| Event tracking | Page views, button clicks, form starts, workflow changes, status<br>changes, shares, follows, predictions, approvals. |
| User behavior logs | Sessions, visits, device context, routes, conversion paths, abandoned<br>flows. |
| Product interaction events | Card impressions, card clicks, feed tab selection, notification seen,<br>challenge opened, venue searched. |
| Funnel analysis | Signup, club creation, match creation, booking, challenge, competition<br>setup, player claim. |
| Retention and cohort analysis | Returning users, active clubs, repeat fans, hub cohorts, competition<br>cohorts, venue cohorts. |
| Entity-level analytics | Club analytics, player analytics, venue analytics, competition<br>analytics, match analytics, challenge analytics. |
| Operational analytics | Admin queues, dispute timelines, moderation workload, notification<br>performance, venue manager responsiveness. |
| Raw event storage | Immutable or append-only event log with enough metadata for future<br>analysis. |
| Derived metrics and rollups | Daily active clubs, booking conversion, average result confirmation<br>time, weekly match count. |
| Dashboards and reports | Platform overview, growth, activation, retention, engines, hubs, zones,<br>venues, admin operations. |
| Exportable data views | CSV/report exports for authorized admin, hub, club, competition, or<br>venue use. |
| Future intelligence layer | Recommendations, churn signals, demand prediction, suspicious<br>pattern summaries, smart nudges. |

## 5. What This Engine Does Not Own

| Does not own | Owner |
| --- | --- |
| Match truth, verification, and final verdict | Trust & Verification Engine |
| RP balances, transfers, locking, penalties, and ledger truth | RP Economy Engine |
| Challenge lifecycle and challenge settlement | Challenge Engine / RP Economy Engine |
| Competition points, standings, brackets, and winners | Competition & Rules Engine |
| Official player stats and player identity | Player / Affiliation Engine |
| Venue booking truth and booking payment status | Venue, Surface & Booking Engine |
| Notification delivery truth | Notification & Distribution Engine |
| Feed ranking and buzz score truth | Fan Buzz, Feed & Discovery Engine |
| Moderation decisions and safety status | Moderation & Safety Engine |
| Admin rulings, overrides, config changes, and governance decisions | Admin Configuration & Governance Engine |

Boundary rule: Analytics can observe, copy, summarize, and analyze. It must not secretly recalculate official records or become a hidden source of truth.

<!-- Page 4 -->

## 6. Core Definitions

| Term | Meaning |
| --- | --- |
| Event | A structured record of something that happened on Kalaanba. |
| Raw event | The original captured event before aggregation or interpretation. |
| Derived metric | A calculated value produced from raw events, such as conversion<br>rate or weekly active clubs. |
| Insight | A meaningful observation produced from metrics and patterns. |
| Intelligence | Future recommendation, prediction, or system-assisted decision<br>support based on data. |
| Actor | The user, system, admin, engine, or external callback that caused or<br>emitted an event. |
| Entity | The object the event is about: club, player, fixture, venue, competition,<br>challenge, notification, award, etc. |
| Session | A continuous period of user activity. |
| Funnel | A step-by-step journey that can be measured for completion and<br>drop-off. |
| Cohort | A group of users/entities that share a starting condition, time period,<br>role, hub, or behavior. |
| Rollup | A summarized metric over a time window or entity context. |
| Attribution | The link between a behavior and the source, campaign, referrer,<br>notification, share, or feature that influenced it. |

## 7. Event-First Architecture

The Analytics Engine should use an event-first architecture. Every business engine and frontend surface emits events when meaningful activity happens. The event is stored first, then converted into metrics, dashboards, reports, and future intelligence.

## 1. Frontend or backend action happens.

## 2. The relevant engine emits a structured event.

## 3. Analytics stores the event in a raw event log.

## 4. Workers or scheduled jobs create derived metrics and rollups.

## 5. Dashboards and reports read from analytics views, not from scattered production tables.

## 6. Future intelligence services can learn from cleaned and governed event history.

Raw data rule: The raw event log should be preserved even when dashboards change. Future questions will need old signals.

## 8. Smallest Meaningful Data Point

Kalaanba should capture the smallest data point that is meaningful enough to answer a future product, operational, safety, or business question. This does not mean capturing noise with no context. It means every important user action and engine decision should be stored with enough surrounding metadata to make it useful later.

- A page view is useful if it includes route, entity, actor, source, device, city hub, and timestamp.

- A button click is useful if it includes the button type, source card, entity, role, and current workflow step.

- A booking abandonment is useful only if Kalaanba knows the last completed step.

- A notification seen event is useful only if Kalaanba can later connect it to an action or non-action.

- A challenge view is useful if Kalaanba knows whether the user later tracked, shared, predicted, or returned.

## 9. Standard Event Payload

Every event should follow a standard shape. Some fields can be nullable, but the structure should stay stable so analytics can compare activity across engines. { "eventId": "evt_123",

<!-- Page 5 -->

"eventName": "venue.slot_selected", "actorUserId": "user_123", "actorRole": "club_admin", "actorContext": "club", "entityType": "venue_surface", "entityId": "surface_456", "relatedEntityType": "fixture", "relatedEntityId": "fixture_789", "sessionId": "sess_123", "deviceId": "device_abc", "source": "mobile_web", "route": "/venues/kalpohin/main-astro", "country": "Ghana", "region": "Northern Region", "cityHubId": "tamale", "zoneId": "west_zone", "clubId": "club_123", "competitionId": null, "timestamp": "2026-05-11T19:30:00Z", "metadata": { "slotDate": "2026-05-16", "startTime": "18:00", "endTime": "20:00", "priceShown": 300, "bookingFlowStep": "slot_selection" } }

## 10. Standard Event Fields

| Field | Purpose |
| --- | --- |
| eventId | Unique identifier for the event. |
| eventName | Stable name using domain.action pattern, such as match.created. |
| actorUserId | User responsible for the event, if user-caused. |
| actorRole | Role at the time of event: fan, player, club_admin, referee,<br>facility_manager, organizer, admin. |
| actorContext | Context in which the role applied: club, venue, competition, admin,<br>fan, system. |
| entityType / entityId | Main object the event is about. |
| relatedEntityType / relatedEntityId | Secondary object connected to the event. |
| sessionId | User session for journey and funnel analysis. |
| deviceId | Privacy-safe device/session identifier for deduplication and abuse<br>pattern analysis. |
| source | Web, mobile web, app, WhatsApp link, admin portal, venue portal,<br>PSP callback, system job. |
| route | App route or surface where event occurred. |
| cityHubId / zoneId | Geographic football context. |
| clubId / competitionId / venueId | Contextual entity identifiers where relevant. |
| timestamp | When the event happened. |
| metadata | Flexible engine-specific details. Must avoid leaking sensitive data<br>unnecessarily. |

## 11. Event Naming Convention

Event names should be stable, readable, and domain-scoped. Recommended format: domain.action or domain.object_action where needed.

| Pattern | Examples |
| --- | --- |
| club.action | club.created, club.profile_completed, club.member_invited |
| match.action | match.creation_started, match.created, match.result_submitted,<br>match.result_confirmed |
| challenge.action | challenge.issued, challenge.seen, challenge.accepted,<br>challenge.shared |
| venue.action | venue.viewed, venue.surface_viewed, venue.slot_selected |
| booking.action | booking.hold_created, booking.payment_started, booking.confirmed |

<!-- Page 6 -->

| notification.action | notification.sent, notification.seen, notification.acted_on |
| --- | --- |
| fan.action | fan.react_clicked, fan.track_clicked, fan.follow_created,<br>fan.prediction_made |
| admin.action | admin.review_opened, admin.override_applied,<br>admin.config_changed |

- Do not rename existing event keys casually. Add a new version if meaning changes.

- User-facing labels can change, but analytics event keys must remain stable.

- Events should be emitted once per meaningful action and deduplicated when needed.

- Events should include version metadata when schema changes.

## 12. Analytics Layers

### 12.1 Layer 1 - Raw Events

Raw events are the permanent activity log. They should capture events before they are transformed into dashboards or summaries. Examples include page views, card impressions, button clicks, status changes, form starts, form abandons, notification opens, result submissions, booking attempts, report submissions, and admin decisions.

### 12.2 Layer 2 - Derived Metrics

Derived metrics are calculated from raw events. Examples include weekly active clubs, venue booking conversion rate, average result confirmation time, challenge acceptance rate, competition page repeat visits, notification action rate, and onboarding completion rate.

### 12.3 Layer 3 - Insights and Intelligence

Insights explain meaning. Intelligence later recommends actions. Examples include: clubs drop off mostly at venue selection; venue bookings spike on Thursdays; users who track a match are more likely to return; competition standings updates drive repeat visits; WhatsApp confirmations are seen but not acted on.

## 13. Critical Analytics Categories

### 13.1 User Analytics

- Sign-up source, role selected, city hub selected, onboarding start/completion, first meaningful action.

- Return visits, active days, abandoned flows, dormant users, power users, acquisition source quality.

- User role behavior: fan, club admin, player, venue manager, referee, organizer, admin.

### 13.2 Club Analytics

- Club created, profile completed, members invited, players added, first match created, first verified match, first RP

earned.

- Challenge issued, challenge accepted, result confirmation speed, follower growth, profile views, recognition

shares.

- Activity quality: verified matches, disputes, no-shows, abandoned workflows, repeated late responses.

### 13.3 Player Analytics

- Ghost profile created, claim link sent, claim link opened, profile claimed, profile completed.

- Player card viewed/shared, lineup selected, stat confirmed, club invite accepted/declined, free agent profile

viewed.

- Recognition cards viewed/shared and player moment engagement.

### 13.4 Match / Fixture Analytics

- Match creation started, opponent selected, venue selected, fixture scheduled, invite sent, invite accepted or

declined.

<!-- Page 7 -->

- Lineup entered, result submitted, result confirmed, dispute raised, match shared, match tracked, reminder acted

on.

- Creation drop-off by step, verification speed by match type, and public engagement by fixture context.

### 13.5 Challenge Analytics

- Challenge card viewed, challenge issued, target seen, accepted, countered, declined, ignored, scheduled.

- Prediction opened, prediction made, result submitted, challenge resolved, RP settled, shared, tracked.

- Challenge funnel health: issue to seen, seen to accepted, accepted to scheduled, scheduled to verified.

### 13.6 Venue and Booking Analytics

- Venue page viewed, surface viewed, slot searched, slot selected, hold created, payment started, payment failed,

payment successful, booking confirmed.

- Booking cancelled, refund requested, offline block created, manager viewed calendar, manager approved or

rejected booking, settlement viewed.

- Venue demand, peak slots, calendar accuracy, payment failure points, manager responsiveness, utilization by

surface.

### 13.7 Competition Analytics

- Competition created, setup completed, teams added, fixtures created, public page viewed, standings viewed,

result confirmed, bracket viewed.

- Competition followed, fixture shared, top scorer page viewed, weekly recognition viewed, organizer dashboard

opened.

- Competition engagement by format, organizer activity, standings repeat visits, and conversion from public

competition pages.

### 13.8 Fan Buzz Analytics

- Views, reactions, shares, tracks, follows, predictions, repeat visits, booking clicks, saved venues, feed card

impressions, feed card clicks.

- Soft-follow creation, feed filter use, public card shares, hub and zone interest signals.

- Which content creates return visits and which public moments spread outside the app.

### 13.9 Notification Analytics

- Notification created, queued, sent, delivered, failed, seen, acted on, expired, cancelled.

- Reminder sent, reminder acted on, channel used, fallback channel used, time-to-action.

- Which notifications move workflows and which ones are ignored.

### 13.10 Trust, Dispute, and Safety Analytics

- Dispute raised, evidence requested, evidence uploaded, review started, review completed, verdict issued, match

voided.

- Content reported, moderation hold, moderation approved, moderation removed, club warning issued, user

restriction applied.

- Which match types create disputes, which clubs trigger repeated review, and where admin review slows down.

### 13.11 Admin and Operations Analytics

- Admin review opened, admin action taken, override applied, config changed, venue verified, club verified,

related-club flag reviewed.

- Manual correction made, support queue backlog, review SLA, workload by hub, workload by engine.

- Which admin workflows need automation or better product design.

## 14. Event Taxonomy by Engine

| Engine | Example events | Analytics use |
| --- | --- | --- |
| Club Engine | club.created, club.profile_completed,<br>club.member_invited, club.area_selected,<br>club.verification_requested, club.verified, | Club growth, activation, profile quality, verification<br>readiness. |

<!-- Page 8 -->

|  | club.profile_viewed |  |
| --- | --- | --- |
| Player / Affiliation Engine | player.ghost_created, player.claim_link_sent,<br>player.claim_started, player.profile_completed,<br>player.card_viewed, player.invite_accepted | Player onboarding, claim conversion, player card<br>distribution. |
| Match / Fixture Engine | match.creation_started, match.created,<br>match.invite_sent, match.confirmed,<br>match.live_started, match.result_submitted,<br>match.result_confirmed | Fixture flow, result verification speed, creation drop-<br>off. |
| Challenge Engine | challenge.card_viewed, challenge.issued,<br>challenge.seen, challenge.countered,<br>challenge.accepted, challenge.scheduled,<br>challenge.resolved | Rivalry funnel, challenge response, scheduling<br>health, engagement. |
| Venue Engine | venue.viewed, venue.surface_viewed,<br>venue.slot_selected, booking.payment_started,<br>booking.confirmed, booking.cancelled,<br>offline_block.created | Booking conversion, venue demand, surface<br>utilization, manager behavior. |
| Competition Engine | competition.created, competition.published,<br>competition.page_viewed, standings.viewed,<br>fixture.shared, winner.published | Organizer activity, public page engagement,<br>competition retention. |
| Fan Buzz Engine | feed.card_impression, feed.card_clicked,<br>fan.react_clicked, fan.track_clicked,<br>fan.follow_created, fan.prediction_made,<br>share.clicked | Discovery effectiveness, public interaction,<br>personalization signals. |
| Notification Engine | notification.created, notification.sent,<br>notification.delivered, notification.seen,<br>notification.acted_on, notification.failed,<br>notification.expired | Communication performance, workflow delay,<br>channel quality. |
| Trust Engine | trust.review_started, evidence.requested,<br>evidence.submitted, dispute.raised, verdict.issued,<br>match.voided | Record quality, dispute patterns, review workload. |
| Moderation Engine | content.reported, moderation.held,<br>moderation.approved, moderation.removed,<br>user.warned, club.restricted | Safety health, risky content patterns, admin<br>workload. |
| Awards Engine | recognition.generated, recognition.viewed,<br>recognition.shared, award.candidate_generated,<br>award.published | Recognition impact, share performance, weekly<br>activity loops. |
| Referee Engine | referee.invited, referee.accepted, referee.declined,<br>report.submitted, referee.no_show_marked | Assignment acceptance, reliability, report<br>completion. |
| Admin Governance Engine | config.changed, override.applied, review.assigned,<br>review.resolved, entity.suspended | Governance transparency, workload, config impact. |

## 15. Product Funnels to Track From Day One

| Funnel | Steps to capture |
| --- | --- |
| User onboarding | Landing viewed -> signup started -> phone verified -> role selected -><br>city hub selected -> onboarding completed -> first meaningful action. |
| Club activation | Club created -> area selected -> members invited -> profile completed<br>-> first match created -> first verified match -> first RP earned -> first<br>challenge issued. |
| Match creation | Started create match -> opponent selected -> date/time selected -><br>venue selected -> invite sent -> opponent accepted -> result<br>submitted -> result confirmed. |
| Venue booking | Venue viewed -> surface viewed -> slot selected -> hold created -><br>payment started -> payment successful -> booking confirmed -><br>fixture linked. |
| Challenge | Challenge card viewed -> challenge issued -> target seen -><br>accepted/countered/declined -> scheduled -> prediction open -><br>played -> verified -> RP settled -> shared. |
| Competition setup | Competition created -> rules set -> teams added -> fixtures created -><br>public page shared -> results confirmed -> standings viewed -><br>winner published. |
| Player claim | Ghost player created -> claim link sent -> link opened -> phone<br>verified -> profile completed -> player card shared. |

<!-- Page 9 -->

## 16. Dashboards and Reports

### 16.1 V1 Dashboard Categories

- Platform overview: active users, active clubs, matches, challenges, bookings, competitions, recognitions,

disputes.

- User growth: signups, sources, roles, hubs, activation, return visits.

- Club dashboard: club creation, activation, match activity, member invites, RP visibility, followers.

- Match dashboard: created matches, confirmed matches, verification speed, disputes, match types.

- Challenge dashboard: issued, seen, accepted, scheduled, resolved, shared, tracked, prediction activity.

- Venue dashboard: views, slot searches, booking conversion, cancellations, utilization, manager activity.

- Competition dashboard: created competitions, public page views, standings views, result updates, follows.

- Fan Buzz dashboard: reactions, shares, tracks, follows, predictions, card impressions, card clicks.

- Notification dashboard: sent, delivered, failed, seen, acted on, response times.

- Trust and moderation dashboard: disputes, evidence requests, review backlog, reports, holds, removals.

- Admin operations dashboard: queue size, average resolution time, overrides, config changes, hub workload.

### 16.2 Entity-Level Analytics Views

| Entity | Example analytics |
| --- | --- |
| User | Active days, roles, follows, sessions, first action, retention, abandoned<br>flows. |
| Club | Profile views, followers, match count, verified match count, challenge<br>activity, response speed, recognition shares. |
| Player | Claim progress, card views, verified stats engagement, recognition<br>interactions. |
| Venue | Views, slot searches, bookings, utilization, cancellations, revenue,<br>manager response. |
| Competition | Page views, standings views, follows, fixture shares, result update<br>engagement. |
| Challenge | Views, shares, tracks, responses, predictions, schedule success,<br>resolution. |
| Zone / Hub | Active clubs, matches, challenges, venues, follows, feed activity,<br>disputes, booking demand. |

## 17. Core Metrics

| Metric type | Examples |
| --- | --- |
| Acquisition | Signups by source, role, hub, referrer, WhatsApp share, competition<br>page, venue page. |
| Activation | First club created, first match created, first follow, first track, first<br>booking attempt, first verified result. |
| Engagement | Sessions, feed clicks, challenge views, reaction rate, track rate, share<br>rate, repeat visits. |
| Retention | Day 1, Day 7, Day 30 return, weekly active clubs, returning fans,<br>repeated venue users. |
| Conversion | Club setup completion, match creation completion, booking payment<br>success, player claim completion. |
| Operations | Admin review time, dispute resolution time, notification action time,<br>venue approval time. |
| Revenue | Booking gross amount, commission, facility share, failed payments,<br>refunds, settlement status. |
| Trust/Safety | Dispute rate, void rate, evidence requests, moderation holds, report<br>rate, repeated flags. |

## 18. Data Access and Visibility

Kalaanba should capture rich data, but access must be scoped. Not every analytics view should be public or available to every actor.

<!-- Page 10 -->

| Audience | Can see |
| --- | --- |
| Public users | Trending clubs, public fixtures, public Buzz badges, recognition cards,<br>public competition information. |
| Club admins | Club profile views, followers, match engagement, challenge<br>performance, result confirmation speed, player availability summaries<br>where allowed. |
| Players | Own profile/card activity where appropriate, recognitions, verified stat<br>visibility, profile completion. |
| Venue managers | Venue views, slot searches, booking conversion, confirmed bookings,<br>cancellations, revenue/settlement, failed payments. |
| Competition organizers | Competition page views, fixture engagement, standings views,<br>follows, team activity, result update engagement. |
| Hub admins | Hub-level club, venue, match, competition, dispute, moderation, and<br>operational analytics. |
| Super Admins | Platform-wide analytics, operational data, sensitive queues,<br>governance views, export tools, configuration impact. |

## 19. Privacy, Safety, and Sensitive Data Rules

- Analytics must avoid storing unnecessary raw sensitive content in metadata.

- Phone numbers, private evidence, screenshots, payment provider details, identity documents, admin notes, and

minor-sensitive data should be protected and not exposed in normal dashboards.

- Use stable internal identifiers rather than displaying private identifiers in reports.

- Device identifiers should be privacy-safe and used for deduplication, abuse pattern review, and product quality,

not public display.

- Personal analytics should be scoped by permission and purpose.

- Public dashboards should use aggregated data where possible.

- Admin exports should be permission-gated and audit-logged.

- Moderation, Trust, and Governance-sensitive data should have stricter access rules.

Privacy rule: Capture richly, expose carefully.

## 20. Data Quality and Governance

- All events must have stable names, timestamps, source, actor context, and entity context where possible.

- Duplicate events should be deduplicated through event IDs, idempotency keys, or session-level rules.

- Event schemas should be versioned.

- Deprecated event names should be mapped, not silently deleted.

- Dashboards should explain whether they use raw events, derived metrics, or official engine outputs.

- Analytics jobs should log failures and late-arriving data.

- Admin Config should control key labels, dashboard permissions, aggregation windows, and retention settings.

- Critical metrics should have definitions so teams do not argue about what an active club or verified match means.

## 21. Instrumentation Approach

| Layer | Role |
| --- | --- |
| Frontend tracking | Captures page views, card impressions, button clicks, form starts,<br>abandoned steps, route changes, feed actions. |
| Backend engine events | Captures business events such as match created, result confirmed,<br>RP awarded, booking confirmed, dispute raised. |
| Outbox/event bus | Stores events reliably so analytics does not depend on fragile direct<br>calls. |
| Worker processing | Processes rollups, funnel states, cohort membership, and dashboard-<br>ready metrics. |
| Analytics store | Stores raw events, aggregates, and queryable views. |
| Dashboard/report layer | Displays authorized analytics to admins, clubs, venues, organizers,<br>and internal teams. |

<!-- Page 11 -->

Performance rule: User actions should not wait for heavy analytics processing. Emit the event, store it safely, and process in the background where needed.

## 22. Conceptual Data Model

| Table / Store | Purpose |
| --- | --- |
| analytics_events | Raw event log. Append-only where possible. |
| analytics_sessions | Session records for journey and retention analysis. |
| analytics_identities | Safe mapping between user, device, roles, and contexts. |
| analytics_funnel_steps | Normalized funnel definitions and per-entity/user progress. |
| analytics_rollups_daily | Daily summarized metrics by entity, hub, zone, role, and engine. |
| analytics_entity_metrics | Current and historical metrics for clubs, venues, competitions,<br>players, challenges. |
| analytics_reports | Saved report definitions, filters, exports, and permissions. |
| analytics_event_schemas | Versioned event schema registry. |
| analytics_dashboard_permissions | Who can see which analytics surfaces. |
| analytics_exports | Audit trail for downloaded/exported reports. |

## 23. Engine Outputs and APIs

- trackEvent(payload)

- trackPageView(payload)

- trackCardImpression(payload)

- trackFunnelStep(payload)

- getUserAnalytics(userId, scope)

- getClubAnalytics(clubId, filters)

- getVenueAnalytics(venueId, filters)

- getCompetitionAnalytics(competitionId, filters)

- getChallengeAnalytics(challengeId, filters)

- getHubAnalytics(cityHubId, filters)

- getZoneAnalytics(zoneId, filters)

- getNotificationAnalytics(filters)

- getTrustModerationAnalytics(filters)

- getAdminOperationsAnalytics(filters)

- getFunnelReport(funnelName, filters)

- getRetentionReport(filters)

- exportAnalyticsReport(reportId, filters)

- registerEventSchema(eventName, schemaVersion)

- getAnalyticsAuditLog(filters)

## 24. Affected Engines and Required Changes

| Engine | Required analytics changes |
| --- | --- |
| Club Engine | Emit club creation, profile completion, member invite, verification, profile<br>view, activity status, role changes. |
| Player / Affiliation Engine | Emit ghost creation, claim link actions, profile completion, card views,<br>affiliations, invitations, verified stat interactions. |
| Match / Fixture Engine | Emit every creation step, fixture state change, invite, lineup action, result<br>submission, result confirmation, dispute state. |
| Challenge Engine | Emit card views,<br>issue/seen/counter/accept/decline/schedule/prediction/result/settlement/<br>share/track events. |
| Venue Engine | Emit venue view, surface view, slot search, booking hold, payment states,<br>offline blocks, manager actions, settlement views. |

<!-- Page 12 -->

| Competition Engine | Emit creation setup, team additions, fixture creation, public page views,<br>standings views, bracket views, follows, shares. |
| --- | --- |
| Fan Buzz Engine | Emit impressions, clicks, reactions, shares, tracks, follows, predictions,<br>soft-follow creation, feed filter use. |
| Notification Engine | Emit lifecycle events: created, queued, sent, delivered, failed, seen,<br>acted_on, expired, cancelled. |
| Trust Engine | Emit review, evidence, dispute, caution, verdict, clearance, void, override-<br>related events. |
| Moderation Engine | Emit report, hold, approve, remove, restore, restrict, warning, escalation<br>events. |
| Awards Engine | Emit candidate generation, recognition creation, card view/share,<br>publication, archive events. |
| Referee Engine | Emit assignment invite, accept, decline, report pending, report submitted,<br>no-show, reliability events. |
| Admin Governance Engine | Emit config change, review decision, override, suspension, verification,<br>merge/archive, and export audit events. |

## 25. Admin Configuration

The Admin Configuration & Governance Engine should control analytics-related settings where appropriate.

- Dashboard access by admin role.

- Entity analytics visibility by role.

- Aggregation windows: daily, weekly, monthly, season, competition.

- Definitions for active user, active club, active venue, active competition, engaged fan.

- Data retention windows by event category.

- Export permissions and approval requirements.

- Sensitive field masking rules.

- Feature usage thresholds.

- Funnel definitions and default report presets.

- Alert thresholds for abnormal drop-off, dispute spikes, payment failures, or notification failures.

## 26. Alpha, V1, and Deferred Scope

### 26.1 Alpha Scope

- Raw event tracking for core flows.

- Standard event naming convention.

- Basic page views and button clicks.

- Club onboarding funnel.

- Match creation funnel.

- Challenge interaction tracking.

- Basic admin dashboard for activity counts.

- Session tracking and source tracking.

### 26.2 Private Beta Scope

- Venue booking funnel tracking.

- Notification lifecycle analytics.

- Fan Buzz interaction analytics.

- Competition page analytics.

- Trust and moderation queue analytics.

- Hub and zone activity dashboards.

- Raw event exports for internal analysis.

- Data quality checks and schema registry.

### 26.3 V1 Scope

- Full event tracking system across major engines.

<!-- Page 13 -->

- Raw event log and derived metric rollups.

- User journey tracking and funnel reports.

- Retention and cohort analysis.

- Feature usage analytics.

- Club, player, venue, competition, match, challenge, hub, and zone analytics.

- Notification performance analytics.

- Booking conversion and revenue analytics.

- Fan interaction analytics.

- Trust, dispute, moderation, and admin operations analytics.

- Authorized dashboards and exportable reports.

- Analytics audit log and export audit trail.

### 26.4 Deferred / Later Scope

- Predictive churn scoring.

- Venue demand forecasting.

- Smart recommendations and next-best action nudges.

- Advanced acquisition attribution and campaign ROI.

- Advanced segmentation and personalization models.

- Anomaly detection for suspicious usage patterns.

- Automated insight summaries.

- AI-assisted dashboard query interface.

- Long-term data warehouse and BI integrations.

- Heatmaps, map intelligence, and advanced spatial analytics.

## 27. Product Guardrails

- Do not defer raw event capture until after V1.

- Do not track only big outcomes; capture the steps that produce or prevent outcomes.

- Do not expose sensitive analytics to public users.

- Do not let analytics recalculate official RP, standings, match truth, or player stats.

- Do not store private evidence or raw sensitive content in analytics metadata when an ID reference is enough.

- Do not make dashboards without metric definitions.

- Do not let event names drift without versioning.

- Do not block user actions while analytics processing runs.

- Do not use analytics to automatically punish clubs or users in V1.

- Do not lose context: actor role, entity type, source, route, hub, zone, timestamp, and workflow step matter.

- Do not overfit public product decisions to vanity metrics like views alone.

- Do not treat Buzz as football truth or Analytics as governance truth.

## 28. Locked Summary

The Analytics, Insights & Intelligence Engine is foundational infrastructure for Kalaanba. It must begin from day one, not after launch. Every important user action, workflow step, engine event, status change, notification state, card interaction, booking attempt, result action, challenge response, trust decision, moderation action, recognition share, and admin decision should produce structured data. The engine should store raw events, create derived metrics, power dashboards, expose safe reports, and later support recommendations and intelligence. It must observe and analyze without replacing the official domain engines that own match truth, RP, standings, player stats, bookings, notifications, moderation, or governance decisions. Final locked principle: If it happens on Kalaanba and it can teach us something, it should be captured - safely, clearly, and in context.
