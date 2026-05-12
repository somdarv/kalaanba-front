<!-- Converted from Awards_and_Recognition_Engine_System_Document.pdf -->

# Kalaanba Awards & Recognition Engine

## System Document

Full product direction for weekly recognitions, competition awards, player and club achievements, shareable recognition cards, season awards, and award governance.

| Field | Locked value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Awards & Recognition Engine |
| Core principle | Season awards create legacy. Weekly recognitions create movement. |
| Recognition stance | Recognition must be continuous: matchday, weekly, competition-<br>round, monthly, season, and historical. |
| Data stance | Performance recognition uses verified records only. Buzz recognition<br>uses approved attention signals only. |
| Season basis | April 1 to February 28/29. March is for closing, review, publishing, and<br>archiving; not for earning new season awards. |
| Recommended next engine | Moderation & Safety Engine |
| Document date | May 10, 2026 |

### Final principle

Kalaanba recognition is not only a trophy cabinet. It is a retention engine. It gives players, clubs, competitions, zones, venues, and fans something fresh to follow every week while protecting official records with Trust clearance.

<!-- Page 2 -->

## Document Map

- Purpose and why this engine matters

- Core principles and boundaries

- Awards vs recognition, performance vs buzz, and scope definitions

- Recognition cadence: matchday, weekly, competition-round, monthly, season, and historical

- Weekly recognitions: goals, assists, top scorers, club activity, challenge moments, buzz moments, zone pulse, and venue

highlights

- Competition-specific recognitions and per-competition stat leaderboards

- Award eligibility, Trust clearance, candidate generation, ranking, ties, review, and publishing

- Recognition cards, feed surfaces, notifications, and distribution

- Admin controls, overrides, audit logs, moderation integration, and affected engines

- Conceptual data model, outputs, configurable defaults, V1 scope, deferred scope, and locked summary

## 1. Purpose

The Awards & Recognition Engine owns the system that recognizes football activity across Kalaanba. It turns verified match records, player stats, club results, challenge outcomes, competition standings, Fan Buzz signals, zone activity, and venue activity into meaningful recognitions that keep the platform active and emotionally rewarding. In simple terms, this engine answers: who deserves recognition, for what, in which context, during which window, based on which trusted data, and how should that recognition appear publicly?

- Recognize players for verified goals, assists, appearances, clean sheets, cards avoided, match moments, and competition

performance.

- Recognize clubs for verified wins, activity, consistency, challenge performance, clean records, RP outcomes, and zone

contributions.

- Recognize competitions with weekly stat leaders, round highlights, standings moments, champions, and tournament awards.

- Recognize challenges, zones, venues, referees/officiators, and fan moments where the data supports it.

- Generate shareable cards and public recognition surfaces that feed app activity without corrupting official records.

### Product line

Season awards create legacy. Weekly recognitions create movement. Matchday cards create emotion. Competition recognitions create repeat visits.

## 2. Why This Engine Matters

A season-only award system is too static for Kalaanba. Grassroots football is emotional every week. Someone scores. Someone assists. A club gets a big win. A challenge explodes. A zone becomes active. A competition has a standout player. If Kalaanba waits until the end of the season to recognize these moments, the app will feel quiet even when football is happening. The Awards & Recognition Engine is therefore part of the retention loop. It gives users reasons to return: weekly leaderboards, matchday moments, competition top scorers, assist charts, club-of-the-week discussions, player cards, challenge highlights, and zone pulse updates.

- Players return to see whether they made the weekly board.

- Clubs return to see whether they are trending, improving, or leading their zone.

- Competition organizers get content for their public pages.

- Fans get new things to react to, track, predict, and share.

- Kalaanba creates public proof that real football activity is happening on the platform.

## 3. Core Principles

- Recognition must be continuous, not only seasonal.

- Performance recognition must use verified records only.

- Buzz recognition must be clearly labeled as attention-based, not football merit.

- Major awards must be reviewable and auditable.

- Weekly recognition should feel fresh, frequent, and shareable.

- Competition recognitions must work inside each competition, not only globally.

- The engine must not decide match truth, player identity, RP movement, challenge settlement, or moderation safety.

- Recognition values, eligibility windows, labels, thresholds, and ranking weights must be configurable by admin.

- More contexts create more winners without faking achievements: global, city hub, zone, competition, club, challenge, and

venue.

<!-- Page 3 -->

## 4. What This Engine Owns

| Owns | Examples |
| --- | --- |
| Recognition categories | Goals of the Week, Top Assists, Club of the Week, Challenge of the<br>Week, Player of the Month, Club of the Season. |
| Eligibility rules | Minimum verified matches, confirmed stats only, competition scope,<br>season window, active participant rules. |
| Recognition windows | Matchday, weekly, round, monthly, season, competition, and historical<br>windows. |
| Candidate generation | Generating ranked lists and nominees from trusted engine outputs. |
| Award/recognition leaderboards | Top scorers this week, assists this week, most active clubs, zone<br>pulse, buzz recognitions. |
| Winner selection workflow | Auto-select, admin-reviewed, nomination-based, organizer-selected,<br>fan-vote later. |
| Recognition cards | Player cards, club cards, challenge cards, competition weekly cards,<br>season award cards. |
| Award badges and profile display | Badges on club, player, competition, zone, and venue pages. |
| Award archives | Season award snapshots, competition award snapshots, historical<br>recognition records. |
| Manual overrides and audit | Admin changes to winners, hidden records, corrected stats, and<br>published recognitions. |
| Does not own | Owner |
| Match truth, verification, disputes, no-shows, walkovers | Trust & Verification Engine |
| Match lifecycle and event recording | Match / Fixture Engine |
| RP minting, locking, transfer, and balance calculation | RP Economy Engine |
| Challenge lifecycle and stake rules | Challenge Engine |
| Competition rules, points, brackets, and standings meaning | Competition & Rules Engine |
| Player identity, affiliations, and official stats source | Player / Affiliation Engine |
| Club identity, roles, related-club status, and verification source | Club Engine |
| Zone mapping and zone rank outputs | Zone Engine |
| Buzz formula and feed ranking | Fan Buzz, Feed & Discovery Engine |
| Notification delivery | Notification & Distribution Engine |
| Public safety and content moderation verdicts | Moderation & Safety Engine |
| Config storage and approval governance | Admin Configuration & Governance Engine |

