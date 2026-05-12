<!-- Converted from Referee_Officiator_Engine_System_Document.pdf -->

### Kalaanba

# Referee & Officiator Engine System Document

Locked product direction for referees, community officiators, split officiating, reports, authority, calendars, and Trust Engine integration..

|  | Field |  |  | Locked value |  |
| --- | --- | --- | --- | --- | --- |
| Status |  |  | Locked direction / pre-architecture planning |  |  |
| Primary owner |  |  | Referee & Officiator Engine |  |  |
| Core principle |  |  | Referees and officiators help Kalaanba trust match outcomes without<br>making grassroots football feel too formal. |  |  |
| V1 stance |  |  | Simple referee/officiator assignment, community officiator support,<br>split community officiating, light reports, calendar visibility, and result<br>confirmation support. |  |  |
| Marketplace / payment stance |  |  | Deferred |  |  |
| Zone restriction |  |  | No zone restriction in V1. Referees should be available across the<br>whole City Hub. |  |  |
| Trust relationship |  |  | Referees and officiators feed the Trust & Verification Engine, but<br>Trust decides final clearance. |  |  |
| Updated |  |  | May 10, 2026 |  |  |

|  | Final principle |  |
| --- | --- | --- |
|  | Referees strengthen trust, community officiators reflect grassroots reality, and the Trust Engine decides what is safe to count. |  |

<!-- Page 2 -->

## Table of Contents

## 1. Purpose

## 2. Why This Engine Matters

## 3. Core Definitions

## 4. What This Engine Owns

## 5. Referee / Officiator Types

## 6. Match Official Arrangement Options

## 7. Split Community Officiating

## 8. Referee Identity States

## 9. V1 Referee / Officiator Onboarding

## 10. Referee Zone Rule

## 11. Referee Profile

## 12. Referee Availability

## 13. Referee Calendar

## 14. Referee Assignment by Match Type

## 15. Assignment Lifecycle

## 16. Who Can Assign a Referee or Officiator?

## 17. Referee / Officiator Acceptance

## 18. Conflict of Interest

## 19. Referee Authority

## 20. Trust Weight

## 21. Referee / Officiator Report

## 22. Split Officiator Period Report

## 23. Report Types

## 24. No-show and Walkover

## 25. Abandoned Match

## 26. Misconduct and Safety

## 27. Referee / Officiator in Disputes

## 28. Community Officiator Rules

## 29. Split Community Officiator Rules

## 30. Referee Reliability

## 31. Referee Pattern Risk

## 32. Notifications

## 33. Referee Assignment UX

## 34. Referee Report UX

## 35. Audit Trail

## 36. Report Correction

## 37. Referee Suspension / Restriction

## 38. Payments and Marketplace

## 39. Engine Outputs

## 40. Integrations

## 41. Configurable Defaults

## 42. V1 Scope

## 43. Deferred / Later

## 44. Product Guardrails

## 45. Locked Summary

<!-- Page 3 -->

## 1. Purpose

The Referee & Officiator Engine defines who can oversee a match, how they are assigned, what authority they carry, what reports they submit, and how their input helps Kalaanba trust match outcomes.

|  | In simple terms |  |
| --- | --- | --- |
|  | This engine answers: who oversaw the match, what can they confirm, and how much weight should Kalaanba give their |  |
|  | report? |  |

It supports:

- verified friendlies

- competition fixtures

- ranked challenges

- referee-officiated matches

- community-officiated matches

- split community officiating

- walkovers

- no-shows

- abandoned matches

- disputes

- misconduct reports

- referee calendars

- referee/officiator reliability records

## 2. Why This Engine Matters

Kalaanba needs trusted results, but grassroots football does not always have formal referees.

- Some matches will have a proper referee.

- Some will have an organizer-appointed official.

- Some will have a respected community officiator.

- Some will have one person from each club officiating different halves.

- Some will only rely on both club reps/captains confirming the result.

This engine supports all of those realities without pretending every match is formal football. It allows Kalaanba to say:

- this match had no official

- this match had a single community officiator

- this match had split community officiators

- this match had a verified referee

- this match had an organizer-appointed official

- this report carries low, medium, high, or very high trust weight

- this report supports result verification or dispute review

## 3. Core Definitions

