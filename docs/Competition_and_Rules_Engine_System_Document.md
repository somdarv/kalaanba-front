<!-- Converted from Competition_and_Rules_Engine_System_Document.pdf -->

# Kalaanba Competition and Rules Engine

Final lock-in system document for competitions, formats, rules, standings, fixture inheritance, public pages, and related engine dependencies.

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Competition and Rules Engine |
| V1 formats | League and Knockout |
| Challenge access | Club-level only. Challenges are not available inside organizer competition<br>creation. |
| Promotion / relegation | Deferred. Not in V1 or current lock-in. |
| Rules lock | Rules that affect fairness lock after first confirmed result. |
| Fixture generation | Manual in V1. Auto-generation later. |
| Public page | Every competition can have a public, unlisted, or private page. |
| Paid competitions | Later. Requires verification, payments, and trust gates. |

Core principle: the Match / Fixture Engine records the event and confirms the result. The Competition and Rules Engine decides what that confirmed result means inside a competition.

## 1. Purpose

- Create and manage structured football competitions such as leagues, knockouts, internal contests,

invitational tournaments, and zonal competitions.

- Define which clubs or teams can enter, what rules apply, how fixtures are managed, and how winners are

determined.

- Provide the rules that competition fixtures inherit: duration, scoring, tiebreakers, disciplinary settings,

eligibility rules, result authority, and standings behavior.

- Publish competition pages and trigger WhatsApp/in-app updates for fixtures, results, standings,

postponements, and winners.

- Preserve competition history after completion so clubs, players, organizers, zones, and seasons have

permanent records.

## 2. Core Definition

A Kalaanba Competition is a structured football contest created by a club, organizer, institution, corporate account, or Kalaanba admin. It defines who can enter, which rules apply, how fixtures are played, how results are confirmed, and how winners are decided. A competition may be formal or informal. It may be internal, open, or invitational. It may be a small weekend knockout, a school league, a community tournament, or a hub-wide zonal competition.

## 3. Competition Engine vs Rules Engine

<!-- Page 2 -->

| Layer | Owns | Examples |
| --- | --- | --- |
| Competition Engine | The container and structure of the<br>competition. | Creator, format, teams, fixtures,<br>stages, status, dashboard, public<br>page. |
| Rules Engine | The behavior and enforcement rules<br>inside the competition. | Points, tiebreakers, match duration,<br>eligibility, cards, suspensions,<br>walkovers, confirmation authority. |

These can be implemented as one domain module at first, but the logical separation should remain clear.

## 4. Competition Types

| Type | Meaning | Status |
| --- | --- | --- |
| League | Every team plays the others. Single round robin in<br>V1; double round robin later if needed. | V1 |
| Knockout / Elimination<br>Cup | Teams are eliminated after losing. Supports seeded<br>or random draw later. | V1 |
| Group Stage +<br>Knockout | Teams play in groups, then qualifiers enter knockout<br>rounds. | Later |
| Round Robin<br>Tournament | All teams play each other in a compressed period<br>such as a day or weekend. | Later / simple variant<br>possible |
| Internal Competition | Competition inside one club, school, workplace,<br>church, mosque, or organization. | V1-ready |
| Invitational<br>Tournament | Organizer invites selected clubs or teams. Not<br>necessarily listed publicly. | Later / optional |
| Zonal / Regional<br>Competition | Structured around City Hub Zones/Belts or zone<br>representatives. | Conceptual now; later<br>build |
| Cup + League<br>Combined | League and cup run alongside each other for same<br>clubs. | Later |
| Promotion / Relegation<br>League | Multiple linked divisions, bottom clubs drop and top<br>clubs rise. | Deferred |

## 5. Challenge Exclusion Rule

Challenges are special inter-club reputation actions. They must be initiated from the Club level, not from the Competition creation flow. Locked rule: Challenge is not an organizer-created competition format. It belongs to the Challenge Engine and Club Engine. Once accepted, a Challenge can become a scheduled fixture, but it should not appear as a normal option when an organizer creates a competition. Club dashboard -> Issue Challenge -> Select opponent -> Set terms -> RP locked if accepted -> Schedule fixture -> Verify result -> Resolve Challenge

