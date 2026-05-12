<!-- Converted from Trust_Verification_Engine_System_Document.pdf -->

# Kalaanba Trust & Verification Engine System Document

Locked product direction for match verification, result confidence, evidence, disputes, no-shows, walkovers, decision traces, Super Admin review, and trust clearances.

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Trust & Verification Engine |
| Core principle | Trust should protect official records without slowing down the app. |
| Engine type | Decision and clearance layer |
| Super Admin visibility | Required |
| Super Admin override | Required |
| AI / SLM dependency for<br>MVP | Not required |
| Document date | May 10, 2026 |

Final principle: The engine recommends. The platform records. The Super Admin can correct. The audit trail remembers.

<!-- Page 2 -->

## 1. Purpose

The Trust & Verification Engine decides whether a match, result, stat, dispute, no-show, walkover, club action, or suspicious pattern is trusted enough to affect official Kalaanba systems. It exists because Kalaanba is building football records that must be credible. A club should not be able to invent results, inflate player stats, farm RP, fake a no-show, manipulate challenges, or create suspicious records without review. Simple definition: the Trust Engine answers: can Kalaanba trust this record enough to let it count? If yes, other engines can proceed. If no, the record stays pending, disputed, under review, void, or blocked from official effect.

### Systems protected

- RP

- player stats

- competition standings

- challenge settlement

- awards

- season archives

- club reliability

- public football records

## 2. Core Philosophy

The Trust Engine must be powerful, but not heavy. It should not make users feel like they are filling police reports after every match. The product feeling should be: Confirm result. Not: Submit formal verification documentation. The engine should work quietly in the background, only becoming visible when something needs confirmation, review, or admin attention.

## 3. Why Verify Matches?

Kalaanba verifies matches so that public records are credible. Verification protects final scores, player goals, assists, cards, appearances, RP awards, challenge stake transfers, standings, awards, and season archives. Without verification, a match may still be saved, but it should not affect official public systems. Example: Aboabo United enters that they beat Taha Stars 4-2. Until Taha Stars confirms, or an authorized referee/organizer confirms, that result should not update RP, public stats, standings, or awards.

## 4. Should Every Match Be Verified?

No. Not every match needs verification. Not every match should affect public stats or RP.

| Match type | Verification needed? | Public stats? | RP? |
| --- | --- | --- | --- |
| Casual friendly | No | No official public stats | No |

<!-- Page 3 -->

| Match type | Verification needed? | Public stats? | RP? |
| --- | --- | --- | --- |
| Verified / official friendly | Yes | Yes, if stats are confirmed | Yes, limited/low RP if<br>eligible |
| Competition fixture | Yes | Yes | Yes, if RP-eligible |
| Ranked challenge | Yes, strongly | Yes | Yes, base RP + stake<br>transfer |
| Referee-officiated match | Yes | Yes | Depends on match<br>type |
| Community-officiated match | Yes, if accepted by<br>both sides | Yes, if confirmed | Depends on match<br>type |
| Internal club match | No platform verification<br>needed | Internal stats only | No |

A verified match and an RP-eligible match are not the same thing. A match can be verified but still fail RP rules because of season timing, related clubs, non-participating clubs, or other eligibility issues.

## 5. Match Creation: Official or Casual?

The user should not be asked a heavy technical question like: Is this match verified? Better wording: Match record type.

### Official Record

The result and stats will require confirmation. This can affect public stats, RP, standings, challenges, or records if eligible.

### Casual Record

Saved for reference only. No RP. No public stats. No standings. No awards.

| Match type | Default behavior |
| --- | --- |
| Friendly | User chooses Official Record or Casual Record |
| Competition | Official Record automatically |
| Challenge | Official Record automatically |
| Referee-officiated | Official Record automatically |
| Internal match | Internal Record automatically |

Example: when creating a friendly match, the club sees: Do you want this match to count as an official Kalaanba record? Options: Yes, require confirmation / No, save as casual match.

## 6. Verified Match vs RP-Eligible Match

### Verified Match

Kalaanba trusts that the match happened and the result is reliable.

### RP-Eligible Match

The match is verified and also passes RP rules. Example: a club plays another club during March. The match can be verified, but it does not generate Season RP because March is the transition month.