## 5. Alignment With Existing Engines

- Season Engine: provides the active season, closing window, archive window, award window, and season participation rules.

- Trust & Verification Engine: provides the clearance that records are safe to count for stats, RP, standings, awards, and

archives.

- Player / Affiliation Engine: provides verified player stats, public player card readiness, player identity, and competition

registrations.

- Competition & Rules Engine: provides competition scope, rules, confirmed standings, fixture outcomes, and competition-

specific award contexts.

- Fan Buzz Engine: provides approved attention signals for buzz recognitions, but must never replace verified football

performance.

- Notification Engine: distributes recognition alerts, weekly summaries, public share cards, and competition updates.

- Admin Governance Engine: stores configurable thresholds and keeps overrides, rule changes, and publishing decisions

auditable.

## 6. Core Definitions

| Term | Meaning |
| --- | --- |
| Award | A more formal recognition usually tied to a season, competition,<br>tournament, month, or major category. |

<!-- Page 4 -->

| Recognition | A lighter and more frequent acknowledgement of activity, such as<br>weekly goals, assists, buzz, or club activity. |
| --- | --- |
| Performance recognition | Recognition based on verified football data such as goals, assists,<br>wins, appearances, challenge results, or clean sheets. |
| Buzz recognition | Recognition based on attention signals such as views, shares,<br>reactions, tracking, predictions, follows, and velocity. |
| Recognition window | The time period being measured: matchday, week, competition round,<br>month, season, or custom window. |
| Recognition context | The scope in which the recognition is calculated: platform, city hub,<br>zone, competition, club, challenge, player, or venue. |
| Candidate | A player, club, challenge, zone, venue, referee, or competition that<br>may qualify for recognition. |
| Winner | The final selected candidate after calculation, review, and publication<br>rules. |
| Recognition card | A shareable visual or feed card generated for a winner, nominee,<br>leaderboard, or milestone. |
| Award snapshot | A frozen record of award winners, candidates, data inputs, and rule<br>version used at the time of publishing. |

## 7. Awards vs Recognition

| Layer | Meaning | Examples |
| --- | --- | --- |
| Recognition | Frequent, dynamic, and activity-driving. It can<br>refresh every matchday, week, round, or<br>month. | Goals of the Week, Assists of the Week, Club<br>of the Week, Most Buzzed Match, Hot in<br>Tamale. |
| Awards | More formal, prestigious, and archival. It<br>usually closes a competition, month, or<br>season. | Club of the Season, Player of the<br>Tournament, Season RP Champion, Top<br>Scorer, Challenge Kings. |

Locked distinction: every award is a recognition, but not every recognition is a major award. Weekly recognition should be easy to generate and share. Season awards should be harder to win and permanently archived.

## 8. Performance Recognition vs Buzz Recognition

| Recognition family | Based on | Examples | Guardrail |
| --- | --- | --- | --- |
| Performance | Verified football records and<br>confirmed stats. | Top Scorer, Top Assists, Club<br>with Most Wins, Challenge<br>Winner, Clean Sheet Hero. | Must pass Trust and stats<br>clearance. |
| Buzz | Approved fan attention and<br>engagement signals. | Most Buzzed Challenge, Most<br>Shared Result, Most Tracked<br>Fixture, Hot Club This Week. | Must be labeled as<br>buzz/attention, not merit. |
| Hybrid | A clear mix of verified<br>performance and attention. | Match of the Week, Player<br>Moment of the Week, Best<br>Challenge Moment. | Formula must show which parts<br>are performance and which parts<br>are buzz. |

### Locked wording

Top Scorer of the Week is a verified stat recognition. Most Buzzed Player Moment is an attention recognition. Both can be valuable, but they must not be confused.

## 9. Recognition Cadence

| Cadence | Purpose | Example recognitions |
| --- | --- | --- |
| Matchday | Capture fresh football moments immediately<br>after verified matches. | Goal scorer cards, hat-trick card, clean sheet<br>card, verified result card, challenge winner<br>card. |
| Weekly | Create the core app heartbeat and repeat<br>visits. | Goals of the Week, Assists of the Week, Club<br>of the Week, Most Buzzed Challenge, Zone<br>of the Week. |

<!-- Page 5 -->

| Competition round / matchweek | Keep each competition page alive through its<br>own rhythm. | Round top scorer, round best match,<br>matchweek XI later, most disciplined team. |
| --- | --- | --- |
| Monthly | Give more prestige than weekly recognition<br>while staying current. | Player of the Month, Club of the Month,<br>Challenge Club of the Month. |
| Season | Create legacy and archive-worthy<br>achievements. | Club of the Season, Season RP Champion,<br>Top Scorer, Assist King, Best Zone. |
| Historical / all-time | Preserve long-term pride and platform<br>memory. | All-time top scorer, most awarded club, most<br>challenge wins, legacy badges later. |

