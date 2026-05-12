<!-- Converted from Moderation_and_Safety_Engine_System_Document.pdf -->

### KALAANBA

# Moderation & Safety Engine

## System Document

### Final principle

Grassroots football needs drama. Kalaanba must make sure the drama does not become harm.

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Moderation & Safety Engine |
| Core principle | Let rivalry and banter live, but stop abuse, threats, false public<br>accusations, private exposure, and unsafe crowd energy. |
| V1 stance | Rule-based moderation, report flow, admin review queue, public-<br>content clearance, feed suppression, share-card safety, and<br>audit trail. |
| AI / SLM dependency for MVP | Not required. AI can assist later, but V1 should work with rules,<br>keyword/phrase checks, status flags, admin queues, and manual<br>review. |
| Primary protection areas | Challenge copy, club banter, public cards, feeds, shareable<br>content, public accusations, referee abuse, media, and reports. |
| Key boundary | Trust decides whether records can count. Moderation decides<br>whether content can be shown publicly. |
| Document date | May 11, 2026 |

## Document Map

- Purpose, philosophy, ownership, boundaries, definitions, risk levels, statuses, and covered content categories.

- Public and private visibility rules, moderation actions, report flow, Trust escalation, Buzz integration, and Notification

integration.

- Challenge copy flow, safe fallback copy, restrictions, admin review queues, conceptual data model, engine outputs,

and affected engines.

- Configurable defaults, alpha/V1/deferred scope, product guardrails, and locked summary.

## Existing Engine Alignment

This system is derived from the already locked direction across Fan Buzz, Notification, Trust, Challenge, Awards, Player, Club, Competition, Referee, Venue, and Admin Governance systems.

| Existing system | Moderation implication |
| --- | --- |
| Fan Buzz / Feed / Discovery Engine | Buzz drives visibility, not football truth. Unsafe, held, restricted,<br>hidden, or escalated content must not trend. |
| Notification & Distribution Engine | Public distribution must not send threats, slurs, abusive challenge<br>messages, harmful accusations, private evidence, or unsafe crowd- |

<!-- Page 2 -->

|  | inciting language. |
| --- | --- |
| Trust & Verification Engine | Trust protects official records. Moderation protects public speech,<br>media, cards, and visibility. |
| Awards & Recognition Engine | Weekly recognitions and share cards need safety clearance before<br>public amplification. |
| Challenge Engine | Challenge copy should create drama without becoming abuse or<br>public accusation. |
| Admin Configuration & Governance Engine | Moderation thresholds, report reasons, restriction durations, queues,<br>and escalation rules should be configurable. |

<!-- Page 3 -->

## 1. Purpose

The Moderation & Safety Engine controls whether public-facing content, public actions, captions, comments, challenge copy, share cards, media, names, reports, and feed items are safe enough to show, distribute, boost, or keep public. In simple terms, this engine answers: can this content be shown publicly without harming people, damaging trust, exposing private information, or turning football rivalry into abuse?

- Challenge call-out messages.

- Club banter and rivalry captions.

- Public match/result posts.

- Weekly recognition and award cards.

- Player highlight cards and player public moments.

- Comments later.

- Club bios, slogans, names, logos, and public profile fields.

- Competition announcements and public page copy.

- Venue reviews and venue public copy later.

- Referee-related public comments and reports.

- Fan Buzz feeds, discovery cards, and shareable cards.

- Reports and abuse flags.

## 2. Why This Engine Matters

Kalaanba is intentionally building public football energy: challenges, reactions, shares, predictions, player moments, weekly recognitions, hot fixtures, zone pride, and rivalry content. That energy is one of the product advantages, but it creates risk if it is not controlled. A club can issue a challenge and write something abusive. A fan can accuse a referee publicly. A disputed result can turn into public shaming. A WhatsApp screenshot can leak private numbers. A player recognition card can include unsafe comments. A challenge can trend for the wrong reason. So the Moderation Engine is not a nice-to-have. It is the safety gate between public activity and public amplification.

### Product boundary

Trust protects official records: RP, player stats, standings, challenge settlement, awards, archives, and public football records. Moderation protects what people are allowed to say, show, share, and amplify.

## 3. Core Philosophy

Kalaanba should not kill banter. Football needs emotion, rivalry, pride, and pressure. The system should allow football-native language while blocking harmful language and unsafe behavior.

