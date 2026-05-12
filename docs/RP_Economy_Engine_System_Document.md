<!-- Converted from RP_Economy_Engine_System_Document.pdf -->

# Kalaanba RP Economy Engine / System Document

Locked product direction for Season RP, Available RP, Locked RP, Lifetime RP, one-time onboarding bonuses, match RP, challenge stakes, RP transfers, ledger rules, anti-farming, tiering, and configurable defaults.

| Status | Locked direction, with configurable defaults |
| --- | --- |
| Primary owner | RP Economy Engine |
| Depends on | Season Engine, Trust/Verification, Match/Fixture, Challenge, Zone, Club |
| Season basis | April 1 to February 28/29; March Transition Month |
| Season RP reset | Hard reset to 0 every April 1 |
| Ranked Challenge<br>unlock | 50 Season RP |
| Core principle | RP should feel valuable, scarce, earned, and auditable. |

### Core summary

The RP Economy Engine is Kalaanba's reputation banking system. It controls how RP is created, stored, locked, transferred, deducted, protected, reset, and archived. Ordinary verified football activity creates RP slowly. Ranked Challenges move meaningful RP between clubs through locked stakes. Every RP movement must be ledgered.

## 1. Purpose of the RP Economy Engine

The RP Economy Engine answers the reputation questions that other engines depend on: how clubs earn RP, whether a match is RP-eligible, whether a club can issue a ranked Challenge, how much respect is on the line, what happens when results are verified, and how suspicious RP patterns are flagged for review. The engine should not own match verification, challenge lifecycle, zone scoring, awards, referee trust, or fan buzz. It consumes trusted outputs from those systems and owns the RP result.

## 2. Core RP Philosophy

- RP is reputation, not money. Public language should say "Respect on the line", not betting or gambling language.

- Season RP powers the current race: rankings, tiers, Challenge eligibility, stakes, zone leaders, and awards.

- Lifetime RP preserves history and cannot be spent, locked, staked, or transferred.

- Ordinary football activity mints RP slowly. Ranked Challenges transfer meaningful RP from one club to another.

- Fan Buzz never creates RP. Buzz drives visibility; results drive respect.

- Every value, weight, percentage, cap, threshold, penalty, and window must be configurable later from admin

settings.

## 3. RP Types

<!-- Page 2 -->

| RP Type | Meaning | Used For |
| --- | --- | --- |
| Season RP | The current-season reputation score.<br>Hard-resets to 0 every April 1. | Rankings, tiers, Challenge eligibility, RP<br>stakes, zone leaders, awards. |
| Available RP | The usable portion of Season RP not currently<br>locked in active Challenges. | Challenge stake checks and new ranked<br>Challenge eligibility. |
| Locked RP | Season RP temporarily held after a ranked<br>Challenge is accepted. | Prevents clubs from reusing the same RP in<br>multiple active Challenges. |
| Lifetime RP | Historical RP record across Kalaanba<br>seasons. | Legacy profile, all-time reputation, historical<br>credibility. Not spendable. |
| Queued RP Bonus | A one-time reward earned before a club is<br>season-eligible. | Applied to the next eligible season rather than<br>creating off-season RP. |

## 4. Season Relationship

RP is tied to the Kalaanba platform season. Season RP is earned only during the active season, April 1 to February 28/29, when the club and match satisfy RP eligibility. March is the Transition Month: matches can be recorded and verified, but they do not generate Season RP.

- Season RP resets to 0 every April 1.

- No soft reset or carryover is used.

- Lifetime RP preserves legacy through archived final Season RP snapshots.

- Clubs can join Kalaanba anytime, but current-season participation closes on July 31.

- If a participating club plays a non-participating club, the match may be verified but produces no Season RP.

## 5. Verified Match vs RP-Eligible Match

A verified match is a trusted match record. An RP-eligible match is a verified match that is allowed to affect Season RP. All RP-eligible matches must be verified, but not all verified matches are RP-eligible.

