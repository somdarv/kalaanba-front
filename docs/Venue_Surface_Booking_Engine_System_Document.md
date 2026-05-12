<!-- Converted from Venue_Surface_Booking_Engine_System_Document.pdf -->

# Kalaanba Venue, Surface & Booking Engine System Document

Locked product direction for venues, surfaces, facility manager portals, availability calendars, fixture-linked bookings, online payments, commissions, venue discovery, verification, and cross-engine dependencies.

| Field | Locked Value |
| --- | --- |
| Status | Locked direction / pre-architecture planning |
| Primary owner | Venue, Surface & Booking Engine |
| Core principle | Kalaanba must know where football happens, whether the place is trusted,<br>whether a slot is truly available, and whether the booking is financially committed. |
| Alpha stance | Validate basic football activity: clubs, match creation, team sheets, venue/manual<br>location, score entry, result confirmation. |
| V1 stance | Full user-acquisition booking loop: facility manager portal, surface calendar, online<br>payment, commission record, booking-linked fixtures, venue discovery, and admin<br>governance. |
| Payment stance | Online payment is required to confirm bookable platform venue slots. Automatic<br>payout is preferred but PSP-dependent; settlement may be manual or scheduled in<br>V1. |
| Location modes | Bookable platform venue, listed/non-bookable venue, open/community venue, and<br>manual venue text. |
| Document date | May 10, 2026 |

### Final principle

The Venue Engine is not just a booking tool. It is Kalaanba's football place layer and one of the strongest acquisition and revenue engines in the platform.

<!-- Page 2 -->

## Document Map.

- Purpose and why this engine matters

- Core principles and alpha-to-V1 position

- Definitions: venue, facility, surface, booking, block, listing, manager

- Venue/location modes and availability confidence

- Facility manager portal and role model

- Surface calendar, conflicts, offline blocks, and booking lifecycle

- Online payments, commission, settlement, refunds, and no-show handling

- Cross-engine integrations and required changes in existing engines

- Conceptual data model, outputs, configuration, V1 scope, deferred scope, and locked summary

<!-- Page 3 -->

## 1. Purpose

The Venue, Surface & Booking Engine owns the physical football place layer of Kalaanba. It defines how venues are discovered, verified, listed, photographed, mapped, booked, paid for, blocked, linked to fixtures, and used as evidence inside the wider platform. In simple terms, this engine answers: where is the match happening, what exact surface is being used, is that slot really available, has the booking been confirmed, who manages the place, and what does this location mean for the fixture, challenge, competition, zone, referee, trust, and payment systems? The engine is also a market-entry tool. Facility managers get a booking system and visibility. Clubs get searchable venues and confirmed slots. Kalaanba gets trusted football location data, booking revenue, and a natural acquisition route into grassroots football.

### What this engine owns

- Venue/facility identity, location, manager access, contact information, verification state, and public

page data.

- Surface/pitch records, including pitch type, format support, dimensions, lighting, media, and

surface-specific calendar.

- Availability calendars, offline blocks, maintenance blocks, pending holds, confirmed bookings, and

booking conflict checks.

- Facility manager portal workflows for managing bookings, surfaces, pricing, blocked slots, rules, and

media.

- Online booking payment status, commission calculation, settlement tracking, refund/cancellation

records, and payment references.

- Venue discovery filters, location confidence, booking confidence, and facility trust signals.

- Venue evidence inputs used by Trust, Match, Challenge, Competition, Zone, Referee, Admin

Governance, Notification, and future Payments systems.

### What this engine does not own

| Does not own | Owner |
| --- | --- |
| Match lifecycle and result<br>confirmation | Match / Fixture Engine and Trust & Verification Engine |
| RP awards or challenge stake<br>transfer | RP Economy Engine and Challenge Engine |
| Competition points, tiebreakers,<br>match rules, or brackets | Competition and Rules Engine |
| Final dispute verdicts and platform<br>overrides | Trust & Verification Engine / Admin Governance |
| Payment provider integration details<br>and payout rails | Payments Engine / PSP integration layer |
| Referee assignment lifecycle | Referee & Officiator Engine |

## 2. Why This Engine Matters

Kalaanba wants to capture the full grassroots football activity cycle: clubs form teams, create fixtures, find venues, book surfaces, assign officials, play matches, confirm results, update records, and build public football history. Venue booking is therefore not a side feature. It is part of the core loop. Without venue structure, fixture creation stays weak. A match can be created, but the pitch may not be available. A challenge can be accepted, but the neutral venue may not be secured. A competition can be launched, but fixtures may clash. A no-show claim can be raised, but proof of presence may be unclear.

<!-- Page 4 -->

With venue structure, Kalaanba can bring order to how grassroots venues are discovered and booked. It can reduce double-booking, strengthen match verification, create revenue through commissions, and give venue owners a reason to join before every club in their area is already active.

### User acquisition logic

The venue portal is a direct acquisition strategy. Kalaanba can approach a facility owner with a practical offer: use this booking calendar, manage offline and online bookings in one place, reduce double bookings, collect committed payments, and receive more football users through Kalaanba discovery. The strongest product message is: we help you manage your pitch and fill your calendar. Kalaanba earns only when the platform brings or processes a booking, unless another commercial model is later configured.

## 3. Core Principles

- Venue data must be useful even before a venue is fully bookable. Discovery can start with listed

venues, but availability confidence must be honest.

- A venue can have many surfaces. The surface is what gets booked, not only the venue name.

- Bookable platform venues must use a calendar that prevents confirmed double-booking for the same

surface and time.

- Facility managers need their own portal and login experience, scoped only to the facilities they

manage.

- Online payment is required to confirm a bookable Kalaanba slot, except where admin or manager

