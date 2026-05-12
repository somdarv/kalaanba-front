<!-- Converted from Fan_Buzz_Feed_Discovery_Engine_System_Document.pdf -->

# Kalaanba Fan Buzz, Feed & Discovery Engine

System Document

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Fan Buzz, Feed & Discovery Engine |
| Core principle | Results drive respect. Buzz drives visibility. |
| V1 stance | Fan reactions, shares, tracking, prediction activity, public feeds, discovery cards, buzz badges,<br>homepage rotation, and soft-follow behavior should be functional from V1. |
| RP stance | Fan Buzz must never mint RP, transfer RP, settle challenges, verify matches, or affect official<br>football truth. |
| Product stance | This engine is not only a score calculator. It requires dedicated UI components, button types, feed<br>surfaces, discovery flows, and admin visibility controls. |

Final principle: Kalaanba should feel like a living grassroots football world, not a quiet fixture database. Existing engine documents already establish the need for this system. The Season Engine defines Fan Buzz as season-aware and competition-aware, affecting visibility, homepage rotation, storytelling, and awards without creating RP. The Challenge and RP Economy directions also keep the key boundary: Buzz drives visibility, but results drive respect.

<!-- Page 2 -->

## Document Map

- Purpose

- Why This Engine Matters

- Core Philosophy

- What This Engine Owns

- What This Engine Does Not Own

- Core Definitions

- Fan Buzz Contexts

- Fan Actions and Buzz Inputs

- Buzz Scoring Direction

- Buzz Decay and Freshness

- Feed and Discovery Surfaces

- Dedicated UI Components

- Button Types

- Card Types

- Key Product Flows

- Follow, Track, and Soft-Follow Logic

- Prediction Integration

- Shareable Cards and Public Distribution

- Public, Private, and Restricted Visibility

- Moderation and Safety Guardrails

- Admin Visibility Controls

- Anti-Manipulation Rules

- Conceptual Data Model

- Engine Outputs

- Affected Engines and Required Changes

- Configurable Defaults

- Alpha, V1, and Deferred Scope

- Product Guardrails

- Locked Summary

## 1. Purpose

The Fan Buzz, Feed & Discovery Engine is Kalaanba's attention and discovery layer. It measures fan interaction around matches, challenges, clubs, players, venues, competitions, zones, and public football moments, then uses that attention to decide what appears across feeds, homepage sections, discovery pages, public cards, and storytelling surfaces.

<!-- Page 3 -->

In simple terms, this engine answers: what is hot right now, what should people see first, which match is gaining attention, which challenge is becoming public drama, which club is trending in a hub or zone, which venue is active, which competition deserves visibility, and which fan actions should create follow or soft-follow behavior. This engine exists because Kalaanba is not only a record system. It is also a public football world. The platform needs a way to surface the action that people care about without corrupting the official football economy.

## 2. Why This Engine Matters

Without this engine, Kalaanba becomes functional but quiet. Clubs may create fixtures, submit results, issue challenges, and book venues, but users may not feel the pulse of grassroots football. With this engine, Kalaanba can show hot challenges, upcoming matches people are tracking, fixtures in a user's city hub, clubs gaining attention, active zones and belts, popular venues, public competition updates, player moments, prediction windows, rivalry stories, and season highlights. This is one of the strongest retention systems in the product. A user may join Kalaanba to create a club or book a venue, but they return because something is happening.

## 3. Core Philosophy

Kalaanba should treat attention as useful, but not as truth. A match can be hot before it is played. A challenge can trend before it is settled. A club can gain visibility from fan activity. A venue can become popular because many fixtures happen there. A player moment can spread after a verified performance. But Buzz must not make anything official. Buzz does not prove a result, award RP, move challenge stakes, update standings, confirm player stats, or decide disputes. Product line: Buzz drives visibility. Results drive respect.

## 4. What This Engine Owns

The Fan Buzz, Feed & Discovery Engine owns the attention layer of Kalaanba.

- Fan reactions, shares, views, tracking actions, manual follows, soft-follow signals, and prediction participation.

- Feed ranking, homepage rotation, trending sections, buzz badges, discovery cards, public content eligibility, and

public/private visibility treatment.

- Buzz decay, boost and suppress controls, anti-manipulation checks, fan-interest profiles, public discovery outputs,

