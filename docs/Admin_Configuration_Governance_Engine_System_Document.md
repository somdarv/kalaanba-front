<!-- Converted from Admin_Configuration_Governance_Engine_System_Document.pdf -->

# Kalaanba Admin Configuration & Governance Engine / System Document

Locked product direction for platform-wide configuration, admin governance, super-admin control, scoped rule changes, audit logs, overrides, approvals, and future-proof rule management.

| Field | Locked Value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Admin Configuration & Governance Engine |
| Core principle | Rules should be configurable. Changes should be controlled. History should be<br>preserved. Effects should be traceable. |
| Architecture stance | Business engines read rule values from Admin Config; engines apply rules and write<br>auditable results. |
| Recommended next<br>engine | Trust & Verification Engine |

Control-room principle: Internal logic keys stay stable. User-facing labels, thresholds, values, windows, weights, and nomenclature can be configured by authorized admins.

<!-- Page 2 -->

## Table of Contents

## 1. Purpose 4

## 2. Why This Engine Matters 4

## 3. Core Principles 4

## 4. What This Engine Owns 4

## 5. Configuration Scopes 5

## 6. Configuration Categories 5

### 6.1 RP Economy Configuration............................................... 5

### 6.2 Season Configuration.................................................. 5

### 6.3 Challenge Configuration................................................ 5

### 6.4 Club Configuration................................................... 6

### 6.5 Player / Affiliation Configuration............................................ 6

### 6.6 Match / Fixture Configuration.............................................. 6

### 6.7 Competition / Rules Configuration........................................... 6

### 6.8 Zone Configuration................................................... 7

### 6.9 Fan Buzz / Feed Configuration............................................. 7

### 6.10 Awards Configuration................................................. 7

### 6.11 Nomenclature Configuration............................................. 7

## 7. Governance Workflows 7

## 8. Admin Roles 8

## 9. Config Versioning 8

## 10. Effective Dates 9

## 11. Dependency Warnings 9

## 12. Audit Logs 9

## 13. Approval Levels 10

## 14. Manual Overrides 10

## 15. Conceptual Config Data Model 10

## 16. Presets 11

<!-- Page 3 -->

## 17. Engine Integrations 11

## 18. V1 Scope 11

## 19. Admin Dashboard Sections 12

## 20. Pushbacks and Cautions 12

## 21. Locked Direction 12

## 22. Recommended Next Engine 13

<!-- Page 4 -->

## 1. Purpose

The Admin Configuration & Governance Engine is Kalaanba's control room. It controls how platform rules, thresholds, labels, weights, values, defaults, approvals, overrides, and sensitive platform decisions are managed across the system. It answers who can change rules, what can be configured, where a configuration applies, when a change takes effect, who approved it, what systems are affected, and whether the change can be rolled back or corrected.

- Store configurable values used by business engines.

- Protect fairness with effective dates and rule-lock windows.

- Preserve accountability with audit logs and approval trails.

- Provide governance workflows for sensitive human decisions.

- Allow Kalaanba to change labels, thresholds, weights, and rules without code edits.

## 2. Why This Engine Matters

Throughout the locked engine documents, Kalaanba has repeatedly accepted a platform-wide rule: anything dependent on a numerical value, threshold, weight, percentage, window, cap, penalty, reward, limit, duration, or configurable label should be configurable. This engine makes that possible in a safe and traceable way. For example, if club availability currently means 70% of squad members are available, a super admin should be able to change that to 50% later. If the public label currently says Available, the admin should be able to rename it to Ready to go without changing internal logic. The key is not only configurability. The key is controlled configurability. Without scoping, versioning, effective dates, and audit trails, configurable rules can damage fairness and trust.

## 3. Core Principles

- Rules should be configurable where they can reasonably change.

- Changes should be controlled, versioned, scoped, and audit-logged.

- Internal keys remain stable even when user-facing labels change.

- Fairness-sensitive changes should usually take effect in the future, not mid-race.