| Condition | Season RP? |
| --- | --- |
| Played during April 1 to February 28/29 | Yes, if all other conditions pass |
| Both clubs are active season participants | Required |
| Both clubs are separate recognized clubs | Required |
| Result is verified and not disputed/nullified | Required |
| Match is in March Transition Month | No RP |
| One club is not participating in the season | No RP |
| Related clubs / A-team vs B-team / same parent clubs | Verified history only; no RP |
| Same-club training match | No RP |

## 6. One-Time Onboarding Bonuses

A club profile is created once, so a small welcome bonus is acceptable. These bonuses are not repeated every season. If earned while the club is not eligible for the current season, the reward is queued for the next eligible season.

<!-- Page 3 -->

| Action | Reward | Frequency | Season Handling |
| --- | --- | --- | --- |
| Complete club profile | +5 Season RP | Once per club | Applied immediately if season-eligible;<br>otherwise queued. |
| First verified match ever | +10 Season RP | Once per club | Applied immediately if season-eligible;<br>otherwise queued. |

## 7. Standard Match RP Model

For a standard RP-eligible verified match, both clubs earn RP. The losing club still receives RP for participation in a verified match because Kalaanba wants clubs to record real football honestly, even when they lose.

| Result | Season RP |
| --- | --- |
| Win | +5 RP |
| Draw | +3 RP |
| Loss | +2 RP |

These values are defaults. They must be configurable later through admin settings.

## 8. Limited RP Effect by Match Type

Every eligible interclub verified match should affect RP, but not every match should carry the same weight. Friendly matches, competition matches, ranked Challenges, and Zone Leader Duels may use different values or multipliers.

| Match Type | RP Direction |
| --- | --- |
| Verified friendly | Low RP effect. Defaults can use the standard table or a reduced configurable table. |
| Competition match | Standard RP effect. |
| Ranked Challenge | Small base match RP plus stake transfer. The major RP movement comes from locked<br>stakes. |
| Zone Leader Duel | Standard base RP plus zone/rivalry implications. |

## 9. Ranked Challenge Unlock

A club must have at least 50 Season RP to issue a Ranked Challenge. This creates a clean progression: complete club setup, play verified matches, earn Season RP, reach 50 RP, then unlock ranked call-outs where real respect is on the line.

## 10. Challenge Stakes

Ranked Challenges must not use pure percentage staking alone, because low-RP clubs would risk tiny values that feel unserious. Challenge stakes use tier-based floors and caps, with all values configurable.

| Season RP | Tier | Minimum Stake | Default Stake | Maximum Stake |
| --- | --- | --- | --- | --- |
| 0-49 | Unranked | Cannot issue ranked<br>Challenge | - | - |
| 50-74 | Emerging | 10 RP | 10 RP | 15 RP |
| 75-149 | Rising | 15 RP | 20 RP | 30 RP |

<!-- Page 4 -->

| Season RP | Tier | Minimum Stake | Default Stake | Maximum Stake |
| --- | --- | --- | --- | --- |
| 150-349 | Local | 25 RP | 35 RP | 60 RP |
| 350-699 | Established | 50 RP | 70 RP | 120 RP |
| 700-1,199 | Elite | 80 RP | 120 RP | 200 RP |
| 1,200+ | Crowned | 120 RP | 180 RP | 300 RP |

Formula: Challenge Stake = max(tier minimum stake, percentage-based stake), bounded by the tier maximum stake.

## 11. RP Locking

When a ranked Challenge is accepted, each club's stake moves from Available RP to Locked RP. Locked RP cannot be reused for another active Challenge. It is released, transferred, returned, or penalized only after the Challenge resolves or is ruled on.

| Moment | Aboabo United | Aboabo City |
| --- | --- | --- |
| Before acceptance | 200 available / 0 locked | 200 available / 0 locked |
| After 40 RP Challenge accepted | 160 available / 40 locked | 160 available / 40 locked |
| If Aboabo United wins | +40 net from City | -40 net to United |

## 12. Challenge Outcome RP Rules