| Allowed energy | Not allowed energy |
| --- | --- |
| Respect on the line. Let the pitch decide. North Zone, we are<br>coming. They talked. Now we play. No excuses on Sunday. | Threats, slurs, doxxing, referee abuse, private screenshots,<br>unverified cheating claims, harassment, and dangerous crowd-<br>inciting language. |

### Locked product principle

Banter is allowed. Harm is not.

<!-- Page 4 -->

## 4. What This Engine Owns

| Owns | Examples |
| --- | --- |
| Public content safety | Challenge copy, captions, comments, bios, slogans, public cards. |
| Moderation status | Clean, watch, held, restricted, hidden, escalated. |
| Report flow | Report content, report user, report club, report abuse, report<br>impersonation. |
| Admin review queue | Risky content, reported items, repeated offenders, public<br>accusations. |
| Feed safety | Suppress, hide, remove from public feed, mark sensitive. |
| Share-card clearance | Challenge cards, result cards, player cards, recognition cards. |
| Public distribution clearance | Public WhatsApp/share messages, feed posts, public<br>announcements. |
| Sensitive content protection | Evidence files, phone numbers, screenshots, minor-sensitive data. |
| Moderation audit trail | Who acted, what changed, why, when, old status, new status. |
| Warning and restriction records | User/club warnings, temporary public-posting restriction, comment<br>restriction later. |

## 5. What This Engine Does Not Own

| Does not own | Owner |
| --- | --- |
| Match truth | Trust & Verification Engine |
| Result verification | Trust & Verification Engine |
| RP movement | RP Economy Engine |
| Challenge lifecycle | Challenge Engine |
| Competition standings | Competition & Rules Engine |
| Player official stats | Player / Affiliation Engine |
| Fan Buzz formula | Fan Buzz Engine |
| Notification delivery | Notification & Distribution Engine |
| Final platform governance | Admin Configuration & Governance Engine |
| Legal/payment disputes | Future Legal / Payments / Governance workflows |

### Important distinction

Trust asks: Did this happen, and can it count? Moderation asks: Can this be shown publicly? Example: a club writes, "They used fake players and bribed the referee." That may need a Trust review, but it should not trend publicly as a feed item. Moderation holds the public accusation. Trust investigates the football record.

## 6. Core Definitions

| Term | Meaning |
| --- | --- |
| Moderation | The process of checking whether content is safe, allowed, restricted, |

<!-- Page 5 -->

|  | or removed. |
| --- | --- |
| Safety review | A deeper review for harmful, threatening, private, abusive, or risky<br>content. |
| Public content | Anything visible beyond involved parties/admins. |
| Private content | Evidence, admin notes, dispute details, identity details, private<br>reports, internal actions. |
| Moderation status | The current safety state of content. |
| Feed eligibility | Whether an item can appear in public feeds or discovery surfaces. |
| Distribution clearance | Whether a message/card can be shared publicly or sent to followers. |
| Sensitive content | Private evidence, phone numbers, minors details, documents,<br>screenshots, abuse details. |
| Report | A user/admin action that flags content, behavior, profile, media, or<br>message for review. |
| Suppression | Content remains stored but is reduced or removed from public<br>visibility. |
| Escalation | Sending a case to admin, Super Admin, Trust, or Governance<br>review. |

## 7. Moderation Risk Levels

| Level | Meaning | Default effect |
| --- | --- | --- |
| Clean | No issue detected. | Publish normally. |
| Watch | Mild risk or edgy wording. | Publish but do not boost aggressively. |
| Hold for Review | Risky content needs admin check. | Not public until cleared. |
| Restricted | Content can be seen only by involved<br>parties/admins. | Removed from public feed/distribution. |
| Hidden | Content should not be shown publicly. | Hidden from public surfaces. |
| Escalated | Serious safety, privacy, threat, abuse, minor,<br>or impersonation issue. | Admin/Super Admin review required. |

## 8. Moderation Statuses

Recommended lifecycle: Submitted -> Auto-screened -> Clean / Watch / Held / Restricted / Hidden / Escalated -> Reviewed -> Approved / Edited / Removed / Restored / Sanction Recommended.