- Super admins can override, but every override requires a reason and leaves a trace.

- Business engines consume configuration values but remain responsible for applying their own rules.

- Governance workflows handle human judgment, exceptions, and review queues.

Example: internal_key = available can display as Available, Ready to go, or any future label. The database and business logic should not depend on the visible word.

## 4. What This Engine Owns

| Owns | Does Not Own |
| --- | --- |
| Platform settings, engine configuration values, labels,<br>nomenclature, rule presets, admin permissions, config<br>versioning, effective dates, approval workflows,<br>dependency warnings, review queues, audit logs,<br>rollback support, and manual override records. | The actual football or business outcome inside each<br>domain engine. For example, it stores Win = +5 RP,<br>but RP Engine applies the +5 RP after a verified<br>eligible win. |

<!-- Page 5 -->

## 5. Configuration Scopes

Not every setting applies everywhere. Configuration must be scoped so Kalaanba can use broad defaults while still allowing carefully controlled exceptions later.

| Scope | Meaning | Example |
| --- | --- | --- |
| Platform default | Applies everywhere unless overridden by a<br>narrower allowed scope. | Ranked Challenge unlock = 50 RP. |
| Season-specific | Applies to one Kalaanba season. | 2026 season cutoff = July 31. |
| City Hub-specific | Applies to one hub such as Tamale or<br>Bolga. | Tamale Hub uses 8 divisions; Bolga Hub<br>uses 4. |
| Zone/Belt-specific | Rare; applies to a specific zone or belt. | Zone Leader Duel requirement in one<br>Belt. |
| Competition-specific | Applies to one competition. | Win = 3 points, draw = 1 point, half<br>length = 35 minutes. |
| Entity-specific<br>override | Applies to one club, player, venue, match,<br>or organizer. | Club suspended from ranked challenges<br>until dispute resolved. |

Suggested resolution order: entity override -> competition config -> zone/hub config -> season config -> platform default. Some settings should intentionally block lower-level overrides.

## 6. Configuration Categories

### 6.1 RP Economy Configuration

- Win/draw/loss RP values.

- Profile completion and first verified match bonuses.

- Ranked Challenge unlock threshold.

- Tier boundaries, stake floors, stake caps, draw stood-ground cost.

- No-show, forfeit, dispute, and admin adjustment values.

- Anti-farming windows and repeat-match decay rules.

### 6.2 Season Configuration

- Season start and end dates.

- Transition month and closing/archive windows.

- Season participation cutoff.

- Challenge cutoff dates.

- RP reset behavior.

- One-time bonus queue handling.

### 6.3 Challenge Configuration

- Challenge response window.

- Scheduling window and optional extension length.

- Counter offer limit.

- Prediction window.

- Open Call-out Window timing.

<!-- Page 6 -->

- Tier gap rules and stake table.

- Decline, ignore, no-show, and late-cancellation consequences.

### 6.4 Club Configuration

- Inactive and dormant thresholds.

- Formerly notice duration.

- Verification requirements.

- Minimum members for verification.

- Profile completion requirements.

- Club availability labels and thresholds.

- Related-club detection sensitivity.

### 6.5 Player / Affiliation Configuration

- Ghost claim expiry.

- Photo requirements.

- Public profile default.

- Minor privacy behavior.

- Availability labels and thresholds.

- Preferred number rules.

- Transfer windows and affiliation state labels.

### 6.6 Match / Fixture Configuration

- Match duration presets.

- Half length presets.

- Walkover default score.

- Result confirmation windows.

- Postponement, cancellation, and abandonment reasons.

- Abandonment ruling options.

- Fixture conflict rules.

- Manual venue requirements.

### 6.7 Competition / Rules Configuration

- Competition templates.

- Points system presets.

- Tiebreaker presets.

- Squad size presets.

- Disciplinary presets.

- Rules lock behavior.

- Fixture generation mode.

- Public page defaults and visibility rules.

<!-- Page 7 -->

### 6.8 Zone Configuration

