<!-- Converted from Notification_Distribution_Engine_System_Document.pdf -->

# Kalaanba Notification & Distribution Engine System Document

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Notification & Distribution Engine |
| Core principle | The right people should get the right update at the right time,<br>through the right channel, without spam. |
| V1 stance | WhatsApp-first, in-app-ready, event-driven, simple reminders,<br>clean match/challenge/competition updates, action queue, and<br>audit log. |
| Primary channels | WhatsApp and in-app notifications. |
| Later channels | SMS, email, push notifications. |
| Real-time stance | Use WebSockets for live UI updates, event listeners/workers for<br>reliable background processing, and an outbox queue for delivery. |
| Distribution stance | Some updates are private. Some are public. Some are shareable. |

The Notification & Distribution Engine controls how Kalaanba turns platform events into useful messages, reminders, alerts, action items, and public updates. It does not decide whether a match is true, whether RP should move, or whether a dispute is valid. Instead, it listens for events from other engines, decides who should be notified, chooses the right channel, and records delivery history.

## 1. Purpose

The Notification & Distribution Engine controls how Kalaanba communicates important activity to clubs, players, referees, organizers, fans, admins, and Super Admins. In simple terms: this engine answers who needs to know, what should they receive, when should they receive it, and through which channel. It supports match invites, fixture updates, result confirmations, challenge alerts, referee assignments, dispute alerts, evidence requests, competition updates, standings updates, RP movement alerts, fan/follower updates, admin review alerts, and public share cards.

## 2. Why This Engine Matters

A workflow can be well-designed and still fail if people do not receive the right alert. A club can submit a result, but the opponent may never see the confirmation request. A referee can be assigned, but may not know. A competition fixture can change, but teams may arrive at the wrong time. A dispute can be raised, but the organizer may miss it. This engine is therefore not just notifications. It is the communication layer that makes Kalaanba feel alive, dependable, and coordinated.

## 3. Core Philosophy

Kalaanba should communicate like grassroots football already communicates: fast, clear, practical, and shareable.

<!-- Page 2 -->

This means WhatsApp-first, short messages, clear action links, no overload, public updates where useful, private updates where sensitive, reminders only when needed, and an audit trail for important messages. The engine should not spam people. It should help them act.

## 4. What This Engine Owns

| Owns | Examples |
| --- | --- |
| Notification events | Match invite, result confirmation, dispute alert, referee<br>assignment, standings update. |
| Recipient targeting | Club captain, organizer, referee, follower, Super Admin, admin<br>queue. |
| Channel selection | WhatsApp, in-app, later SMS/email/push. |
| Reminder logic | Result confirmation reminder, challenge response reminder,<br>referee report reminder. |
| Delivery status | Queued, sent, delivered, failed, seen, acted on. |
| Preferences and quiet hours | Who can receive what, when, and how often. |
| Distribution rules | Private alert, public update, share card, admin-only alert. |
| Audit log | Who was notified, when, through which channel, and whether<br>action was taken. |

| Does not own | Owner |
| --- | --- |
| Match result truth | Trust & Verification Engine |
| Fixture lifecycle | Match / Fixture Engine |
| RP movement | RP Economy Engine |
| Challenge lifecycle | Challenge Engine |
| Competition rules | Competition & Rules Engine |
| Referee assignment logic | Referee & Officiator Engine |
| Fan Buzz formula | Fan Buzz Engine |
| Moderation decisions | Moderation / Safety Engine |
| Admin override decision | Admin Governance Engine |

## 5. Notification vs Distribution

### Notification

A targeted message sent to someone who needs to act or know. Example: Taha Stars submitted a 2-1 result. Confirm or dispute.

### Distribution

A public or semi-public update meant to spread information. Example: Full-time: Taha Stars 2-1 Aboabo City. Match verified.

### Locked distinction

A notification is usually private. A distribution update can be public, shareable, or feed-based.

## 6. Channels

### WhatsApp

Main V1 channel. Use for match invites, result confirmation links, challenge alerts, referee assignments, fixture reminders, dispute alerts, competition updates, public share cards, and standings snapshots.

<!-- Page 3 -->

### In-app notifications

Should exist from V1 or near V1 as notification history, pending actions, dispute alerts, admin review items, referee report reminders, and challenge updates.

### SMS