<!-- Page 4 -->

Example: two related clubs play each other. The match can be verified for history, but no Season RP should be awarded.

### Recommended flags

{ verified: true, rpEligible: false, statsEligible: true, standingsEligible: false, challengeSettlementEligible: false }

## 7. Core Actors

### 7.1 Club Rep / Captain

The club rep or captain performs the match confirmation role. For now, there is no separate scorer role.

- enter result

- confirm result

- enter basic match stats

- confirm lineup/stats where needed

- raise dispute

- respond to no-show/walkover claim

- attach evidence where needed

Later, Kalaanba may introduce a dedicated scorer role if clubs become more structured.

### 7.2 Club Admin / Owner

Can do everything the club rep/captain can do, plus higher-risk club decisions such as confirming the official club position on a dispute, accepting admin ruling, and managing club representatives.

### 7.3 Competition Organizer

The organizer has stronger authority inside a competition. The organizer can confirm competition results, override result submissions according to competition rules, declare walkovers, rule on abandoned fixtures, review first-level competition disputes, and escalate serious disputes to Kalaanba admin.

### 7.4 Referee

A referee has high trust authority. A referee can confirm final score, match completion, cards, misconduct, no-show, forfeit, walkover, abandonment, and referee report. For referee-officiated matches, referee confirmation carries the strongest weight.

### 7.5 Community Officiator

A community officiator is not a formal platform referee. This could be someone both teams accept to oversee the match. They can confirm that the match happened, final score, no-show, and basic incidents. Their trust weight is lower than a verified referee but higher than a random fan witness.

### 7.6 Kalaanba Admin

Kalaanba Admin can review disputed results, suspicious records, no-show claims, related-club suspicion, evidence, and referee/organizer conflicts. Admin can confirm, amend, void, return to pending, request more evidence, or escalate to Super Admin.

### 7.7 Super Admin

<!-- Page 5 -->

The Super Admin has full visibility and override power. Super Admin can see Trust Engine outputs, Decision Trace, triggered rules, background checks, caution levels, and override engine verdicts. Every override must be audit-logged.

## 8. Confirmation Models by Match Type

| Match type | Confirmation model |
| --- | --- |
| Casual friendly | No platform verification. Saved as casual record only. |
| Verified / official friendly | Club A rep/captain + Club B rep/captain confirm same result. |
| Competition fixture | Club reps may submit/confirm; organizer can verify, correct, or override<br>according to competition rules. |
| Ranked challenge | 2-of-3: challenger rep/captain, respondent rep/captain, referee or accepted<br>officiator. |
| Referee-officiated match | Referee confirmation carries strongest weight. If no club disputes within the<br>window, verify. |
| Internal match | No platform verification. Club admin/captain saves internally. |

Example for challenge: challenger says 2-1, respondent says 1-1, referee says 2-1. Result can be verified as 2-1 because two trusted confirmations match.

## 9. Match Verification Statuses

| Status | Meaning |
| --- | --- |
| draft | Match exists but is incomplete. |
| scheduled | Match is planned but not played. |
| live | Match is currently being played. |
| result_submitted | One side has entered result. |
| awaiting_confirmation | Waiting for required confirmation. |
| confirmed | Required confirmation has passed. |
| disputed | Reports conflict or someone has contested the record. |
| under_review | Organizer/admin/Super Admin review is ongoing. |
| void | Match will not count officially. |
| archived | Match record is closed and preserved. |

### User-facing wording

| Internal status | User-facing wording |
| --- | --- |
| awaiting_confirmation | Awaiting confirmation |
| confirmed | Verified |
| disputed | Disputed |
| under_review | Under review |
| void | Void |

<!-- Page 6 -->

| Internal status | User-facing wording |
| --- | --- |
| archived | Archived |

Users should not see heavy trust-engine language.

## 10. Evidence Rules

Evidence should support trust, not create unnecessary paperwork.

### When evidence is not required

Normal verified friendlies should not require evidence if both clubs confirm the same result.

### When evidence is optional

Evidence may be optional for regular friendlies, normal competition fixtures, normal matches with no dispute, and normal referee-confirmed matches.

### When evidence is required or requested