## 6. Competition Scope

| Scope | Meaning | Risk level |
| --- | --- | --- |
| Internal | Only members, squads, houses, departments, or<br>teams inside one club/organization. | Low |
| Open | Eligible clubs or teams can register or be added<br>from outside the organizer's group. | Medium to high |

<!-- Page 3 -->

| Scope | Meaning | Risk level |
| --- | --- | --- |
| Invitational | Organizer curates the participant list and sends<br>invitations. | Medium |
| Official / Sanctioned | Created or approved by Kalaanba for hub, zonal, or<br>special events. | High trust |

## 7. Who Can Create Competitions

| Creator | Can create | Gate |
| --- | --- | --- |
| Club owner / admin | Internal competitions; club-hosted<br>competitions. | Open or paid competitions<br>need verification. |
| Individual organizer | Invite-only or open competitions. | Open/paid requires<br>verification. |
| Institution admin | Internal school/institution competitions; open<br>events if allowed. | Verification if public or paid. |
| Corporate account | Internal workplace competitions. | Low gate if self-contained. |
| Kalaanba super admin | Official, zonal, pilot, or sanctioned<br>competitions. | Official badge applied. |

## 8. Verification and Risk Gates

Competition creation should remain easy, but higher-risk actions need gates. Verification is not only documents; it means Kalaanba can reach the admins/owners and trusts their track record.

| Competition action | Gate |
| --- | --- |
| Free internal competition | No verification gate. |
| Invite-only free competition | Light profile/accountability check. |
| Open free competition | Profile completeness and good standing. |
| Open paid competition | Verified organizer/club required. Payments/trust rules must be ready. |
| Prize-money competition | Stronger review later; may require bond or platform-held prize pool. |
| Official Kalaanba competition | Admin-created or sanctioned. |

## 9. V1 Competition Creation Flow

### Simple Mode

Simple Mode is the default for informal organizers. It should feel light, quick, and practical.

## 1. Competition name

## 2. Choose format

## 3. Add teams/clubs

## 4. Set basic rules

## 5. Create fixtures manually

## 6. Publish/share

### Advanced Mode

Advanced settings are expandable, not forced. This follows the locked idea that templates are on-ramps, not destinations.

- Identity and branding: logo, colors, banner, slug, tagline.

<!-- Page 4 -->

- Scope and eligibility: internal, open, invitational, age/gender/category, geography.

- Format options: league, knockout, group later, round robin later.

- Rules: points, tiebreakers, match duration, disciplinary rules, squad rules.

- Venue rules: fixed venue, home/away, mixed, platform venue, or manual venue.

- Registration rules: deadlines, team limits, squad size, waitlist later.

- Communications: WhatsApp group link, notification toggles, sender name prefix.

- Public page: privacy, about, sponsor area later, featured match later.

## 10. Competition Identity

| Field | V1 requirement |
| --- | --- |
| Name | Required |
| Short name | Optional |
| Edition / season label | Optional but recommended |
| Sport | Default soccer at launch |
| Logo / colors / banner | Optional in V1; editable before lock where safe |
| Slug / public URL | Generated, editable before launch |
| Visibility | Public, unlisted, or private |
| Organizer contact | Required internally |

## 11. Competition Participants

A competition participant is the side entered into the competition. It may be a club, a team under a club, a school house, a department, a temporary squad, or an internal side. Internal model: Club is the main identity. Team/Participant is the competition entry. This avoids confusion when one club has multiple squads or internal teams.

| Example | Club | Competition participant |
| --- | --- | --- |
| Community league | Aboabo United | Aboabo United Senior Team |
| School contest | Tamale High School | House 1 |
| Workplace league | Metaonyx Ltd | Operations Department |
| Internal club match | Taha Young Stars | Team A / Team B |

## 12. Team Registration and Entry

V1 should prioritize organizer-added teams. Open registration and paid entry can come later.

| Method | Status |
| --- | --- |
| Organizer manually adds teams/clubs | V1 |
| Organizer invites teams by phone or<br>club profile | V1 / near V1 |
| Open registration form | Later |
| Waitlist | Later |