- Number of zones/belts per hub.

- Zone/belt labels.

- Area-to-zone mappings.

- Zone leader requirements.

- Zone score formula weights.

- Area confidence labels.

- Inter-zone competition rules.

### 6.9 Fan Buzz / Feed Configuration

- Reaction weights.

- Share weights.

- Comment weights.

- Prediction weights.

- View velocity weights.

- Homepage rotation rules.

- Buzz decay period.

- Boost and suppress flags.

### 6.10 Awards Configuration

- Award categories.

- Eligibility thresholds.

- Minimum matches and minimum clean record.

- Award calculation windows.

- Manual award override rules.

- Public award display settings.

### 6.11 Nomenclature Configuration

Nomenclature configuration lets Kalaanba change user-facing language without changing database logic. This is essential for labels such as Available, Limited, Zone, Belt, Season RP, Ranked Challenge, and similar user-facing concepts.

| Internal Key | Current Label | Possible Future Label |
| --- | --- | --- |
| available | Available | Ready to go |
| limited | Limited | Short squad |
| unavailable | Unavailable | Not taking matches |
| zone | Zone | Territory |
| season_rp | Season RP | Season Respect |
| ranked_challenge | Ranked Challenge | Respect Challenge |

## 7. Governance Workflows

<!-- Page 8 -->

Configuration stores rules. Governance handles sensitive human decisions that require review, approval, judgment, or exception handling.

- Club verification and formal upgrade approval.

- Zone/Area change requests and Area mapping reviews.

- Related-club flag review and confirmation.

- Duplicate club merge and archive decisions.

- Club, player, venue, or organizer suspension.

- Dispute escalation and admin rulings.

- Manual RP adjustment and correction entries.

- Match result override and voiding decisions.

- Competition cancellation or abandonment review.

- Venue verification and facility trust review.

- Player identity and stat dispute review.

- Admin-created official competitions and badges.

## 8. Admin Roles

| Role | Default Responsibility |
| --- | --- |
| Super Admin | Full access. Can change global configs, create seasons, adjust RP rules, manage<br>admins, approve major overrides, view audit logs, and roll back configs where<br>possible. |
| Hub Admin | Manages one City Hub. Can approve areas, manage zone mappings, review<br>local clubs, handle hub disputes, and manage local competitions. |
| Competition Admin /<br>Organizer | Controls one competition. Can manage teams, set rules before lock, create<br>fixtures, confirm/override results where permitted, postpone/cancel fixtures,<br>and publish updates. |
| Club Admin | Controls club actions. Can manage members, issue challenges, confirm<br>matches, request zone changes, and update profile within permissions. |
| Support / Admin Reviewer | Reviews flags, disputes, and queues; escalates cases; can view audit trails and<br>prepare recommendations. |
| Read-only Analyst | Views reports, logs, and analytics but cannot change anything. |

## 9. Config Versioning

Every serious configuration should have versions. Kalaanba must be able to answer what changed, who changed it, why it changed, where it applies, and when it took effect.

| Version Example | Meaning |
| --- | --- |
| RP Standard Match Rule v1: Win +5 / Draw +3 / Loss +2 | Original default RP economy values. |
| RP Standard Match Rule v2: Win +6 / Draw +3 / Loss +1 | Future adjusted values with new effective date. |
| Club Availability v1: Available at 70% squad availability | Original threshold. |
| Club Availability v2: Ready to go at 50% squad<br>availability | Changed threshold and public label. |

<!-- Page 9 -->

## 10. Effective Dates

Some changes can apply immediately. Fairness-sensitive changes should usually apply later so clubs, players, and organizers are not surprised mid-race.

| Change Type | Default Effective Timing |
| --- | --- |
| Label/nomenclature changes | Can apply immediately, because internal keys remain stable. |
| RP values, tier thresholds, award rules | Prefer next season or a clearly announced future date. |
| Competition tiebreakers, points, match<br>rules | Before first confirmed result only, unless admin override is justified. |
| Zone/Area remapping | Prefer between seasons, except serious correction. |
| Season dates, reset rules, cutoff dates | Future season by default. |
| Manual override or dispute ruling | Immediate, but must be reasoned and audit-logged. |