Later or fallback. Useful for OTP, critical alerts, users without WhatsApp, or WhatsApp delivery failure.

### Email

Later. Useful for organizers, institutions, admins, weekly reports, and competition summaries.

### Push notifications

Later. Useful when the mobile app is active.

## 7. WebSockets, Event Listeners, Workers, and Outbox

### Core answer

Yes, Kalaanba should have listeners that react to events as they happen. But not everything should be handled by WebSockets.

### WebSockets

Use WebSockets for live UI updates: new notification badge, admin review queue update, live match status, challenge activity, and action queue changes. WebSockets make the frontend feel real-time.

### Event listeners

Use backend event listeners to react when other engines emit events such as result_submitted, challenge_accepted, referee_assigned, dispute_raised, or standings_updated.

### Background workers

Use workers for heavier or external work such as sending WhatsApp messages, retries, reminder scheduling, digest generation, and failed-delivery handling.

### Notification outbox

Use an outbox table/queue so notification jobs are saved reliably before sending. This prevents lost notifications and avoids slowing the main user action.

### Important distinction

WebSockets are for real-time display. Queues/workers are for reliable delivery. Event listeners connect the engines together.

## 8. Recommended Event Flow

### Example flow

A result is submitted. Match Engine emits result_submitted. Notification Engine creates an in-app action item and queues a WhatsApp confirmation request. WebSocket updates the opponent captain action queue instantly. Worker sends WhatsApp in the background. Delivery status is logged.

### Why this matters

The user does not wait for WhatsApp delivery before the match submission completes. The platform stores the event, queues the notification, and continues.

<!-- Page 4 -->

### Locked architecture

Other engines emit events. Notification Engine listens, decides who receives what, stores notification records, queues delivery, pushes live UI updates, and logs outcomes.

| Layer | Purpose | Examples |
| --- | --- | --- |
| WebSocket | Live UI updates | Notification badge, admin queue change,<br>match live status. |
| Event listener | React to platform events | result_submitted, challenge_accepted,<br>dispute_raised. |
| Outbox / queue | Reliable delivery jobs | WhatsApp send, retries, reminders, digest<br>jobs. |
| Worker | Process async jobs | Send messages, retry failed jobs, schedule<br>reminders. |
| Database notification record | Persistent notification history | Action queue, audit log, delivery status. |

## 9. Notification Recipients

The engine should decide recipients based on role and context. Club recipients include owner, admin, captain, manager, assigned club rep, players where relevant, and media manager where relevant. Match recipients include both club reps/captains, assigned referee/officiator, competition organizer, venue admin later, and followers if public. Challenge recipients include challenger club reps, respondent club reps, club admins, fans/followers, referee/officiator once scheduled, and admins if flagged. Competition recipients include organizer, participating clubs, club reps/captains, referees/officials, players where enabled, fans/followers, and Super Admin/admin for escalations.

## 10. Notification Urgency Levels

Urgency affects channel, reminder frequency, priority in admin dashboard, whether WhatsApp is used, and whether notifications are grouped or immediate.

| Level | Meaning | Examples |
| --- | --- | --- |
| info | General update | Result published, competition launched. |
| normal | Useful but not urgent | Fixture reminder, new follower. |
| important | Needs attention | Match invite, referee assignment. |
| urgent | Needs action soon | Result confirmation, evidence request. |
| critical | High-risk or deadline-sensitive | Dispute deadline, Super Admin review,<br>challenge RP hold. |

## 11. Notification Categories

### Match notifications

Match invite sent, match accepted, fixture scheduled, fixture rescheduled, match postponed, match cancelled, match abandoned, result submitted, result confirmation requested, result verified, walkover claimed, walkover confirmed, match under review.

### Challenge notifications

Challenge issued, challenge seen, challenge countered, challenge accepted, challenge declined, challenge ignored/expired, scheduling window opened, challenge fixture scheduled, prediction opened, challenge result submitted, challenge disputed, RP settled, challenge archived.

<!-- Page 5 -->

### Trust notifications

Evidence requested, dispute raised, review started, review verdict issued, match voided, Super Admin override applied, caution/watch flag created.

### Referee/officiator notifications

Assignment request, assignment accepted, assignment declined, match reminder, report reminder, period report reminder, dispute follow-up, report accepted, assignment cancelled.