- disputes

- walkovers

- no-shows

- abandoned matches

- suspicious matches

- high-RP challenges

- competition finals

- repeated club pairings

- related-club suspicion

- late-season suspicious results

### Accepted evidence types

- match photos

- short video clips

- GPS check-in

- referee/officiator note

- lineup photo

- WhatsApp/chat screenshots

- organizer report

- matchday team photo

- venue photo

- score sheet, if available

### Evidence privacy

Evidence should be private by default. Evidence is admin-only unless intentionally published.

<!-- Page 7 -->

| Evidence type | Default visibility |
| --- | --- |
| Match photo | Admin-only unless published |
| Video clip | Admin-only unless published |
| WhatsApp screenshot | Admin-only |
| GPS check-in | Admin-only |
| Referee report | Admin/organizer; summary may be public |
| Organizer report | Admin-only or competition admin |
| Public media upload | Public only if intentionally shared |

## 11. Evidence Statuses

| Status | Meaning |
| --- | --- |
| not_required | No evidence needed. |
| optional | Evidence can be uploaded but is not required. |
| requested | Evidence has been requested. |
| submitted | Evidence has been uploaded. |
| reviewed | Evidence has been checked. |
| insufficient | Evidence does not prove enough. |
| accepted | Evidence supports the decision. |
| rejected | Evidence is invalid, irrelevant, or suspicious. |

Example: a no-show is claimed. Admin requests GPS/photo evidence. Club uploads venue photo and check-in. Admin reviews and accepts it. Evidence status becomes accepted.

## 12. Referee Report

The referee report must be light in V1. It should not feel like a full legal document.

### V1 referee report fields

- match status

- final score

- match completed? yes/no

- no-show? yes/no

- walkover? yes/no

- abandoned? yes/no

- cards, if entered

- key incident note, optional

- misconduct note, optional

- short comment

- optional photo/video upload

<!-- Page 8 -->

Example: Match completed. Final score: Taha Stars 2-1 Aboabo City. One red card to Aboabo City in second half. No major dispute.

## 13. Scorecard

A scorecard is the digital match summary. It does not have to be a physical paper.

### Scorecard fields

- clubs/teams

- date

- time

- venue

- match type

- final score

- scorers

- cards

- lineups, if entered

- referee/officiator

- confirmation status

- evidence status

- dispute status

- clearance outputs

Example: Taha Stars vs Aboabo City. Final score: 2-1. Status: Verified. RP clearance: Approved. Stats clearance: Approved.

## 14. Dispute Flow

A dispute happens when someone contests the result, stats, no-show, walkover, card, player involvement, or match validity.

| Context | Review path |
| --- | --- |
| Friendly match | First review by both club reps/captains. If they cannot agree, Kalaanba admin may<br>review, keep unverified, confirm with evidence, or void. |
| Competition fixture | First review by competition organizer. Escalation to Kalaanba admin, then Super<br>Admin for serious cases. |
| Ranked challenge | First review through 2-of-3 model. If unresolved, referee/admin arbitration. RP<br>remains locked until decision. |
| Internal match | Club admin resolves internally unless there is abuse, harassment, impersonation,<br>or safety concern. |

## 15. Dispute Statuses

| Status | Meaning |
| --- | --- |
| no_dispute | No dispute exists. |

<!-- Page 9 -->

| Status | Meaning |
| --- | --- |
| dispute_raised | One party has challenged the record. |
| awaiting_response | Other side must respond. |
| evidence_requested | Reviewer needs proof. |
| organizer_review | Competition organizer is reviewing. |
| admin_review | Kalaanba admin is reviewing. |
| super_admin_review | Super Admin is reviewing. |
| resolved_confirmed | Original result stands. |
| resolved_amended | Result/stat was corrected. |
| resolved_void | Match is voided from official records. |
| closed_no_action | Dispute lacked enough basis. |

## 16. No-show, Forfeit, and Walkover Rules

A no-show should not be accepted just because one club claims it.

| Context | Rule |
| --- | --- |
| Friendly | Both clubs agree, or admin resolves. |
| Competition | Organizer declares based on competition rules. |
| Challenge | Referee/officiator confirms, or 2-of-3 confirms. |