season buzz snapshots, and zone/hub buzz summaries.

- Fan-facing product components that allow users to interact with public football activity.

<!-- Page 4 -->

## 5. What This Engine Does Not Own

| Does not own | Owner |
| --- | --- |
| Match truth, verification, disputes | Trust & Verification Engine |
| Fixture lifecycle | Match / Fixture Engine |
| RP minting, transfer, locking, penalty | RP Economy Engine |
| Challenge lifecycle and RP stake rules | Challenge Engine |
| Competition rules, points, standings | Competition & Rules Engine |
| Player identity and official stats | Player / Affiliation Engine |
| Club identity and permissions | Club Engine |
| Venue booking and availability | Venue, Surface & Booking Engine |
| Notifications and delivery | Notification & Distribution Engine |
| Referee assignment and reports | Referee & Officiator Engine |
| Admin rule configuration | Admin Configuration & Governance Engine |
| Abuse, slurs, threats, unsafe public content | Moderation / Safety Engine |
| Official awards calculation | Awards Engine later |

The engine can consume outputs from all of these systems, but it must not silently replace their decisions.

## 6. Core Definitions

| Term | Meaning |
| --- | --- |
| Fan Buzz | A normalized attention score generated from fan interaction and public activity. |
| Feed | A ranked stream of public or relevant football items shown to a user. |
| Discovery | Surfaces that help users find clubs, matches, venues, competitions, players, zones, or<br>challenges. |
| Reaction | A quick fan response to public content. |
| Track | A user's explicit short-term interest in one match, challenge, fixture, or competition moment. |
| Follow | A user's longer-term interest in a club, player, venue, competition, zone, or city hub. |
| Soft follow | A lightweight inferred interest created by repeated interaction without formal following. |
| Buzz context | The scope in which attention is measured, such as season, competition, hub, zone, club,<br>venue, or challenge. |
| Buzz badge | A visible label that communicates attention level, such as Trending or Hot in Tamale. |
| Feed card | A reusable UI card that displays a public object such as a challenge, fixture, club, venue, or<br>player moment. |
| Visibility boost | Admin or system action that increases display priority without affecting RP or official records. |
| Visibility suppression | Admin or system action that reduces or hides a public item from feeds. |
| Buzz decay | The reduction of buzz over time so stale activity does not dominate fresh action. |

## 7. Fan Buzz Contexts

### 7.1 Kalaanba Season Buzz

Measures how hot a match, challenge, club, zone, player moment, or competition is inside the current Kalaanba season. Examples include most buzzed challenge of the season, most followed club this season, highest tracked fixture this season, and most shared result card this season.

<!-- Page 5 -->

### 7.2 Competition Buzz

Measures attention inside a specific league, knockout, tournament, or internal competition. Examples include most watched final, most followed knockout fixture, most shared standings update, and most tracked team in a tournament.

### 7.3 Hub Buzz

Measures what is hot inside a City Hub, such as Hot in Tamale, active clubs in Bolga, trending venues in Kumasi, or public matches near Accra.

### 7.4 Zone / Belt Buzz

Measures attention inside or across zones and belts. Examples include North Zone is active this week, Central Zone has the hottest challenge, or West Zone venue is getting more bookings.

### 7.5 Challenge Buzz

Measures public attention around a challenge using reactions, shares, views, tracking, prediction activity, comment activity later, and response velocity.

### 7.6 Fixture Buzz

Measures attention around a scheduled match or competition fixture using track count, fixture views, shares, team popularity, venue activity, competition importance, prediction activity, and reminder signups.

### 7.7 Club Buzz

Measures public attention around a club. It can use follows, result shares, challenge activity, fixture tracking, public profile views, player card interactions, and fan engagement. Club Buzz is not RP.

### 7.8 Venue Buzz

Measures attention around a venue using public fixtures hosted there, profile views, booking page visits, shares, saved venue actions, and booking activity.

### 7.9 Player Moment Buzz

Measures attention around verified player-related public moments such as hat-trick cards, verified goal scorer cards, player of the match later, player card shares, and top scorer updates later.

## 8. Fan Actions and Buzz Inputs

Fan actions should be simple, football-native, and measurable.