### Competition notifications

Competition launched, team added, fixture scheduled, fixture changed, registration opened, registration closed, result confirmed, standings updated, knockout bracket updated, disciplinary notice, winner announced.

### RP notifications

RP awarded, RP locked, RP returned, RP transferred, RP penalty applied, RP held for review, Season RP reset, bonus queued, bonus applied.

### Player notifications

Invited to club, ghost profile claim link, lineup selected, stat confirmed, stat disputed, transfer or affiliation request, profile verified, player card ready.

### Admin notifications

Dispute review needed, suspicious RP movement, related club flag, duplicate player flag, evidence waiting, Super Admin override needed, competition escalation, venue verification request later.

## 12. Actionable vs Informational Notifications

### Actionable notification

Requires user action. Examples: confirm result, accept challenge, submit referee report, upload evidence, respond to dispute, accept fixture invite.

### Informational notification

Only informs the user. Examples: result verified, standings updated, challenge published, RP awarded, competition winner announced.

### Locked rule

Actionable notifications should remain visible until resolved. Informational notifications can expire, group, or stay in history.

## 13. Notification Lifecycle

Recommended lifecycle: Created -> Queued -> Sent -> Delivered or Failed -> Seen -> Acted On, Expired, or Cancelled.

| Status | Meaning |
| --- | --- |
| created | Notification event created. |
| queued | Waiting to be sent. |
| sent | Sent to channel provider. |
| delivered | Delivery confirmed, if channel supports it. |
| failed | Sending failed. |
| seen | User opened or viewed it. |
| acted_on | User completed action. |
| expired | Action window passed. |

<!-- Page 6 -->

| cancelled | No longer relevant. |
| --- | --- |

## 14. Notification Event Model

Each notification should be tied to a source event and should have enough metadata for routing, action, audit, expiry, and retries. { "notificationId": "notif_123", "eventType": "result_confirmation_requested", "sourceType": "match", "sourceId": "match_456", "recipients": ["clubA_captain", "clubB_admin"], "urgency": "urgent", "channelPreference": ["whatsapp", "in_app"], "title": "Confirm match result", "body": "Aboabo United submitted a 2-1 result against Taha Stars.", "actionUrl": "/matches/match_456/confirm", "status": "queued", "createdAt": "timestamp" }

## 15. Notification Triggers

The engine should listen for platform events and create the right notification jobs.

| Event | Notification |
| --- | --- |
| Match created | Opponent invite. |
| Match accepted | Fixture confirmed. |
| Result submitted | Confirmation request. |
| Result confirmed | Result verified update. |
| Challenge issued | Challenge alert. |
| Challenge countered | Counter offer alert. |
| Challenge accepted | Scheduling alert. |
| Referee assigned | Assignment request. |
| Referee report missing | Report reminder. |
| Dispute raised | Dispute alert. |
| Evidence requested | Evidence request. |
| Competition fixture changed | Fixture change alert. |
| Standings updated | Standings update. |
| RP transferred | RP movement alert. |

## 16. Recipient Targeting Rules

The engine should not send everything to everyone. Match invites go to the target club owner/admin/captain and creator club confirmation. Result confirmation goes to opponent club rep/captain, club admin/owner if needed, organizer if competition, and referee if assigned. Challenge issued goes to target club admins/captains, challenger club admins, followers if public, and admin if flagged. Referee assignment goes to the referee/officiator, assigning club/organizer, and both clubs when accepted. Competition updates go to organizer, affected clubs, affected referees, and followers if public.

## 17. Reminder Logic

Reminders should be helpful, not annoying. Each reminder should have first reminder time, max reminders, stop condition, escalation path, and expiry action. Examples include challenge response reminder, scheduling window reminder, result

<!-- Page 7 -->

confirmation reminder, referee report reminder, evidence deadline reminder, dispute response reminder, fixture kickoff reminder, and competition registration deadline reminder.

## 18. Escalation Logic

Some notifications should escalate if ignored. Result confirmation ignored can escalate to club admin/owner. Challenge response ignored can expire. Referee report ignored can notify organizer/admin. Evidence request ignored can allow review to proceed without evidence. Critical admin review ignored can escalate to Super Admin.

## 19. Anti-Spam Rules

