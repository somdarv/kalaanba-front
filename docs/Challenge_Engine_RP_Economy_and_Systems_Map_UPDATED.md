<!-- Converted from Challenge_Engine_UPDATED.pdf -->

# Kalaanba Challenge Engine - Updated Document

Updated with final RP Economy, Season, related-club, and configurability lock-ins.

| Field | Locked Value |
| --- | --- |
| Status | Updated locked direction / pre-architecture planning |
| Updated | 2026-05-06 |
| Key changes | 50 RP ranked challenge unlock; hard seasonal reset; related clubs no<br>RP; standard match RP Win +5 / Draw +3 / Loss +2. |

## 1. Purpose

The Challenge Engine is the public rivalry layer of Kalaanba. It lets clubs issue call-outs, put Respect Points on the line, invite fans into the drama, schedule matches, verify results, and move reputation only after football proves the claim. Public drama. Boringly fair rules underneath.

## 2. Updated Lock-ins from RP Economy and Season Engine

| Area | Updated locked direction |
| --- | --- |
| Season reset | Season RP hard-resets to 0 every April 1. No soft carryover. Lifetime RP<br>preserves legacy. |
| Ranked Challenge unlock | A club must have at least 50 Season RP to issue a Ranked Challenge. |
| Match RP base model | Standard RP-eligible verified match: Win +5, Draw +3, Loss +2. |
| Related clubs | Related clubs may play verified matches, but no Season RP, no Ranked<br>Challenge, and no RP transfer. |
| One-time bonuses | Profile completion +5 Season RP once; first verified match ever +10 Season RP<br>once. If earned off-season or before eligibility, queue for next eligible season. |
| Configurability | Every number, cap, window, threshold, percentage, penalty, multiplier, and<br>weight must be admin-configurable. |

## 3. Challenge Lifecycle

Drafted -> Issued -> Seen -> Countered | Accepted | Declined | Ignored -> Scheduling -> Scheduled -> Prediction Open -> Live -> Verification Pending -> Resolved | Disputed | Forfeited -> Archived

| State | Meaning |
| --- | --- |
| Issued | Challenge is public. Fans can react and share. Target has not accepted. No<br>settled Team A vs Team B visuals yet. |
| Seen | Target club has opened the Challenge. Useful for pressure and transparency. |
| Countered | Target accepts the spirit of the Challenge but proposes different terms. |
| Accepted | Both clubs agree. RP is locked. |
| Scheduling | Both clubs agree date, time, venue, format, and referee terms. |
| Scheduled | Challenge becomes a fixture. Team A vs Team B visuals are now allowed. |

<!-- Page 2 -->

| State | Meaning |
| --- | --- |
| Prediction Open | Fans can predict score near matchday. |
| Verification Pending | Match is done but result is not yet trusted enough to settle RP. |
| Resolved | Result is verified. RP movement is executed and ledgered. |
| Disputed | RP remains locked until verification/arbitration resolves the dispute. |

## 4. RP on the Line

Ranked Challenges transfer meaningful RP through locked stakes. Challenge RP should mostly come from another club, not from newly minted system points. Base match RP can still be awarded if the Challenge fixture is RP-eligible and verified.

| Outcome | RP rule |
| --- | --- |
| Challenger wins | Challenger receives respondent locked stake. Respondent loses locked stake. |
| Respondent wins | Respondent receives challenger locked stake. Challenger loses locked stake. |
| Draw | Both main stakes return. Challenger pays stood-ground cost to respondent. |
| No-show / forfeit | Present club receives stake. No-show club may receive extra penalty and<br>reliability mark. |
| Dispute | RP remains locked until result is verified or arbitrated. |
| Mutual cancellation | Locked RP returns unless late-cancellation rules apply. |

Default draw cost: 10% of stake, minimum 2 RP, maximum 15 RP. Public wording should say: "stood their ground" rather than "penalty."

## 5. Challenge Stake Table

Stake values are defaults. They must be configurable in admin settings.