override is explicitly allowed.

- Offline bookings must be entered as blocks so the Kalaanba calendar remains reliable.

- Manual venue text remains allowed because grassroots football cannot be forced into perfect data

from day one.

- Venue media, GPS, Area, Zone/Belt, pitch type, lighting, and surface details are not decoration. They

support discovery, trust, fixture planning, and zone records.

- Every booking, payment, refund, cancellation, commission, settlement, manager edit, and admin

override must be auditable.

- Alpha validates the football loop. V1 ships the acquisition loop. The roadmap must not confuse alpha

limits with final V1 ambition.

## 4. Alpha vs V1 Product Position

The product should be built in phases, but the V1 target should be ambitious. Alpha is for validating the core football activity loop while the team is building. V1 is the market-facing version that should be strong enough to defend the product from fast followers and support user acquisition.

| Phase | Purpose | Expected capability |
| --- | --- | --- |
| Alpha | Build and validate the basic<br>football activity loop. | Create club/team, add players, create match, add<br>manual or platform venue, create team sheet, enter<br>score, confirm result, store record. |
| Private beta | Test venue operations with<br>selected clubs and selected<br>venues. | Venue profiles, basic surface calendars, manager<br>login, blocked slots, booking requests, basic payment<br>test, admin review. |
| V1 | Public acquisition and revenue<br>product. | Facility portal, searchable venue discovery,<br>surface-level booking, online payment, commission<br>record, fixture-linked booking, offline blocks,<br>cancellation/refund flow, admin governance,<br>notifications. |

<!-- Page 5 -->

Locked direction: V1 should include the functional booking and payment loop. It should not defer online payments if commission capture is part of the venue acquisition model.

## 5. Core Definitions

| Term | Meaning |
| --- | --- |
| Facility / Venue | The physical place where football activity happens. It may include one or more<br>bookable surfaces. |
| Surface | A specific pitch/court/field inside a venue. The surface owns the bookable<br>calendar and conflict checks. |
| Bookable platform venue | A venue whose manager uses Kalaanba availability and booking tools. Slots can<br>be reserved through the platform. |
| Listed venue | A venue known to Kalaanba and shown for discovery or fixture selection, but not<br>bookable through Kalaanba. |
| Open/community venue | A field or park that may not have a formal manager or booking process. It can be<br>recorded, but availability is not guaranteed. |
| Manual venue text | A typed location entered by a user when no platform venue exists or when the<br>exact venue is not listed. |
| Facility manager | A person authorized to manage one or more venues or surfaces in the venue<br>portal. |
| Booking | A reservation of one surface for a specific time window, with status, payment,<br>user, fixture, and audit trail. |
| Offline block | A calendar block entered by a manager for a booking or unavailability that<br>happened outside Kalaanba. |
| Maintenance block | A blocked period where the surface cannot be booked because of maintenance,<br>cleaning, repair, event setup, weather, or facility decision. |
| Booking hold | A temporary lock on a slot while the user completes payment or while manager<br>approval is pending. |
| Settlement | The facility owner share after Kalaanba commission, refunds, and adjustments<br>are accounted for. |

## 6. Venue and Location Modes

Kalaanba should never imply that every listed venue is bookable or available. The product must clearly separate location data from booking confidence.

| Mode | What it means | Booking<br>confidence | Fixture behavior |
| --- | --- | --- | --- |
| Bookable platform<br>venue | Facility manager uses Kalaanba<br>portal. Surfaces have calendars,<br>prices, rules, and booking/payment<br>workflow. | High if calendar is<br>current and slot is<br>confirmed. | Fixture can link to<br>booking record and<br>surface calendar. |
| Listed venue | Kalaanba has captured the venue,<br>GPS, media, zone, and basic data,<br>but booking is handled outside the<br>platform. | Medium for location<br>truth, low for<br>availability. | Fixture can select<br>venue, but booking must<br>be confirmed outside<br>Kalaanba. |
| Open/community<br>venue | A field or park with no formal<br>booking manager or controlled<br>availability. | Low availability<br>confidence. | Fixture can use it as<br>match location; no slot<br>guarantee. |
| Manual venue text | User types a location that may not<br>exist as a structured venue record<br>yet. | No platform<br>confidence. | Fixture exists, but<br>conflict check and venue<br>trust are limited. |

### Availability labels

<!-- Page 6 -->

Recommended public labels: Bookable on Kalaanba, Listed venue, Open/community park, Manual location, Availability not guaranteed, Slot held, Payment pending, Booking confirmed, Venue unavailable.

## 7. Venue, Facility, and Surface Model

A venue is the container. A surface is the bookable unit. This distinction is important because one venue can have several football spaces with different sizes, prices, time slots, lighting, and suitability.

| Layer | Owns | Examples |
| --- | --- | --- |
| Venue / Facility | Brand/name, owner/manager, address, GPS, Area,<br>Zone/Belt, City Hub, media, rules, contact, verification. | Kalpohin Sports Complex,<br>Gig Cottage Field,<br>Community Astro. |
| Surface | Bookable calendar, pitch type, size, supported formats,<br>pricing, opening hours, maintenance blocks, surface<br>media. | Main Astro, 5-a-side pitch,<br>Training pitch, Event field. |
| Booking | Reservation of one surface and time window, payment<br>state, fixture link, manager decision, cancellation/refund<br>state. | Main Astro, Sunday<br>8pm-10pm, paid by Aboabo<br>United. |

### Venue data fields

