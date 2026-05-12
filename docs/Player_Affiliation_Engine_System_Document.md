<!-- Converted from Player_Affiliation_Engine_System_Document.pdf -->

# Kalaanba Player / Affiliation Engine System Document

Locked product direction for player identity, ghost players, free agents, club affiliations, transfers, competition exclusivity, verified stats, player media, availability intelligence, shareable cards, and platform-wide configurability.

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary actor | Player |
| Relationship layer | Affiliation between player, club, team, and competition |
| Key principle | Only verified stats appear publicly. Claimed stats are shelved for now. |
| Public cards | Claimed player profiles/cards are public by default, with sensitive information protected. |
| Ghost players | Ghost records are private/internal and do not appear publicly. Claim link expires after 3 days. |
| Configuration rule | All values, labels, thresholds, windows, percentages, weights, and nomenclature must be<br>configurable by super admin. |
| Recommended next engine | Trust & Verification Engine or Player Card Engine, depending on build priority. |

## 1. Purpose of the Player / Affiliation Engine

The Player / Affiliation Engine defines who a player is, how that player connects to clubs and competitions, and how verified match activity becomes a permanent football record. It protects player identity while still supporting grassroots realities such as ghost players, multi-club participation, free agents, nicknames, changing squad numbers, and public player cards. In simple terms: the Player Engine owns the person and the football profile. The Affiliation Engine owns the relationship between that player, a club, a team, a competition, and a season.

## 2. Core Definitions

| Term | Meaning |
| --- | --- |
| Player | An individual football participant with a persistent identity across clubs, seasons, competitions,<br>and match records. |
| Affiliation | The relationship between a player and a club or team, such as active, invited, trialist, on loan,<br>released, or banned. |
| Competition registration | The player's locked participation in a specific competition for one team/club. A player may have<br>multiple club affiliations but only one team registration inside a competition. |
| Ghost player | A temporary private/internal player record created by a manager using name and phone before<br>the player claims the profile. |
| Claimed player | A player who has verified their phone/account and controls their profile. |
| Free agent | A claimed player profile not currently attached to a club, or openly available to be invited. |

## 3. Player Name Structure

Every player should have a structured name model so Kalaanba can display identity appropriately across formal records, match graphics, lineups, cards, notifications, and admin views.

| Field | Meaning | Usage |
| --- | --- | --- |
| First name | Player's given name. | Formal registration, admin, search, legal/trust contexts. |

<!-- Page 2 -->

| Field | Meaning | Usage |
| --- | --- | --- |
| Last name | Player's family/surname. | Formal registration, admin, search, legal/trust contexts. |
| Stage / jersey name | Nickname, football name, shirt name,<br>or name the football community knows<br>the player by. | Player cards, lineups, goal alerts, public match graphics,<br>fan-facing copy. |
| Preferred number | Player's preferred shirt number across<br>their football identity. | Profile, player card, free agent listing, preference display. |
| Assigned squad<br>number | Number assigned by a specific<br>club/team/competition/fixture. | Lineups, matchday records, competition squads. This can<br>differ from preferred number. |

Example: First name: Abdul. Last name: Rahman. Stage/Jersey name: Kaka. Preferred number: 10. Assigned number for a specific competition: 17. Display rule: use the most suitable name for the context. Formal pages can use first + last name. Player cards and goal alerts can lead with stage/jersey name. Admin and verification views should always retain full name.

## 4. Player Identity States

| State | Meaning | Public visibility |
| --- | --- | --- |
| Ghost | Created by a manager with name and phone. Not claimed by<br>the player yet. | Private/internal only. Not public. |
| Claimed | Player has verified account/phone and controls the profile. | Public by default, with privacy<br>controls. |
| Active | Player has at least one active club affiliation. | Visible according to club/player<br>settings. |
| Free agent | Player is not currently attached to a club or is open to invitations. | Public by default unless hidden. |
| Minor-protected | Player is under a minor-protection/privacy rule. | Restricted visibility. Sensitive<br>fields hidden. |

Internally, claim status and football market status should be separate. A player can be claimed and free agent at the same time. A ghost player cannot be public-facing.

## 5. Ghost Player Rules

Ghost players exist to reduce onboarding friction. Managers can add players quickly, and the player later claims the profile through SMS/WhatsApp link. However, ghost players must not pollute public player records.

- Managers can create ghost players with name and phone only.

- The claimed player fills out full profile information after claiming.

- Ghost claim link expires after 3 days by default.

- Ghost players do not appear on public player cards, discovery pages, public profiles, or public player listings.

- Ghost players may be visible privately to club admins/team mates where needed for team management.

- If the ghost record has no dependencies after expiry, it can be cleaned up.

- If attached to squads, fixtures, match records, or competitions, it should be retained as expired ghost data until resolved.