<!-- Page 5 -->

| Method | Status |
| --- | --- |
| Paid registration / entry fees | Later, after verification and payments are ready |
| Custom registration fields | Later |
| Bulk player import | Useful early if player records are in MVP |

## 13. Rules Configuration

Rules should be configurable but not overwhelming. Use templates, defaults, and expandable advanced sections.

| Rule group | Examples |
| --- | --- |
| Match rules | Half length, number of halves, break duration, extra time, penalties,<br>substitution limits, squad size. |
| Points rules | Win, draw, loss, walkover points, bonus points if ever needed. |
| Tiebreakers | Points, goal difference, goals scored, head-to-head, wins, disciplinary record,<br>manual decision. |
| Squad rules | Minimum/maximum squad, registration deadline, age/gender category,<br>guest players, transfer window. |
| Disciplinary rules | Yellow accumulation, red card suspension, ban length, appeal rules. |
| Fixture rules | Minimum rest days, preferred matchdays, kickoff windows, postponement<br>authority. |
| Result rules | Who confirms, who can override, dispute window, abandoned match rulings. |
| Venue rules | Fixed venue, home/away, mixed, neutral venue, manual venue allowed. |

## 14. Default Rules

| Default | Current value |
| --- | --- |
| Points system | Win 3, Draw 1, Loss 0 |
| Tiebreaker order | Points -> Goal difference -> Goals scored -> Head-to-head -> Wins<br>-> Disciplinary record -> Manual/admin decision |
| Walkover score | Competition-configured; default 3-0 |
| Match duration | Configurable; not assumed 90 minutes |
| Fixture generation | Manual in V1 |
| Rules lock | After first confirmed result |
| Public page | Public / unlisted / private |
| Challenge format | Not included in competition creation; challenge starts from club level |

## 15. Rules Lock Behavior

Rules that affect fairness lock after the first confirmed result in the competition. This prevents organizers from changing the competition after clubs have already played under a different rule set.

<!-- Page 6 -->

| Locked after first confirmed result | Still editable after lock |
| --- | --- |
| Points system, tiebreakers, match duration, squad<br>eligibility, disciplinary thresholds, walkover score,<br>qualification/advancement rules, confirmation<br>authority. | Description, banner, logo, sponsor info,<br>communication settings, public page copy, typo<br>fixes. |

Admin overrides are possible but must be audited with who changed it, what changed, why, when, and which records were affected.

## 16. Competition Lifecycle

Draft -> Setup -> Registration Open -> Registration Closed -> Fixtures Scheduled -> Active -> Completed -> Archived

| State | Meaning |
| --- | --- |
| Draft | Competition is being created and not ready. |
| Setup | Structure exists; organizer is adding teams/rules/fixtures. |
| Registration Open | Teams can be added, invited, or registered. |
| Registration Closed | Participant list is closed unless organizer/admin reopens. |
| Fixtures Scheduled | Fixtures exist on the calendar. |
| Active | Competition has started or at least one fixture/result is underway. |
| Paused | Temporary hold due to issue, venue problem, dispute, or admin decision. |
| Completed | Final result or table outcome is known. |
| Archived | Records are locked into history. |
| Cancelled | Competition will not continue. |
| Abandoned | Competition started but cannot be completed; requires resolution. |

## 17. Fixture Generation and Management

- V1 uses manual fixture creation.

- Auto-generation for leagues, knockouts, and group stages comes later.

- Competition Engine defines fixture rules; Match / Fixture Engine creates and manages actual match

events.

- Competition fixtures inherit match duration, rules, confirmation authority, and venue behavior from the

competition.

- Fixture changes should trigger notifications where enabled.

## 18. Standings and Brackets

### League standings

League standings should calculate matches played, wins, draws, losses, goals for, goals against, goal difference, points, form, and position. Tiebreakers are applied in configured order.

### Knockout brackets

Knockout brackets should track round, fixture, winner, loser, next fixture, bye, seed, and final winner.

### Group stage later

<!-- Page 7 -->

Group stage support should track group tables, qualifiers, best runners-up where needed, and advancement rules. This is not V1 unless specifically prioritized later.