| Status | Meaning |
| --- | --- |
| submitted | User or system created content. |
| auto_screened | Rule-based scan has run. |
| clean | Safe for normal publishing. |
| watch | Allowed, but carries mild risk. |
| held_for_review | Not public until admin clears it. |
| restricted | Visible only to allowed parties. |
| hidden | Removed from public surfaces. |
| escalated | Sent to higher-level review. |
| approved | Admin cleared it. |

<!-- Page 6 -->

| edit_requested | User must revise before publication. |
| --- | --- |
| removed | Content removed from public use. |
| restored | Previously hidden content was restored. |
| sanction_recommended | Admin should consider warning/restriction. |

## 9. Content Categories Covered

### 9.1 Challenge Copy

Challenge copy includes call-out text, counter-offer public wording, challenge captions, challenge card text, and rivalry statements. It should create pressure without becoming abuse.

| Category | Examples |
| --- | --- |
| Allowed | Respect on the line. Let the pitch decide. We are ready for them.<br>This Sunday, no excuses. |
| Hold / Review | They are cowards. They always run from real teams. We will<br>expose them. |
| Blocked | Threats of violence, ethnic/religious insults, doxxing, referee<br>bribery accusations without formal dispute, attack language, and<br>cheating claims before Trust verdict. |

### 9.2 Public Accusations

Public accusations should be controlled because they can damage clubs, players, referees, and competitions before facts are reviewed.

- Examples to hold: "They used fake players."

- Examples to hold: "The referee was paid."

- Examples to hold: "They forged the result."

- Examples to hold: "This club is a scam."

- Examples to hold: "They always cheat."

### Correct path

Public accusation -> held by Moderation -> dispute/report created -> Trust/Governance review -> public outcome only if cleared and appropriate.

### 9.3 Comments Later

Comments should not be V1-critical, but the Moderation Engine should be designed for them. Comment risks include abuse, slurs, threats, referee harassment, player harassment, club pile-ons, unsafe rivalry escalation, spam, impersonation, and false allegations. V1 can defer full comments, but the engine should already support comment moderation statuses so the future comment system does not need to be redesigned.

### 9.4 Media Uploads

Media includes match photos, player images, venue images, challenge graphics, profile images, and future short clips.

- Public media must be intentionally published.

- Evidence media is private by default.

- WhatsApp screenshots should not be public by default.

<!-- Page 7 -->

- Phone numbers, private chat names, sensitive documents, and minor details should be hidden or rejected.

- Dangerous, explicit, humiliating, or abusive media should be held or removed.

### 9.5 Recognition and Award Cards

Because the Awards & Recognition Engine creates weekly recognitions, these cards need moderation clearance before public amplification.

- Stats-based cards must only use verified stats.

- Captions must avoid abuse, mocking, or humiliation.

- Public player cards must respect privacy and minor-protection rules.

- Recognition should celebrate excellence without publicly shaming losing clubs.

- Youth/minor-sensitive recognition needs privacy rules.

### 9.6 Club, Player, Venue, Competition, and Referee Public Fields

The engine should also protect public-facing names, bios, slogans, stage names, venue descriptions, competition announcements, organizer notes, and referee-facing public comments. These surfaces can quietly become harmful if they are not treated as moderated public content.

## 10. Public vs Private Rules

| Public by default if clean | Private by default |
| --- | --- |
| Verified result cards; public fixtures; public challenge cards;<br>competition standings; public recognition cards; club discovery<br>cards; venue discovery cards; player cards for claimed public<br>profiles. | Evidence files; WhatsApp screenshots; admin notes; referee conflict<br>notes; identity verification details; minor-sensitive player data;<br>suspicious flag details; related-club review notes; dispute evidence;<br>Super Admin override reasons; internal match notes; safety reports. |

### Locked privacy rule

Private evidence and sensitive operational records must not leak into public feeds, public cards, share links, public notifications, or fan-facing pages unless intentionally cleared for publication.

## 11. Moderation Actions

- Approve, hold, hide, restore, suppress from feed, remove from public distribution, and mark sensitive.

- Request edit, escalate to Trust, escalate to Admin Governance, or escalate to Super Admin.

- Warn user, warn club, restrict public posting, restrict challenge copy, restrict comments later, or block share-card

generation.

- Lock comment thread later, remove media, mark media as evidence-only, or mark content as private/internal-only.

## 12. Report Flow