- Ghost records should have audit history: created by, phone used, club/team context, expiry time, and claim status.

Locked wording: ghost player records are operational placeholders, not public player identities.

## 6. Player Profile Fields

### V1 fields

<!-- Page 3 -->

- First name

- Last name

- Stage / jersey name

- Phone number

- Preferred number

- Primary position

- Basic photo, preferably headshot first

- Availability status

- Primary club or free agent status

### Later / enriched fields

- Nickname variations and searchable aliases

- Date of birth, where required by competition rules

- Strong foot and weak foot

- Secondary positions

- Style tags

- Physical tags

- Bio

- Jersey preference

- Boot color

- Social links if allowed

- Player media set: headshot, half-body/portrait, full-body, action shot, celebration image

## 7. Player Photos and Media Requirements

Players should eventually upload multiple image types because a single photo cannot serve every design surface. V1 can require one clear image first, but the data model should support all types from the start.

| Image type | Purpose | Examples of use |
| --- | --- | --- |
| Headshot | Clear face photo, usually cropped tight. | Small avatars, lineups, team sheets, goal scorer<br>cards, notifications, public profile thumbnail. |
| Half-body / portrait | Waist-up or chest-up player image. | Player card front, profile hero, player of the match,<br>roster cards, matchweek graphics. |
| Full-body | Standing full player image. | Special cards, player spotlights, posters, comparison<br>graphics, scouting-style profile. |
| Action shot later | Player in motion during a match or training. | Articles, social content, highlight cards, fan-facing<br>stories. |
| Celebration photo later | Emotional or celebratory image. | Special cards, milestone posts, social sharing. |

V1 recommendation: require or strongly request a headshot first. Encourage half-body and full-body photos for better cards. Do not block basic onboarding because a player lacks all three images.

## 8. Player / Club Affiliation

A player can belong to multiple clubs at once because grassroots football is flexible. A player may play with a community club, a workplace team, a school group, or a weekend team at the same time. Competition registration is different: inside one competition, a player can represent only one team.

<!-- Page 4 -->

| Affiliation state | Meaning |
| --- | --- |
| Invited | Club invited player; player has not accepted. |
| Requested | Player requested to join club; club has not accepted. |
| Active | Player is currently part of the club. |
| Inactive | Still attached but not currently active. |
| Trialist | Player is being tested or temporarily involved. |
| On Loan | Temporary affiliation with another club under agreed terms. |
| Released | Club/player relationship has ended. |
| Banned | Player is blocked from that club/competition context. |
| Declined / Removed | Invitation declined or relationship removed. |

## 9. Multi-club Affiliation and Competition Exclusivity

Locked rule: multi-club affiliation is allowed, but competition registration is exclusive per competition. Example: A player can be affiliated with Aboabo United and Sunday Stars, but inside Tamale Weekend League 2026, that player can only represent one registered team. The Competition and Rules Engine can define transfer windows, eligibility deadlines, guest player rules, and mid-competition movement restrictions.

## 10. Transfers, Loans, and Movement

- Transfers are light outside competitions and stricter inside competitions.

- Permanent transfers, loans, and free movement should all be supported conceptually.

- Loan workflows should require three-way confirmation later: origin club, destination club, player.

- Before competition registration deadline, movement is generally free unless the competition says otherwise.

- After deadline and during competition, movement follows competition rules and is blocked by default unless a transfer

window is configured.

- All transfer, loan, release, and affiliation records are append-only, timestamped, and permanent.

- No club or player can delete transfer history or rewrite confirmed stats outside dispute/amendment process.

## 11. Player Consent and Club Actions

| Action | Rule |
| --- | --- |
| Manager adds ghost player | Allowed with name + phone. Player claims later. |
| Club invites claimed player | Player can accept or decline. |
| Claimed player added without consent | Player can reject/remove affiliation, except where competition rules temporarily<br>block leaving. |
| Club registers player for competition | Allowed according to competition rules. Higher-trust competitions can require<br>player confirmation. |
| Player leaves club | Allowed unless blocked by active competition rules or unresolved obligations. |
| Player disputes stat | Allowed through stat dispute/amendment flow. |

## 12. Player Availability and Club Availability Intelligence

<!-- Page 5 -->

Player availability should feed club availability. This turns individual player signals into useful club-level readiness data for match-making, challenges, fixture planning, and opponent confidence.

| Player availability | Meaning |
| --- | --- |
| Available | Player can play. |
| Limited | Player may play with notice or under constraints. |
| Unavailable | Player cannot play. |
| Unknown | No recent response or data. |
| Injured / exams / work / travel later | Specific unavailability reasons for richer planning. |

