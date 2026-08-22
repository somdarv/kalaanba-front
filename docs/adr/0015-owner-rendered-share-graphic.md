# ADR-0015: The share graphic ships before the §16 minor-privacy work

- **Status:** Accepted
- **Date:** 2026-08-22
- **Work Packet:** WP-20260822-player-card-artefact
- **Affected engines:** Player & Affiliation, Moderation & Safety

## Context

Player & Affiliation §15 names two artefacts, not one: "static share images for
WhatsApp **and** a live URL that stays current". A card in a group chat is the
acquisition loop the product depends on, and a link in a WhatsApp thread is a
grey rectangle with a favicon.

`contracts/api/player/post-players-id-media.v1.yaml` carried a written fence:

> Minor-related restrictions are deferred to the §16 privacy work and are NOT
> enforced here yet. That gap is the reason the public card page and the share
> graphic are still fenced off.

That sentence treated both artefacts as one risk. They are not the same risk,
and the difference is who publishes.

§16 makes player cards public by default once claimed, and defers minor-related
privacy rules to a later packet. There is no `date_of_birth` field and no
`is_minor` flag on the player record today, so there is nothing to gate on even
if we wanted to: any gate written now would be a gate on a field that does not
exist.

## Decision

**The share graphic ships. The public card page stays fenced.**

The graphic is rendered client-side, in the owner's own browser, from the record
that browser already holds, and handed to the OS share sheet. Nothing is
published, indexed, or served to a stranger by the platform. A player pressing
"share" and sending their own card to their own group chat is the same act as
screenshotting the page, which they can already do and which no fence prevents.

The public card page is different in kind: it is the platform serving a child's
name, face and locality to anyone with the URL, indefinitely, to an audience the
child did not choose. That stays behind §16.

The fence in the media contract is narrowed to the public page accordingly.

## Alternatives considered

**Hold the graphic until §16 lands.** Rejected. It defers the acquisition loop
§15 identifies as the product's growth mechanism, for a protection it would not
actually deliver — a player who wants to send their card screenshots it, and a
screenshot has none of the provenance marks the drawn graphic carries.

**Gate on age now.** Rejected as unbuildable rather than undesirable. No field
carries age. Adding one is a §16 decision about consent, storage and minor data
handling, not something to smuggle in as a precondition for a share button.

**Strip identifying detail from the graphic.** Rejected. The graphic already
carries strictly less than the card on screen: no phone number, no email, no
locality, no evidence, no dispute notes, no admin overrides (Law 10). What is
left — stage name, full name, number, position, verified counters — is the card.
Removing it produces an artefact nobody would send.

## Consequences

**Positive**

- §15's acquisition loop ships, and ships as a designed 4:5 object rather than a
  screenshot of a web page.
- The graphic is drawn on canvas from the same `buildPlayerCardModel` the DOM
  card uses, so §15's two artefacts cannot drift apart.
- It carries provenance a screenshot cannot: the seeded-data stamp travels with
  the image, so a fabricated stat line cannot be passed off as a record.

**Negative**

- A minor can produce and send an image of their own card today. The platform
  does not publish it, but it also does not stop it.
- `moderation_status` is not consulted before rendering. This is correct for an
  owner-facing surface — the owner sees their own upload either way — but it
  means an image on hold can appear in a graphic the owner shares before
  Moderation has ruled on it.

**Follow-up**

- The §16 packet must revisit this ADR. If it introduces an age signal, the
  share button becomes gateable and the decision should be re-examined rather
  than assumed settled.
- The public card page remains out of scope and stays fenced in the media
  contract until §16 lands.
- When Moderation & Safety gains a queryable verdict, decide whether a held
  image should block the share button for the owner. This ADR does not settle
  that; it only records that today there is nothing to query.