## 10. Recognition Contexts and Scopes

Every recognition should have a clear scope. This creates more legitimate recognition surfaces without inventing fake achievements.

| Scope | Meaning | Example |
| --- | --- | --- |
| Platform-wide | Across Kalaanba where data is comparable. | Kalaanba Goals of the Week. |
| City Hub | Within one football hub. | Top Scorer in Tamale this week. |
| Zone / Belt | Within or across zones and belts. | North Zone Club of the Week. |
| Competition | Inside a league, cup, tournament, or internal<br>competition. | Tamale Weekend League Assists of the<br>Week. |
| Club | Inside one club or squad context. | Aboabo United Player of the Week. |
| Challenge | Inside challenge activity and challenge<br>history. | Challenge Kings of the Month. |
| Venue | Around a venue or surface activity. | Most Active Venue This Week. |
| Player | A player-specific milestone or moment. | Hat-trick Hero, Debut Goal, 10 verified<br>appearances. |

## 11. Matchday Recognition

Matchday recognition should be generated after a match result and key events are confirmed. It creates immediate shareable emotion without waiting for weekly reports.

| Recognition | Trigger | Output |
| --- | --- | --- |
| Goal Scorer Card | Verified scorer recorded. | Player moment card and match event feed<br>item. |
| Assist Provider Card | Verified assist recorded. | Player moment card where assists are<br>captured. |
| Hat-trick Hero | Player scores 3 or more verified goals in one<br>match. | Special player card and club/competition feed<br>item. |
| Clean Sheet Hero | Goalkeeper/team clean sheet is confirmed<br>where goalkeeper/team defensive data<br>exists. | Player/team card. |
| Debut Goal | Claimed/registered player scores first verified<br>goal. | Player milestone card. |
| Challenge Winner Card | Ranked challenge resolved and RP settled. | Challenge result card with public challenge<br>context. |
| Stood Their Ground Card | Challenge draw where respondent earns<br>stood-ground recognition. | Challenge moment card. |
| Comeback Win Card | Club wins after trailing if live/period scoring<br>supports it. | Match moment card later. |
| Big Win Card | Win margin crosses configured threshold. | Club result card. |

## 12. Weekly Recognition Layer

Weekly recognition is the main dynamism layer. It should run every week and produce public sections, ranked lists, and shareable cards. The default weekly window should be configurable. A sensible platform default is Monday 00:00 to Sunday 23:59 in the relevant hub timezone, with publishing after the verification grace period.

<!-- Page 6 -->

### 12.1 Weekly Player Recognitions

| Recognition | Data needed | Default rule |
| --- | --- | --- |
| Goals of the Week | Verified goals inside the week. | Rank players by verified goals, then assists,<br>minutes, match importance, fewer matches,<br>then admin tiebreak if needed. |
| Top Scorer This Week | Verified goals. | Highest verified goals in selected scope. |
| Assists of the Week | Verified assists inside the week. | Rank players by verified assists, then goals,<br>minutes, match importance. |
| Top Assist Provider This Week | Verified assists. | Highest verified assists in selected scope. |
| Goal Contributions of the Week | Verified goals plus assists. | Goals + assists, with goals and assists<br>separately visible. |
| Most Appearances This Week | Verified appearances. | Useful where players can play multiple<br>fixtures. |
| Clean Sheet Recognition | Verified clean sheet data. | Available only when lineups/goalkeeper/team<br>data supports it. |
| Hat-trick Heroes | Verified goals in one match. | Any player with 3+ goals in a verified match<br>during the week. |
| Player Moment of the Week | Verified moment plus optional buzz. | Hybrid recognition; admin review<br>recommended. |

### 12.2 Weekly Club Recognitions

| Recognition | Data needed | Default rule |
| --- | --- | --- |
| Club of the Week | Verified results, activity, clean record,<br>optional buzz. | Hybrid formula with performance weighted<br>higher than buzz. |
| Most Active Club | Verified matches played. | Count confirmed matches in the week. |
| Most Verified Wins | Verified wins. | Highest wins in scope. |
| Best Attack | Verified goals for. | Highest goals scored, with match count<br>visible. |
| Best Defence | Verified goals against. | Lowest goals conceded among clubs meeting<br>minimum matches. |
| Biggest Win of the Week | Verified result margin. | Largest winning margin, excluding walkover if<br>configured. |
| Most Improved Club | RP movement or form improvement. | Compare current week to previous window,<br>with anti-farming review. |
| Most Disciplined Club | Verified card/no-show/dispute data. | Fewest cards and no negative reliability<br>events among eligible clubs. |
| Clean Record Club | No disputes, no no-shows, no forfeit<br>penalties, verified activity. | Recognition for reliability and good platform<br>behavior. |

### 12.3 Weekly Challenge Recognitions

| Recognition | Data needed | Default rule |
| --- | --- | --- |
| Challenge of the Week | Challenge lifecycle, RP stake, result, buzz. | Hybrid recognition for the most<br>important/high-attention challenge. |
| Challenge Club of the Week | Challenge wins, accepted challenges,<br>reliability. | Club with strongest challenge performance. |
| Biggest Upset | Winner tier/RP compared to opponent. | Lower-ranked club beats higher-ranked club<br>in verified eligible challenge or match. |
| Stood Their Ground | Drawn ranked challenge with stood-ground<br>outcome. | Respondent earns recognition when<br>challenger fails to prove the call-out. |
| Open Call-out Window Standout | Open call-out participation/results. | Recognizes special campaign moments. |
| Most Buzzed Challenge | Buzz signals only. | Attention recognition; does not imply football<br>superiority. |

