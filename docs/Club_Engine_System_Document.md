<!-- Converted from Club_Engine_System_Document.pdf -->

# Kalaanba Club Engine / System Document

Locked product direction for club identity, onboarding, roles, verification, maturity, location, season participation, RP eligibility, related-club integrity, and historical records.

| Status | Locked direction / pre-architecture planning |
| --- | --- |
| Primary actor | Club |
| Key principle | A club is a shared football identity, formal or informal. |
| Public trust badge | Show one simple public badge: Verified Club |
| Internal trust detail | Store verification source and maturity level internally |
| V1 stance | Simple informal onboarding; relaxed rules; preserve<br>records |
| Recommended next engine | Fixture / Match Engine |

## 1. Purpose of the Club Engine

The Club Engine defines what a club is on Kalaanba and what that club is allowed to do. It is the identity and eligibility layer for grassroots football groups: who controls them, where they belong, whether they are active, whether they can earn RP, whether they can issue challenges, and what history must never be lost. In simple terms: the Club Engine answers who this club is, who represents it, where it plays from, what level of trust it has, and what actions it can take inside Kalaanba.

## 2. Club Definition

A Kalaanba Club is any group of people who play together under a shared football identity. It can be a casual neighbourhood crew, a friend group, a school team, a church or mosque team, an academy, a workplace team, a facility-based team, or a registered sports club. The system must not assume every club has registration documents, an office, formal board members, or a permanent home ground. The Club Engine should support the way grassroots football already works, then gradually improve structure through verification, roles, history, and trust.

## 3. Supported Club Types

Kalaanba should support multiple club types. A club may have one primary type and optional tags later.

| Club Type | Meaning / Example |
| --- | --- |
| Community club | Area-based team or local football group. |
| Informal / friend crew | Group of friends or neighbourhood boys playing under<br>a shared name. |
| School club | School team, class team, alumni team, or campus<br>football group. |
| Academy | Training/development club with youth or structured<br>squads. |
| Corporate / workplace team | Company, office, or professional group team. |

<!-- Page 2 -->

| Church / mosque team | Religious community team. |
| --- | --- |
| Institution team | University, association, NGO, department, or organized<br>institution. |
| Facility-based team | Team operating from or connected to a venue/facility. |
| Registered sports club | Formal club with documents or official recognition. |

## 4. Club Maturity Levels

Formal and informal should not be a permanent binary. A club can grow without losing history.

| Level | Meaning | Typical Privileges |
| --- | --- | --- |
| Informal | Quick-start group with minimum<br>setup. | Basic play, members, fixtures,<br>records. |
| Structured | Profile, members, location, and roles<br>are reasonably complete. | Better discovery and readiness for<br>verification. |
| Verified | Admins/owners are reachable and<br>track record is trusted. | Trusted public badge; higher-trust<br>actions. |
| Registered / Official | Documents or institutional backing<br>exist. | Stored internally as verification<br>source; may unlock formal contexts. |
| Locked public badge rule<br>Public UI should show one simple badge: Verified Club. Internally, store the maturity level and the<br>verification source: platform_history, documents, or admin_fast_track. |  |  |

## 5. V1 Club Creation Flow

V1 informal entry should stay simple and relaxed. The goal is to feel as easy as creating a WhatsApp group.

| # | Step | V1 Direction |
| --- | --- | --- |
| 1 | Club name | Required. Keep it simple. |
| 2 | City Hub | Select the broader football home, e.g.<br>Tamale City Hub. |
| 3 | Area | Select actual locality/community.<br>System maps Area to Zone/Belt. |
| 4 | Contact/admin phone | Primary reachable contact. |
| 5 | Optional co-founder | Useful for informal clubs; co-<br>founder removal needs safeguards. |
| 6 | Optional colors/logo | Allow later completion. Version<br>changes internally. |
| 7 | Invite members | Phone-based invites; ghost members<br>can be linked later. |

## 6. Location and Activity Footprint

The original activity-area map idea remains useful, but it should identify where a club usually operates rather than force an official boundary choice.

- V1: Choose City Hub, choose Area, optional location pin, optional preferred home venue.

- Later: Primary Area, usual play area, training ground, preferred home venue, activity radius.