| Field group | Fields |
| --- | --- |
| Identity | Venue name, short name, facility type, description, public visibility, slug. |
| Ownership/management | Owner account, manager accounts, manager roles, contact phone, support<br>contact, escalation contact. |
| Location | Country, Region, City Hub, Area, Zone/Belt, written address, landmark, GPS<br>coordinates, map pin confidence. |
| Trust | Verification state, verified by, verification source, verification date, duplicate<br>flags, admin notes. |
| Media | Daytime photos, nighttime photos, close-up surface photos, drone/aerial shots,<br>facility videos, lighting view, amenities photos. |
| Commercial | Currency, booking enabled, payment required, commission profile, cancellation<br>policy, settlement profile. |
| Facility rules | Allowed match types, opening hours, dress/boot rules, lateness policy, damage<br>policy, security note, weather policy. |

### Surface data fields

| Field group | Fields |
| --- | --- |
| Identity | Surface name, surface code, surface type, active/inactive state. |
| Football attributes | Pitch type, supported format, dimensions, markings, goal type, lighting,<br>covered/uncovered, spectator space. |
| Calendar | Opening hours, slot length, buffer time, blackout dates, maintenance blocks,<br>offline blocks, confirmed bookings. |
| Pricing | Base price, peak price, off-peak price, special day price, deposit/full payment rule,<br>manager override permission. |
| Media | Surface photos, close-ups, night-light photos, drone shot, video walk-through,<br>condition photos. |
| Rules | Minimum notice, maximum advance booking, cancellation window, reschedule<br>rule, grace period, allowed activities. |

## 8. Venue Onboarding, Verification, and Media Capture

<!-- Page 7 -->

Venue onboarding should produce useful public pages and trustworthy operational data. The team can onboard directly, allow manager claims, or accept suggestions from players/students/agents who submit location and media data.

### Onboarding paths

| Path | Description | Trust level |
| --- | --- | --- |
| Kalaanba direct<br>onboarding | Kalaanba team or agent visits venue, captures GPS,<br>media, surface data, manager contact, and rules. | Highest for V1. |
| Facility manager<br>claim | Manager signs up, claims facility, submits details, and<br>waits for admin verification. | Medium until reviewed. |
| Community<br>suggestion | Player/student/agent suggests venue with photos, GPS,<br>and notes. | Listed/suggested until<br>admin verifies. |
| Fixture-created<br>venue lead | Users repeatedly type the same manual venue. Admin<br>converts it into a venue lead. | Low until verified. |

### Required capture checklist

- Venue name and common/local name.

- Written address, landmark, GPS coordinates, Area, Zone/Belt, City Hub, and Region.

- Surface names and pitch types.

- Supported formats such as 5-a-side, 7-a-side, 9-a-side, or 11-a-side.

- Daytime photos, nighttime photos, close-up pitch photos, and drone/aerial views where possible.

- Opening hours, slot lengths, pricing, cancellation policy, manager contacts, and booking rules.

- Lighting condition, security, parking, washrooms, changing rooms, seating, and nearby landmark

notes.

- Manager confirmation that offline bookings must be entered into the portal to avoid double booking.

### Media refresh rule

Media should be reviewed periodically. A default six-month refresh cycle is reasonable for public venue photos, with facility managers able to request updates earlier after surface upgrades, lighting changes, renovations, or damage.

## 9. Facility Manager Portal

Facility managers need a separate portal experience. Technically this can be built on the same account system, but the user experience should feel like a facility control room. A manager logs in and sees only the facilities, surfaces, bookings, payments, and settings they are allowed to manage.

### Manager roles

| Role | Default permissions |
| --- | --- |
| Facility owner | Full control over facility profile, surfaces, managers, rules, settlement information,<br>and high-risk changes. |
| Facility manager | Manage bookings, block slots, approve/reject requests, update availability, edit<br>operational details, submit media updates. |
| Booking attendant | View calendar, add offline bookings/blocks, confirm arrivals, mark no-show, and<br>handle simple booking actions. |
| Media manager | Upload photos/videos and request facility page updates, subject to approval where<br>needed. |
| Finance viewer | View payments, commission, settlement reports, refunds, and balances, but<br>cannot edit operations. |

<!-- Page 8 -->

### Portal dashboard

- Today's bookings and upcoming bookings.

- Pending booking requests and payment-pending holds.

- Surface calendar view by day, week, and month.

- Offline block entry for phone, WhatsApp, walk-in, personal, maintenance, and private events.

- Payment report, commission report, settlement report, refund report, and failed payment list.

- Facility media and profile completeness score.

- No-show, late cancellation, dispute, and facility-unavailable alerts.

- Admin messages, verification status, and action items.

## 10. Availability Calendar and Conflict Prevention

The surface calendar is the operational heart of the Venue Engine. It decides whether a slot can be shown, held, paid for, confirmed, blocked, or rejected. Calendar accuracy is also the reason facility managers must enter offline bookings into Kalaanba.

### Calendar entries

| Entry type | Meaning | Conflict effect |
| --- | --- | --- |
| Open slot | Surface is available for booking based on opening<br>hours and rules. | Can be selected. |
| Temporary hold | Slot is being reserved while payment or manager<br>approval is pending. | Blocks new bookings for a<br>short configured period. |
| Confirmed booking | Slot is paid/approved and attached to a customer or<br>fixture. | Blocks overlap. |
| Offline booking block | Manager entered an external booking or walk-in<br>arrangement. | Blocks overlap. |
| Maintenance block | Surface is unavailable for repair, cleaning, setup,<br>weather, or facility decision. | Blocks overlap. |
| Admin block | Kalaanba admin or facility owner blocks the surface<br>due to dispute, safety, suspension, or verification<br>issue. | Blocks or hides slot. |

### Conflict rules

- The same surface cannot have two confirmed bookings that overlap.

- A temporary hold blocks the slot until it expires, payment fails, or payment succeeds.