### 12.4 Weekly Buzz and Discovery Recognitions

| Recognition | Based on | Guardrail |
| --- | --- | --- |

<!-- Page 7 -->

| Most Buzzed Match | Track count, views, shares, reactions,<br>prediction activity, freshness. | Must be labeled as buzz. Does not prove<br>match quality. |
| --- | --- | --- |
| Most Shared Result | Share events on verified result cards. | Result must be verified before official result<br>card distribution. |
| Most Tracked Fixture | Track/reminder actions. | A tracking signal, not a merit award. |
| Hot Club This Week | Club follows, profile views, challenge buzz,<br>result shares. | Attention-based only unless performance<br>inputs are included and labeled. |
| Hot in Hub | Hub-level normalized buzz. | Small local activity can trend in local scope. |
| Zone on Fire | Zone/belt activity and attention. | Should use normalized local context. |

### 12.5 Weekly Venue and Referee Recognitions

| Recognition | Data needed | Default stance |
| --- | --- | --- |
| Venue of the Week | Public fixtures hosted, venue views, booking<br>clicks, booking activity, approved media. | Attention/operations recognition; must not<br>imply slot availability. |
| Most Active Venue | Count public verified fixtures or confirmed<br>bookings. | Useful for venue discovery. |
| Popular Venue | Venue buzz, booking page views, saves,<br>shares. | Buzz label only. |
| Reliable Referee Recognition | Accepted assignments, reports submitted,<br>low disputes. | Internal or light public recognition first. Avoid<br>public star ratings in V1. |
| Community Officiator Mention | Accepted officiator reports and clean match<br>support. | Optional, careful, and not a formal ranking in<br>V1. |

## 13. Competition-Specific Recognition

Every competition should be able to generate its own recognition layer. This is important because competitions have their own rhythms, matchdays, rounds, rules, eligibility, registered players, and audience. A player may not be top scorer across Kalaanba, but may be top scorer inside Tamale Weekend League this week.

### Locked rule

Each competition should support per-competition weekly leaderboards for goals and assists where those stats are captured and verified.

### 13.1 Competition Weekly Recognitions

| Recognition | Scope | Notes |
| --- | --- | --- |
| Competition Goals of the Week | One competition. | Verified goals inside that competition window. |
| Competition Assists of the Week | One competition. | Verified assists inside that competition<br>window. |
| Top Scorer This Week | One competition. | Weekly ranking, separate from season-long<br>top scorer. |
| Top Assist Provider This Week | One competition. | Weekly ranking, separate from season-long<br>assist table. |
| Player of the Week | One competition. | Can be organizer-selected, stats-assisted, or<br>hybrid after review. |
| Team of the Week | One competition. | Later, when lineups, positions, and richer<br>stats exist. |
| Best Match of the Week | One competition. | Hybrid of verified result importance and buzz. |
| Most Disciplined Team | One competition. | Cards/no-shows/disputes depending on<br>captured data. |
| Best Defence of the Week | One competition. | Goals conceded among teams meeting<br>minimum match threshold. |
| Standout New Player | One competition. | Useful for onboarding and player discovery. |
| Fastest Goal of the Week | One competition. | Only if goal minute is captured. |

<!-- Page 8 -->

| Best Comeback | One competition. | Only if period/live score data supports it. |
| --- | --- | --- |

### 13.2 Competition Season / Tournament Awards

| Award | Primary data | Default owner/review |
| --- | --- | --- |
| Champion | Final standings/bracket winner. | Competition Engine result; Awards publishes<br>badge/card. |
| Runner-up | Final or table position. | Competition output. |
| Golden Boot / Top Scorer | Verified competition goals. | Auto with admin/organizer review. |
| Assist King | Verified competition assists. | Auto where assists are captured. |
| Best Defence | Goals conceded, clean sheets, minimum<br>matches. | Auto with rules. |
| Most Disciplined Team | Cards, disputes, no-shows, forfeit records. | Auto with organizer review. |
| Player of the Tournament | Stats-assisted or organizer-selected. | Organizer/admin review. |
| Best Match | Importance plus buzz plus verified result. | Hybrid, reviewed. |
| Most Buzzed Fixture | Fan Buzz signals. | Buzz recognition. |

### 13.3 Round / Matchweek Windows

A competition can use calendar weeks, matchweeks, rounds, or custom windows. For example, a weekend league may publish Matchweek 4 recognitions even if some fixtures are played midweek. The Competition & Rules Engine should define or expose the competition window; the Awards Engine should calculate within that window.

## 14. Goals of the Week vs Goal of the Week

| Concept | Meaning | V1 direction |
| --- | --- | --- |
| Goals of the Week | A verified stat leaderboard showing who<br>scored the most goals in the window. | Automatic from confirmed match events. |
| Goal of the Week | A quality or beauty award for one goal. | Nomination/admin-curated in V1 because it<br>needs video, match clip, referee note,<br>organizer nomination, or fan voting later. |

This distinction matters. A player with four tap-ins may lead Goals of the Week, while another player may win Goal of the Week for a brilliant strike if there is credible media or nomination evidence.

## 15. Player Recognition Rules

Player recognitions must only use official public stats after match confirmation. Claimed stats should not appear in official awards. Player cards can display verified achievements, milestones, and confidence labels, but the platform should avoid serious numeric player ratings in V1.

- Ghost players do not receive public recognition cards until they claim their profile or the record is safely resolved according to

