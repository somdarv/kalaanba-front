<!-- Converted from Season_Engine_UPDATED.pdf -->

# Kalaanba Season Engine - Updated Document

Updated with final RP Economy bonus queue rules, RP eligibility refinements, and platform-wide configurability.

| Field | Locked Value |
| --- | --- |
| Status | Updated locked direction, with configurable defaults |
| Updated | 2026-05-06 |
| Primary calendar | April 1 to February 28/29; March Transition Month; December-January<br>High Activity Peak. |

## 1. Purpose

The Season Engine is Kalaanba's timing and eligibility layer. It coordinates which period is active, which rules apply, who can participate, which matches can affect Season RP, and when records must be frozen and archived.

## 2. Locked Season Calendar

| Period | Role | Season RP? |
| --- | --- | --- |
| April 1 - November 30 | Active Season: normal play, RP growth, ranked<br>challenges, zone competition, leaderboards. | Yes, if eligible |
| December - January | High Activity Peak: festive/holiday football intensity<br>and major grassroots activity. | Yes, if eligible |
| February | Final Run-In: still active, but challenge cutoffs and<br>dispute pressure begin. | Yes, if eligible |
| March 1 - March 14 | Closing Window: resolve verification, disputes, locked<br>RP, admin rulings, final leaderboard preparation. | No new RP |
| March 15 - March 31 | Archive / Setup / Preseason: publish awards, freeze<br>records, update zones, onboard clubs/venues/refs. | No new RP |

## 3. Season RP and Lifetime RP

| RP type | Meaning | Used for |
| --- | --- | --- |
| Season RP | Current-season reputation. Hard-resets<br>to 0 every April 1. | Current rankings, tiers, challenge<br>eligibility, RP stakes, zone leaders,<br>awards. |
| Lifetime RP | Historical reputation accumulated from<br>archived Season RP snapshots. | Legacy profile, historical pride, all-time<br>records, long-term credibility. |

Locked rule: No soft carryover. Bigger clubs are respected through Lifetime RP and archives, not a head start in the new season.

## 4. Club Registration and Season Participation

<!-- Page 2 -->

| Rule | Locked direction |
| --- | --- |
| Default participation | Every active club on Kalaanba automatically joins the platform season<br>unless it opts out. |
| Season cutoff | July 31. Clubs joining after this date cannot participate in the current<br>Kalaanba Season. |
| Late clubs | Can still create profiles, record matches, use tools, and prepare for next<br>season. |
| Opt-out | Allowed, but opt-out clubs cannot earn Season RP or compete in official<br>season rankings/awards. |

If a participating club plays a non-participating club, the match can still be recorded and verified, but it does not generate Season RP for the participating club.

## 5. Queued One-time RP Bonuses

The RP Economy Engine now locks two one-time bonuses: +5 Season RP for completing club profile and +10 Season RP for first verified match ever.

| Situation | Handling |
| --- | --- |
| Club is season-eligible | Bonus applies to the current Season RP once. |
| Club joins after July 31 cutoff | Bonus is queued for the next eligible season. |
| Bonus is earned in<br>March/off-season | Bonus is queued for the next eligible season. |
| Bonus was already used | No repeat bonus. |

## 6. Verified Match vs RP-Eligible Match

| Concept | Definition |
| --- | --- |
| Verified Match | A trusted match record confirmed through Kalaanba's verification process. It<br>means the match happened and the result is reliable. |
| RP-Eligible Match | A verified match allowed to affect Season RP because it meets season,<br>participation, match-type, related-club, and anti-farming rules. |

All RP-eligible matches must be verified, but not all verified matches are RP-eligible.

## 7. RP Eligibility Rules

| Condition | Required for Season RP? |
| --- | --- |
| Played during April 1 - February 28/29 | Yes |
| Both clubs are active season participants | Yes |
| Both clubs are separate recognized clubs | Yes |
| Result is verified | Yes |
| Match is not unresolved, duplicated, disputed, or nullified | Yes |
| Match is in March Transition Month | No Season RP |
| One club is not participating in the season | No Season RP |
| Related clubs / same parent group | No Season RP |

<!-- Page 3 -->

| Condition | Required for Season RP? |
| --- | --- |
| Same-club training match | No Season RP |

## 8. Limited RP Effect

Every eligible interclub verified match should affect RP, but not every match carries the same weight. Defaults are configurable.

| Match type | RP effect direction |
| --- | --- |
| Verified friendly | Low RP / limited RP |
| Competition match | Standard RP |
| Ranked Challenge | Standard base RP plus stake transfer |
| Zone leader duel | Standard base RP plus zone/rivalry implications |

Current standard RP model: Win +5, Draw +3, Loss +2 for RP-eligible verified matches. Specialized match types may use configurable multipliers or direct values.

## 9. Challenge Cutoffs and Season-end Handling

| Default cutoff | Rule |
| --- | --- |
| February 7 | No new ranked challenges after this date. |
| February 14 | No new ranked challenge acceptance after this date. |
| February 28/29 | All ranked challenge matches must be played by this date. |
| March 1 - March 14 | Verification, disputes, locked RP, and admin rulings are settled. |

Locked RP is not treated as won or lost until settlement. The season archive is created only after locked RP is transferred, returned, or ruled on.

## 10. Fan Buzz and Seasons

Fan Buzz is season-aware and competition-aware. It does not create RP. It affects visibility, homepage rotation, storytelling, and awards.

| Buzz context | Meaning |
| --- | --- |
| Kalaanba Season Buzz | How hot a match/challenge is within the platform season. |
| Competition Buzz | How hot it is inside a specific league/tournament context. |
| Hub Buzz | How much attention it is getting within a City Hub. |
| Zone/Belt Buzz | How much attention it is getting inside or across zones/belts. |

## 11. Season Archive

At season end, Kalaanba creates permanent snapshots to protect history even if club names, zones, crests, or structures change later.

- Club archive: final Season RP, Lifetime RP at close, hub rank, zone/belt rank, matches, W-D-L,

goals, verified match count, challenge record, RP won/lost, no-shows, disputes, Fan Buzz highlights, awards.

- Zone/Belt archive: final zone score, zone rank, top club, top 5 clubs, total verified matches,

inter-zone record, challenge record, most active club, most buzzed challenge.

<!-- Page 4 -->

## 12. Configurable Defaults

Use defaults for now, but every value-driven rule must remain configurable across the platform.

| Default | Current value |
| --- | --- |
| Season start | April 1 |
| Season end | February 28/29 |
| Transition Month | March |
| High Activity Peak | December - January |
| Season RP reset | Hard reset to 0 |
| Season participation cutoff | July 31 |
| Closing Window | March 1 - March 14 |
| Archive/setup window | March 15 - March 31 |
| New ranked challenge cutoff | February 7 |
| Ranked challenge acceptance cutoff | February 14 |
| Off-season/March RP | No RP |

## 13. Locked Summary

Kalaanba uses a yearly platform-wide season from April 1 to February 28/29. December and January are the high-activity peak. February is the Final Run-In. March is the Transition Month for closing, archiving, dispute resolution, setup, onboarding, and zone adjustments. Season RP hard-resets to 0 every April 1, while Lifetime RP preserves legacy. Clubs can join Kalaanba anytime, but season participation closes on July 31. Verified matches can be recorded all year, but only RP-eligible matches inside the active season generate Season RP. One-time bonuses earned off-season or after cutoff are queued for the next eligible season. The Season Engine coordinates timing, cutoffs, participation, archive, and reset rules for other engines.