- Offline blocks and maintenance blocks must be treated like confirmed unavailability.

- Fixtures linked to confirmed bookings inherit the surface and time conflict protections.

- Manual venue text cannot be fully conflict-checked and should be labeled accordingly.

- A venue can have multiple surfaces booked at the same time if they are physically separate and

allowed by configuration.

- Future checks may include buffer time, cleanup time, travel time for referees, maximum matches per

surface per day, and safety capacity.

## 11. Booking Lifecycle

The booking lifecycle must support both instant-confirm and manager-approval venues. Some facilities may want payment to confirm immediately. Others may want to approve a request before payment or

<!-- Page 9 -->

before final confirmation.

| State | Meaning |
| --- | --- |
| draft | User is exploring venue/surface/date/time but has not initiated a booking. |
| slot_selected | User selected a surface and time slot. |
| hold_created | System temporarily holds the slot while payment or approval is pending. |
| approval_pending | Manager must approve before payment or confirmation, depending on facility<br>rules. |
| payment_pending | Payment has been initiated but not completed. |
| payment_failed | Payment failed or was abandoned; hold may expire or be released. |
| confirmed | Booking is paid/approved and the slot is secured. |
| linked_to_fixture | Booking is connected to a match, challenge, competition fixture, or training event. |
| reschedule_requested | User or manager requested a new date/time/surface. |
| cancelled | Booking was cancelled before completion or after confirmation. |
| refund_pending | Refund decision or provider processing is pending. |
| refunded | Refund has been completed or recorded. |
| completed | Booked time passed and no unresolved issue remains. |
| no_show | Booked party did not appear according to facility/Trust rules. |
| disputed | Booking, payment, attendance, refund, or facility availability is contested. |

### Default bookable venue flow

Select venue -> select surface -> select slot -> system creates temporary hold -> user pays online -> payment succeeds -> booking confirmed -> fixture/event is linked or created -> notifications sent to clubs and manager -> booking appears on surface calendar.

### Manager approval flow

Select venue -> select surface -> request slot -> manager approves -> payment link opens or hold is created -> user pays -> booking confirmed -> fixture/event is linked -> notifications sent.

## 12. Offline Booking Blocks

Grassroots venues will still receive phone calls, WhatsApp messages, walk-ins, and personal arrangements. Kalaanba should not fight that reality. Instead, it should make those external bookings visible to the venue calendar so platform users do not book the same slot.

### Offline block types

| Block type | Use |
| --- | --- |
| Phone/WhatsApp booking | Manager received a booking outside Kalaanba and blocks the slot. |
| Walk-in booking | A customer booked in person at the facility. |
| Private event | Facility has reserved the surface for an event, training, or private use. |
| Maintenance | Surface unavailable for repair, cleaning, line marking, grass treatment, or lighting<br>work. |
| Weather/safety | Facility blocks surface because conditions are unsafe. |
| Admin block | Kalaanba or facility owner blocks slot because of dispute, suspension, verification,<br>or operational issue. |

<!-- Page 10 -->

### Offline block fields

- Surface, date, start time, end time, reason, created by, optional customer name, optional phone,

visibility setting, note, and edit history.

- Offline blocks should not automatically create Kalaanba commission unless a future policy allows

manager-entered paid bookings through the platform.

- Manager-created blocks should be audited because they affect platform availability.

## 13. Online Payments, Commission, and Settlement

For bookable platform venues, online payment is core to V1 because it confirms commitment, secures the slot, and allows Kalaanba to record commission. The exact payment service provider may determine whether automatic split payouts are possible at launch. Locked V1 stance: Kalaanba must collect booking payments online and calculate commission. Automatic payouts are preferred but not required for the first V1 if the local provider cannot support them cleanly. The system must still track facility owner balance and settlement status.

### Payment models

| Model | How it works | V1 suitability |
| --- | --- | --- |
| Provider split at source | Payment provider automatically splits Kalaanba<br>commission and facility owner share. | Best option if available and<br>reliable. |
| Kalaanba collects and<br>settles | Kalaanba receives full payment, records<br>commission and facility share, then pays facility<br>manually or on schedule. | Acceptable V1 fallback. |
| Deposit online, balance<br>at venue | User pays deposit through Kalaanba; facility<br>collects balance later. | Possible later or for selected<br>venues, but commission must be<br>clear. |
| Reserve now, pay at<br>venue | No online payment. User only reserves slot. | Not preferred for bookable V1<br>because commission capture<br>and commitment are weak. |

### Booking finance record

| Field | Meaning |
| --- | --- |
| gross_amount | Total amount paid or payable for the booking. |
| commission_amount | Kalaanba share based on configured percentage or fixed fee. |
| facility_share | Amount due to facility after commission, refunds, and adjustments. |
| payment_status | Not started, pending, successful, failed, reversed, refunded, partially refunded. |
| settlement_status | Not due, pending, scheduled, paid, held, disputed, adjusted. |
| payment_provider_referenc<br>e | Reference returned by PSP for reconciliation. |
| refund_reference | Reference for refund or reversal. |
| commission_profile_id | Config profile used to calculate the platform share. |
| created_by/source | System, user, manager, admin, PSP callback, or manual entry. |

### Important separation

Venue booking payments are not the same as competition entry fees, prize pools, referee payments, subscriptions, or sponsorships. The V1 payment scope can be limited to venue booking collection, commission calculation, payment status, refund status, and settlement tracking.

<!-- Page 11 -->

## 14. Cancellation, Refunds, No-Shows, and Facility

## Issues

Venue bookings require practical rules for real life. A club may cancel. A facility may become unavailable. A team may not show up. Weather can destroy a slot. The engine should store decisions without silently deleting history.