## 11. Dependency Warnings

Before risky changes, admins should see what may be affected. This can start simple and become more advanced later.

| Admin Change | Example Warning |
| --- | --- |
| Ranked Challenge unlock 50 RP -> 30<br>RP | This may make clubs between 30 and 49 RP eligible for ranked<br>challenges, increasing call-out volume and spam risk. |
| Club Available threshold 70% -> 50% | This may reclassify clubs from Limited to Available and affect<br>matchmaking/challenge suggestions. |
| Win RP +5 -> +7 | This may change RP growth speed, tier progression, challenge<br>eligibility, and zone leaderboards. |
| Zone mapping change | This may change club zone rank, zone leaderboard, challenge<br>context, and season archive interpretation. |

## 12. Audit Logs

Every meaningful admin action must be audit-logged. Audit logs protect trust, support dispute review, and explain why records changed.

- Actor and role.

- Action taken.

- Target entity.

- Old value and new value.

- Reason supplied by admin.

- Timestamp.

- IP/device/session where useful.

- Approval chain.

- Affected systems.

- Rollback or correction reference.

<!-- Page 10 -->

Examples: Super Admin changed ranked challenge unlock from 50 RP to 40 RP. Hub Admin moved Taha Area from East Zone to North-East Belt. Admin confirmed two clubs as related. Organizer overrode a result with reason and evidence.

## 13. Approval Levels

| Risk Level | Examples | Governance Requirement |
| --- | --- | --- |
| Low | Label changes, UI copy, template descriptions, typo<br>corrections. | Can apply immediately by<br>authorized admin. |
| Medium | Availability thresholds, dormant threshold, notification<br>windows, ghost expiry duration. | Require admin confirmation<br>and audit log. |
| High | RP values, challenge stake rules, tier thresholds, season<br>dates, zone remaps, manual RP adjustment,<br>related-club confirmation, verification removal. | Require senior/admin<br>approval and effective-date<br>handling. |
| Critical | Season reset, mass RP recalculation, global rule<br>migration, bulk zone remap, major club merge/delete,<br>payment-related rule changes. | Require super admin and<br>possibly dual approval. |

## 14. Manual Overrides

Humans will sometimes need to override system outcomes. Overrides must fix records without silently rewriting history.

- Must require a reason.

- Must be audit-logged.

- Must show affected records.

- Must not silently delete history.

- Should use compensating entries where possible instead of editing old records.

Example: If an RP transaction was wrong, keep the old transaction and add an admin_adjustment transaction that corrects the balance. This keeps the story complete.

## 15. Conceptual Config Data Model

The exact database design will come later, but the concept should support keys, scopes, values, versions, effective dates, approval, and auditability.

| Field | Meaning |
| --- | --- |
| config_key | Stable internal key such as rp.standard.win or<br>club.availability.available_threshold. |
| scope_type / scope_id | Platform, season, hub, zone, competition, club, player, venue, or other<br>entity. |
| value / data_type | Stored value and its type: number, percentage, string, boolean, JSON,<br>date, enum, etc. |
| version / status | Version number and state such as draft, active, scheduled, retired,<br>rolled_back. |
| effective_from / effective_to | When the setting starts and stops applying. |
| created_by / approved_by | Who created and approved the change. |

<!-- Page 11 -->

| Field | Meaning |
| --- | --- |
| reason / metadata | Explanation, dependency info, rule IDs, or admin notes. |

## 16. Presets

Presets make configuration easier for admins and organizers. They are bundles of values that can be applied and then customized.