Kalaanba should not overwhelm users. Controls include grouping similar alerts, limiting repeated reminders, using digest for low-priority updates, avoiding duplicate channel sends, respecting quiet hours where possible, allowing role-based preferences, suppressing resolved action requests, and cancelling outdated notifications.

## 20. Quiet Hours

Quiet hours should reduce non-urgent alerts. Non-urgent notifications can wait until morning, urgent matchday alerts can still send, and critical dispute/admin alerts can still send. Quiet hours can be configured by user, club, competition, or platform default.

## 21. Notification Preferences

Users and clubs should eventually control preferences. V1 can support simple preferences: WhatsApp on/off where possible, in-app always on for important actions, competition updates on/off, challenge alerts on/off, fan/follower updates on/off, and basic reminder frequency. Some system-critical notifications cannot be fully disabled.

## 22. WhatsApp-Friendly Message Types

Kalaanba should produce short, clean, shareable WhatsApp messages. These are examples, not final copy.

### Match invite

Match Invite Aboabo United wants to play Taha Stars. Date: Saturday, 4:00 PM Venue: Kalpohin AstroTurf Confirm or decline: [link]

### Result confirmation

Confirm Result Aboabo United submitted: Aboabo United 2-1 Taha Stars Confirm or dispute: [link]

### Verified result

Full-Time Result Aboabo United 2-1 Taha Stars Status: Verified View match: [link]

<!-- Page 8 -->

### Challenge issued

Respect on the Line Aboabo United have called out Taha Stars. Response needed: [link]

### Challenge accepted

Challenge Accepted Taha Stars have accepted Aboabo United's challenge. Match scheduling is now open.

### Referee assignment

Referee Assignment You have been assigned to: Aboabo United vs Taha Stars Saturday, 4:00 PM Accept or decline: [link]

### Dispute alert

Result Dispute Raised Taha Stars disputed the submitted result against Aboabo United. Review required: [link]

### Competition standings

Standings Updated Tamale Weekend League table has been updated after today's result. View standings: [link]

## 23. Shareable Cards and Distribution Outputs

The Notification Engine should trigger shareable outputs, but it does not design every visual itself. It can request match cards, result cards, challenge cards, standings cards, fixture cards, winner cards, player milestone cards, RP movement cards where public, referee assignment cards where private, and dispute/update cards where admin-only.

## 24. Public vs Private Rules

Not every update should be public. Public by default: public fixture scheduled, verified result, competition standings, public challenge issued, challenge accepted, winner announcement, and public player milestone later. Private by default: dispute details, evidence requests, WhatsApp screenshots, admin review notes, referee conflict notes, RP suspicious flags, related- club flags, Super Admin override notes, private/internal matches, and sensitive player identity notifications.

## 25. Fan and Follower Notifications

Fans should receive followed club fixture, followed club result, challenge issued by followed club, challenge accepted, prediction window open, match reminder, result verified, competition winner, and major standings update. Fans should not receive internal disputes, evidence requests, admin review details, referee report reminders, or private match changes.

## 26. Soft Follow Behavior

Some fan actions can create a soft-follow. Examples include reacting to a challenge, sharing a challenge, predicting a score, tracking a match, or repeatedly viewing updates from one club. Soft-follow means the user may receive relevant updates without formally following the club, but the system should avoid spam.

<!-- Page 9 -->

## 27. Admin and Super Admin Alerts

Admin alerts should be separate from normal user alerts. Admin alert types include dispute review needed, evidence submitted, suspicious RP movement, repeated club pairing, related-club suspicion, referee report conflict, competition escalation, no-show claim, abandoned match ruling needed, and Super Admin override request. Super Admin should receive critical trust review, high-RP challenge hold, global config issue, season-closing unresolved dispute, major competition escalation, mass notification failure, and suspicious pattern cluster.

## 28. Notification Audit Log

Every important notification should be logged. Log fields include notification ID, event type, source entity, recipient, recipient role, channel, message template, send time, delivery status, failure reason, action taken, acted time, retry count, and created by/source engine.

## 29. Message Templates

Use templates, not hardcoded messages. Template fields include template key, channel, language, title, body, variables, action label, action URL, urgency, expiry, allowed recipients, and public/private flag. { "templateKey": "match.result.confirmation.request", "channel": "whatsapp", "title": "Confirm Result", "body": "{{clubA}} submitted {{score}} against {{clubB}}. Confirm or dispute.", "actionLabel": "Review Result", "visibility": "private" }