### Cancellation actors

| Actor | Possible action |
| --- | --- |
| Customer/club | Cancel, request reschedule, request refund, report facility unavailable. |
| Facility manager | Cancel due to facility issue, reschedule, mark no-show, approve/refuse refund<br>within policy. |
| Kalaanba admin | Override cancellation, approve refund, settle dispute, adjust commission, suspend<br>facility. |
| Payment provider | Return success/failure/refund callback and transaction evidence. |

### Refund policy direction

- Refund rules should be configurable by facility, hub, or platform default.

- Refund decisions must consider cancellation time, facility policy, weather, facility fault, customer fault,

and match type.

- If the facility cancels or becomes unavailable, customer refund or reschedule should be favored unless

policy says otherwise.

- If the club cancels late, full refund should not be assumed.

- If the club no-shows, facility may retain payment depending on policy.

- All refunds, partial refunds, denied refunds, and manual adjustments must be audit-logged.

### Venue-unavailable flow

Facility marks slot unavailable -> affected booking notified -> user chooses refund or reschedule if allowed -> fixture/challenge/competition receives venue issue status -> Trust/Admin can review if match records, no-show claims, or challenge deadlines are affected.

## 15. Fixture and Match Integration

The Match / Fixture Engine owns the match event. The Venue Engine owns the place, surface, booking, availability, and payment record. A fixture may be linked to a venue without a booking, or linked to a confirmed booking when a bookable platform venue is used.

### Fixture venue fields

| Field | Meaning |
| --- | --- |
| location_mode | manual_text, listed_venue, bookable_surface, open_community_venue. |
| venue_id | Selected venue if structured. |
| surface_id | Selected surface if available. |
| booking_required | Whether the fixture needs a confirmed booking before full confirmation. |
| booking_id | Linked booking record, if any. |
| booking_status | Pending, confirmed, cancelled, expired, refunded, disputed. |
| venue_confidence | Manual, listed, verified, bookable, manager-confirmed. |

<!-- Page 12 -->

| Field | Meaning |
| --- | --- |
| match_location_zone | Zone/Belt derived from venue/surface location when structured. |

### Fixture flow for bookable venue

Create match -> choose opponent -> set date/time/format -> choose bookable venue and surface -> create booking hold -> complete payment -> booking confirmed -> fixture becomes venue-secured -> clubs notified -> match proceeds -> result confirmation uses booking and location data where relevant.

### Fixture states affected

The Fixture Engine may need a venue-secured flag or side status so a match can be drafted/scheduled while venue booking is still pending. For high-trust competitions and challenges, a fixture should not be treated as fully secured until the required venue booking is confirmed or venue rules are satisfied.

## 16. Challenge Integration

Challenges depend heavily on venue agreement. A public call-out can be accepted, but the real fixture only becomes credible when date, time, venue, match format, and referee/officiator terms are settled. For bookable venues, payment and booking confirmation become part of challenge scheduling.

### Challenge venue terms

| Term | Direction |
| --- | --- |
| venue_requirement | Manual allowed, listed venue allowed, bookable venue required, verified venue<br>required, neutral venue required. |
| surface_requirement | Pitch type, size, lighting, format support, Astro/grass/court, day/night suitability. |
| payer | Challenger pays, respondent pays, split payment, organizer pays, external<br>agreement. |
| payment_deadline | When venue payment must be completed after scheduling. |
| booking_failure_rule | What happens if payment expires, manager rejects, venue becomes<br>unavailable, or booking is cancelled. |
| refund/no-show rule | How booking payment is handled if one side fails to appear or challenge is<br>cancelled. |

### Recommended V1 challenge rule

For high-RP ranked challenges, the platform should strongly prefer a verified/bookable venue and a referee/officiator. If split/community officiating or manual venue is allowed, the Trust Engine should be able to increase caution level and request stronger evidence.

## 17. Competition Integration

Competitions need venue rules because multiple fixtures can compete for the same surfaces. The Competition and Rules Engine should decide venue behavior for the competition, while the Venue Engine enforces surface availability and booking states.

| Competition venue rule | Meaning |
| --- | --- |
| Fixed venue | All fixtures use one venue or facility. |
| Fixed surface | All fixtures use one specific surface. |
| Home/away | Participants provide home venues, subject to rules. |
| Mixed | Organizer can choose different venues per fixture. |
| Neutral venue | Fixtures must use a venue not marked as home for either participant. |

<!-- Page 13 -->

| Competition venue rule | Meaning |
| --- | --- |
| Bookable platform venue<br>required | Fixtures must be tied to confirmed Kalaanba bookings. |
| Manual venue allowed | Organizer can type venue/location text, but availability is not guaranteed by<br>Kalaanba. |

### Tournament and block booking

The Venue Engine should eventually support bulk reservation for tournament days. For V1, admins or managers may create repeated blocks/bookings for a competition manually. Auto-generation can come later, but the model should support multiple bookings tied to one competition or matchday.

### Paid competition distinction

Venue booking payments can be V1-critical even if competition entry fees and prize pools are deferred. These are different payment use cases. Venue booking payment secures a pitch slot; competition payment manages tournament participation or prize economics.

## 18. Zone, Area, and Discovery Integration

The Venue Engine supplies venue location data to the Zone Engine and discovery surfaces. Kalaanba must preserve the distinction between a club's identity location and the physical match location.

| Location type | Meaning | Source |
| --- | --- | --- |
| Club identity location | Area/Zone/Belt the club represents. | Club Engine and Zone Engine. |
| Venue location | Area/Zone/Belt where the facility physically<br>sits. | Venue Engine and Zone Engine. |
| Match location | Venue Zone/Belt or manual location<br>attached to the fixture. | Fixture Engine uses Venue Engine<br>output. |