| Season RP | Tier | Minimum Stake | Default Stake | Maximum Stake |
| --- | --- | --- | --- | --- |
| 0-49 | Unranked | Cannot issue ranked<br>challenge | - | - |
| 50-74 | Emerging | 10 RP | 10 RP | 15 RP |
| 75-149 | Rising | 15 RP | 20 RP | 30 RP |
| 150-349 | Local | 25 RP | 35 RP | 60 RP |
| 350-699 | Established | 50 RP | 70 RP | 120 RP |
| 700-1,199 | Elite | 80 RP | 120 RP | 200 RP |
| 1,200+ | Crowned | 120 RP | 180 RP | 300 RP |

## 6. Counter Offers

For V1, allow one counter from the target club and one accept/reject decision from the challenger. This supports real negotiation without endless back-and-forth.

| Counterable item | Example |
| --- | --- |
| RP amount | Target asks to reduce 80 RP to 50 RP. |
| Venue | Target requests neutral ground. |

<!-- Page 3 -->

| Counterable item | Example |
| --- | --- |
| Referee | Target requires a platform/referee-portal referee. |
| Match window | Target proposes Sunday instead of Saturday. |
| Format | Target asks for one-off instead of home-and-away. |
| Eligibility | Target requests registered squad only. |

## 7. Open Call-out Windows and Inter-zone Duels

Open Call-out Windows are special campaign periods where normal Challenge restrictions loosen. They create platform-wide excitement without making everyday Challenge behavior spammy.

- Open Call-out Windows may be monthly or occasional promotional periods.

- Zone leaders or top-zone clubs can challenge leaders of other zones, even across tier gaps,

because they represent their zone.

- Earned access should require top-zone rank, verified activity, clean reliability, no unresolved

disputes, and enough RP.

- Higher-ranked clubs put more RP on the line when accepting lower-tier or zone-leader challenges.

No RP is created out of thin air.

## 8. Result Verification and RP Settlement

Because Challenge outcomes move RP, result verification must be strong from V1. Use 2-of-3 verification with challenger scorer, respondent scorer, and assigned referee for ranked Challenges.

- Any two matching confirmations verify the result.

- If confirmations conflict or evidence is contested, the Challenge enters Disputed state.

- RP remains locked until verification, admin review, referee report, or arbitration resolves the case.

## 9. Related Clubs and Integrity

Related clubs can still record matches for history, development, and transparency. However, those matches generate no Season RP and cannot be Ranked Challenges. Integrity observers/managers should monitor repeat pairings, one-way RP feeding, heavy repeated losses, same-device/admin patterns, suspicious referee patterns, abnormal match frequency, and late-season manipulation. These should raise admin review flags, not automatically punish every case.

## 10. V1 Scope Recommendation

| Include in V1 | Reason |
| --- | --- |
| Issued call-out stage | Core public drama starts here. |
| Fan reactions and sharing | Creates Fan Buzz and soft-follow behavior. |
| RP balance and ledger | Required if RP matters. |
| 50 RP ranked challenge unlock | Prevents immediate spam and creates a verified activity path. |
| Tier-based stake floors/caps | Keeps Challenges meaningful without inflating the economy. |
| One counter offer | Supports negotiation without endless back-and-forth. |
| 72-hour response window | Gives club admins time to respond. |

<!-- Page 4 -->

| Include in V1 | Reason |
| --- | --- |
| 4-day scheduling window + optional<br>extension | Fits real grassroots life and prevents limbo. |
| 2-of-3 result verification | Required because RP moves after results. |
| Fan Buzz affects homepage rotation | Attention matters, but it does not mint RP. |

## 11. Updated Locked Summary

Kalaanba Challenges let clubs put reputation on the line. Clubs earn RP through RP-eligible verified matches during the active season. A club needs 50 Season RP to issue a Ranked Challenge. When a Ranked Challenge is accepted, both clubs lock meaningful RP based on configurable tier floors and caps. The match is scheduled, fans react and predict, results are verified through the trust process, and RP moves only after the result is settled. Season RP resets to zero every April 1. Lifetime RP preserves legacy. Related clubs can play verified matches but cannot generate RP or transfer RP between themselves. Every RP movement is ledgered.
