# ADR-0017: Reserved club names, and the tier that decides what one means

- **Status:** Proposed
- **Date:** 2026-08-23
- **Work Packet:** WP-20260823-club-creation
- **Affected engines:** Club (owner of the rule), Moderation & Safety (owner of the
  report path it deliberately does not replace), Admin Configuration & Governance
  (source of truth for the list)

## Context

Club creation had no front door. `POST /api/v1/clubs` shipped in WP-C1 and nothing
called it: the CTA was hidden on the theory that organisers would seed clubs by hand.
WP-20260823 opens self-service creation to any signed-in user, and that raises a
question the engine docs do not answer.

**Both engine docs are silent on a creation-time name gate.** Club engine doc §5 step 1
says only "Club name. Required. Keep it simple." Moderation & Safety §4 owns "public
content safety", but every example it gives is *authored copy* — captions, bios,
slogans, comments — and its impersonation handling is a **report flow**, which by
construction runs after the thing exists.

So the first person to sign up can register Asante Kotoko, and the only mechanism the
platform has is someone noticing and reporting it. On a platform whose entire currency
is "this club, this result, this record", a club identity that can be taken by whoever
types it first corrupts the thing the product is for.

Two rules are needed and neither is written down anywhere. Per
`engine-docs-mandatory.instructions.md`, that means an ADR rather than inventing them
in code.

## Decision

### 1. The gate lives in the Club engine; the report path stays in Moderation

Club engine doc §11 files **Name** under the Club engine's own "Versioned" field group.
Validating a club name at creation is therefore the Club engine validating its own
field, not Moderation reaching across a boundary (Law 1).

Moderation keeps the after-the-fact impersonation report for what the list misses. The
split is honest about what each mechanism can actually do: **a blocklist catches the
famous names, reports catch the rest.** Neither alone is sufficient and neither
replaces the other.

Profanity and slur filtering stays out of the Club engine entirely. That is Moderation's
list, it is an order of magnitude larger, and folding it in here would put the Club
engine in charge of a rule it does not own.

### 2. Tier is the first question, and it decides what a reserved name means

The creation flow opens with two doors, config-owned as `club.tiers`:

| Tier | What it is | On submit | Reserved name |
| ---- | ---------- | --------- | ------------- |
| `amateur` | A community side, friend crew, school or work team | Club is live immediately | **Refused** |
| `professional` | A registered club, academy or institution | Club is created `pending`, hidden from every public read | **Allowed to be claimed**, and claiming it is what the review checks |

This is the ordering insight the whole packet turns on. "Can this person use this name"
is unanswerable in the abstract and trivial once you know which door they came through.
Asking tier first turns one hard question into two easy ones.

A `professional` claim goes down §10's **document-based** upgrade path: a registration
document or institution letter, plus a second contact, reviewed by an admin. Cleared
means the club appears and §4's Verified Club badge becomes showable. Rejected means the
club is **archived**, never deleted (Law 13), and the name is released.

**The club is created held rather than deferred to a claim queue.** The alternative
considered was filing a claim that writes no club row until approval, which keeps an
unproven "Asante Kotoko" out of the table entirely. It was rejected because the Owner
then has nothing to look at, no way to add their documents incrementally, and no object
for the admin's decision to attach to. The cost of the chosen route is real: an
unverified row exists, and every read path has to respect it. That cost is paid
structurally rather than by discipline (see Consequences).

### 3. Matching: canonical anywhere, aliases exact

Each entry in `club.name.reserved_terms` is
`{ "canonical": string, "aliases": string[] }`. After normalisation (lowercase, strip
diacritics and punctuation, drop `club.name.ignored_tokens`, collapse whitespace):

- the **canonical** name matches if it appears anywhere in the candidate as whole tokens
- each **alias** matches only if it is the whole candidate