Users should be able to report abuse, harassment, threats, hate/slur content, false accusations, referee abuse, player abuse, impersonation, private information exposure, spam, unsafe rivalry/crowd language, inappropriate media, wrong club/player identity, suspicious challenge wording, and other issues. Recommended report lifecycle: Reported -> Triage -> Under Review -> Action Taken / No Action / Escalated / Closed.

| Report status | Meaning |
| --- | --- |
| reported | A report was submitted. |
| triage | System/admin categorizes severity. |
| under_review | Admin is checking the report. |

<!-- Page 8 -->

| action_taken | Content/user/club action applied. |
| --- | --- |
| no_action | Report lacked enough basis. |
| escalated | Sent to Super Admin, Trust, or Governance. |
| closed | Review completed. |

## 13. Moderation vs Trust Escalation

Some cases must leave Moderation and go to Trust or Governance. Moderation should protect the public surface while the appropriate engine reviews the underlying football or account issue.

| Case | Moderation action | Trust/Governance action |
| --- | --- | --- |
| They cheated public comment | Hold/remove public copy. | Create dispute/review if needed. |
| Fake player used | Hold accusation. | Player eligibility/stat dispute review. |
| Referee was bribed | Hold accusation. | Referee/organizer conflict review. |
| No-show claim is fake | Keep public copy restricted. | Trust no-show/walkover review. |
| Suspicious challenge language | Hold challenge copy. | Challenge/Trust review if risk is serious. |
| Threat to attack team | Hide/escalate. | Admin/Super Admin safety action. |

## 14. Feed and Buzz Integration

Moderation status must affect Fan Buzz and public feed eligibility. Buzz cannot amplify content that is unsafe, held, hidden, restricted, escalated, or tied to serious unresolved disputes.

| Moderation status | Feed/Buzz behavior |
| --- | --- |
| clean | Eligible for feed and Buzz. |
| watch | Eligible, but may have reduced boost. |
| held_for_review | Not eligible for public feed. |
| restricted | No public feed. |
| hidden | No feed, no public card. |
| escalated | Block public amplification until decision. |

### Locked feed rule

No content should trend while it is held, restricted, hidden, escalated, or tied to an unresolved serious dispute.

## 15. Notification and Distribution Integration

Notification Engine must ask Moderation before sending public messages or public share cards. Private operational messages do not need public moderation clearance, but they still need privacy protection.

| Message/card type | Moderation requirement |
| --- | --- |
| Result confirmation request | Private workflow message. Allowed, with privacy protection. |
| Evidence request | Private workflow message. Allowed, evidence remains private. |
| Public challenge card | Moderation clearance needed. |

<!-- Page 9 -->

| Public accusation message | Blocked or held. |
| --- | --- |
| Weekly recognition card | Moderation clearance needed. |
| Dispute details to followers | Blocked unless a safe public summary is cleared. |

### Locked distribution rule

Private action messages can move workflows. Public distribution must wait for safety clearance where content is risky.

## 16. Challenge Copy Flow

## 1. Club writes challenge call-out.

## 2. System auto-screens copy.

## 3. If clean, challenge can publish.

## 4. If watch, publish but avoid heavy boosting.

## 5. If risky, hold public copy.

## 6. Club can submit edited version.

## 7. Admin can approve, edit-request, restrict, or hide.

## 8. Challenge business logic can continue privately or with safe default copy, depending on severity.

### Fallback copy

A challenge should not fail just because the hype copy is held. The challenge may continue privately or with safe default wording such as: Aboabo United have called out Taha Stars. Respect is on the line.

## 17. Safe Default Copy Library

For V1, risky user-generated copy can fall back to safe templates. This prevents moderation from blocking the entire product flow.

- Respect on the line.

- The challenge has been issued.

- The match will decide.

- Both clubs are ready.

- Prediction is open.

- Fixture confirmed.

- Result verified.

- Challenge resolved.

## 18. User and Club Restriction Levels

Restrictions should be progressive. Automatic punishment should be avoided in V1. The system should flag and recommend; admins decide.

| Level | Meaning |
| --- | --- |
| none | Normal account. |
| warning | User/club warned. |
| public_copy_review | Public posts require review. |
| challenge_copy_review | Challenge messages require review. |

<!-- Page 10 -->