| Outcome | RP Rule |
| --- | --- |
| Challenger wins | Challenger receives respondent's locked stake. Respondent loses locked stake. |
| Respondent wins | Respondent receives challenger's locked stake. Challenger loses locked stake. |
| Draw | Both main stakes are returned, but challenger pays a stood-ground cost to respondent.<br>Default: 10% of stake, minimum 2 RP, maximum 15 RP. |
| No-show / forfeit | Present club receives stake. No-show club may receive additional RP penalty and<br>reliability mark. |
| Dispute | RP remains locked until verification, arbitration, or admin ruling. |
| Mutual cancellation | Locked RP is returned unless late-cancellation rules apply. |

## 13. Related Clubs

Related clubs can play verified matches for history and football operations, but those matches generate no Season RP and cannot be Ranked Challenges. This includes A-team/B-team relationships, academy/senior-side relationships, same manager-controlled clubs, same ownership groups, same squad pools, and clubs flagged by admin/system as related.

## 14. Lifetime RP

Lifetime RP is historical only. It cannot be spent, locked, staked, transferred, or used for current-season challenge economics. Locked formula: Lifetime RP = sum of archived final Season RP snapshots. Example: if a club ends three seasons with 240 RP, 180 RP, and 310 RP, its Lifetime RP becomes 730 RP. This preserves legacy without giving current-season advantage.

<!-- Page 5 -->

## 15. RP Transaction Ledger

The ledger is non-negotiable. It is the permanent audit trail of every RP movement. If a club asks why its RP changed, the ledger must answer clearly.

| Field | Description |
| --- | --- |
| transactionId | Unique record for the RP movement. |
| clubId | The club affected by the transaction. |
| seasonId | The Kalaanba season the transaction belongs to. |
| challengeId / fixtureId | Source record, if applicable. |
| type | match_award, stake_locked, stake_released, transfer_in, transfer_out, penalty,<br>admin_adjustment, season_reset, etc. |
| amount | Positive or negative RP movement. |
| balanceBefore / balanceAfter | Audit snapshot for available/season balance. |
| lockedBefore / lockedAfter | Audit snapshot for locked RP. |
| reason | Human-readable explanation for club/admin RP history. |
| createdBy / source | System, admin, referee, result verification, season job, etc. |
| metadata | Extra context, evidence IDs, rule IDs, or admin note. |

## 16. Transaction Types

- profile_completion_bonus

- first_verified_match_bonus

- queued_bonus_applied

- match_win_award

- match_draw_award

- match_loss_participation_award

- stake_locked

- stake_released

- stake_transferred_in

- stake_transferred_out

- draw_stood_ground_transfer

- no_show_penalty

- forfeit_penalty

- dispute_penalty

- admin_adjustment

- season_reset

- season_archive_snapshot

## 17. Anti-Farming and Integrity Monitors

<!-- Page 6 -->

The RP economy requires observers/managers that monitor results and RP flows. These systems should raise admin review flags, not automatically punish every suspicious case.

| Risk | Protection |
| --- | --- |
| Repeat pairings | Full RP only for first configured number of matches between same clubs within a<br>configured window. Later matches reduced or blocked. |
| Related clubs | Verified history only; no RP and no Ranked Challenge. |
| Fake clubs created to lose | New clubs must meet verification/activity requirements before ranked Challenge<br>transfer is allowed. |
| One-way RP feeding | Flag repeated RP transfers from one club to another. |
| Suspicious losses | Flag heavy repeat losses, strange scorelines, repeated opponents, and abnormal<br>timing. |
| Referee pattern risk | Flag suspicious repeated referee patterns once referee data exists. |
| Same admin/device patterns | Flag links between clubs involved in RP movement. |
| Fan Buzz manipulation | Buzz affects visibility only, never RP. |

## 18. Configurable Defaults Rule

Platform-wide rule: anything dependent on a numerical value, threshold, weight, percentage, window, cap, penalty, reward, or limit must be configurable.

- match RP rewards

- friendly/competition/challenge RP multipliers

- ranked Challenge threshold

- tier boundaries

- stake floors and caps

- draw-cost percentage

- anti-farming windows

- repeat-match decay

- no-show penalties

- dispute penalties

- season cutoffs

- challenge deadlines

- fan buzz weights

- zone score weights

- award qualification thresholds

## 19. Engine Responsibilities