| Preset Type | Examples |
| --- | --- |
| Competition templates | Standard community league, Weekend knockout cup, Informal 5-a-side,<br>School competition, Start from scratch. |
| Match duration presets | 2 x 45, 2 x 35, 2 x 30, 2 x 25, 2 x 20. |
| RP economy presets | Conservative RP economy, Balanced RP economy, Fast-growth RP economy. |
| Availability presets | Strict availability, Balanced availability, Relaxed availability. |
| Governance presets | Light verification, Standard verification, Strict paid-organizer verification. |

## 17. Engine Integrations

| Engine/System | What It Reads From Admin Config / Governance |
| --- | --- |
| RP Economy Engine | RP values, thresholds, stake rules, penalties, anti-farming windows, tier<br>boundaries. |
| Season Engine | Season dates, cutoffs, closing windows, archive windows, reset rules. |
| Club Engine | Status thresholds, labels, verification requirements, related-club review<br>outcomes. |
| Player / Affiliation Engine | Ghost expiry, photo requirements, privacy defaults, availability labels,<br>transfer windows. |
| Match / Fixture Engine | Duration presets, walkover score, confirmation windows, allowed<br>abandonment rulings. |
| Competition / Rules Engine | Templates, points presets, tiebreakers, rule-lock behavior, registration<br>defaults. |
| Zone Engine | Hub zone count, area mapping approvals, zone score weights, label rules. |
| Challenge Engine | Response windows, counter limits, challenge thresholds, open call-out<br>windows. |
| Notification Engine | Frequency limits, opt-out defaults, message labels, fallback behavior. |
| Trust & Verification Engine | Verification thresholds, dispute windows, evidence requirements,<br>confidence rules. |

## 18. V1 Scope

V1 should not expose every possible setting. The architecture should be ready for broad configuration, but the admin UI should begin with essentials.

<!-- Page 12 -->

| Include in V1 | Defer / Later |
| --- | --- |
| Config registry, super admin role, basic admin settings<br>page, RP values/thresholds, season dates/cutoffs,<br>challenge windows, club inactivity/dormant<br>thresholds, ghost claim expiry, match duration<br>presets, walkover default score, competition<br>templates, audit logs, manual config versioning. | Complex dependency graphs, dual approval workflow,<br>advanced rollback UI, per-hub overrides at scale,<br>config simulation, bulk migration tools, advanced<br>admin analytics. |

## 19. Admin Dashboard Sections

- Platform Settings.

- Season Settings.

- RP Economy.

- Challenge Rules.

- Club Rules.

- Player Rules.

- Match & Fixture Rules.

- Competition Templates.

- Zone & Area Governance.

- Verification Queue.

- Dispute Queue.

- Related Club Review.

- Audit Logs.

- System Health.

## 20. Pushbacks and Cautions

- Not everything should be editable on day one. Build a config registry first, then expose settings gradually.

- Config changes can break fairness, so effective dates are critical.

- Labels and internal values must stay separate.

- Admin overrides should not rewrite history. Use adjustment records and audit trails.

- Per-hub customization is powerful but dangerous. Start with platform defaults first.

- A highly configurable system needs strong tests so configuration changes do not silently break engines.

## 21. Locked Direction

Kalaanba needs an Admin Configuration & Governance Engine as the platform control room. All numerical values, thresholds, percentages, labels, windows, caps, weights, penalties, durations, and configurable nomenclature should be stored in a versioned configuration system. Business engines read from configuration; they do not hardcode values. Internal keys remain stable while user-facing labels can change. Configuration changes are scoped, versioned, audit-logged, and can have effective dates. High-risk changes require stronger admin permissions and may require approval. Governance workflows handle verification, zone mapping, related-club flags, disputes, manual overrides, merges, suspensions, and admin rulings. V1 exposes core settings first while the backend architecture supports broader

<!-- Page 13 -->

configuration later.

## 22. Recommended Next Engine

Recommended next engine: Trust & Verification Engine. Reason: verified matches, disputes, evidence, referee authority, result confidence, stat confirmation, no-shows, walkovers, awards, RP, standings, player records, season archives, and admin rulings all depend on whether a record is trusted enough to become official.