### System support checks

- Did Club A check in?

- Did Club B check in?

- Did referee/officiator check in?

- Was kickoff started?

- Was GPS near venue?

- Was evidence uploaded?

- Did absent club respond?

- Was there a postponement request?

- Was the match cancelled before kickoff?

Example: Club A checks in. Referee checks in. Club B does not check in and does not respond. Referee marks Club B absent. Walkover can be confirmed.

## 17. No-show / Walkover Statuses

| Status | Meaning |
| --- | --- |
| none | No no-show/walkover claim. |
| claimed | One side claims the other failed to show. |

<!-- Page 10 -->

| Status | Meaning |
| --- | --- |
| awaiting_response | Other side must respond. |
| evidence_requested | Evidence needed. |
| confirmed | No-show/walkover accepted. |
| rejected | Claim rejected. |
| under_review | Admin/organizer reviewing. |
| void | Match voided instead of awarded. |

## 18. Trust Confidence Levels

Trust confidence levels are mainly internal. They help the Super Admin and admin team understand record strength.

| Level | Meaning |
| --- | --- |
| unverified | Submitted but not trusted yet. |
| basic_confirmed | Required parties agreed. |
| organizer_confirmed | Competition organizer confirmed. |
| referee_confirmed | Referee confirmed. |
| strongly_verified | Multiple high-trust confirmations exist. |
| disputed | Conflicting reports exist. |
| void | Record should not count officially. |

Example: a friendly confirmed by both clubs = basic_confirmed. A competition result confirmed by organizer = organizer_confirmed. A challenge confirmed by both clubs and referee = strongly_verified.

## 19. Caution Levels

The Trust Engine should not only say confirmed or unconfirmed. It should warn the platform.

| Level | Meaning |
| --- | --- |
| low | Normal. No issue. |
| medium | Watch, but do not block. |
| high | Review before official updates. |
| critical | Block official update until admin/Super Admin decision. |

Example: two clubs have played four RP-generating matches in ten days. The score may be confirmed, but the caution level becomes high. Recommended action: review before RP update.

## 20. Decision Trace

The Trust Engine should expose a structured Decision Trace to Super Admin. This is not hidden AI reasoning. It is a readable audit trail of what the engine checked and why it gave its verdict.

### Decision Trace should include

<!-- Page 11 -->

- record type

- match type

- submitted result

- actor confirmations

- rules checked

- triggered rules

- evidence status

- dispute status

- caution level

- engine verdict

- recommended action

- affected systems

- background checks

- override history

- final verdict

### Example Decision Trace

{ recordType: "match_result", matchType: "ranked_challenge", submittedResult: "Aboabo United 2-1 Taha Stars", confirmations: { challengerRep: "2-1", respondentRep: "2-1", referee: null }, rulesChecked: [ "challenge_2_of_3_verification", "rp_clearance_required", "no_active_dispute", "related_club_check" ], triggeredRules: ["two_matching_confirmations"], cautionLevel: "low", engineVerdict: "confirm", recommendedAction: "Allow challenge settlement", affectedSystems: ["RP", "Challenge", "PlayerStats", "SeasonArchive"], finalVerdict: "confirmed" }

## 21. Engine Verdict vs Final Verdict

The engine recommendation and the official final decision should be separate. This is important because reality can be different from what data suggests.

| Field | Meaning |
| --- | --- |
| engineVerdict | What the Trust Engine recommends. |
| finalVerdict | What the platform officially applies. |
| finalDecisionBy | System, organizer, admin, or Super Admin. |
| overrideReason | Required if final verdict differs from engine verdict. |

{ engineVerdict: "suspicious_hold",

<!-- Page 12 -->

finalVerdict: "confirmed", finalDecisionBy: "super_admin", overrideReason: "Known tournament structure. Clubs share venue admin but are separate teams." }

## 22. Trust Clearance Outputs

Other engines should not need to understand the whole trust story. They should read clear outputs.

### Confirmed example

{ verificationStatus: "confirmed", trustLevel: "basic_confirmed", cautionLevel: "low", disputeStatus: "no_dispute", evidenceStatus: "not_required", rpClearance: true, statsClearance: true, standingsClearance: true, challengeSettlementClearance: true, archiveClearance: true, reviewFlag: false, reviewReason: null }