player identity rules.

- If a stat is disputed, the player should remain pending for that recognition until the dispute is resolved.

- If a competition registration makes a player ineligible, competition recognitions should exclude that player even if the match

record exists.

- If assists are not captured in a match or competition, assist recognitions should not be faked. The category can show as

unavailable or only use competitions that capture assists.

- Minor-protected players require restricted public display and careful card generation rules.

### 15.1 Player Milestone Badges

| Milestone | Trigger | Output |
| --- | --- | --- |
| First Verified Match | Player appears in first confirmed match. | Milestone badge/card. |
| First Verified Goal | Player scores first confirmed goal. | Player moment card. |
| First Verified Assist | Player records first confirmed assist. | Player moment card where assists are<br>captured. |
| 5 / 10 / 25 Verified Appearances | Appearance count crosses threshold. | Profile badge. |
| Hat-trick Hero | 3+ verified goals in one match. | Special card. |

<!-- Page 9 -->

| Goal Machine | Configured number of goals within a window. | Monthly/season badge. |
| --- | --- | --- |
| Assist King | Leads assist chart in scope. | Weekly/monthly/season recognition. |

## 16. Club Recognition Rules

Club recognition should reward both performance and healthy platform behavior. A club should not win major recognitions through suspicious activity, unresolved disputes, related-club farming, repeated no-shows, or abusive public behavior.

| Recognition | Primary input | Important guardrail |
| --- | --- | --- |
| Club of the Week | Wins, goals, verified activity, challenge result,<br>clean record, optional buzz. | Performance must dominate buzz. |
| Most Active Club | Verified matches played. | Avoid rewarding spam or suspicious repeated<br>pairings. |
| Most Improved Club | RP/form change across windows. | Use anti-farming flags and minimum activity. |
| Clean Record Club | Trust/reliability outputs. | No unresolved disputes, no no-shows, no<br>negative moderation issue. |
| Challenge Club of the Week | Challenge wins, accepted challenges, RP<br>stake outcome. | Only resolved challenges count. |
| Season RP Champion | RP Engine final output. | Awards Engine does not recalculate RP. |

## 17. Challenge Recognition Rules

Challenge recognition should preserve the public drama of Kalaanba while respecting the RP economy. No challenge recognition should imply RP movement unless the Challenge Engine and RP Economy Engine have resolved and ledgered the outcome.

- Issued challenges can receive buzz recognition before they are played.

- Challenge performance awards require resolved challenge results.

- Draws can create stood-ground recognition for the respondent.

- No-show/forfeit recognition must follow Trust and Challenge rulings.

- Open Call-out Window recognitions can have special categories configured for campaign periods.

## 18. Zone, Belt, and Hub Recognition

Zone and hub recognitions give local identity to the platform. They should use Zone Engine outputs, verified match records, RP Engine outputs, and Fan Buzz outputs depending on category type.

| Recognition | Type | Possible inputs |
| --- | --- | --- |
| Zone of the Week | Hybrid | Verified activity, inter-zone wins, challenge<br>moments, zone buzz, clean record. |
| Most Active Zone | Performance/activity | Verified matches involving clubs from that<br>zone. |
| Hottest Zone | Buzz | Zone-level reactions, views, shares, follows,<br>tracked fixtures. |
| Inter-Zone Kings | Performance | Verified cross-zone wins and challenge<br>results. |
| Zone Leader Recognition | Performance | Zone rank output, RP output, verified activity. |
| Hub Player of the Week | Performance | Verified stats inside one city hub. |

## 19. Venue and Referee Recognition

Venue and referee recognitions should be handled carefully. Venues can be recognized for activity, bookings, and visibility. Referees/officiators can be recognized for reliability and contribution, but public referee scoring should be deferred until the platform has stronger trust and review systems.

- Venue recognition must not imply that a venue is always available or officially superior unless verified by the Venue Engine.

- Most Active Venue can be based on confirmed bookings and public fixtures hosted.

- Popular Venue can be based on Buzz inputs but should remain an attention label.

- Reliable Referee recognition should start internal or light public, based on accepted assignments, reports submitted, low

dispute involvement, and clean audit history.

<!-- Page 10 -->

## 20. Award and Recognition Eligibility

| Eligibility check | Rule |
| --- | --- |
| Trust clearance | Performance recognitions require verified/confirmed records and stats<br>clearance. |
| Dispute status | Records under dispute, review, or voided status must not count until<br>resolved. |
| Season window | Season awards use April 1 to February 28/29. March does not create<br>new season award activity. |
| Competition window | Competition awards use competition-defined windows, rounds,<br>matchweeks, or final records. |
| Participation status | Club/player must be eligible for the relevant season or competition<br>scope. |
| Related-club rules | Related-club matches can be excluded from RP or performance<br>recognitions where rules require. |
| Minimum activity | Some awards require a minimum number of matches, appearances,<br>or confirmed events. |
| Moderation clearance | Public cards and public recognition copy must pass moderation safety<br>rules. |
| Privacy clearance | Minor-protected, private, internal, or restricted records may need<br>hidden or limited recognition. |

### Important rule

A match can be verified but still not eligible for a specific award. Example: a March match may be stored as history but should not affect season awards.

## 21. Required Data and Clearances