| Fan action | Buzz effect direction | Notes |
| --- | --- | --- |
| View | Low weight | Useful for velocity but easy to manipulate. |
| React | Medium weight | Shows lightweight interest. |
| Share | High weight | Strong signal because it spreads Kalaanba outside the app. |
| Track | High weight | Strong intent to follow one event. |
| Follow | High long-term signal | Stronger for future personalization. |
| Predict | High event signal | Strong engagement near matchday. |
| Comment later | Medium/high | Requires moderation. |
| Repeat visit | Medium | Can create soft-follow. |
| Save venue later | Medium/high | Useful for venue discovery. |
| Click booking | High venue signal | Supports venue discovery and business intent. |

<!-- Page 6 -->

| Fan action | Buzz effect direction | Notes |
| --- | --- | --- |
| Watch live updates later | High fixture signal | Useful for live match feed. |

## 9. Buzz Scoring Direction

The exact formula should remain configurable, but the engine needs a clear conceptual model. Conceptual formula: Buzz Score = weighted fan actions + velocity + contextual importance + freshness - decay - suppression - manipulation risk. Possible inputs include reaction score, share score, track score, prediction score, view velocity, follow strength, comment score later, content freshness, match importance, challenge importance, competition stage, zone rivalry context, club relationship, venue activity, moderation status, admin boost or suppress flag, and anti-manipulation score. Buzz should be normalized. A small local fixture should be able to trend inside its zone without needing the same numbers as a major hub final.

## 10. Buzz Decay and Freshness

Buzz should decay over time. Without decay, old challenges and old results may stay visible too long. Decay should depend on content type.

| Content type | Decay direction |
| --- | --- |
| Challenge issued | Fast early rise, then decay if no response. |
| Challenge accepted | Rises again after acceptance. |
| Prediction window | Strong short-term boost near matchday. |
| Live fixture | Strong real-time priority. |
| Verified result | Short post-match boost. |
| Competition standings | Moderate boost after update. |
| Player moment | Moderate boost, longer if shared. |
| Venue activity | Slower weekly trend. |
| Club profile buzz | Slower rolling trend. |
| Zone buzz | Weekly or seasonal aggregation. |

Buzz should have both short-term hotness and long-term popularity. A club can be hot today and also popular this season. These are not the same.

## 11. Feed and Discovery Surfaces

### 11.1 Home Feed

- hot challenges

- upcoming tracked matches

- followed club updates

- verified results

- popular fixtures nearby

- competition updates

<!-- Page 7 -->

- player moments

- venue suggestions

- zone pulse updates

### 11.2 City Hub Feed

- Hot in Tamale

- upcoming matches in the hub

- trending clubs

- active venues

- most active zones

- latest verified results

- open call-out windows

### 11.3 Zone / Belt Feed

- zone pulse

- top clubs in this zone

- hot challenges involving zone clubs

- public fixtures in this territory

- most active venues in the zone

### 11.4 Challenge Wall

- new call-outs

- hot call-outs

- accepted challenges

- prediction open

- resolved challenges

- upsets and stood-ground results

- inter-zone leader duels

### 11.5 Fixture Discovery

- upcoming public fixtures

- matches near you

- fixtures at popular venues

- competition fixtures

- friendlies open to followers

- tracked matches

### 11.6 Club Discovery

- clubs near you

<!-- Page 8 -->

- trending clubs

- active clubs this week

- verified clubs

- clubs with upcoming fixtures

- clubs in your followed zone

### 11.7 Venue Discovery

- popular venues

- bookable venues

- active venues this week

- venues hosting public fixtures

- venues near you

- venues by pitch type

### 11.8 Competition Discovery

- active competitions

- public leagues

- weekend knockouts

- competitions near you

- standings updated

- finals coming up

### 11.9 Player Moment Feed

- goal scorers

- player cards

- milestones

- hat-tricks later

- top scorers later

- players to watch later

## 12. Dedicated UI Components

This engine needs its own reusable UI kit shared across home, challenge, fixture, club, venue, competition, and player pages.

### 12.x Buzz Badge

Shows attention level. Labels may include Trending, Heating Up, Hot in Tamale, Zone Buzz, Most Watched, Prediction Open, People Are Tracking, Shared Often, Rivalry Alert, Popular Venue, and Active Zone.

<!-- Page 9 -->

### 12.x Heat Meter