| Owns | Does Not Own |
| --- | --- |
| Season RP balance, Available RP, Locked RP, Lifetime<br>RP | Match verification logic |

<!-- Page 7 -->

| Owns | Does Not Own |
| --- | --- |
| RP minting, transfer, locking, release, deduction,<br>penalties, refunds | Challenge lifecycle states |
| RP transaction ledger and RP audit history | Zone score formula |
| RP eligibility checks and tier outputs | Award winners |
| Anti-farming observers and admin flags | Fan Buzz formula |
| Season reset and RP snapshot inputs | Referee trust and dispute evidence rules |

## 20. Flexible Outputs

- getClubRPBalance(clubId, seasonId)

- getClubRPHistory(clubId, seasonId)

- getClubTier(clubId, seasonId)

- getChallengeStakeOptions(clubId, targetClubId)

- getRPEligibilityForMatch(fixtureId)

- getRPLeaderboard(hubId, seasonId)

- getZoneRPTable(zoneId, seasonId)

- getLockedRPReport(clubId)

- getSeasonRPSnapshot(seasonId)

- getSuspiciousRPFlags(filters)

## 21. Dependencies and Related Engines

| Engine/System | Relationship to RP Engine |
| --- | --- |
| Season Engine | Determines active season, cutoffs, participation, reset, and archive timing. |
| Trust & Verification Engine | Determines whether a record is trusted enough to affect RP. |
| Match / Fixture Engine | Provides match type, result, clubs, venue, and verification state. |
| Challenge Engine | Requests stake calculation, RP locking, transfers, and penalties. |
| Zone Engine | Consumes Season RP for zone ranks, leaders, and inter-zone context. |
| Club Engine | Provides club identity, related-club links, participation status, and eligibility. |
| Leaderboard Engine | Consumes RP outputs; should not recalculate RP itself. |
| Admin Governance | Configures RP values and reviews suspicious flags. |

## 22. Locked Summary

The RP Economy Engine controls Season RP, Available RP, Locked RP, Lifetime RP, match RP rewards, ranked Challenge transfers, one-time onboarding bonuses, related-club restrictions, anti-farming rules, tier thresholds, stake rules, and the RP ledger. Season RP resets to zero every April

## 1. Clubs earn RP through RP-eligible verified matches during the active season. Standard matches

award +5 RP for a win, +3 RP for a draw, and +2 RP for a loss. Profile completion gives +5 Season RP once, and the first verified match ever gives +10 Season RP once; if either happens before season

<!-- Page 8 -->

eligibility, the reward is queued. Ranked Challenges unlock at 50 Season RP and transfer meaningful RP using locked stakes. Lifetime RP is historical and equals the sum of archived final Season RP snapshots. Every numerical rule is configurable.

## 23. Previous Documents to Update

The following updates should be made to earlier documents so the docs stay synchronized with the RP Economy lock-in.

| Document | Recommended update |
| --- | --- |
| Challenge Engine document | Change Ranked Challenge unlock from 30 Season RP to 50 Season RP. Replace the<br>older 0-29 Unranked table row with 0-49 Unranked. |
| Challenge Engine document | Update related-club rule: related clubs can play verified matches, but no Season RP<br>and no Ranked Challenges between them. |
| Challenge Engine document | Update ordinary verified match RP to the simplified table: Win +5, Draw +3, Loss +2,<br>with match-type modifiers/configuration where needed. |
| Challenge Engine document | Remove/override any soft-carryover language. The Season document now locks hard<br>reset to 0 every April 1. |
| Season Engine document | Add that one-time profile completion and first verified match bonuses are queued for<br>the next eligible season when earned off-season or after cutoff. |
| Season Engine document | Add explicit note: March/off-season matches may be verified records but do not<br>create RP; one-time bonuses earned then are queued. |
| Zone Engine document | No major change required. It should consume RP Engine outputs and should not<br>calculate RP directly. |

## 24. Recommended Next Engine

Next recommended engine: Club Engine. Reason: RP, seasons, challenges, zones, related-club restrictions, participation cutoff, profile bonuses, club name/crest history, and eligibility all depend on having a strong definition of what a club is and what a club is allowed to do.