### Discovery filters

- Country, Region, City Hub, Zone/Belt, Area, and distance from user or club.

- Bookable now, available this weekend, lights available, night football, surface type, supported format,

price range, verification level.

- Facility amenities such as changing rooms, parking, washrooms, seating, security, and media quality.

- Venue activity: most booked, most played, newly listed, manager verified, high media completeness,

suitable for challenges.

## 19. Trust and Verification Integration

Venue and booking data should strengthen trust without making normal users feel like they are filling legal forms. A confirmed booking, GPS check-in, facility manager attendance mark, referee check-in, and venue photo can all support disputes, no-shows, walkovers, and match verification.

### Trust inputs from Venue Engine

| Input | Trust use |
| --- | --- |
| Confirmed booking | Supports claim that match was scheduled for that surface/time. |
| Payment success | Shows booking commitment and timing. |
| Booking cancellation | Clarifies whether a no-show claim is valid or whether match was already<br>cancelled. |

<!-- Page 14 -->

| Input | Trust use |
| --- | --- |
| Facility manager<br>arrival/attendance mark | Supports whether clubs/referee appeared. |
| GPS check-in near venue | Supports presence at the match location. |
| Venue photo/video evidence | Supports no-show, surface condition, abandoned match, or facility issue<br>review. |
| Manager-created offline block | Explains why a slot was unavailable or why a manual fixture cannot claim<br>booking confidence. |
| Venue-unavailable report | Supports reschedule/refund and prevents unfair no-show rulings. |

### Example no-show support flow

Booking confirmed -> Club A checks in near venue -> referee/officiator checks in -> Club B does not check in -> manager marks Club B absent or no response -> Trust Engine reviews timing, evidence, and match type -> walkover/no-show decision can be made with stronger confidence.

## 20. Club, Player, and Team Sheet Integration

Clubs should be able to move from match planning to venue booking without leaving the football flow. If a club creates a fixture and needs a surface, the booking should be part of the match setup rather than a separate disconnected transaction.

### Club features supported

- Preferred home venue and preferred home surface.

- Frequent venues used by the club.

- Facility-based club/team connection.

- Venue booking from match creation.

- Booking history by club and manager/admin role.

- Availability and readiness signals tied to selected venue, date, and team sheet.

- Team sheet reminders linked to confirmed venue booking and kickoff time.

### Player/team-sheet touchpoints

Venue data can later support player availability, arrival check-ins, lineup confirmation, matchday reminders, and player media. For alpha and V1, the main requirement is that team sheets and fixture details display the confirmed venue/surface clearly.

## 21. Referee and Officiator Integration

The Venue Engine does not assign referees, but venue data improves referee scheduling, trust, and matchday operations. Referee/officiator assignment should read fixture location, surface, kickoff time, venue rules, and booking status.

| Referee need | Venue contribution |
| --- | --- |
| Assignment context | Shows exact venue, surface, kickoff time, and match type. |
| Calendar conflict | Venue time helps avoid overlapping referee assignments. |
| Travel awareness later | GPS and Area/Zone/Belt support travel radius and distance warnings. |
| Report context | Referee report can reference confirmed booking, surface, no-show, facility issue,<br>or abandonment reason. |
| Trust evidence | Referee check-in near venue supports match verification and no-show decisions. |

<!-- Page 15 -->

### Payment separation

Referee payments and marketplace payments can remain deferred. Venue payments are a separate V1 payment requirement because they secure pitch slots and drive Kalaanba's venue commission model.

## 22. Admin Governance

Venue operations introduce real money, real availability, and real-world facility claims. Admin Governance must therefore support venue verification, facility ownership review, duplicate resolution, refund disputes, and commission/settlement oversight.

### Venue admin queues

| Queue | Purpose |
| --- | --- |
| Venue verification | Review facility identity, GPS, manager contact, photos, and public listing<br>quality. |
| Manager claim review | Approve or reject a person claiming to manage a facility. |
| Duplicate venue review | Merge repeated venues or manual entries into one trusted record. |
| GPS/location correction | Fix wrong pins, wrong Area/Zone/Belt, or misleading address. |
| Media review | Approve public photos/videos, remove poor or misleading media. |
| Booking dispute | Resolve customer, club, manager, payment, refund, or availability conflict. |
| Commission/settlement<br>review | Check facility balances, manual payouts, PSP mismatches, or adjustments. |
| Suspension/restriction | Temporarily block venue, surface, manager, or booking ability because of trust<br>or safety issues. |

### Admin override requirements

- Every override requires a reason.

- The old value, new value, actor, role, timestamp, affected booking/fixture/payment, and evidence must

be recorded.

- Financial corrections should use adjustment records rather than silently editing old payment history.

- Venue merges should preserve old names, GPS pins, media, bookings, fixtures, and manager history.

## 23. Notifications and Communication

Venue booking depends on timely communication. WhatsApp-first notifications should be considered where applicable, with in-app notifications and SMS/email later depending on cost and user behavior.

| Event | Who should be notified |
| --- | --- |
| Booking request created | Facility manager, requester/club admin. |
| Manager approved/rejected | Requester/club admin, involved club admins if fixture-linked. |
| Payment successful | Requester, facility manager, fixture participants, admin if needed. |
| Payment failed/hold expiring | Requester and possibly facility manager. |
| Booking confirmed | Requester, facility manager, clubs, referee/officiator if assigned. |
| Booking<br>cancelled/rescheduled | All affected clubs, manager, referee/officiator, competition organizer if linked. |
| Venue unavailable | Requester, clubs, referee/officiator, organizer, admin queue if high impact. |
| Refund/settlement update | Requester or facility finance role, depending on event. |