| Candidate | Verdict | Why |
| --------- | ------- | --- |
| `Asante Kotoko`, `asante kotoko fc` | refused | canonical, ignored token dropped |
| `Tamale Manchester United` | refused | canonical, anywhere |
| `Man Utd` | refused | alias, whole candidate |
| `Kotoko Boys` | **allowed** | alias, not the whole candidate |
| `Hearts FC`, `Young Chelsea`, `Taha Stars` | **allowed** | same |

**The asymmetry is the decision, not an implementation detail.** A full club name is
specific enough that containing it is always a claim on that club. A single word is not.
"Kotoko" is the Twi word for porcupine and "Hearts" is an ordinary English word; a
Tamale side called Kotoko Boys is not impersonating anyone, and refusing them their own
name to catch a dodge nobody has attempted is the wrong trade in a product built for
exactly those teams.

The rule this encodes: **when in doubt, a word goes in `aliases`, never in a `canonical`
of its own.**

### 4. The list is configuration, and the client never sees it

`club.name.reserved_terms` is a config key at `medium` approval, not a constant in
domain code. A list of famous clubs compiled into a deploy is a magic number with extra
steps (Law 2), and this particular list will need editing the week real clubs arrive.

`GET /api/v1/clubs/meta` serves the tiers, the types and the name bounds, and
deliberately **does not** serve the reserved list. Three reasons, in order of weight:
whether a name may be used is a verdict and verdicts are backend truth (Law 3); a client
copy of a value that changes without a deploy is stale by construction, which is the
exact failure ADR-0007 was written about; and publishing the list publishes the map for
routing around it. The client submits and reacts to `club.name_reserved`.

## Consequences

**The held club must be invisible, and that cannot rest on remembering.** A `pending`
club is a row in `clubs` bearing a name it has not earned. The filter therefore lives in
one private query builder inside `EloquentClubStore`, which every read routes through,
`findById` and `listByArea` included. `listAdminClubsForUser` is the single deliberate
exception, because an Owner must be able to see their own club under review. That one
asymmetry, stated once next to the rule it breaks, is the whole enforcement surface. A
partial unique index on the normalised name where `verification_state = 'pending'` stops
two people holding the same claim at once.

**False negatives are expected and accepted.** "Kotoko Boys" passes. So will names this
list has never heard of, and every dodge that avoids containing a full canonical name.
That is what the Moderation report path is for, and it is why this ADR does not claim
the blocklist solves impersonation. It raises the cost of the obvious attack from zero
to "an admin has to approve you."

**The tier map is a judgement that will move.** `club.types.tier` puts school and
corporate under `amateur` by default, against §10's grouping of "Schools, academies,
corporates" under the document path, on the grounds that a class team is grassroots
football and should not need an institution letter to exist. It is a config map so that
call can be revisited without a deploy once real schools test it.

**Evidence handling arrives with a cost.** The `professional` door needs a private R2 disk
(the existing `r2` disk carries a public base URL for player media) and a *recoverable*
second contact number, which breaks the Identity engine's hash-plus-last-4 pattern
because an admin has to dial it. Both land in WP-20260823-club-verification with their
own security review, and both are narrow, deliberate exceptions recorded there.

## Alternatives considered

**Block on any shared word.** The strictest reading of "an amateur club cannot use pro
names or related". Refuses every dodge, and also refuses Kotoko Boys, Hearts FC and
Young Chelsea. Rejected: the false positives land on precisely the grassroots teams this
platform exists to serve, and they land silently, at the moment those teams are trying
to sign up.

**Exact match only.** Lets "Tamale Manchester United" straight through. Rejected as too
weak to be worth the config surface.

**Claim queue with no club row until approval.** Cleaner on paper: nothing unproven ever
exists. Rejected because the claimant has nothing to see and the admin has nothing to
decide *about*; the decision went to a held row plus a structural filter.

**One list, no tiers.** Simply refuse reserved names to everybody. Rejected because it
leaves the real Asante Kotoko permanently unable to join the platform, which inverts the
problem rather than solving it.