|  | Term |  |  | Meaning |  |
| --- | --- | --- | --- | --- | --- |
| Referee |  |  | A person recognized by Kalaanba, an organizer, or a match<br>agreement to officiate a match. |  |  |
| Verified referee |  |  | A referee whose identity/contact has been checked and who carries<br>stronger trust weight. |  |  |
| Community officiator |  |  | A grassroots match official accepted by the clubs. May be neutral or<br>club-affiliated. |  |  |
| Split community officiators |  |  | Two or more club-agreed officiators who handle different match<br>periods, often one from each club. |  |  |
| Organizer official |  |  | A person assigned by a competition organizer to oversee or confirm |  |  |

<!-- Page 4 -->

|  | a fixture. |
| --- | --- |
| Kalaanba-appointed referee | A referee assigned directly by Kalaanba/admin for higher-trust<br>matches. |
| Assigned match official | Any referee, community officiator, organizer official, or split officiator<br>attached to a specific match. |
| Referee/officiator report | A short match report submitted after the match or after a specific<br>period. |
| Trust weight | The strength given to the official's input inside the Trust Engine. |

## 4. What This Engine Owns

### Owns

- referee/officiator profile

- referee identity state

- community officiator records

- split community officiator setup

- referee availability

- referee calendar

- referee assignment

- assignment acceptance/decline

- match official arrangement

- referee/officiator report

- period-specific officiator report

- no-show/walkover report

- abandoned match report

- misconduct note

- referee/officiator trust input

- conflict of interest flags

- referee pattern-risk signals

- referee/officiator audit trail

### Does not own

|  | Does not own |  |  | Owner |  |
| --- | --- | --- | --- | --- | --- |
| Final trust clearance |  |  | Trust & Verification Engine |  |  |
| RP awards/transfers |  |  | RP Economy Engine |  |  |
| Fixture lifecycle |  |  | Match / Fixture Engine |  |  |
| Competition rules |  |  | Competition & Rules Engine |  |  |
| Player stats |  |  | Player / Affiliation Engine |  |  |
| Payments |  |  | Payments Engine, later |  |  |
| Public referee marketplace |  |  | Later marketplace layer |  |  |
| Suspensions/sanctions |  |  | Admin Governance / Competition Rules, depending on context |  |  |

## 5. Referee / Officiator Types

### 5.1 No Official

The match has no referee or officiator attached. Result confirmation depends on club reps/captains or organizer/admin rules. Allowed for:

- casual friendlies

- some verified friendlies

- internal matches

<!-- Page 5 -->

- low-risk matches

Not ideal for:

- high-RP challenges

- serious competitions

- finals

- disputed clubs

- suspicious match patterns

### 5.2 Single Community Officiator

A single person accepted by both sides to oversee the match. This person may be:

- a respected senior player

- a coach

- a captain

- a trusted supporter

- a neutral person from the community

- a team member from either side, if both clubs agree

They can confirm match occurrence, final score, no-show, basic incidents, abandonment, and rough match flow. Trust weight: medium, unless the person has stronger platform trust history.

### 5.3 Split Community Officiators

This is the grassroots pattern where both clubs agree to share officiating duties.

|  | Period |  |  | Officiator |  |
| --- | --- | --- | --- | --- | --- |
| First half |  |  | Person from Club A |  |  |
| Second half |  |  | Person from Club B |  |  |

The officiators may be team members, captains, coaches, senior players, trusted club-side representatives, or supporters accepted by both clubs. They do not have to be neutral.

|  | Key requirement |  |
| --- | --- | --- |
|  | Both clubs must agree to the split officiating arrangement before the match starts. |  |

Trust weight: medium, but with a clear note that the officials are club-affiliated.

### 5.4 Verified Referee

A verified referee is a person Kalaanba has checked enough to trust more strongly. Verification can come through:

- phone verification

- admin approval

- known local reference

- previous clean match history

- organizer recommendation

- referee association later

- documents later

Trust weight: high.

### 5.5 Competition-Appointed Official

A person assigned by a competition organizer. They may not be a platform-wide verified referee, but inside that competition they carry authority because the organizer gave them that role.

<!-- Page 6 -->

Example: A school tournament assigns a games master as the match official. Trust weight: medium to high inside that competition.

### 5.6 Kalaanba-Appointed Referee

A referee assigned directly by Kalaanba or a hub/admin team. This carries the strongest platform authority outside admin or Super Admin rulings. Trust weight: very high.

## 6. Match Official Arrangement Options

When creating or scheduling a match, the official section should say: Match official arrangement.

## 1. No official

## 2. Single community officiator