<!-- Page 3 -->

- Identity location and match venue can be different. A club may represent Taha but play official games

at an AstroTurf in another Zone/Belt.

### Map selection principle

Use the map to understand the club activity footprint. Do not make complex polygon clicking mandatory in V1, especially for users on weak internet or cheap phones.

## 7. Club Roles and Permissions

| Role | Default permissions |
| --- | --- |
| Owner | Full control; transfer ownership; request zone/area<br>changes; opt out of season; archive/merge; approve<br>high-risk actions. |
| Co-founder | Informal club full-admin role. Removal should require<br>mutual or admin confirmation. |
| Admin | Manage operations, members, fixtures, squads,<br>competition registration, and challenges if permitted. |
| Manager | Manage squad, lineups, fixtures, and match logistics. |
| Captain | Confirm availability, represent team on matchday,<br>confirm results where allowed. |
| Scorer | Enter live events, final score, and match reports where<br>allowed. |
| Media Manager | Upload photos, manage club/match media, post updates. |
| Member / Viewer | Member can appear in squads and set availability.<br>Viewer can only view. |
| High-risk permission rule<br>Actions that affect RP, challenges, season participation, zone identity, or ownership require Owner/Admin-<br>level authority and may need admin review. |  |

## 8. Season Participation and RP Relationship

- Every active club automatically joins the Kalaanba season unless it opts out.

- Clubs can register on Kalaanba at any time, but season participation obeys the Season Engine cutoff

rules.

- Club Engine stores participation and opt-out status; RP Engine calculates balances and ledger entries.

- Club profile can display Season RP, Available RP, Locked RP, Lifetime RP, tier, and ranked challenge

status, but the Club Engine does not calculate RP itself.

## 9. Club Verification

A verified club is a club whose admins/owners are reachable, whose identity is complete enough, and whose track record gives Kalaanba confidence to trust it with higher-risk actions. Verification is not only about documents. It can come through phone confirmation, second contact, complete profile, valid Area/Zone mapping, minimum members, verified match history, no unresolved disputes, good reliability, known local reference, or documents where available.

<!-- Page 4 -->

## 10. Formal Upgrade Paths

| Path | Requirements | Typical use |
| --- | --- | --- |
| Document-based | Registration document, institution<br>letter, official contact, second<br>contact, verified phone, official<br>branding. | Schools, academies, corporates,<br>formal clubs. |
| Platform-history | Complete profile, active admins,<br>enough members, verified matches,<br>clean reliability, no unresolved<br>disputes. | Informal clubs becoming serious. |
| Admin fast-track | Known contact, local reference,<br>direct onboarding, manual review. | Pilot clubs and trusted community<br>teams. |

## 11. Profile Changes and Versioning

Club rules should be relaxed enough for grassroots reality, but major identity changes must be versioned internally so history remains clean.

| Field Group | Rule | Examples |
| --- | --- | --- |
| Freely editable | Can change without admin review. | Bio, socials, contact, training days,<br>cover image. |
| Versioned | Can change, but old value is<br>preserved internally. | Name, crest, colors, motto, short<br>name. |
| Admin-reviewed | Requires review or applies between<br>seasons. | Area, Zone/Belt, City Hub, ownership<br>transfer, merge. |
| Formerly display rule<br>Public "formerly..." notices can show for a short period after a major identity change. Default: 90 days. Full<br>version history remains permanent internally. |  |  |

## 12. Inactive and Dormant Clubs

| State | Default trigger | Behavior |
| --- | --- | --- |
| Inactive | No meaningful activity for 3 months. | Still visible, but may receive activity<br>nudges. |
| Dormant | No meaningful activity for 6 months. | Can still be challenged; response<br>may be unlikely; can earn RP if they<br>return and play eligible matches. |
| Dormant challenge message<br>This club has been dormant for 6 months. Response may be unlikely. |  |  |

## 13. Related Clubs and Integrity Detection

Related clubs can record verified matches, but those matches do not generate Season RP, cannot be Ranked Challenges, and cannot transfer RP.

- Signals: same owner/admin, same phone, same device pattern, same payment account, overlapping

squad, same manager, same parent organization, same logo/name pattern, repeated matches, or one- way RP movement.