## 19. Walkover, Abandoned, Postponed, and Cancelled

## Fixtures

| Case | Competition/Rules Engine responsibility |
| --- | --- |
| Walkover | Define default score, points awarded, no-show consequence, and whether<br>table is affected. No player stats are generated. |
| Abandoned fixture | Define whether replay, result stands, void, walkover, reschedule, or admin<br>ruling applies. |
| Postponed fixture | Define who can postpone, approval rules, reschedule deadline, and<br>notification behavior. |
| Cancelled fixture | Define whether it has no effect, is voided, or triggers a competition-specific<br>consequence. |

## 20. Competition and RP

Competition matches use standard RP behavior only when RP-eligible under Season and RP rules. The Competition Engine does not calculate RP. It labels the fixture as a competition match and supplies context; the RP Engine decides whether and how much RP is awarded.

| Condition | RP direction |
| --- | --- |
| Both clubs are active season<br>participants | Required for Season RP |
| Match is inside active season | Required for Season RP |
| Result confirmed | Required before RP |
| Related clubs | No Season RP |
| Standard RP-eligible competition<br>match | Win +5, Draw +3, Loss +2 by current RP defaults |

## 21. Competition and Season

A competition can have its own edition or season label, but it also maps to the Kalaanba platform season. The Season Engine decides whether competition fixtures count toward Season RP, rankings, and archives. Example: Tamale Weekend League Season 2 belongs to Kalaanba Season 2026 if its fixtures fall within the active platform season.

## 22. Competition and Zones

Zonal competitions should use the locked City Hub -> Zone/Belt -> Area model. The old NEWS idea is replaced by City Hub zones and belts.

- Same-zone competition: clubs from one Zone/Belt.

- Cross-zone competition: clubs from multiple Zones/Belts.

- Zone representative competition: top or selected clubs represent their Zone/Belt.

- Hub championship: strongest clubs across a City Hub compete.

Zonal competitions are part of the engine concept, but not V1.

## 23. Competition and Players

<!-- Page 8 -->

Competition Engine should prepare for player registration and eligibility, even if V1 keeps it light.

- Registered squad per competition.

- Player eligibility rules such as age, category, guest player permission, and registration deadline.

- Matchday lineup, squad number, positions, minutes, goals, assists, cards, and suspensions.

- Transfers and movement rules later through Player/Affiliation Engine.

- Verified stats only become official after result_confirmed = true.

## 24. Competition Communications

Competitions should trigger communication events, especially WhatsApp-friendly outputs.

- Competition launched.

- Registration opened or closed.

- Team added or accepted.

- Fixture scheduled or changed.

- Fixture postponed, cancelled, or abandoned.

- Result confirmed.

- Standings updated.

- Disciplinary notice.

- Winner/final announcement.

Every communication should be logged per competition/event where possible.

## 25. Competition Public Page

Every competition should be able to have a public, unlisted, or private page. Public tournament pages are a major distribution surface because organizers share clean pages on WhatsApp.

| V1 public page | Later additions |
| --- | --- |
| Name, logo/banner/colors, about, teams,<br>fixtures, results, standings/bracket, rules<br>summary, share link. | Top scorers, player awards, sponsors, media gallery,<br>featured match, trophy name, advanced analytics. |

## 26. Templates

Templates are on-ramps, not destinations. They should pre-fill rules but remain customizable.

| Template | Use |
| --- | --- |
| Standard community league | Default local league with simple rules. |
| Weekend knockout cup | Short tournament with elimination format. |
| Informal 5-a-side | Quick casual competition with shorter matches. |
| School competition | School houses/classes/departments. |
| Start from scratch | Advanced or custom organizers. |

## 27. Engine Integrations

<!-- Page 9 -->