## 3. Split community officiators

## 4. Verified referee

## 5. Organizer-appointed official

## 6. Kalaanba-appointed referee

This keeps the UI simple and flexible.

## 7. Split Community Officiating

### 7.1 Definition

Split community officiating means the clubs agree that officiating duties will be shared by club-provided or club-approved persons across different match periods.

|  | Match format |  |  | Officiator setup |  |
| --- | --- | --- | --- | --- | --- |
| 2 halves |  |  | One officiator per half |  |  |
| 3 periods |  |  | One officiator per period |  |  |
| 4 quarters |  |  | One officiator per quarter or two officials rotating |  |  |
| One-period match |  |  | Split officiating not needed unless duties are shared by time block |  |  |

### 7.2 Required setup fields

- officiating type: split_community_officiators

- first period officiator

- second period officiator

- club affiliation of each officiator

- whether both clubs accepted the arrangement

- period each officiator controls

- optional phone number

- optional note

{ "officiatingType": "split_community_officiators", "neutrality": "club_affiliated", "firstHalfOfficial": { "name": "Abdul Rahman", "clubAffiliation": "Aboabo United", "acceptedByBothClubs": true }, "secondHalfOfficial": { "name": "Malik Fuseini", "clubAffiliation": "Taha Stars", "acceptedByBothClubs": true }, "trustWeight": "medium"

<!-- Page 7 -->

}

### 7.3 What each split officiator confirms

Each officiator confirms only the period they handled. First-half officiator confirms:

- first-half started

- first-half completed

- first-half score, if tracked

- first-half cards/incidents, if tracked

- any major issue in that half

Second-half officiator confirms:

- second-half started

- second-half completed

- second-half score/events

- full-time completion

- any major issue in that half

### 7.4 Final result confirmation

Split officiators support the final result, but they should not alone replace club confirmation.

|  | Recommended V1 rule |  |
| --- | --- | --- |
|  | Final result still needs club rep/captain confirmation or Trust clearance. |  |

Example: Aboabo United vs Taha Stars. First half officiator from Aboabo. Second half officiator from Taha. Both club captains confirm 2-2. Both officiators report no major dispute. Match can be verified.

### 7.5 Dispute handling

If a dispute happens in the period handled by a club-affiliated officiator, their report is useful but should not automatically settle the dispute alone. Example: Club A says the second half ended 1-0. Club B says the second half ended 0-0. Second-half officiator came from Club B. The report should be considered, but because the official is club-affiliated, the Trust Engine may request opponent response, club captain confirmation, video/photo evidence, organizer review, or admin review.

### 7.6 Where split officiating is allowed

Recommended allowed contexts:

- friendlies

- verified friendlies

- internal competitions

- school/workplace/community competitions

- low-risk tournaments

- low-stake challenges, if configured

Use caution for:

- high-RP ranked challenges

- finals

- official Kalaanba competitions

- disputed competitions

- matches involving suspicious clubs

For high-stakes matches, the UI can say: Split community officiators are allowed, but verified referee or organizer official is recommended. For very high-risk matches, the system can require: Verified referee or organizer official required.

<!-- Page 8 -->

## 8. Referee Identity States

|  | State |  |  | Meaning |  |
| --- | --- | --- | --- | --- | --- |
| unregistered_officiator |  |  | Named for a match but does not have a referee/officiator profile yet. |  |  |
| community_officiator |  |  | Accepted by both clubs for a match or informal context. |  |  |
| split_community_officiator |  |  | Club-affiliated or club-approved officiator assigned to a period. |  |  |
| referee_profile_created |  |  | Referee has a basic Kalaanba profile. |  |  |
| phone_verified |  |  | Referee phone/contact has been verified. |  |  |
| admin_verified |  |  | Admin has approved the referee identity. |  |  |
| trusted_referee |  |  | Referee has enough clean history to carry stronger authority. |  |  |
| organizer_official |  |  | Official assigned within a competition context. |  |  |
| kalaanba_appointed |  |  | Referee assigned by Kalaanba/admin. |  |  |
| suspended |  |  | Referee/officiator is blocked from assignments. |  |  |
| archived |  |  | Referee/officiator record is inactive but preserved. |  |  |

## 9. V1 Referee / Officiator Onboarding

### Required fields for referee profile

- full name

- phone number

- City Hub

- basic area/location

- referee/officiator type

- verification state

### Optional fields

- photo

- preferred match types