A visual indicator of how active something is. Possible levels: Low, Rising, Hot, On Fire, and Peak Buzz. Public users need feeling, not internal math.

### 12.x Engagement Bar

Reusable action row under public content. Default actions: React, Track, Predict, Share, Follow, and Comment later.

### 12.x Reaction Picker

Football-native reaction set. Possible V1 reactions: Fire, Watching, Respect, Shock, Rivalry, and Banter. Banter requires care and moderation.

### 12.x Track Button

For event-level interest. Labels include Track Match, Track Challenge, Track Fixture, Remind Me, and Watch This.

### 12.x Follow Button

For long-term interest in clubs, players, competitions, venues, zones/belts, and city hubs.

### 12.x Prediction Button

For scheduled matches and accepted challenges. Labels include Predict Score, Make Prediction, Who Wins, and Call It.

### 12.x Share Button

Generates or opens shareable output such as fixture, challenge, result, standings, player, venue, zone, or competition cards.

### 12.x Feed Filter Tabs

Examples: For You, Nearby, Trending, Following, Challenges, Fixtures, Venues, Clubs, Competitions, and Zones.

### 12.x Admin Feed Controls

Feature, Boost, Suppress, Hide, Flag, Remove from public feed, Mark sensitive, Require moderation, Pin to hub, Pin to competition, and Pin to zone.

## 13. Button Types

### 13.1 Fan Action Buttons

- React

- Track

- Follow

- Predict

- Share

- Remind Me

- Comment later

- Save Venue later

- View Fixture

<!-- Page 10 -->

- View Challenge

- View Club

- View Venue

- View Competition

- View Player Card

### 13.2 Football Decision Buttons

These may appear inside feeds but are owned by other engines. The Fan Buzz Engine can display these buttons, but it must not own their business logic.

- Accept Challenge

- Counter

- Decline

- Confirm Result

- Dispute

- Book Venue

- Join Competition

- Invite Team

- Submit Lineup

- Assign Referee

- Submit Report

### 13.3 Admin Visibility Buttons

- Boost

- Suppress

- Feature

- Pin

- Unpin

- Hide

- Restore

- Flag for review

- Send to moderation

- Remove from feed

- Mark as sensitive

- Lock public comments later

### 13.4 Share / Distribution Buttons

- Share to WhatsApp

- Copy Link

<!-- Page 11 -->

- Download Card later

- Post Result Card later

- Share Standings

- Share Challenge

- Share Venue

- Share Player Card

## 14. Card Types

| Card type | Content direction |
| --- | --- |
| Challenge Buzz Card | Challenger, respondent, challenge stage, RP on the line if public, venue status if scheduled,<br>prediction status, buzz badge, reaction count, track count, share button, prediction button,<br>view challenge button. |
| Fixture Buzz Card | Clubs, date/time, venue, match type, competition/challenge label, status, track button, share<br>button, buzz badge, public/private indicator. |
| Result Card | Final score, verification status, match type, club badges, scorers if public, venue if public,<br>share button, view match button. Only verified results should be shown as official result<br>cards. |
| Club Discovery Card | Club name, crest, area/zone/city hub, verified badge if any, recent activity, upcoming fixture,<br>Season RP/tier if public, follow button, view club button. |
| Zone Pulse Card | Zone/belt name, city hub, top club, hot challenge, verified matches this week, active clubs,<br>follow territory button. |
| Venue Activity Card | Venue name, area/zone, pitch type, bookable/listed/manual confidence, popular time slots<br>later, upcoming public fixtures, book button if bookable, view venue button. |
| Competition Discovery Card | Competition name, format, status, teams, next fixture, standings/bracket link, follow<br>competition button, share competition button. |
| Player Moment Card | Player photo, stage/jersey name, club, verified moment, match context, player card link,<br>share button. Player moment cards must not use unverified claimed stats. |

## 15. Key Product Flows

### 15.1 Fan Sees a Hot Challenge

User opens app. Homepage shows Hot Challenges in Tamale. User taps challenge card, reacts, tracks the challenge, predicts score when prediction opens, and receives result update after verification. This is the public drama loop.

### 15.2 Fan Discovers Local Football

User selects City Hub, sees active zones, upcoming fixtures, trending clubs, and popular venues, then follows a club or tracks a match. The feed becomes more personalized.

### 15.3 Club Gets Visibility From Activity