## 30. Notification Inbox

Kalaanba should have an in-app notification inbox with sections such as Action needed, Match updates, Challenge updates, Competition updates, Referee tasks, Admin reviews, and System messages. Action-needed items should stay at the top.

## 31. Action Queue

The Action Queue is more focused than the inbox. It shows tasks the user must complete: confirm result, accept or decline match invite, respond to challenge, submit referee report, upload evidence, review dispute, or accept fixture schedule.

## 32. Failure and Retry Handling

If a message fails, the system should retry, switch to fallback channel when available, mark delivery failed, show failure in admin logs, notify sender/admin if critical, and avoid duplicates if already acted on.

## 33. Grouping and Digest

Low-priority notifications can be grouped. If five competition fixtures are scheduled at once, send one grouped message where possible. Do not digest urgent action requests.

<!-- Page 10 -->

## 34. Notification Timing

Timing should match the workflow. Match invites send immediately. Fixture reminders can send 24 hours before and on matchday. Result confirmation sends immediately after result submission. Referee report reminders send after match end. Standings updates send after confirmed result updates the table.

## 35. Expiry Rules

Some notifications expire: challenge response window expired, old match invite declined, result confirmation completed, evidence deadline passed, referee assignment cancelled, fixture cancelled, or competition completed. Expired notifications should not keep prompting action.

## 36. Security and Privacy

The Notification Engine must not leak sensitive information. Do not expose phone numbers, WhatsApp screenshots, evidence files, admin notes, referee conflict notes, identity verification details, minor-sensitive player data, Super Admin override reasons, or suspicious flag details unless intentionally published to authorized users.

## 37. Moderation and Safety Link

Notifications and public messages must respect moderation rules. Do not distribute threats, slurs, abusive challenge messages, harmful accusations, unverified cheating claims, private evidence, or dangerous crowd-inciting language. Risky public challenge copy should wait for moderation clearance.

## 38. Event-Driven Architecture

The Notification Engine should be event-driven. Other engines emit events, and the Notification Engine decides what to send. This prevents each engine from building its own messaging logic.

## 39. Notification Outbox

Use a notification outbox pattern. When an important event happens, write a notification job to an outbox. Then a worker sends it. This prevents lost notifications, supports retries, avoids slowing the main app, and keeps delivery outside the core transaction.

## 40. Performance and Bottleneck Prevention

Notification sending should not block normal app use. Create notification events quickly, send through background workers, store delivery result, retry if failed, avoid waiting for external messaging providers before continuing app flow, group low- priority messages, and cancel outdated messages.

## 41. Engine Outputs

- createNotificationEvent(event)

- getUserNotifications(userId)

- getActionQueue(userId)

- getClubNotifications(clubId)

- getCompetitionNotifications(competitionId)

- getNotificationStatus(notificationId)

<!-- Page 11 -->

- getDeliveryLog(filters)

- getPendingReminders(filters)

- getNotificationPreferences(userId)

- getPublicDistributionFeed(filters)

- getAdminAlertQueue(filters)

- getFailedNotifications(filters)

- cancelNotification(notificationId)

- markNotificationActedOn(notificationId)

- pushRealtimeUpdate(channel, payload)

- processNotificationOutboxJob(jobId)

## 42. Engine Integrations

| Engine/System | Relationship |
| --- | --- |
| Match / Fixture Engine | Emits match invite, fixture scheduled, result submitted,<br>postponed, cancelled, abandoned events. |
| Trust & Verification Engine | Emits confirmation, dispute, evidence, review, verdict, caution,<br>and override events. |
| Challenge Engine | Emits challenge issued, seen, countered, accepted, scheduled,<br>prediction open, resolved events. |
| Referee & Officiator Engine | Emits assignment, acceptance, report pending, report submitted,<br>no-show referee events. |
| Competition & Rules Engine | Emits competition launched, fixture changed, standings updated,<br>winner announced events. |
| RP Economy Engine | Emits RP awarded, locked, returned, transferred, penalty, season<br>reset events. |
| Club Engine | Emits member invite, role change, verification, dormant status,<br>related-club review events. |
| Player / Affiliation Engine | Emits player invite, ghost claim, stat confirmed, stat disputed,<br>transfer/affiliation events. |
| Fan Buzz / Feed Engine | Consumes public distribution events and fan interactions. |
| Admin Governance Engine | Configures templates, permissions, audit, and admin alert routing. |
| Moderation / Safety Engine | Clears public challenge messages, comments, and risky copy<br>before distribution. |