| Engine/System | Competition relationship |
| --- | --- |
| Club Engine | Provides creators, participants, roles, verification, and club eligibility. |
| Match / Fixture Engine | Creates and confirms competition fixtures as Events. |
| Rules Engine | Defines competition behavior and enforcement. |
| Season Engine | Determines platform season timing, RP eligibility, and archive context. |
| RP Economy Engine | Awards Season RP only after result confirmation and eligibility checks. |
| Zone Engine | Provides zone/belt context for zonal and inter-zone competitions. |
| Player / Affiliation Engine | Provides squads, eligibility, lineups, stats, transfers, and suspensions. |
| Trust / Verification Engine | Determines reliability of records, disputes, and official confirmation. |
| Notification Engine | Sends WhatsApp, SMS, and in-app updates. |
| Payments Engine | Later handles entry fees, refunds, prize pools, and commissions. |
| Admin Governance | Approves high-risk competitions, overrides, disputes, and official<br>competitions. |

## 28. V1 Scope

- Create competition.

- Simple and advanced setup path.

- League format.

- Knockout format.

- Manual fixture creation.

- Basic rules configuration.

- Configurable match duration.

- Basic tiebreakers.

- Organizer-added teams.

- Competition dashboard.

- Result-driven standings or bracket progression.

- Public/unlisted/private competition page.

- WhatsApp-friendly result and standings triggers.

- Rules lock after first confirmed result.

- Walkover, postponement, cancellation, and abandoned-state support.

- Audit trail for rule/result/standings-impacting changes.

## 29. Deferred / Later

- Open team registration forms.

- Paid entry fees and prize pool handling.

- Auto fixture generation.

- Group stage + knockout.

- Round robin compressed tournament helper.

- Promotion/relegation leagues.

<!-- Page 10 -->

- Multi-stage competitions beyond simple structures.

- Competition cloning and organizer-saved templates.

- Advanced disciplinary automation.

- Full sponsor tools.

- Advanced player eligibility and transfer enforcement.

- Neutral venue per-round designation.

- Advanced abandoned competition handling.

## 30. Configurable Defaults

Platform-wide configuration rule: any value, threshold, time window, weight, percentage, cap, limit, reward, penalty, or scoring parameter should be configurable.

| Default | Current value |
| --- | --- |
| V1 formats | League and Knockout |
| Points system | Win 3, Draw 1, Loss 0 |
| Walkover score | Default 3-0, competition-configured |
| Rules lock trigger | First confirmed result |
| Fixture generation | Manual |
| Public page | Public, unlisted, private |
| Challenge in competition creation | No |
| Paid competitions | Deferred |
| Promotion/relegation | Deferred |
| Zonal competitions | Conceptual, later build |

## 31. Pushbacks and Product Guardrails

- Do not make every competition feel official. Small informal competitions should be easy to run.

- Do not force open registration in V1. Organizer-added teams are enough to prove the core flow.

- Do not overbuild the rules engine early. Start with templates, defaults, and expandable settings.

- Do not allow paid competitions without verification, payment policy, refund rules, and trust gates.

- Do not allow fairness-changing rule edits after the first confirmed result without audit/admin override.

- Do not include Challenge as an organizer competition type. Challenges belong to Club-level actions.

## 32. Locked Summary

Kalaanba competitions organize multiple matches into structured football contests. The Competition Engine owns the competition container: creator, scope, format, participants, fixtures, status, public page, and dashboard. The Rules Engine owns behavior: points, tiebreakers, match duration, eligibility, disciplinary rules, confirmation authority, walkover handling, and fairness locks. V1 supports League and Knockout formats, manual fixture creation, organizer-added teams, basic rules, configurable match duration, standings/brackets, public pages, and WhatsApp-friendly outputs. Challenges are not part of organizer competition creation; they are special club-to-club actions that start at Club level and only become fixtures after acceptance. Paid competitions, promotion/relegation, group + knockout, auto-generation, and advanced registration are deferred. Rules that affect fairness lock after the first confirmed result.

<!-- Page 11 -->

## 33. Recommended Next Engine

Recommended next engine: Player / Affiliation Engine. Reason: competitions, fixtures, lineups, stats, player cards, ghost players, transfers, squads, eligibility, suspensions, and verified career records all depend on a strong player-affiliation system. The Competition Engine can define squad rules, but the Player / Affiliation Engine must define who the players are, how they join clubs, how they are registered into competitions, and how their verified match history is preserved.