Club creates a public fixture. Fans react and share. Buzz increases. Fixture appears in trending section. More users discover the club. Club gains followers.

### 15.4 Challenge Becomes Public Theatre

Challenge is issued. Target club sees it. Fans react and share. Target accepts or counters. Fixture is scheduled. Prediction opens. Result becomes shareable after verification.

<!-- Page 12 -->

### 15.5 Venue Discovery Through Activity

Venue hosts several public fixtures, receives profile views and booking clicks, appears in Active Venues This Week, and more clubs discover and book it.

### 15.6 Competition Public Page Gains Attention

Organizer launches competition. Fixtures and results are shared. Standings update. Fans follow the competition. Competition appears in discovery feed.

## 16. Follow, Track, and Soft-Follow Logic

### 16.1 Follow

Follow is a long-term user interest. Users can follow clubs, players, competitions, venues, zones/belts, and city hubs. Follow affects feed personalization, notification preferences, discovery recommendations, follower count, and public social proof where allowed.

### 16.2 Track

Track is short-term event interest. Users can track a challenge, fixture, competition final, prediction window, or venue event later. Track affects event reminders, notification priority, feed priority, buzz score, and soft-follow signals.

### 16.3 Soft Follow

Soft follow is inferred interest. A user may soft-follow a club or challenge if they react to multiple items from the same club, share a club's challenge, track a match, predict on a club's fixture, repeatedly view a zone or club, or interact with the same competition repeatedly. Soft-follow should increase feed relevance, suggest formal follow, send limited updates only, respect notification preferences, and expire if the user stops engaging.

## 17. Prediction Integration

Prediction should be treated as both engagement and event participation. Prediction belongs logically to scheduled public fixtures and accepted challenges.

- Fixture is scheduled.

- Match is public or allowed for public prediction.

- Prediction window is active.

- Match has not started.

- Moderation/safety does not block public activity.

Prediction can increase fixture buzz, challenge buzz, fan engagement, notification priority, and shareability. Prediction must not affect match result, RP, standings, official statistics, or challenge settlement. Prediction is attention, not authority.

## 18. Shareable Cards and Public Distribution

Sharing is one of the strongest growth mechanics. Kalaanba should make public football moments easy to share on WhatsApp.

- challenge card

- fixture card

<!-- Page 13 -->

- verified result card

- competition standings card

- bracket card

- venue card

- club card

- player card

- zone pulse card

- award card later

- season highlight card later

The Fan Buzz Engine should track share events and feed them into buzz. The Notification & Distribution Engine should handle message delivery and public distribution rules. Important rule: A share card should only display information allowed by the source object's visibility and trust state. Do not share private disputes, evidence, admin notes, unverified accusations, phone numbers, sensitive player data, referee conflict notes, private/internal matches, or Super Admin override reasons.

## 19. Public, Private, and Restricted Visibility

| Visibility type | Examples |
| --- | --- |
| Public by default, if allowed | Public fixture scheduled; verified public result; public challenge issued; challenge accepted;<br>competition launched; standings updated; winner announced; public venue page; public<br>club profile; claimed public player card; zone pulse summary. |
| Private by default | Private/internal match; dispute details; evidence requests; admin review notes; referee<br>conflict notes; related-club suspicion; unverified cheating claims; private venue booking<br>details; manual admin overrides; sensitive player identity notifications. |
| Restricted / conditional | Unverified results; pending challenges; high-risk challenge copy; reported comments later;<br>fixtures involving minors later; suspicious activity flags; abandoned match narratives;<br>no-show claims before decision. |

## 20. Moderation and Safety Guardrails

This engine will amplify content, so it must not amplify harmful content. Moderation should apply to challenge copy, comments later, club banter messages, public call-out text, user captions, reported reactions later, public accusations, dangerous rivalry language, threats, slurs, harassment, and crowd-inciting language. Risky public content should be held for moderation before feed promotion. Moderation states can include clear, needs review, restricted visibility, hidden, removed, admin-only, and appeal later. The Fan Buzz Engine should consume moderation status before ranking or distributing content.

## 21. Admin Visibility Controls

Admins need controls because feeds influence public attention. Admin controls should be audit-logged.

- feature item

- boost item

- suppress item

<!-- Page 14 -->

- hide from feed