- preferred days

- preferred time windows

- years of experience

- referee association

- admin note

- document/photo proof later

### For one-time community officiator

Do not force full onboarding. Capture name, phone number where possible, club affiliation if any, match attached to, period handled if split officiating, and whether both clubs accepted the arrangement.

## 10. Referee Zone Rule

Referees should not be restricted to Zones or Belts in V1. They should be available across the whole City Hub. Reason: grassroots referees may be few. If Kalaanba restricts them too early, fixtures may become harder to schedule. Later, referees may set:

- preferred areas

- travel radius

- unavailable zones

- preferred venues

- transport requirement

- fee expectation, if marketplace/payment comes later

<!-- Page 9 -->

## 11. Referee Profile

### V1 profile fields

- name

- phone

- photo

- City Hub

- verification state

- assigned matches

- completed matches

- report history

- dispute involvement count

- availability status

- admin notes

- suspension status

### Later profile fields

- license/certification

- referee grade

- match fee range

- travel radius

- language preference

- disciplinary history

- public referee badge

- organizer reviews, internal first

- marketplace status

## 12. Referee Availability

|  | Status |  |  | Meaning |  |
| --- | --- | --- | --- | --- | --- |
| available |  |  | Can take assignments. |  |  |
| limited |  |  | May be available with notice. |  |  |
| unavailable |  |  | Cannot take assignments. |  |  |
| unknown |  |  | No recent availability signal. |  |  |

Simple availability fields: available days, available time windows, unavailable dates, preferred City Hub, and optional preferred areas later.

## 13. Referee Calendar

A referee calendar should show:

- pending assignment requests

- accepted assignments

- declined assignments

- completed matches

- cancelled matches

- abandoned matches

- report pending tasks

- dispute follow-up tasks

|  | Basic V1 conflict check |  |
| --- | --- | --- |
|  | A referee should not be assigned to two matches at the same time. |  |

<!-- Page 10 -->

Future conflict checks:

- travel time between venues

- maximum matches per day

- back-to-back match warning

- preferred rest period

- venue distance warning

## 14. Referee Assignment by Match Type

|  | Match type |  |  | Assignment direction |  |
| --- | --- | --- | --- | --- | --- |
| Friendly Match |  |  | A club may optionally add no official, a single community officiator,<br>split community officiators, or a verified referee. Friendly matches do<br>not require a referee by default. |  |  |
| Verified Friendly |  |  | Referee/officiator optional, but useful. Confirmation can come from<br>both club reps/captains, referee/officiator plus one club rep<br>depending on Trust configuration, or split officiators plus both club<br>reps/captains. |  |  |
| Competition Fixture |  |  | Organizer can assign a verified referee, organizer official, single<br>community officiator, split community officiators, or manual referee<br>name if not on platform yet. Competition rules decide whether<br>referee confirmation is required. |  |  |
| Ranked Challenge |  |  | Referee or accepted officiator is strongly recommended. V1 ranked<br>challenges use 2-of-3 verification: challenger club rep/captain,<br>respondent club rep/captain, and referee or accepted officiator. |  |  |
| Internal Match |  |  | No referee required. Club may add one for internal record only. |  |  |

For split community officiators in a ranked challenge, the third actor is not one person. Instead, the officiator reports become supporting evidence. Low-risk challenges may allow split community officiators. High-RP challenges should require verified referee or organizer/Kalaanba-appointed official. Disputed challenges with split officiators should go to Trust/admin review.

## 15. Assignment Lifecycle

Proposed -> Invited -> Accepted | Declined -> Assigned -> Matchday -> Report Pending -> Report Submitted -> Closed

|  | State |  |  | Meaning |  |
| --- | --- | --- | --- | --- | --- |
| proposed |  |  | Referee/officiator suggested but not invited. |  |  |
| invited |  |  | Assignment request sent. |  |  |
| accepted |  |  | Referee/officiator accepted assignment. |  |  |
| declined |  |  | Referee/officiator rejected assignment. |  |  |
| assigned |  |  | Referee/officiator officially attached to match. |  |  |
| matchday |  |  | Match day has arrived. |  |  |
| report_pending |  |  | Match ended; report is needed. |  |  |
| period_report_pending |  |  | Split officiator must report on assigned period. |  |  |
| report_submitted |  |  | Referee/officiator submitted report. |  |  |
| closed |  |  | Assignment complete. |  |  |
| cancelled |  |  | Assignment cancelled. |  |  |
| no_show_referee |  |  | Referee/officiator did not show. |  |  |