| media_review | Media uploads require review. |
| --- | --- |
| comment_restricted | Cannot comment temporarily, later feature. |
| public_distribution_blocked | Cannot generate public/share cards temporarily. |
| suspended_public_activity | Can use private workflows, but public activity is suspended. |
| account_suspended | Serious admin/governance action. |

## 19. Admin Review Queue

The admin review queue is the operational control point for risky public content and reports. It should be simple enough for V1 but structured enough to support Super Admin escalation and audit trails.

- Held challenge copy and unsafe call-outs.

- Reported content, reported users, and reported clubs.

- Private information exposure.

- Public accusations.

- Referee abuse and player abuse.

- Unsafe rivalry language.

- Media review.

- Recognition/share-card review.

- Repeated offender warnings.

- Super Admin escalations.

| Queue item field | Meaning |
| --- | --- |
| Item type | Challenge copy, media, report, card, profile field, comment later, etc. |
| Source engine/source ID | Where the item came from. |
| Reporter | Reporter user/club/admin, if any. |
| Report reason | User-selected or system-detected reason. |
| Risk level | Clean, watch, hold, restricted, hidden, escalated. |
| Content preview | Safe preview for admin review. |
| Involved parties | Users, clubs, players, referees, organizers, venues. |
| Current visibility | Public, private, restricted, hidden. |
| Suggested action | System recommendation, not final decision. |
| Admin decision/reason | Final decision and explanation. |
| Audit history | Permanent trace of decisions and changes. |

## 20. Conceptual Data Model

### 20.1 Moderation Record

{ "moderationId": "mod_123", "sourceType": "challenge_message", "sourceId": "challenge_456", "contentType": "text", "submittedBy": "user_789", "clubId": "club_123", "status": "held_for_review", "riskLevel": "high",

<!-- Page 11 -->

"riskReasons": ["unverified_cheating_claim", "referee_accusation"], "visibility": "private_until_review", "feedEligible": false, "distributionEligible": false, "reviewQueue": "public_accusations", "createdAt": "timestamp" }

### 20.2 Report Record

{ "reportId": "report_123", "reportedBy": "user_456", "reportedEntityType": "comment", "reportedEntityId": "comment_789", "reason": "abuse_or_harassment", "details": "Optional user explanation", "status": "under_review", "severity": "medium", "assignedTo": "admin_123", "createdAt": "timestamp" }

### 20.3 Admin Decision Record

{ "decisionId": "decision_123", "moderationId": "mod_123", "previousStatus": "held_for_review", "newStatus": "removed", "action": "remove_from_public_feed", "reason": "Unverified cheating accusation against referee.", "decidedBy": "admin_456", "decidedAt": "timestamp", "affectedSystems": ["FanBuzz", "Notification", "Challenge"] }

## 21. Engine Outputs

The Moderation & Safety Engine should expose focused outputs and service functions to other engines. These names are conceptual and can be adjusted during architecture.

- screenContent(payload)

- createModerationRecord(payload)

- getModerationStatus(sourceType, sourceId)

- isFeedEligible(sourceType, sourceId)

- isDistributionEligible(sourceType, sourceId)

- submitReport(payload)

- getReport(reportId)

- getAdminModerationQueue(filters)

- approveContent(moderationId, reason)

- holdContent(moderationId, reason)

- hideContent(moderationId, reason)

<!-- Page 12 -->

- restoreContent(moderationId, reason)

- requestEdit(moderationId, reason)

- markSensitive(moderationId, reason)

- applyUserWarning(userId, reason)

- applyClubWarning(clubId, reason)

- restrictPublicPosting(entityId, entityType, reason)

- escalateToTrust(moderationId, reason)

- escalateToSuperAdmin(moderationId, reason)

- getModerationAuditLog(filters)

## 22. Affected Engines and Required Changes