- pin to hub

- pin to zone

- pin to competition

- remove from public discovery

- mark as sensitive

- send to moderation

- restore visibility

- lock engagement

- disable comments later

- freeze buzz score in dispute cases

## 22. Anti-Manipulation Rules

Buzz can be gamed. The system should reduce obvious manipulation without punishing normal enthusiasm.

| Risk | Protection direction |
| --- | --- |
| Fake views | View deduplication, low view weight, session/device checks. |
| Reaction spam | Rate limits, reaction caps, unique user weighting. |
| Same device repeated engagement | Device/session pattern checks and new account dampening. |
| Share farming | Share deduplication and suspicious share pattern flags. |
| Bot-like traffic | Rate limits, behavior analysis, admin review. |
| Artificial prediction activity | Prediction rate limits and account trust checks. |
| Venue click manipulation | Deduplicate booking clicks and weight actual booking intent more strongly. |
| Comment spam later | Moderation queue and restricted visibility. |

Suspicious buzz should affect visibility, not football truth. A manipulated buzz pattern should not affect RP, match verification, player stats, or standings.

## 23. Conceptual Data Model

The exact database design comes later, but the engine should prepare for these records.

### 23.1 Fan Interaction Record

{ "interactionId": "int_123", "userId": "user_456", "entityType": "challenge", "entityId": "challenge_789", "interactionType": "reaction", "reactionType": "fire", "context": { "seasonId": "season_2026", "cityHubId": "tamale", "zoneId": "north_zone" }, "createdAt": "timestamp", "source": "mobile_web" }

<!-- Page 15 -->

### 23.2 Buzz Score Snapshot

{ "buzzSnapshotId": "buzz_123", "entityType": "fixture", "entityId": "fixture_456", "score": 74.5, "level": "hot", "contextType": "city_hub", "contextId": "tamale", "components": { "views": 12.4, "reactions": 18.0, "shares": 20.0, "tracks": 16.0, "predictions": 8.1 }, "decayApplied": true, "manipulationRisk": "low", "calculatedAt": "timestamp" }

### 23.3 Follow Record

{ "followId": "follow_123", "userId": "user_456", "entityType": "club", "entityId": "club_789", "followType": "manual", "status": "active", "createdAt": "timestamp" }

### 23.4 Soft Follow Record

{ "softFollowId": "sf_123", "userId": "user_456", "entityType": "club", "entityId": "club_789", "reason": "tracked_two_fixtures_and_shared_challenge", "strength": 0.64, "expiresAt": "timestamp", "createdAt": "timestamp" }

### 23.5 Feed Item Record

{ "feedItemId": "feed_123", "entityType": "challenge", "entityId": "challenge_789", "visibility": "public", "rankScore": 88.2, "feedContexts": ["home", "tamale_hub", "north_zone"], "badges": ["Trending", "Prediction Open"], "status": "active", "createdAt": "timestamp" }

## 24. Engine Outputs

The engine should expose flexible outputs, not one giant response.

- getHomeFeed(userId, filters)

- getHubFeed(hubId, filters)

- getZoneFeed(zoneId, filters)

- getTrendingChallenges(hubId, filters)

<!-- Page 16 -->

- getTrendingFixtures(hubId, filters)

- getTrendingClubs(hubId, filters)

- getPopularVenues(hubId, filters)

- getCompetitionBuzz(competitionId)

- getChallengeBuzz(challengeId)

- getFixtureBuzz(fixtureId)

- getClubBuzz(clubId)

- getPlayerMomentBuzz(playerId, filters)

- getVenueBuzz(venueId)

- getBuzzBadge(entityType, entityId)

- recordFanInteraction(payload)

- recordShareEvent(payload)

- recordTrackEvent(payload)

- createFollow(userId, entityType, entityId)

- removeFollow(userId, entityType, entityId)

- getSoftFollowSuggestions(userId)

- getFeedCards(context, filters)

- getAdminBuzzFlags(filters)

- applyVisibilityBoost(entityType, entityId, reason)

- applyVisibilitySuppression(entityType, entityId, reason)

- recalculateBuzz(entityType, entityId)

## 25. Affected Engines and Required Changes

This system touches many existing engines. Below are the affected engines and what may need to change or be added.

### 25.1 Challenge Engine

- Challenge records need buzz eligibility.