## 16. Who Can Assign a Referee or Officiator?

|  | Context |  |  | Who can assign |  |
| --- | --- | --- | --- | --- | --- |
| Friendly |  |  | Club admin/owner, with opponent visibility/acceptance where needed |  |  |
| Verified friendly |  |  | Club admin/owner, both clubs should see/accept assigned official |  |  |

<!-- Page 11 -->

| Split community friendly | Both clubs must accept arrangement |
| --- | --- |
| Competition | Organizer or competition admin |
| Challenge | Both clubs agree through challenge scheduling terms |
| Kalaanba official match | Kalaanba admin/Super Admin |
| Internal match | Club admin |

## 17. Referee / Officiator Acceptance

A referee or officiator should be able to:

- accept assignment

- decline assignment

- request clarification

- mark unavailable

- report conflict

- cancel with reason, if allowed

Reasons for decline: unavailable, too far, schedule conflict, safety concern, personal conflict with club, already assigned, or other. For split community officiating, acceptance should be captured from both clubs.

## 18. Conflict of Interest

Referees and officiators should be able to declare a conflict. Possible conflict signals:

- member of one club

- coach/player/supporter of one side

- related to club admin/player

- regularly officiates for one club

- works for organizer

- has active dispute with club

- assigned too often to same club

- same phone/admin/device pattern later

|  | Important distinction |  |
| --- | --- | --- |
|  | Club affiliation is allowed for community/split officiating, but it must be recorded. |  |

A conflict does not always block the assignment. For high-stakes matches, conflict may require admin review or a verified referee.

## 19. Referee Authority

### 19.1 What a referee/officiator can confirm

- match happened

- kickoff occurred

- match completed

- final score

- period score, if split officiating

- cards

- misconduct

- no-show

- forfeit

- walkover

<!-- Page 12 -->

- abandonment

- key incidents

- match status

### 19.2 What they should not decide alone

- RP eligibility

- Season RP award

- challenge stake transfer

- final admin punishment

- player suspension beyond competition rules

- related-club status

- season archive correction

They provide trusted input. The Trust Engine, Competition Engine, RP Engine, and Admin Governance Engine apply final system rules.

## 20. Trust Weight

|  | Actor / arrangement |  |  | Trust weight |  |
| --- | --- | --- | --- | --- | --- |
| No official |  |  | None |  |  |
| Single neutral community officiator |  |  | Medium |  |  |
| Single club-affiliated community officiator |  |  | Medium-low to medium |  |  |
| Split community officiators |  |  | Medium, with club-affiliation note |  |  |
| Organizer official |  |  | Medium to high inside that competition |  |  |
| Phone-verified referee |  |  | High |  |  |
| Admin-verified referee |  |  | High |  |  |
| Trusted referee |  |  | Very high |  |  |
| Kalaanba-appointed referee |  |  | Very high |  |  |
| Suspended referee/officiator |  |  | No active authority |  |  |

Trust weight feeds the Trust Engine. It does not automatically override all evidence. Example: A verified referee confirms 2-1, but both clubs dispute and upload strong contrary evidence. The result should move to review, not blindly accept the referee.

## 21. Referee / Officiator Report

The report must be light. Do not create a long form that discourages use.

### V1 report fields

- match completed: yes/no

- final score

- period handled, if split officiating

- period score/events, if needed

- no-show: yes/no

- walkover: yes/no

- abandoned: yes/no

- cards, if entered

- key incident note, optional

- misconduct note, optional

- injury/safety note, optional

- short comment

- evidence upload, optional

Example: Match completed. Final score: Taha Stars 2-1 Aboabo City. One red card to Aboabo City. No major dispute.

<!-- Page 13 -->

## 22. Split Officiator Period Report

For split community officiating, each officiator submits a period report.

### Period report fields

- assigned period

- did the period start?

- did the period finish?

- score during period, optional

- major incidents

- cards, if any

- dispute note

- short comment

- evidence upload, optional

Example first-half report: I handled the first half. It ended 1-1. No red cards. One yellow card to Taha Stars. Example second-half report: I handled the second half. Aboabo scored once. Match ended 2-1. Taha disputed the last goal. If the period reports conflict with club confirmations, the Trust Engine should flag the match for review.

## 23. Report Types