| Recognition family | Required source outputs |
| --- | --- |
| Goals / assists / appearances | Match result confirmed, player stat confirmed, stats clearance true,<br>player identity resolved. |
| Competition recognitions | Competition fixture confirmed, competition participant eligibility,<br>standings/stat outputs, organizer rules. |
| Club recognitions | Verified matches, RP outputs where relevant, Trust clearance,<br>related-club flags, club season participation. |
| Challenge recognitions | Challenge resolved, Trust clearance, RP ledger outcome where RP is<br>mentioned, Fan Buzz where attention is used. |
| Buzz recognitions | Fan Buzz score, visibility allowed, moderation status clean or<br>approved. |
| Venue recognitions | Venue booking/fixture outputs, venue visibility, venue verification or<br>confidence status. |
| Season awards | Season Engine award window, RP Engine final outputs, archives,<br>Trust clearance for unresolved items. |

## 22. Recognition Lifecycle

Recommended lifecycle: Tracking -> Candidate Generated -> Pending Clearance -> Review -> Locked -> Published -> Archived.

| State | Meaning |
| --- | --- |
| tracking | The window is active and data is being monitored. |
| candidate_generated | The engine has generated potential winners or leaderboards. |
| pending_clearance | Trust, stats, competition, privacy, or moderation checks are still<br>needed. |
| review | Admin, organizer, or Super Admin review is needed before<br>publication. |
| locked | Winner/list has been finalized and should not change except through |

<!-- Page 11 -->

|  | audited correction. |
| --- | --- |
| published | Recognition is visible on feeds, cards, profiles, competition pages, or<br>archives. |
| archived | Recognition has been frozen into historical records. |
| voided/corrected | Recognition was withdrawn or corrected after audit, dispute, or stat<br>amendment. |

## 23. Candidate Generation and Ranking

The engine should generate candidates automatically where the data is objective. It should support human review where the category is subjective, hybrid, sensitive, or based on incomplete media.

| Selection method | Best for | Example |
| --- | --- | --- |
| Automatic | Objective verified stats. | Goals of the Week, Top Assists, Most<br>Verified Wins. |
| Stats-assisted review | Categories needing judgment but supported<br>by data. | Player of the Week, Club of the Week. |
| Organizer-selected | Competition-specific subjective awards. | Best Player of Tournament. |
| Admin-curated | High-visibility or sensitive categories. | Goal of the Week, Best Challenge Moment. |
| Fan voting later | Public participation categories after<br>moderation and anti-manipulation are ready. | Fan Favorite, Goal of the Week later. |

## 24. Tie-Breakers

Tie-breakers must be configurable and visible to admins. Public pages should show enough context to avoid confusion.

| Recognition | Suggested tie-break order |
| --- | --- |
| Goals of the Week | Goals -> assists -> fewer matches -> match importance -> verified<br>minutes if available -> admin/organizer decision. |
| Assists of the Week | Assists -> goals -> fewer matches -> match importance -> verified<br>minutes if available -> admin/organizer decision. |
| Club of the Week | Wins -> goal difference -> challenge result -> clean record -><br>strength/context -> buzz as secondary -> admin review. |
| Most Active Club | Verified matches -> number of unique opponents -> no suspicious<br>repeat-pairing flag -> admin review. |
| Most Buzzed Challenge | Buzz score -> share count -> track count -> prediction participation -><br>freshness -> moderation status. |
| Best Defence | Goals conceded -> minimum matches -> clean sheets -> opposition<br>strength later -> admin review. |

## 25. Publishing and Recognition Cards

Recognition should become content. The engine should generate structured outputs that Fan Buzz, Feed, Notification, Competition pages, Club pages, Player cards, and public share cards can use.

| Card type | Content direction |
| --- | --- |
| Goals of the Week Card | Player names, photos, club, goals, competition/context, week label,<br>verified badge. |
| Assists of the Week Card | Player names, assists, club, competition/context, week label. |
| Top Scorer Card | Player, stat total, scope, verified data source. |
| Club of the Week Card | Club crest, zone/hub, key verified results, clean record, optional buzz<br>label. |
| Challenge of the Week Card | Clubs, challenge stage/result, RP stake if public, buzz badge,<br>verified/resolved status. |
| Zone Pulse Card | Zone/belt name, active clubs, verified matches, hot challenge, top<br>club. |
| Competition Weekly Card | Competition logo/name, weekly leaders, upcoming highlight, |

<!-- Page 12 -->

|  | standings link. |
| --- | --- |
| Season Award Card | Formal winner card for archive and sharing. |

### 25.1 Card Publication Rules

- Official result cards require verified results.

- Performance recognition cards require Trust and stats clearance.

- Buzz cards require visibility and moderation clearance.

- Minor-protected or privacy-restricted player data must use safe display rules.

- Cards should show context clearly: week, competition, zone, hub, season, or tournament.

- If a recognition is corrected later, the old card should not silently remain official. It should be corrected, withdrawn, or marked

updated according to admin rules.

## 26. UI Surfaces

| Surface | Recognition content |
| --- | --- |
| Home feed | Weekly recognitions, hot challenges, most buzzed moments, player<br>moments, club of the week. |
| City Hub page | Hub top scorers, assists, clubs, hot fixtures, active zones. |
| Zone/Belt page | Zone player leaders, zone club leaders, zone pulse, inter-zone<br>recognition. |
| Competition page | Competition top scorers, assists, weekly leaders, player of the week,<br>standings moments. |
| Club page | Club awards, weekly mentions, player leaders, challenge<br>achievements. |
| Player profile | Badges, verified achievements, weekly mentions, competition<br>recognitions. |
| Challenge wall | Challenge of the week, most buzzed challenge, biggest upset, stood-<br>ground moments. |
| Venue page | Most active venue, popular venue, public fixtures hosted, booking<br>activity labels. |
| Admin dashboard | Candidates pending clearance, review queues, overrides, category<br>settings, publish controls. |