<!-- Page 16 -->

## 24. Conceptual Data Model

The exact schema will be decided during architecture, but the conceptual model should preserve clear boundaries between venue identity, surface calendars, bookings, payments, and fixture links.

| Entity | Core fields |
| --- | --- |
| Venue | venueId, name, type, ownerId, managerIds, address, gps, country, region,<br>cityHubId, areaId, zoneId, verificationStatus, visibility, mediaSetId, rulesProfileId. |
| Surface | surfaceId, venueId, name, pitchType, supportedFormats, dimensions, lighting,<br>activeStatus, pricingProfileId, availabilityProfileId, rulesProfileId. |
| VenueManagerAccess | managerAccessId, userId, venueId, role, permissions, status, createdBy,<br>approvedBy, audit. |
| CalendarBlock | blockId, surfaceId, startTime, endTime, blockType, reason, source, visibility,<br>createdBy, audit. |
| Booking | bookingId, venueId, surfaceId, userId, clubId, fixtureId, startTime, endTime,<br>status, paymentRequired, paymentId, cancellationPolicyId, audit. |
| BookingPayment | paymentId, bookingId, grossAmount, commissionAmount, facilityShare,<br>paymentStatus, providerReference, refundStatus, settlementStatus, audit. |
| SettlementRecord | settlementId, venueId, bookingIds, amountDue, amountPaid, status, method,<br>reference, adjustmentIds, audit. |
| VenueMedia | mediaId, venueId, surfaceId, mediaType, timeOfDay, source, approvalStatus,<br>uploadedBy, capturedAt, refreshDueAt. |
| VenueLead | leadId, source, suggestedName, gps, manualText, submittedBy, confidence,<br>status, convertedVenueId. |

## 25. Engine Outputs

- getVenueProfile(venueId)

- getPublicVenueProfile(venueId)

- getVenueSurfaces(venueId)

- getSurfaceAvailability(surfaceId, dateRange)

- getBookableSlots(filters)

- getVenueDiscoveryResults(filters)

- getVenueLocationContext(venueId)

- getSurfaceBookingRules(surfaceId)

- createBookingHold(surfaceId, startTime, endTime, requester)

- confirmBookingPayment(bookingId, paymentReference)

- getBookingStatus(bookingId)

- getBookingForFixture(fixtureId)

- getFacilityManagerDashboard(userId)

- getVenueCalendar(venueId, filters)

- getSurfaceCalendar(surfaceId, filters)

- getVenueSettlementReport(venueId, dateRange)

- getVenueTrustInputs(fixtureId)

- getVenueAdminReviewQueue(filters)

- getVenueDuplicateFlags(filters)

<!-- Page 17 -->

- getManualVenueLeadSuggestions(filters)

## 26. Configurable Defaults

As with the other Kalaanba engines, values, labels, thresholds, fees, percentages, windows, and rule weights should not be hardcoded. They should be controlled through Admin Configuration and Governance.

| Configuration area | Examples |
| --- | --- |
| Booking rules | Hold duration, minimum notice, maximum advance booking, booking approval<br>mode, auto-confirm rules. |
| Calendar rules | Slot length, buffer time, opening hours, blackout dates, maintenance categories. |
| Payment rules | Payment required, deposit/full payment mode, payment expiry, PSP mode. |
| Commission | Percentage, fixed fee, hybrid fee, venue-specific commission, promotional<br>commission. |
| Cancellation/refund | Free cancellation window, partial refund percentage, late cancellation rule,<br>no-show rule. |
| Manager permissions | Who can block slots, approve bookings, cancel bookings, edit prices, upload<br>media. |
| Verification | Venue verification requirements, media requirements, GPS confidence, refresh<br>cycle. |
| Discovery labels | Bookable on Kalaanba, Listed venue, Open/community park, Availability not<br>guaranteed. |
| Trust thresholds | When high-RP matches require verified/bookable venues, when evidence is<br>requested. |

## 27. Phased Build Plan

The team can still build in phases, but the phases should lead toward a full V1 booking loop instead of treating payment and manager tools as distant add-ons.

| Phase | Build focus | Validation question |
| --- | --- | --- |
| Alpha 1 | Clubs, basic match creation, manual venue/location, simple<br>score entry, result confirmation. | Can users organize and<br>record a match? |
| Alpha 2 | Team sheets, platform venue selection, venue leads, basic<br>venue profiles, GPS and media capture. | Can fixture records connect<br>to structured locations? |
| Alpha 3 | Surface records, simple availability calendar, manager login,<br>manager block slots. | Can a venue manager<br>prevent double-booking? |
| Beta 1 | Booking request, temporary hold, manager approval,<br>booking-linked fixture, notifications. | Can clubs reserve a venue<br>through Kalaanba? |
| Beta 2 | Online payment test, payment callbacks, commission record,<br>booking confirmation, cancellation basics. | Can Kalaanba secure<br>revenue and confirm the<br>slot? |
| V1 | Full public booking loop, discovery, manager portal,<br>payments, commission/settlement tracking, admin<br>governance, trust integration. | Can this drive real<br>acquisition and operations? |

## 28. V1 Scope

V1 should be complete enough to attract clubs and venue managers. It does not need every future marketplace feature, but it must make booking, payment, and manager operations work.

<!-- Page 18 -->