Example inference: 16 of 21 players are available. Club readiness could display: Strong / Available. If most players identify as casual or weekend players, the club can show a matching activeness summary. Default availability thresholds are configurable. Example: Available at 70%+ of squad available, Limited at 40-69%, Unavailable below 40%. Super admin must be able to change 70% to 50%, change labels like Available to Ready to Go, and adjust dependencies without code changes.

## 13. Verified Stats Only

Locked rule: Kalaanba works with only stats it can confirm. Claimed stats are shelved for now. Official public player stats must come only from confirmed match records. The Match / Fixture Engine already gates downstream updates behind result_confirmed = true. Player Engine must respect that gate.

- Verified stats can include appearances, starts, minutes, goals, assists, yellow cards, red cards, position played, shirt

number, player of the match, clean sheets later, penalties later.

- Stats entered live remain provisional until match result and events are confirmed.

- Stat disputes must go through a review/amendment process with audit trail.

- No claimed stats should appear in official player cards or profile totals for now.

## 14. Player Ratings and Card Confidence

V1 should not use serious numeric player ratings yet. Ratings can become unfair without enough event context, minutes, positions, role, opposition strength, and defensive contributions. Instead, V1 should use verified stats, card tiers, badges, and confidence labels.

| Concept | V1 direction |
| --- | --- |
| Numeric rating | Do not make this central in V1. Prepare data model for later. |
| Card confidence | Use labels like Provisional, Growing, Verified based on verified match count. |
| Card tiers | Use simple tiers or visual levels based on verified appearances and achievements. |
| Performance index later | Can use arithmetic from appearances, goals, assists, awards, cards, minutes, and match<br>results. Should be configurable. |

## 15. Player Card

A basic shareable player card should be part of V1 because it creates pride, distribution, and player acquisition. Player cards should be public by default after the player claims the profile, but sensitive personal information must never be public.

- Player card should use stage/jersey name prominently and full name in smaller text where appropriate.

- Card can show preferred number, primary position, club badge, photo, verified appearances, goals, assists, and badges.

- Ghost players do not get public player cards.

- Player card must clearly distinguish verified data from any future non-verified claims if such features are ever added.

<!-- Page 6 -->

- Cards should support static share images for WhatsApp and a live URL that stays current.

## 16. Public Profile and Privacy

Player profiles/cards are public by default once claimed. Sensitive information remains private. Minor-related privacy rules must be handled carefully before launch.

| Data | Public? |
| --- | --- |
| Stage/jersey name | Yes |
| First and last name | Yes by default, configurable/privacy-controlled later. |
| Phone number | Never public. |
| DOB | Hidden by default; used only where competition eligibility requires. |
| Photos | Public if player uploads/approves, with minor restrictions later. |
| Verified stats | Public by default. |
| Club affiliations | Public where player/club/competition settings allow. |
| Ghost records | Not public. |

## 17. Player Identity Integrity

Player identity integrity matters because the long-term value of Kalaanba is trusted football records. V1 can use phone number as the strongest anchor, but the architecture should support future duplicate detection and safety checks.

- Phone number + OTP is primary V1 identity anchor.

- Ghost-to-claimed linking uses phone number match.

- Duplicate detection can use phone, name similarity, DOB, club history, photo similarity later, and same manager-created

records.

- Phone number recycling and account takeover must be handled later under security/legal planning.

- All identity merges, corrections, and dispute resolutions should be audited.

## 18. Loyalty Mechanics and Player Legacy

The Affiliation Engine should eventually support player loyalty and legacy mechanics. These should be data-driven, not manually invented.

| Mechanic | Definition direction |
| --- | --- |
| Founding member | Player affiliated with club at creation or within first eligible setup period. Permanent badge. |
| Loyalty badge | Player active with a club for 2+ seasons, configurable. |
| Club legend | Auto-assigned by verified appearance milestones or most appearances for club. |
| Special achievements | Hat-trick, Player of the Match, Champion, Top Scorer, Challenge King, Inter-zone Warrior, etc. |

## 19. Platform-wide Configurability Rule

This rule applies to all engines, not only Player/Affiliation. Kalaanba must be architected so super admins can configure values, labels, thresholds, windows, percentages, weights, caps, penalties, nomenclature, and dependencies without changing code. Examples: if club availability currently means 70% of squad available, a super admin should be able to change it to 50%. If the label Available should become Ready to Go, that should be configurable. If the ghost expiry window should change from 3 days to 5 days, that should be configurable. If player card confidence requires 5 verified matches today and 8 later, that should be configurable.

<!-- Page 7 -->

Architecture implication: engines should read from configuration records or rule profiles, not hardcoded constants. Configuration changes should be versioned, permissioned, and audit-logged because changing a threshold can affect rankings, eligibility, player cards, club readiness, and public labels.

## 20. Engine Outputs

- getPlayerProfile(playerId)

- getPublicPlayerProfile(playerId)