## 27. Notification and Distribution Behavior

The Awards Engine should not deliver messages itself. It should emit events that the Notification & Distribution Engine turns into WhatsApp, in-app, public feed, or shareable card updates.

| Event | Possible notification/distribution |
| --- | --- |
| weekly_recognition_published | Weekly summary sent to hub feed, competition followers, involved<br>clubs, and recognized players. |
| player_recognized | In-app/WhatsApp notification to player and club admin where allowed. |
| club_recognized | Club admins receive share card and public post prompt. |
| competition_recognition_published | Organizer and participating teams receive weekly leaderboard<br>update. |
| season_award_locked | Admin/Super Admin notification before public publishing. |
| recognition_corrected | Affected users/admins notified and public card updated. |

## 28. Admin Review, Override, and Audit

Recognition must remain exciting but credible. Admins need the power to review, delay, correct, hide, or override recognitions, especially when disputes, privacy, abuse, or data errors appear.

- Automatic categories can publish after clearance if configured.

- Major categories should enter review before publishing.

- Organizer-controlled competition awards can be reviewed by the competition organizer, with Kalaanba admin escalation for

disputes.

<!-- Page 13 -->

- Super Admin can override any award or recognition, but a reason and audit log are required.

- Corrections must preserve history. Do not delete and pretend nothing happened.

| Audit field | Meaning |
| --- | --- |
| recognitionId | Unique record. |
| categoryId | Category that produced the recognition. |
| windowId | Week, round, month, season, or custom window. |
| candidateDataSnapshot | Data used at time of selection. |
| ruleVersion | Award rule/config version used. |
| clearanceSnapshot | Trust, stats, moderation, privacy, and competition clearance at<br>publishing. |
| publishedBy | System, organizer, admin, or Super Admin. |
| overrideReason | Required if manual change differs from engine recommendation. |
| correctedFrom | Previous recognition record if amended. |

## 29. Moderation and Safety Integration

Recognition creates public content, so it must integrate with the Moderation & Safety Engine. Public cards, captions, challenge copy, fan-vote prompts later, comments later, and share text must be safe before distribution.

| Risk | Moderation requirement |
| --- | --- |
| Abusive challenge recognition copy | Hold before public feed or share card. |
| Unverified cheating accusation | Block public distribution and send to Trust/Admin if needed. |
| Referee abuse | Hide or restrict public content; escalate if severe. |
| Minor-protected player recognition | Apply restricted display or require admin approval. |
| Sensitive evidence or screenshots | Do not publish as part of recognition cards. |
| Crowd-inciting rivalry language | Hold, edit, suppress, or escalate. |

## 30. Conceptual Data Model

| Entity | Purpose |
| --- | --- |
| AwardCategory | Defines the category, label, type, scope, eligibility, calculation method,<br>and visibility. |
| RecognitionWindow | Defines the time/context window such as week, round, month,<br>competition, or season. |
| RecognitionCandidate | Stores generated candidates and their score/stat snapshot before<br>final selection. |
| RecognitionRecord | Stores final winner, ranked list, badge/card output, publication state,<br>and archive status. |
| RecognitionMetricSnapshot | Stores the metric values used to generate a candidate. |
| RecognitionCard | Stores generated visual/card metadata and share status. |
| RecognitionAuditLog | Stores actions, overrides, corrections, publishing events, and<br>clearance snapshots. |
| RecognitionConfig | Stores configurable defaults and scoped overrides. |

### 30.1 Example Category Structure

{ "categoryKey": "competition_goals_of_week", "label": "Goals of the Week", "categoryType": "performance", "scopeType": "competition", "cadence": "weekly", "metric": "verified_goals", "requiresTrustClearance": true, "requiresStatsClearance": true, "selectionMode": "automatic", "publishMode": "auto_after_clearance_or_admin_review", "tieBreakers": ["assists", "fewer_matches", "match_importance", "admin_review"],

<!-- Page 14 -->

"visibility": "public_if_competition_public" }

## 31. Engine Outputs

| Output | Used by |
| --- | --- |
| weeklyRecognitionSnapshot | Home feed, hub pages, notification summaries, admin dashboard. |
| competitionWeeklyLeaders | Competition pages, organizer dashboards, competition followers. |
| playerRecognitionBadges | Player profiles, player cards, public player moment feed. |
| clubRecognitionBadges | Club profiles, club cards, challenge wall. |
| seasonAwardSnapshot | Season archive, club/player history, awards pages. |
| recognitionCardPayload | Fan Buzz/Feed, Notification, share card generator. |
| pendingRecognitionReviewQueue | Admin Governance, organizer dashboard, Super Admin dashboard. |
| recognitionAuditTrail | Admin Governance and support review. |

## 32. Configurable Defaults

| Config area | Examples |
| --- | --- |
| Weekly window | Start day/time, end day/time, timezone, publishing delay, verification<br>grace period. |
| Category labels | Goals of the Week, Assist King, Club of the Week, Zone on Fire,<br>Challenge Kings. |
| Eligibility thresholds | Minimum matches, minimum appearances, minimum verified stats,<br>minimum competition fixtures. |
| Tie-breakers | Goals, assists, match importance, fewer matches, clean record, buzz,<br>admin review. |
| Hybrid weights | Performance weight, buzz weight, reliability weight, challenge weight. |
| Publishing rules | Auto publish, organizer review, admin review, Super Admin review. |
| Visibility rules | Public, unlisted, private competition, minor-protected, internal-only. |
| Card generation | Enabled categories, card templates, public stats shown, sponsor area<br>later. |
| Correction rules | Whether corrections update card, withdraw card, publish correction<br>note, or preserve old archive. |