- Challenge lifecycle should emit fan-facing events.

- Challenge cards need reaction, share, track, and prediction states.

- Challenge feed status should distinguish issued, accepted, scheduled, prediction open, resolved, disputed, and

archived.

- Public challenge copy may need moderation clearance before feed boost.

- Challenge pages need engagement bars.

- Open call-out windows and inter-zone duels should receive special feed sections.

### 25.2 Match / Fixture Engine

<!-- Page 17 -->

- Fixtures need public feed eligibility flags, trackable status, shareable fixture card support, and buzz context fields.

- Fixture status changes should create feed events where public.

- Verified results should generate result cards.

- Cancelled and postponed fixtures should suppress outdated feed items.

- Private/internal matches should not enter public feed by default.

### 25.3 Notification & Distribution Engine

- Fan Buzz should feed notification priority without spamming users.

- Track, follow, and soft-follow should influence fan/follower notifications.

- Shareable cards requested by Fan Buzz should pass through Notification/Distribution.

- Notification preferences should control fan update delivery.

### 25.4 Season Engine

- Season archive should include Fan Buzz highlights.

- Season context should be attached to buzz calculations.

- Season phase may affect buzz weight.

- High-activity peak may affect feed sections.

- March transition month should allow historical buzz but no RP generation.

### 25.5 RP Economy Engine

- RP Engine should ignore Fan Buzz for RP awards.

- RP history UI may show public attention separately from RP.

- Suspicious buzz manipulation should not trigger RP penalties directly.

- Buzz should never alter challenge stake, tier, RP eligibility, or RP settlement.

### 25.6 Zone Engine

- Zones need buzz summaries.

- Zone pages should show active clubs, hot challenges, upcoming fixtures, and popular venues.

- Inter-zone challenge buzz should feed zone storytelling.

- Zone/belt feeds should consume club, venue, challenge, and fixture buzz.

### 25.7 Club Engine

- Club profiles need feed modules and public activity cards.

- Club follow counts may be shown.

- Club buzz should remain separate from RP.

- Club dormant status should affect feed ranking.

- Club verification status may affect feed trust display.

### 25.8 Player / Affiliation Engine

- Player cards should support share and buzz tracking.

<!-- Page 18 -->

- Player moments should be generated only from verified stats.

- Ghost players must never enter public feed.

- Minor privacy rules must restrict player visibility.

- Player achievements later can create player moment cards.

### 25.9 Venue, Surface & Booking Engine

- Venue pages need buzz and popularity metrics.

- Venue discovery should include popular and active venues.

- Bookable venues may receive higher discovery utility than manual venues.

- Venue cards need book/view buttons.

- Venue popularity should not imply availability.

### 25.10 Competition & Rules Engine

- Competition public pages need follow and share buttons.

- Competition fixtures and results should produce feed items.

- Standings updates can become public distribution cards.

- Competition buzz should be calculated inside competition context.

- Finals and knockout rounds may receive higher contextual weight.

### 25.11 Trust & Verification Engine

- Trust clearance should determine whether official result cards can be marked verified.

- Disputed items should have restricted public visibility.

- Unverified results should not be promoted as official.

- Suspicious patterns may suppress feed visibility.

- Evidence and dispute details must remain private.

### 25.12 Referee & Officiator Engine

- Referee-officiated matches may receive stronger public trust labels.

- Referee reports should not be public unless summarized and allowed.

- Referee assignment itself is usually private.

- Verified referee involvement may be shown on public match cards where appropriate.

### 25.13 Admin Configuration & Governance Engine

- Admin Config must store fan buzz weights, reaction weights, share weights, prediction weights, view velocity

weights, buzz decay period, homepage rotation rules, boost flags, suppress flags, and feed visibility rules.

- Admin actions must be audit logged.

### 25.14 Moderation / Safety Engine

- Public challenge copy must be moderated where risky.

- Comments later must pass moderation.

<!-- Page 19 -->

- Abusive content should be suppressed from feeds.

- Moderation state should affect feed eligibility.

### 25.15 Leaderboard Engine

- Leaderboards should consume buzz outputs but not recalculate buzz.

- RP leaderboard and trending leaderboard must stay separate.

- Club rank and trending rank must not be confused.

- Homepage can display both Top RP Clubs and Trending Clubs.