### Disputed example

{ verificationStatus: "disputed", trustLevel: "disputed", cautionLevel: "high", disputeStatus: "dispute_raised", evidenceStatus: "requested", rpClearance: false, statsClearance: false, standingsClearance: false, challengeSettlementClearance: false, archiveClearance: false, reviewFlag: true, reviewReason: "Conflicting result submissions" } RP Engine checks rpClearance. Player Engine checks statsClearance. Competition Engine checks standingsClearance. Challenge Engine checks challengeSettlementClearance.

## 23. Super Admin Visibility

Super Admin must see the Trust Engine clearly.

### Super Admin should see

- engine verdict

- final verdict

- decision trace

- clearance outputs

- caution level

- triggered rules

- background activity

- suspicious flags

- actor confirmations

<!-- Page 13 -->

- evidence summary

- dispute status

- review history

- affected systems

- recommended action

- override option

- full audit trail

Super Admin should be able to inspect the engine decision, not just see a final label. Example admin view: Engine verdict: Hold for review. Caution level: High. Reason: Same two clubs have generated RP matches 5 times in 14 days. Affected systems: RP, Leaderboard, Season Archive. Recommendation: Request evidence and hold RP update. Super Admin action: Confirm / Amend / Void / Request Evidence / Override.

## 24. Super Admin Override

Super Admin can override engine decisions. But overrides must never silently erase history.

### Override must capture

- previous status

- new status

- engine verdict

- final verdict

- override reason

- affected records

- admin identity

- timestamp

- optional evidence/note

{ engineVerdict: "hold_for_review", previousStatus: "under_review", finalVerdict: "confirmed", overriddenBy: "super_admin_id", overrideReason: "Organizer submitted verified tournament report and both clubs later confirmed.", affectedSystems: ["RP", "Stats", "Standings"], overriddenAt: "timestamp" }

## 25. Background Integrity Checks

The Trust Engine should have a mind of its own. It should not only respond to disputes. It should also observe suspicious patterns. These checks should usually run in the background so they do not slow the user experience.

### Background checks can watch for

- same clubs playing too often

- related clubs trying to earn RP

- one club repeatedly losing to another

<!-- Page 14 -->

- strange scorelines

- late-season suspicious results

- same admin/device patterns

- same referee patterns

- fake clubs created to lose

- repeated no-shows

- repeated disputes from one club

- abnormal RP movement

- challenge manipulation

- repeated walkovers

- competition organizer conflict patterns

### Output

- Watch this fixture

- Review before RP update

- Request evidence

- Hold challenge settlement

- Flag club reliability

- Escalate to Super Admin

- Allow but monitor

Important rule: suspicious flags should create review items. They should not automatically punish.

## 26. Fixtures and Teams to Watch

The Trust Engine should actively warn admins about fixtures, clubs, and patterns to watch.

{<br>watchType: "fixture",<br>cautionLevel: "medium",<br>reason: "Both clubs have played each other 3 times within 10 days.",<br>recommendedAction: "Allow match but review RP eligibility after result."<br>}

## 27. Review Queues

The Trust Engine should feed admin review queues.

### Review queue types

<!-- Page 15 -->

- disputed match queue

- no-show/walkover review

- abandoned match review

- suspicious RP movement

- related club review

- duplicate player/club identity

- referee report conflict

- stat correction request

- competition escalation

- evidence review

- manual override request

- Super Admin review

### Each queue item should show

- record affected

- clubs involved

- match type

- issue summary

- caution level

- current status

- evidence

- decision trace

- recommended action

- deadline, if any

- audit trail

- affected systems

## 28. Review Priority

Not all review items should have equal urgency.

### Priority should consider

- RP involved

- challenge stake involved

- competition importance

- dispute severity

- season deadline

- number of affected players

- number of affected clubs

- standings impact

<!-- Page 16 -->

- awards impact

- repeated pattern

- public visibility

Example: a disputed casual friendly with no RP = low priority. A disputed ranked challenge with 120 RP locked = high priority. A league final result dispute = critical priority.

## 29. Timeouts and Silence