|  | Report type |  |  | Use |  |
| --- | --- | --- | --- | --- | --- |
| Normal match report |  |  | Confirms completed match and score. |  |  |
| Period report |  |  | Confirms one period under split officiating. |  |  |
| No-show report |  |  | Confirms one side failed to appear. |  |  |
| Walkover report |  |  | Confirms match awarded without normal play. |  |  |
| Abandonment report |  |  | Explains why match started but could not finish. |  |  |
| Misconduct report |  |  | Captures serious behavior or safety issue. |  |  |
| Dispute support report |  |  | Clarifies conflict after dispute is raised. |  |  |
| Correction report |  |  | Referee/officiator amends earlier report with explanation. |  |  |

## 24. No-show and Walkover

Referee/officiator can help confirm no-show/walkover.

### No-show report should capture

- club present

- club absent

- scheduled kickoff time

- time waited

- whether absent club gave notice

- evidence, optional

- final recommendation

Example: Club A present. Club B absent after 30 minutes. No postponement request shown. Recommend walkover to Club A. Walkover is not a normal scoreline and should not generate player stats. It should require reason/evidence, a dispute window, and confirmation before downstream effects.

## 25. Abandoned Match

If a match starts but cannot finish, the referee/officiator should submit an abandonment report.

<!-- Page 14 -->

### Abandonment report fields

- minute abandoned

- current score

- reason

- club/player involved, if any

- safety issue, if any

- referee/officiator recommendation

- evidence, optional

Possible reasons: weather, darkness, venue issue, violence/misconduct, injury/emergency, crowd trouble, referee safety, team refusal to continue, other. Possible rulings: replay, result stands, void, walkover, reschedule. The referee/officiator recommends. Organizer/admin decides according to rules.

## 26. Misconduct and Safety

Referees and officiators should be able to report misconduct.

- player fight

- referee abuse

- threat

- crowd trouble

- unsafe venue condition

- team refuses to continue

- fake player issue

- violent conduct

V1 should capture the report and send it to review. Do not overbuild disciplinary automation yet.

## 27. Referee / Officiator in Disputes

A referee/officiator report can help settle a dispute. They can confirm final score, period score, whether a goal counted, whether match ended, no-show, walkover, abandonment, and cards/misconduct. For split community officiators, the report is useful but should be treated with its club affiliation in mind. Example: Second- half officiator from Club B says Club A's goal did not count. Club A disputes. The Trust Engine should not automatically accept the period official's word alone. It should request club responses, organizer/referee input, or evidence.

## 28. Community Officiator Rules

Community officiators are important for grassroots reality. They should be allowed, but clearly separated from verified referees.

### Community officiator requirements

- name

- phone number, where possible

- accepted by both clubs

- attached to a specific match

- club affiliation recorded, if any

- can submit basic report

- does not automatically become platform referee

<!-- Page 15 -->

### Trust behavior

Community officiator confirmation can support verification. But for high-stakes challenges, suspicious matches, or disputes, the system may still request more evidence or admin review.

## 29. Split Community Officiator Rules

|  | Locked rule |  |
| --- | --- | --- |
|  | Kalaanba supports split community officiating. A split community officiator may be a team member from either side, as long as |  |
|  | both clubs agree before the match. |  |

### Basic structure

- One officiator may handle the first half.

- Another officiator may handle the second half.

- The officiators may come from the two clubs.

- Their club affiliation must be recorded.

- Their reports support verification.

- They do not carry the same trust weight as a verified referee.

### Best use cases

- friendlies

- verified friendlies

- small community competitions

- school/workplace/internal competitions

- low-risk tournaments

### Caution cases

- high-RP ranked challenges

- finals

- serious disputes

- suspicious clubs

- repeated RP matches between same clubs

## 30. Referee Reliability

Kalaanba should track referee/officiator reliability internally. Do not rush public referee ratings in V1.

### Internal reliability signals

- accepted assignments

- completed assignments

- late cancellations

- no-show referee events

- reports submitted on time

- disputed reports

- reports overturned by admin

- repeated club patterns

- misconduct complaints

- admin notes

This supports future trust weight.

<!-- Page 16 -->

## 31. Referee Pattern Risk

The Referee Engine should expose data that allows Trust/RP monitors to detect:

- same referee always assigned to same club

- same split officiators appearing repeatedly in suspicious matches

- one referee linked to suspicious RP movement

- referee frequently involved in disputed matches

- referee reports repeatedly overturned

- referee connected to related clubs