## 33. Affected Engines and Required Changes

| Engine | Required relationship / change |
| --- | --- |
| Season Engine | Expose award windows, season phase, season eligibility, archive<br>hooks, and final award publication timing. |
| Trust & Verification Engine | Expose awardsClearance/statsClearance and hold recognitions when<br>records are disputed, void, suspicious, or under review. |
| Match / Fixture Engine | Provide confirmed match events, match type, date, venue, lineups,<br>scorers, assists, cards, and status. |
| Player / Affiliation Engine | Provide verified player stats, player identity state, competition<br>registration, public card eligibility, and privacy flags. |
| Competition & Rules Engine | Provide competition windows, participant eligibility, standings, fixture<br>contexts, award permissions, and organizer review authority. |
| RP Economy Engine | Provide trusted RP outputs, season RP champion data, challenge RP<br>movement, and RP-based award inputs. Awards Engine must not<br>calculate RP. |
| Challenge Engine | Provide challenge lifecycle, accepted/resolved status, challenge<br>result, draw/stood-ground output, upset context, and public challenge<br>metadata. |
| Zone Engine | Provide city hub, zone/belt mapping, zone ranks, inter-zone records,<br>and zone activity outputs. |

<!-- Page 15 -->

| Club Engine | Provide club identity, verification state, season participation, related-<br>club flags, and role permissions. |
| --- | --- |
| Fan Buzz Engine | Provide buzz scores and attention snapshots for buzz recognitions<br>and hybrid recognitions. |
| Notification & Distribution Engine | Deliver recognition announcements, share cards, weekly summaries,<br>and correction alerts. |
| Moderation & Safety Engine | Clear public recognition copy, share cards, captions, fan-vote<br>prompts, and comments later. |
| Admin Governance Engine | Store configuration, review queues, approval workflows, overrides,<br>audit logs, and rule versions. |
| Venue Engine | Provide venue activity, booking-linked fixtures, booking activity, venue<br>visibility, and venue trust state for venue recognitions. |
| Referee & Officiator Engine | Provide assignment/report reliability outputs for careful internal or light<br>public referee recognitions. |

## 34. V1 Scope

| Include in V1 | Reason |
| --- | --- |
| Weekly recognition engine | Keeps the app dynamic and gives users a reason to return. |
| Competition-specific weekly goals and assists | Every competition needs its own activity heartbeat. |
| Goals of the Week and Assists of the Week | Simple, objective, and highly shareable if stats are confirmed. |
| Top scorer and top assist provider per competition | Core sports expectation for competition pages. |
| Club of the Week and Most Active Club | Creates club pride and platform activity. |
| Challenge of the Week and Most Buzzed Challenge | Connects public drama to recognition. |
| Player milestone cards | Drives player acquisition and sharing. |
| Recognition cards | Turns recognition into distribution content. |
| Admin review queue | Protects credibility before public publication. |
| Trust/stats clearance integration | Prevents disputed or unverified data from being recognized. |
| Buzz recognition integration | Allows attention-based recognitions without corrupting performance<br>awards. |
| Award badges on profiles | Creates lasting pride and retention. |
| Season award snapshot | Archives final awards into historical records. |

## 35. Deferred / Later Scope

- Full fan voting system.

- AI-generated award writeups and narratives.

- Complex player ratings and Team of the Week automation.

- Team of the Season based on advanced positions and minutes.

- Goal of the Week public voting with video clips.

- Sponsor-backed awards and prizes.

- Monetary rewards or prize payouts.

- Full referee public rating and awards marketplace.

- Advanced venue awards based on verified facility quality audits.

- All-time leaderboards beyond simple historical records.

- Automated graphic generation beyond basic templates.

## 36. Product Guardrails

- Do not publish performance recognition from unverified, disputed, or voided records.

- Do not let Fan Buzz decide serious football merit awards alone.

- Do not fake assists if assists are not captured or confirmed.

- Do not let related-club or suspicious repeat-match patterns inflate awards without review.

- Do not expose sensitive evidence, private screenshots, or minor-protected player details in recognition cards.

- Do not silently change published winners. Corrections must be audit-logged.

- Do not make referee awards feel like public referee shaming or uncontrolled ratings in V1.

<!-- Page 16 -->

- Do not let weekly recognitions become spam. Use feed grouping, weekly summaries, and clean card design.

- Do not confuse venue popularity with confirmed availability or facility quality.

## 37. Locked Summary

The Awards & Recognition Engine is Kalaanba's recognition and retention layer. It must produce weekly, competition, matchday, monthly, season, and historical recognitions from trusted football records and approved attention signals. It should make the app feel alive every week through goals, assists, player moments, club activity, challenge moments, zone pulse, venue activity, and competition leaderboards. Performance recognition must come only from verified records. Buzz recognition must remain visibility-based and clearly labeled. Season awards create legacy, but weekly recognitions create movement. Every recognition should have a scope, a window, a data source, a clearance status, a publication state, and an audit trail. V1 should include weekly recognitions, per-competition goals and assists, top scorer and top assist provider leaderboards, player and club recognition cards, challenge recognition, buzz recognition, admin review, Trust clearance, and profile badges. The next system document should be the Moderation & Safety Engine, because the more Kalaanba publishes and distributes public recognition, the more strongly it must protect the platform from abuse, unsafe rivalry language, false accusations, and privacy mistakes.