The engine needs rules for silence. Example: Club A submits result. Club B does not confirm or dispute. The system should notify Club B, send a reminder, wait for a configurable confirmation window, and apply rules based on match type.

| Situation | Possible outcome |
| --- | --- |
| Friendly, no response | Remain unverified or admin review |
| Competition, no response | Organizer may confirm |
| Challenge, no response | Use 2-of-3 or escalate |
| Referee-confirmed, no response | Confirm if no dispute after window |
| Suspicious match | Hold for review |

Timeout windows should be configurable.

## 30. Audit Trail

Every meaningful trust decision must be audit-logged.

### Audit log should capture

- actor

- role

- action

- old value

- new value

- reason

- timestamp

- affected systems

- evidence IDs

- decision trace ID

- override record, if any

Examples: Club captain confirmed result. Organizer overrode score. Referee declared walkover. Admin requested evidence. Super Admin overrode Trust Engine hold. System flagged repeated RP match.

## 31. User-Facing Language

Normal users should not see technical trust logic.

<!-- Page 17 -->

| Instead of | Show |
| --- | --- |
| Verification clearance failed due to conflicting actors. | Result under review. |
| Trust Engine flagged abnormal RP behavior. | This fixture has unusual activity. Review recommended.<br>(admin only) |
| Stats clearance pending. | Stats will update after confirmation. |

## 32. Performance and Bottleneck Prevention

The Trust Engine must not slow down the app. It should be built as an event-driven clearance layer.

### 32.1 Immediate checks

Fast checks happen when a result is submitted. Examples: do both scores match, has the required actor confirmed, is there an active dispute, is this match type automatically official, is confirmation complete.

### 32.2 Stored outputs

The engine stores trust decisions. Other engines read stored outputs instead of recalculating every time.

- verificationStatus

- trustLevel

- cautionLevel

- rpClearance

- statsClearance

- standingsClearance

- reviewFlag

### 32.3 Background jobs

Heavy checks should run in workers/background jobs. Examples: farming detection, related-club signals, one-way RP feeding, abnormal referee patterns, repeated dispute patterns, late-season manipulation. Locked architecture principle: do not recalculate trust on every page load. Process inputs. Store outputs. Let other engines read the output.

## 33. SLM / AI Position

An SLM can be useful later, but it should not be core to MVP.

### Not recommended for MVP core decisions

- Do not let AI alone decide match winner.

- Do not let AI alone decide RP transfer.

- Do not let AI alone decide challenge settlement.

- Do not let AI alone decide standings update.

- Do not let AI alone decide player stat confirmation.

- Do not let AI alone decide suspensions.

- Do not let AI alone decide fraud verdicts.

### Useful later as Admin Assistant

<!-- Page 18 -->

- summarizing dispute evidence

- reading referee reports

- comparing written claims

- generating admin case summaries

- classifying review priority

- explaining why a fixture was flagged

- helping Super Admin review faster

Example: Club A says the match ended 3-2. Club B says 2-2. Referee note says one late goal was disallowed. AI summary: Main dispute is whether the 78th-minute goal counted. Request referee confirmation or video.

### MVP recommendation

- rule-based Trust Engine

- admin review queues

- decision trace

- Super Admin override

- background suspicious flags

AI can come later as a helper, not the judge.

## 34. Engine Outputs

The Trust Engine should expose flexible outputs.

- getMatchTrustStatus(matchId)

- getResultClearance(matchId)

- getDecisionTrace(recordId)

- getReviewQueue(filters)

- getEvidenceStatus(recordId)

- getDisputeStatus(recordId)

- getNoShowReview(matchId)

- getSuspiciousFixtureFlags(filters)

- getClubTrustFlags(clubId)

- getChallengeSettlementClearance(challengeId)

- getStatsClearance(matchId)

- getStandingsClearance(matchId)

- getAdminOverrideHistory(recordId)

## 35. Engine Integrations

| Engine | Relationship |
| --- | --- |
| Match / Fixture Engine | Provides match record, result, status, actors, venue, events. |
| RP Economy Engine | Reads RP clearance before awarding, locking, transferring, or penalizing RP. |

<!-- Page 19 -->