### 25.16 Awards Engine Later

- Awards may consume season buzz snapshots.

- Performance awards and attention awards should be distinguished.

- Most Buzzed Challenge can be an attention award.

- Best Club should not be decided by Buzz alone.

### 25.17 Search / Discovery Layer

- Search results may use buzz as one ranking factor.

- Location relevance should remain important.

- Verified/bookable/trusted entities may receive ranking preference.

- Popular does not always mean best.

- Search filters should separate nearby, trending, verified, and bookable.

## 26. Configurable Defaults

All values should remain configurable through Admin Config.

- reaction weights

- share weights

- track weights

- prediction weights

- view weights

- comment weights later

- follow weight

- soft-follow threshold

- soft-follow expiry period

- buzz decay rate

- buzz time windows

- feed section limits

- homepage rotation rules

- boost multiplier

<!-- Page 20 -->

- suppression multiplier

- new account dampening

- view deduplication window

- reaction cap per user

- share cap per user

- prediction window weight

- challenge buzz threshold

- fixture buzz threshold

- venue buzz threshold

- club buzz threshold

- zone buzz threshold

- moderation hold behavior

- public/private feed defaults

- admin boost permissions

- admin suppress permissions

## 27. Alpha, V1, and Deferred Scope

| Phase | Scope direction |
| --- | --- |
| Alpha | Public fixture card, basic challenge card, basic reaction, basic share tracking, basic track button,<br>simple trending list, manual feed ordering where needed, basic home feed section, basic club follow,<br>simple buzz score placeholder. |
| Private beta | Buzz score calculation, feed ranking, hub feed, challenge feed, fixture feed, track/follow behavior,<br>prediction integration, basic soft-follow, share card tracking, admin boost/suppress, moderation hold<br>for risky content, basic anti-spam rules. |
| V1 | Home feed, city hub feed, zone feed, challenge wall, fixture discovery, club discovery, venue<br>discovery, competition discovery, buzz badges, engagement bars, reaction buttons, track buttons,<br>follow buttons, prediction buttons, share card buttons, soft-follow logic, public/private visibility rules,<br>buzz decay, admin boost/suppress, basic anti-manipulation, feed card system, season and<br>competition buzz contexts, integration with Notification Engine for fan/follower updates. |
| Deferred / later | Advanced comments, fan reward economy, badges for fans, full social graph, advanced<br>recommendation engine, AI-personalized feed, creator tools, club media walls, public referee<br>discovery, advanced fan prediction games, leaderboard for fans, paid boosts/promoted content,<br>sponsor-driven discovery, media gallery ranking, short video feed, full mobile push personalization. |

## 28. Product Guardrails

- Do not make Buzz look like RP.

- Do not let popularity create official football advantage.

- Do not show unverified results as official.

- Do not amplify disputes before review.

- Do not expose private evidence.

- Do not let abusive challenge copy trend.

- Do not make every feed global. Local context matters.

<!-- Page 21 -->

- Do not let old content dominate fresh activity.

- Do not treat views as a strong signal by themselves.

- Do not turn grassroots football into spam.

- Do not make feed ranking impossible to explain to admins.

- Do not calculate important feed outputs only in React. Backend owns ranking and feed rules.

## 29. Locked Summary

Kalaanba's Fan Buzz, Feed & Discovery Engine is the platform's attention and discovery layer. It measures fan interactions such as reactions, shares, views, tracking, following, predictions, and soft-follow behavior, then uses those signals to rank public football activity across feeds, discovery pages, homepage sections, challenge walls, zone pages, venue pages, club pages, competition pages, and season storytelling surfaces. The engine requires dedicated UI components, including buzz badges, heat indicators, engagement bars, reaction buttons, track buttons, follow buttons, prediction buttons, share buttons, feed cards, discovery cards, and admin visibility controls. Fan Buzz does not create RP, verify results, settle challenges, update standings, confirm player stats, or decide official records. It only affects visibility, discovery, storytelling, public attention, and fan engagement. The engine must integrate with Challenge, Match/Fixture, Notification, Season, RP Economy, Zone, Club, Player, Venue, Competition, Trust, Referee, Admin Governance, Moderation, Leaderboard, Awards, and Search/Discovery systems. Locked product rule: Results drive respect. Buzz drives visibility.