## 43. Configurable Defaults

| Setting | Default direction |
| --- | --- |
| Primary V1 channel | WhatsApp |
| In-app notification | Enabled for all important events |
| SMS | Later/fallback |
| Email | Later |
| Push | Later |
| WebSocket live updates | Enabled for in-app/admin real-time updates |
| Outbox/queue delivery | Required for reliable sending |
| Match invite reminder | Configurable |
| Result confirmation reminder | Configurable |
| Challenge response reminder | Configurable |
| Referee report reminder | Configurable |
| Evidence request reminder | Configurable |
| Quiet hours | Configurable |
| Max reminders | Configurable |
| Digest frequency | Configurable |
| Admin escalation window | Configurable |
| Public/private visibility | Template-configured |

<!-- Page 12 -->

| Critical notification fallback | Configurable |
| --- | --- |
| Delivery retry count | Configurable |

## 44. V1 Scope

- WhatsApp-first notifications

- in-app notification records

- WebSocket-ready real-time UI updates

- event listeners for platform events

- notification outbox and background worker delivery

- action queue

- match invite notifications

- fixture scheduled/changed notifications

- result confirmation requests

- result verified notifications

- challenge issued/countered/accepted/scheduled notifications

- challenge response reminders

- referee assignment notifications

- referee report reminders

- dispute alerts

- evidence request alerts

- competition fixture/result/standings updates

- WhatsApp-friendly result cards

- WhatsApp-friendly fixture cards

- WhatsApp-friendly challenge messages

- notification audit log

- basic delivery status

- basic retry handling

- basic grouping for bulk fixture updates

- admin alert queue

- configurable templates

## 45. Deferred / Later

- full mobile push system

- SMS fallback at scale

- email digest system

- advanced quiet-hour personalization

- advanced notification analytics

- AI-written notification copy

- multilingual template management

- deep fan notification personalization

- full public feed ranking

- sponsor distribution tools

- paid promotional boosts

- advanced delivery provider failover

- rich media automation at scale

- automated voice calls

<!-- Page 13 -->

## 46. Product Guardrails

- Do not send every update to everyone.

- Do not expose private disputes publicly.

- Do not leak evidence or admin notes.

- Do not make WhatsApp delivery block app workflows.

- Do not use WebSockets as the only delivery system.

- Do not rely on frontend listeners for critical records.

- Do not create endless reminders.

- Do not let old action notifications remain active after expiry.

- Do not notify fans about internal admin issues.

- Do not distribute abusive challenge messages.

- Do not make notification templates hardcoded.

- Do not ignore failed critical notifications.

- Do not let public share cards override Trust clearance.

## 47. Locked Summary

The Kalaanba Notification & Distribution Engine controls how platform events become useful messages, reminders, alerts, action items, and public updates. It is WhatsApp-first for V1, with in-app notification records, an action queue, WebSocket- ready real-time UI updates, event listeners, and an outbox/worker delivery system. SMS, email, and push notifications can come later. The engine listens for events from Match, Trust, Challenge, Referee, Competition, RP, Club, Player, Fan Buzz, Admin Governance, and Moderation systems. It decides who receives what, through which channel, at what urgency, and whether reminders, escalation, grouping, or public distribution are needed. WebSockets should be used for real-time app and admin UI updates, such as notification badges, action queue changes, admin review queue changes, live match status, and challenge activity. Backend event listeners and workers should handle reliable notification creation, WhatsApp delivery, retries, reminders, and audit logs. Critical messages must be persisted through an outbox/queue rather than relying only on live WebSocket connections. The engine separates private notifications from public distribution. Sensitive items such as disputes, evidence, admin notes, suspicious flags, and Super Admin override details remain private. Public updates such as verified results, public fixtures, challenge announcements, standings, and winner announcements can be distributed and shared. Final principle: Notify the people who need to act. Inform the people who need to know. Share only what is safe to make public. Use WebSockets for live visibility, and use queues/workers for reliable delivery.