<!-- Page 5 -->

- Detection should be handled by observers, listeners, integrity monitors, scheduled jobs, and admin

review alerts.

- Automatic detection should flag for review first. Confirmed related-club status should be stored and

used by RP and Challenge rules.

## 14. Archive, Merge, and No Data Loss

Club Engine must never destroy historical football data. Use soft delete, archive, merge, rename/version, deactivate, or suspend flows instead of hard deletion.

- Archived clubs retain matches, players, RP history, awards, disputes, and challenge records.

- Merged clubs preserve old identity and link to the surviving club.

- Duplicate clubs should be resolved by careful merge, not deletion.

- All transfer/merge/ownership decisions should be audit logged.

## 15. Club Public Profile

| Version | Fields |
| --- | --- |
| V1 profile | Club name, crest/logo, Area/Zone/City Hub, club type,<br>availability, recent matches, players, basic record, share<br>button. |
| Later profile | Season RP, Lifetime RP, tier, Verified Club badge,<br>challenge record, competition history, preferred venue,<br>badges, former-name notice, public squad, zone rank,<br>hub rank. |

## 16. Club Engine Outputs

The Club Engine should be one source of truth for club identity and eligibility, with flexible outputs for different use cases.

- getClubProfile

- getClubPublicProfile

- getClubEligibility

- getClubRolesAndPermissions

- getClubLocationIdentity

- getClubMaturityStatus

- getClubVerificationStatus

- getRelatedClubFlags

- getClubVersionHistory

- getClubSeasonParticipationStatus

- getClubArchiveMergeStatus

## 17. Related Engines and Dependencies

| Engine/System | How Club Engine connects |
| --- | --- |
| Zone Engine | Maps club Area to Zone/Belt and supports club location |

<!-- Page 6 -->

|  | identity. |
| --- | --- |
| Season Engine | Determines participation cutoff, opt-out, active season<br>eligibility, and archive timing. |
| RP Economy Engine | Consumes club eligibility and related-club status;<br>calculates Season RP, Locked RP, Lifetime RP. |
| Challenge Engine | Uses club permissions, status, RP eligibility, related-club<br>rules, and dormant warnings. |
| Fixture / Match Engine | Connects clubs to matches, results, squads, and<br>verification. |
| Player / Affiliation Engine | Manages player membership, ghost players, transfers,<br>loans, and squads. |
| Trust & Verification Engine | Determines whether a club is trusted enough for higher-<br>risk actions. |
| Admin Governance Engine | Reviews zone changes, verification, related-club flags,<br>merges, and disputes. |
| Notifications Engine | Sends member invites, role changes, challenge alerts,<br>and club updates. |

## 18. Configurable Defaults

As with the other engines, any value, threshold, time window, limit, or rule weight should be configurable from admin settings later.

| Default | Current value |
| --- | --- |
| Inactive threshold | 3 months without meaningful activity |
| Dormant threshold | 6 months without meaningful activity |
| Formerly notice window | 90 days |
| Informal onboarding | Minimal required fields |
| Public verification badge | Verified Club |
| Map pin | Optional in V1 |

## 19. Locked Summary

Kalaanba treats a club as any shared football identity, formal or informal. V1 onboarding should be light, especially for informal clubs. Clubs choose City Hub and Area, while Kalaanba maps Area to Zone/Belt. The system supports multiple club types, maturity levels, roles, verification paths, and versioned identity changes. Publicly, users see one Verified Club badge; internally, Kalaanba stores maturity level and verification source. Dormant clubs can still be challenged, but the system should warn that response may be unlikely. Related clubs may record verified matches but cannot generate RP, issue Ranked Challenges against each other, or transfer RP. No club history should ever be lost; archive, merge, and versioning are preferred over deletion.

## 20. Recommended Next Engine

Recommended next engine: Fixture / Match Engine. Reason: Clubs, RP, Seasons, Zones, Challenges, and Trust all depend on the match record. The Match Engine defines what a match is, what states it can pass through, how it links to clubs, teams, venues, competitions, seasons, verification, RP eligibility, and player stats. It is the best next foundation before going deeper into Trust, Awards, Venue, or Player Engines.