- unusual challenge settlement patterns

These should create review flags, not automatic punishments.

## 32. Notifications

The engine should trigger notifications for:

- new referee assignment request

- assignment accepted

- assignment declined

- assignment cancelled

- match reminder

- report reminder

- period report reminder

- dispute follow-up request

- report accepted

- admin review outcome

- suspension/warning notice

Channels: WhatsApp first where applicable, in-app notification, SMS later, email later.

## 33. Referee Assignment UX

When creating or scheduling a match, show Match official arrangement with these options:

## 7. No official

## 8. Add community officiator

## 9. Split community officiators

## 10. Select Kalaanba referee

## 11. Organizer will assign

For split community officiators: Choose who will officiate each period.

|  | Period |  |  | Officiator |  |  | Club affiliation |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First half |  |  | Abdul Rahman |  |  | Aboabo United |  |  |
| Second half |  |  | Malik Fuseini |  |  | Taha Stars |  |  |

Both clubs must confirm: We agree to this officiating arrangement.

## 34. Referee Report UX

After the match, the referee/officiator sees: Submit match report.

- Did the match happen?

- Did the match finish?

- Final score

- Period handled, if split officiating

- Any no-show/walkover?

<!-- Page 17 -->

- Any red cards or serious incidents?

- Short note

- Upload photo/video, optional

- Submit

That is enough for V1.

## 35. Audit Trail

Every referee/officiator action should be audited.

- who assigned the official

- who accepted the arrangement

- referee/officiator invited time

- referee/officiator accepted/declined time

- split officiator period assignment

- assignment changes

- cancellation reason

- report submitted

- report edited

- dispute response

- admin override

- affected match

- affected competition/challenge

No referee/officiator report should be silently deleted.

## 36. Report Correction

A referee/officiator may need to correct a report. Correction should be allowed, but audited. Example: Original report: Taha Stars 2-1 Aboabo City. Correction: Taha Stars 3-1 Aboabo City. Reason: Missed late penalty in original submission. The system should preserve both versions.

## 37. Referee Suspension / Restriction

Admin can suspend or restrict a referee/officiator. Reasons:

- repeated no-show

- false reports

- misconduct

- unresolved complaints

- suspicious match patterns

- conflict of interest

- safety issue

Suspension effects:

- cannot accept new assignments

- existing assignments may need replacement

- profile remains archived internally

- past reports remain preserved

For community/split officiators, restriction may simply prevent that person from being used as an officiator again until reviewed.

<!-- Page 18 -->

## 38. Payments and Marketplace

Do not build full referee marketplace in V1. Deferred features:

- referee fees

- payment collection

- platform commission

- automatic payouts

- referee bidding

- rating-based recommendations

- referee marketplace discovery

- paid referee booking

For V1, referee/officiator assignment can be manual and operational.

## 39. Engine Outputs

- getRefereeProfile(refereeId)

- getRefereeAvailability(refereeId)

- getRefereeCalendar(refereeId)

- getAvailableReferees(matchId)

- getAssignmentStatus(matchId)

- getMatchOfficialArrangement(matchId)

- getCommunityOfficiatorRecord(matchId)

- getSplitOfficiatorAssignments(matchId)

- getPeriodOfficiatorReport(matchId, periodId)

- getRefereeReport(matchId)

- getRefereeTrustInput(matchId)

- getRefereeConflictFlags(refereeId, matchId)

- getRefereeReliabilitySummary(refereeId)

- getRefereeAssignmentHistory(refereeId)

- getOfficiatorPatternFlags(filters)

## 40. Integrations

|  | Engine/System |  |  | Relationship |  |
| --- | --- | --- | --- | --- | --- |
| Match / Fixture Engine |  |  | Creates match event and links referee/officiator assignment. |  |  |
| Trust & Verification Engine |  |  | Consumes referee/officiator confirmation and report. |  |  |
| Challenge Engine |  |  | Uses referee/officiator as third actor in 2-of-3 where applicable. |  |  |
| Competition & Rules Engine |  |  | Defines whether referee/organizer confirmation is required. |  |  |
| RP Economy Engine |  |  | Reads Trust clearance; may monitor referee/officiator pattern risk. |  |  |
| Club Engine |  |  | Provides club reps/captains and club-affiliation context for split<br>officiators. |  |  |
| Zone Engine |  |  | Referees can operate across City Hub in V1; no zone restriction. |  |  |
| Notification Engine |  |  | Sends assignment/report/dispute notifications. |  |  |
| Admin Governance Engine |  |  | Manages referee verification, restrictions, overrides, and audit. |  |  |
| Payments Engine |  |  | Later handles referee payments. |  |  |