| Engine | Required change or relationship |
| --- | --- |
| Challenge Engine | Challenge messages need moderation status. Public cards need distribution<br>clearance. Risky call-outs should use safe default copy. Abusive copy must<br>not trend. |
| Fan Buzz / Feed / Discovery Engine | Feed ranking must consume moderation status. Held, hidden, restricted, or<br>escalated content should not trend. Comments later must pass moderation. |
| Notification & Distribution Engine | Public messages and share cards need moderation clearance. Private<br>evidence and dispute details must not leak. |
| Trust & Verification Engine | Public accusations can become Trust review inputs. Trust verdicts can unlock<br>safe public summaries. |
| Awards & Recognition Engine | Weekly recognition cards need safety clearance. Buzz-based recognition must<br>not use unsafe content. |
| Player / Affiliation Engine | Player names, stage names, images, and cards need safety/privacy rules.<br>Minor-sensitive player content needs restricted visibility. |
| Club Engine | Club names, bios, slogans, logos, and identity fields need moderation status.<br>Repeated unsafe behavior can affect public-posting privileges. |
| Competition & Rules Engine | Competition announcements, public pages, standings captions, and organizer<br>messages need moderation where public. |
| Referee & Officiator Engine | Referee abuse reports route to moderation. Public referee accusations should<br>be held. Reports remain private unless summarized safely. |
| Venue Engine | Venue reviews later need moderation. Venue media and public venue<br>descriptions need safety/privacy checks. |
| Admin Configuration & Governance Engine | Stores thresholds, labels, queue permissions, review roles, restriction<br>durations, and escalation rules. |

## 23. Configurable Defaults

All value-driven and policy-driven defaults should be configurable by admin later. Internal logic keys should remain stable even when user-facing labels change.

- Risk phrase list and banned words/slurs list.

- Public accusation patterns and challenge copy hold behavior.

- Report reasons, default moderation queues, and review SLA targets.

- Number of warnings before restriction and restriction duration.

- Feed suppression multiplier and watch-level boost limit.

- Private evidence visibility and minor content visibility defaults.

- Share-card clearance requirement and allowed fallback copy templates.

- Admin role permissions and Super Admin escalation triggers.

## 24. Alpha, V1, and Deferred Scope

| Phase | Scope |
| --- | --- |

<!-- Page 13 -->

| Alpha | Basic report button, simple moderation status on public content, admin<br>hide/restore, safe default challenge copy, manual admin review, basic<br>audit trail. |
| --- | --- |
| Private Beta | Rule-based content screening, held-for-review queue, public accusation<br>hold, feed suppression, share-card clearance, report categories,<br>user/club warnings, sensitive evidence protection. |
| V1 | Full moderation queue, public content clearance, challenge copy<br>moderation, recognition/share-card moderation, feed eligibility<br>integration, Notification distribution clearance, report flow, admin<br>decisions, audit trail, user/club restriction levels, Super Admin escalation,<br>configurable defaults. |
| Deferred / Later | Full comment system, AI moderation assistant, appeals center, advanced<br>image/video moderation, fan reputation system, device/IP abuse network,<br>automated ban recommendations, legal evidence export, advanced<br>safety analytics, multi-language moderation models, community<br>moderation helpers. |

## 25. Product Guardrails

- Do not kill football banter.

- Do not let abusive challenge copy trend.

- Do not expose private evidence.

- Do not distribute unverified cheating claims.

- Do not let disputes become public harassment.

- Do not make moderation decisions invisible to admins.

- Do not let AI make final safety decisions in V1.

- Do not publicly shame users for moderation status.

- Do not confuse moderation with Trust verification.

- Do not block private operational workflows unnecessarily.

- Do not allow public threats, slurs, doxxing, or crowd-inciting language.

- Do not let sensitive player/minor data leak through cards, feeds, or notifications.

- Do not allow Most Buzzed to amplify unsafe content.

- Do not permanently delete moderation history; preserve audit trail.

## 26. Locked Summary

Kalaanba's Moderation & Safety Engine protects the public side of the platform. It decides whether content is safe enough to publish, share, boost, recommend, or distribute. It does not decide whether a match result is true, whether RP should move, whether standings should update, or whether a player stat is official. Those are Trust, RP, Competition, and Player Engine responsibilities. The engine supports football banter, rivalry, and public drama, but blocks or holds threats, slurs, harassment, private information, referee abuse, unverified cheating claims, unsafe crowd language, and harmful public accusations. For V1, the engine should be rule-based, admin-reviewable, auditable, configurable, and integrated with Fan Buzz, Notification, Challenge, Trust, Awards, Player, Club, Competition, Referee, Venue, and Admin Governance systems.

### Final locked rule

Kalaanba can be loud, competitive, and emotional - but it must not become unsafe.