| Engine | Relationship |
| --- | --- |
| Challenge Engine | Reads challenge settlement clearance before resolving stakes. |
| Competition / Rules Engine | Reads standings clearance and provides organizer authority rules. |
| Player / Affiliation Engine | Reads stats clearance before public player stats update. |
| Season Engine | Reads archive clearance and controls seasonal timing. |
| Zone Engine | Reads trusted match outputs for inter-zone records. |
| Club Engine | Provides club reps, captains, related-club signals, club status. |
| Referee Engine | Provides referee identity, assignment, report, trust weight. |
| Admin Governance Engine | Provides config, override authority, audit rules, review permissions. |
| Notification Engine | Sends confirmation requests, disputes, review updates, verdicts. |
| Awards Engine | Consumes only trusted records. |

## 36. Configurable Defaults

All values should be configurable later through Admin Configuration.

### Configurable items

- confirmation timeout window

- dispute response window

- evidence request window

- match types requiring evidence

- challenge verification rule

- no-show response window

- caution thresholds

- repeat-pairing threshold

- high-RP review threshold

- Super Admin override permissions

- referee confirmation weight

- community officiator weight

- review priority weights

- background check frequency

- evidence visibility defaults

## 37. V1 Scope

V1 should include:

- verified vs casual friendly distinction

- club rep/captain confirmation

- no separate scorer role

<!-- Page 20 -->

- organizer confirmation for competitions

- 2-of-3 confirmation for challenges

- referee confirmation

- community officiator confirmation

- dispute statuses

- evidence upload for disputes/high-risk cases

- no-show/walkover review

- trust confidence levels

- caution levels

- decision trace

- Super Admin visibility

- Super Admin override

- admin review queues

- audit log

- stored trust clearance outputs

- basic background suspicious flags

## 38. Deferred / Later

Defer:

- complex public trust scores

- automated punishments

- fan witness verification

- deep AI fraud detection

- self-hosted SLM

- advanced device fingerprinting

- automated referee trust scoring

- advanced fraud prediction

- complex identity graph analysis

- public club reliability ratings

- player-level fraud scoring

## 39. Product Guardrails

- Do not make every match feel formal.

- Do not require evidence for normal confirmed matches.

- Do not let one club confirm a serious result alone.

- Do not let AI make official decisions alone.

- Do not let suspicious flags automatically punish clubs.

- Do not hide Trust Engine outputs from Super Admin.

<!-- Page 21 -->

- Do not let overrides erase history.

- Do not recalculate trust on every page load.

- Do not block the whole app because background checks are running.

- Do not expose complex trust language to normal users.

## 40. Locked Summary

The Kalaanba Trust & Verification Engine is the platform decision and clearance layer. It decides whether a match, result, stat, no-show, walkover, dispute, challenge outcome, or suspicious pattern is trusted enough to affect official systems. Not every match needs verification. Casual friendlies and internal matches can exist without public official effect. Verified friendlies, competitions, challenges, referee-officiated matches, and accepted community-officiated matches require confirmation before they can affect public stats, RP, standings, challenge settlement, awards, or archives. For V1, club reps/captains perform score entry, confirmation, basic event entry, and dispute raising. No separate scorer role is needed yet. Competition organizers have stronger authority inside competitions. Referees carry high trust weight. Community officiators can support grassroots verification when accepted by both sides. Ranked challenges use 2-of-3 verification. The engine writes stored outputs such as verification status, trust level, caution level, RP clearance, stats clearance, standings clearance, challenge settlement clearance, archive clearance, and review flags. Other engines read these outputs instead of recalculating trust repeatedly. The Super Admin must see the engine full Decision Trace, background activity, triggered rules, caution level, verdict, evidence summary, and affected systems. The Super Admin can override the engine, but every override must require a reason and preserve the audit trail. The engine should proactively flag fixtures, clubs, challenges, and RP movements to watch for suspicious activity. These flags create review items, not automatic punishments. For MVP, the engine should be rule-based, event-driven, auditable, configurable, and overrideable. AI/SLM should not be a core dependency for MVP, but can later assist admins by summarizing evidence and review cases. Final principle: The engine recommends. The platform records. The Super Admin can correct. The audit trail remembers.