## 41. Configurable Defaults

All values should be configurable later.

|  | Setting |  |  | Default |  |
| --- | --- | --- | --- | --- | --- |
| Referee zone restriction |  |  | None in V1 |  |  |

<!-- Page 19 -->

| Community officiator allowed | Yes |
| --- | --- |
| Split community officiators allowed | Yes |
| Club-affiliated officiator allowed | Yes, if both clubs agree |
| Referee required for friendly | No |
| Referee required for verified friendly | No |
| Referee required for competition | Competition-configured |
| Referee required for ranked challenge | Recommended; required for high-RP challenges later |
| Split officiators allowed for high-RP challenge | Configurable; default caution/review |
| Referee assignment conflict check | Same-time conflict |
| Report required after referee assignment | Yes |
| Period report required for split officiating | Yes, configurable |
| Report reminder | Configurable |
| Late report flag | Configurable |
| Referee no-show flag | Configurable |
| Trust weight | Based on identity state and arrangement type |
| Public referee ratings | Deferred |

The broader platform direction is that value-driven rules, thresholds, windows, and labels should remain configurable through Admin Configuration.

## 42. V1 Scope

- referee/officiator profile

- community officiator support

- split community officiator support

- club-affiliated officiator support

- verified referee/admin-approved referee status

- referee/officiator assignment to match

- assignment accept/decline

- both-club acceptance for split officiating

- period assignment for split officiators

- referee calendar

- basic availability

- same-time conflict check

- referee report

- period report

- no-show/walkover report

- abandonment report

- misconduct note

- referee/officiator confirmation feeding Trust Engine

- referee/officiator as third actor in challenge verification where applicable

- internal reliability signals

- admin verification/restriction

- audit trail

- notifications for assignment and report reminders

## 43. Deferred / Later

- full referee marketplace

- payments and payouts

- referee public ratings

- automated referee ranking

- advanced referee recommendations

- travel-distance optimization

- referee certification verification

<!-- Page 20 -->

- referee association integration

- advanced disciplinary automation

- automated referee trust score

- referee dispute appeal system

- public referee profile discovery

- GPS-enforced referee check-in

- referee fee negotiation

- AI referee report analysis

## 44. Product Guardrails

- Do not make every match require a referee.

- Do not treat community officiators as the same as verified referees.

- Do not treat split community officiators as neutral officials.

- Do not block grassroots matches because they only have club-provided officials.

- Do not make referee report forms too long.

- Do not restrict referees by Zone/Belt in V1.

- Do not build payments before trust and assignments work.

- Do not show public referee ratings too early.

- Do not let referee confirmation automatically override every dispute.

- Do not silently delete referee/officiator reports or corrections.

- Do not over-automate punishment based on referee patterns.

- Do not make clubs feel forced into formal referee structure when grassroots reality is different.

## 45. Locked Summary

The Kalaanba Referee & Officiator Engine defines who can oversee a match, how they are assigned, what authority they carry, what report they submit, and how their input supports Trust verification. V1 supports verified referees, organizer officials, single community officiators, and split community officiators. A community officiator may be a team member, captain, coach, senior player, supporter, or trusted person accepted by both clubs. Split community officiating is allowed, where one club-provided officiator may handle the first half and another club- provided officiator may handle the second half. Their club affiliation must be recorded. Community and split officiators support grassroots verification but do not carry the same trust weight as verified referees. Their reports help the Trust Engine, especially when both clubs agree, but they should not automatically settle serious disputes alone. Referees should not be restricted to Zones or Belts in V1. They should be available across the City Hub because referee supply may be limited. V1 supports referee/officiator assignment, acceptance/decline, simple availability, calendar visibility, same-time conflict checks, reports, no-show/walkover reports, abandonment reports, misconduct notes, internal reliability signals, and audit logs. The referee or officiator confirms what happened on the field. The Trust Engine decides clearance. The Competition Engine applies competition rules. The RP Engine only acts after Trust clearance. Admins and Super Admins can review, restrict, or override, with the audit trail preserved.

|  | Final principle |  |
| --- | --- | --- |
|  | Referees strengthen trust, community officiators reflect grassroots reality, and the Trust Engine decides what is safe to count. |  |