- getPlayerCardData(playerId)

- getPlayerAffiliations(playerId)

- getClubRoster(clubId)

- getCompetitionRegistrationEligibility(playerId, competitionId)

- getPlayerVerifiedStats(playerId, filters)

- getPlayerAvailability(playerId)

- getClubAvailabilitySummary(clubId)

- getGhostPlayerStatus(ghostId)

- getDuplicatePlayerFlags(filters)

- getPlayerVersionHistory(playerId)

## 21. Related Engines and Dependencies

| Engine/System | How it connects |
| --- | --- |
| Club Engine | Manages clubs, roles, rosters, related club contexts, club availability summaries. |
| Match / Fixture Engine | Provides confirmed match records, lineups, matchday positions, shirt numbers, goals,<br>assists, cards, minutes. |
| Competition / Rules Engine | Controls player eligibility, squad registration, transfer windows, and<br>one-team-per-competition rule. |
| Season Engine | Provides seasonal context for appearances, loyalty, awards, archives, and card<br>confidence. |
| RP Economy Engine | RP is club-based for now. Player activity may influence club RP through matches, but<br>players do not hold/spend RP. |
| Challenge Engine | Can create special achievements and challenge-related player badges later. |
| Trust & Verification Engine | Owns stat disputes, verification confidence, duplicate detection, identity confidence, and<br>evidence. |
| Player Card Engine | Consumes verified stats, profile data, media, badges, confidence labels, and club<br>identity. |
| Notifications Engine | Sends ghost claim links, invitations, registration notices, transfer requests, lineup calls,<br>and profile alerts. |
| Admin Governance Engine | Reviews duplicates, identity disputes, minors/privacy, merges, and special corrections. |

## 22. V1 Scope

- Ghost player creation with name + phone.

- 3-day ghost claim link expiry, configurable.

- Claimed player profiles.

- Free agent player profile creation.

<!-- Page 8 -->

- First name, last name, stage/jersey name, preferred number.

- Basic player photo support, with data model ready for headshot, portrait, and full-body.

- Club affiliation, invite/request join, and primary club.

- Multi-club affiliation.

- One team per competition registration.

- Basic squad numbers, positions, and lineups.

- Verified stats from confirmed matches only.

- Appearances, goals, assists, cards, positions, and shirt number per fixture.

- Stat dispute request flow.

- Player availability feeding club availability summary.

- Basic shareable player card.

- Privacy defaults and sensitive-data protection.

- Append-only affiliation and transfer history.

## 23. Deferred / Later

- Full transfer marketplace.

- Advanced loan workflows with three-way confirmation.

- Deep numeric player ratings.

- Advanced player card tiers and special cards.

- Scouting marketplace.

- Photo similarity duplicate detection.

- Complex eligibility automation.

- Parental consent automation.

- Training attendance and player development tracking.

- Advanced availability calendar.

- Public claimed-stat sections, if ever needed, separated from verified stats.

## 24. Configurable Defaults

| Default | Current value |
| --- | --- |
| Ghost claim link expiry | 3 days |
| Ghost public visibility | Never public |
| Player profile visibility | Public by default after claim |
| Phone visibility | Never public |
| Preferred number | Profile-level preference, can differ from assigned number |
| Competition player exclusivity | One team per competition |
| Verified stats policy | Only confirmed stats appear publicly |
| Numeric rating in V1 | No serious numeric rating in V1 |
| Minimum photo requirement | Headshot first; portrait and full-body encouraged |
| Availability threshold example | 70% available = Available/Ready, configurable |
| Label/nomenclature config | Super admin configurable |

<!-- Page 9 -->

## 25. Locked Summary

Kalaanba treats players as persistent football identities with first name, last name, stage/jersey name, and preferred number. Managers can create ghost players using only name and phone, but ghost records are private/internal and public player cards only appear after claim. Ghost claim links expire after 3 days by default; unused ghosts can be cleaned up, while dependent ghost records are retained safely. Players can create free agent profiles, belong to multiple clubs, and represent only one team per competition. Transfers are light outside competitions and governed by competition rules inside competitions. Only verified stats from confirmed matches appear publicly. Player profiles/cards are public by default after claim, with sensitive data protected. Player availability can feed club availability intelligence. Serious numeric ratings are deferred; V1 should use verified stats, card tiers, badges, and confidence labels. Every value, threshold, label, percentage, window, and dependency should be configurable by super admin and audit-logged.

## 26. Recommended Next Engine

Recommended next engine: Trust & Verification Engine. Reason: the Player/Affiliation Engine depends on trusted identity, verified stats, stat disputes, ghost-to-claimed linking, duplicate detection, result confidence, and evidence handling. The Trust Engine will also support RP eligibility, match verification, challenge resolution, club verification, and competition integrity.