| Included in V1 | Reason |
| --- | --- |
| Venue directory and public venue<br>pages | Discovery and trust. |
| Surface-level records | Accurate booking unit and conflict checks. |
| GPS, Area, Zone/Belt, pitch type,<br>day/night media | Discovery, Zone Engine, Trust, and public confidence. |
| Facility manager portal | Venue acquisition and operations. |
| Surface calendar | Prevents double-booking. |
| Offline block entry | Keeps Kalaanba availability aligned with real-world bookings. |
| Booking request/hold/confirmation<br>lifecycle | Practical reservation flow. |
| Online payment for bookable slots | Commitment and Kalaanba commission capture. |
| Commission calculation and<br>booking finance record | Revenue tracking and facility transparency. |
| Settlement tracking | Facility owner balance even if payout is manual. |
| Cancellation/refund statuses | Real-world booking support. |
| Fixture-linked booking | Connects football activity to venue operations. |
| Admin venue verification and<br>dispute queues | Trust and governance. |
| Notifications | Operational clarity for clubs, managers, and organizers. |

## 29. Deferred / Later

The following can be deferred without weakening the core V1 booking loop.

- Fully automated payout routing if the local PSP does not support clean split payments at launch.

- Public venue ratings and reviews.

- Advanced dynamic pricing.

- Bulk auto-generated tournament booking schedules.

- Subscriptions or premium facility pages.

- Promoted venue ads and sponsorship placement.

- Full referee marketplace and referee payments.

- Facility equipment rental, kits, water, ball rental, and add-on services.

- Advanced analytics for venue utilization, revenue forecasting, and demand heatmaps.

- Automated drone/media refresh workflows across the country.

- AI-based venue quality scoring.

## 30. Required Changes to Existing Engines

The Venue Engine introduces new statuses and links that should be reflected in the existing engine documents before architecture is finalized.

| Engine | Required update |
| --- | --- |
| Match / Fixture Engine | Add booking-linked fixture fields, venue-secured status, booking<br>pending/confirmed/cancelled side states, and surface calendar conflict behavior. |
| Challenge Engine | Add venue booking/payment terms to scheduling, including payer, deadline,<br>neutral/bookable venue requirement, and failure/cancellation consequences. |

<!-- Page 19 -->

| Engine | Required update |
| --- | --- |
| Competition and Rules<br>Engine | Expand venue rules: fixed venue, fixed surface, home/away, neutral venue,<br>bookable platform venue required, manual venue allowed, block booking, payer<br>model. |
| Zone Engine | Treat Venue Engine as source for venue Area/Zone/Belt, GPS, match location zone,<br>and venue discovery data. |
| Trust & Verification<br>Engine | Consume booking status, payment status, GPS check-in, manager attendance<br>mark, venue photo, venue-unavailable reports, and booking cancellation evidence. |
| Club Engine | Support preferred home venue/surface, facility-based team links, frequent venues,<br>and booking history from club dashboard. |
| Referee & Officiator<br>Engine | Read venue/surface/GPS/booking status for assignment context, reports,<br>check-ins, no-show, and abandoned match review. |
| Admin Governance<br>Engine | Add venue verification, manager claim, duplicate venue merge, GPS correction,<br>media review, booking dispute, commission/settlement review, and facility<br>suspension queues. |
| Payments Engine | Make venue booking payment collection, commission recording, refund tracking,<br>and settlement tracking V1-critical; keep other payment use cases later. |
| Notification Engine | Add booking request, payment, confirmation, cancellation, reschedule, refund,<br>venue-unavailable, and manager/admin queue notifications. |

## 31. Product Guardrails

- Do not show a listed venue as available unless the surface calendar is controlled by Kalaanba or the

manager has confirmed the slot.

- Do not allow online users to book a surface if an offline block or confirmed booking overlaps the

selected time.

- Do not treat manual venue text as trusted venue data until admin converts/reviews it.

- Do not silently edit booking, payment, refund, or settlement history. Use audit logs and adjustment

records.

- Do not make facility managers manage all bookings through Kalaanba immediately unless the portal

gives them enough value to keep their calendar accurate.

- Do not force automatic payouts into V1 if the payment provider cannot support it safely; track

settlement clearly and pay manually/scheduled if needed.

- Do not let venue managers decide match result, RP eligibility, or challenge settlement. They can

provide attendance and venue evidence; Trust and other engines decide official effects.

- Do not hide venue-unavailable events from linked fixtures. If the venue fails, the fixture, challenge,

competition, and affected parties must know.

- Do not make media quality decorative only. Photos, night views, and GPS should support discovery and

trust.

## 32. Locked Summary

Kalaanba's Venue, Surface & Booking Engine is a core acquisition and revenue engine. It gives facility owners and managers a dedicated portal to manage facilities, surfaces, availability, offline blocks, online bookings, rules, media, payments, and settlement visibility. It gives clubs and organizers a way to discover venues, select exact surfaces, confirm slots, and link bookings directly to fixtures, challenges, competitions, and training events. The engine supports multiple location modes: bookable platform venues, listed/non-bookable venues, open/community venues, and manual venue text. Bookable venues require online payment to confirm slots so Kalaanba can secure commitment and record commission. Automatic payouts are preferred but

<!-- Page 20 -->

PSP-dependent; V1 must at minimum support online collection, commission calculation, facility balance tracking, refund status, and manual or scheduled settlement. Alpha should validate the basic football loop: club creation, match creation, team sheets, venue/manual location, score entry, and confirmation. V1 should ship the serious acquisition loop: venue discovery, manager portal, surface calendar, offline blocks, fixture-linked booking, online payment, commission record, settlement tracking, notifications, admin governance, and Trust integration. Final locked direction: the Venue Engine owns the place, the surface, the booking, the calendar, and the commercial booking record. The Fixture Engine owns the match. The Trust Engine decides what is safe to count. The Payments layer processes money. The Admin Governance Engine controls sensitive changes. Together, they make Kalaanba able to organize real football, in real places, with real booking confidence.
