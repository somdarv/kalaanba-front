<!-- Converted from Zone_Engine_UPDATED.pdf -->

# Kalaanba Zone Engine - Updated Document

Updated with RP Engine dependency clarification and RP-eligible inter-zone match wording.

| Field | Locked Value |
| --- | --- |
| Status | Updated locked direction / pre-architecture planning |
| Updated | 2026-05-06 |
| Key change | Zone Engine consumes RP Engine outputs; normal inter-zone match<br>affects RP only when RP-eligible. |

## 1. Purpose

The Zone System groups grassroots clubs by practical football geography, not strict government boundaries. It supports local identity, reduced travel, zone-based rivalry, inter-zone competition, leaderboards, challenge context, and discovery. Zones should feel like home, but work like competition infrastructure.

## 2. Locked Hierarchy and Nomenclature

| Level / Term | Locked meaning | Example |
| --- | --- | --- |
| Country | National scope | Ghana |
| Region | Broad geographic context | Northern Region |
| City Hub | The football center people identify with; not limited to<br>official city boundaries. | Tamale City Hub |
| Zone | A core competitive division inside a City Hub. | North Zone |
| Belt | A Zone-type used for outer or peri-urban communities<br>connected to the City Hub. | North-East Belt |
| Area | Actual locality, suburb, quarter, or settlement a club<br>represents. | Taha, Kukuo, Sakasaka<br>Quarters |
| Territory | Emotional copy word, not a data level. | Defend your territory. |

## 3. Default Division Logic

For a major hub like Tamale, the preferred default is 8 competitive divisions because 8 supports clean inter-zone brackets, group stages, leader duels, and knockout formats.

- Default logic: Central + cardinal directions + outer directional belts.

- Possible working structure: Central Zone, North Zone, East Zone, South Zone, West Zone,

North-East Belt, North-West Belt, South-East or South-West Belt depending on actual geography and football density.

- The exact map is not locked; it will be decided later using geography, travel patterns, football

density, and local advice.

## 4. What We Are Not Doing

<!-- Page 2 -->

- We are not copying Ghana Football Association zoning. GFA zones cover much larger formal league

geographies and do not directly solve Kalaanba grassroots city-hub needs.

- We are not using strict political, municipal, or electoral boundaries as the product model.

- We are not letting users freely create public Zones or Belts.

- We are not forcing every hub into 8 divisions. Smaller hubs may use 2 or 4; larger hubs may use 8

or more if justified.

## 5. User Flow and Admin Governance

Choose City Hub: Tamale Choose Area: Taha System assigns: North-East Belt Users select Area first. Kalaanba maps that Area to a Zone or Belt. If the area is missing, the user suggests the area and admin maps it after review.

- Zones and Belts are admin-controlled.

- Users can suggest Areas or request Area/Zone changes.

- Zones remain fixed during a Kalaanba season unless there is a serious error.

- Splits, merges, and major remaps should normally happen between seasons.

## 6. Club Location vs Venue Location

A club can belong to one Area/Zone but use a home venue in another Zone. This is allowed because grassroots clubs may represent one community but play official matches elsewhere.

| Location type | Meaning |
| --- | --- |
| Club identity location | Area / Zone or Belt the club represents. |
| Venue location | Physical Area / Zone or Belt where the pitch sits. |
| Match location | Venue Zone or Belt. |

## 7. Venue Capture Requirement

When venues are added or physically onboarded, Kalaanba should capture rich location and media information for maps, trust, public venue pages, future booking, and local discovery.

- Venue name and written address/location description.

- GPS coordinates.

- Area and Zone/Belt.

- Pitch type.

- Daytime photos and nighttime photos.

- Drone shots / aerial views where possible.

## 8. Referee Rule

Referees should not be restricted to Zones or Belts in V1. They should be available across the whole City Hub because referees may be few and concentrated in one area. Later, refs may set travel preferences, availability radius, or preferred areas.

## 9. Inter-zone Matches vs Challenge Matches

<!-- Page 3 -->

| Type | Meaning | Effect |
| --- | --- | --- |
| Normal inter-zone match | A verified match between clubs<br>from different Zones or Belts. | Can affect club RP through normal<br>activity rewards only when RP-eligible<br>under Season/RP rules. No locked<br>challenge stake. |
| Challenge match | A public call-out where reputation is<br>deliberately put on the line. | Affects club RP through locked stake<br>transfer, Fan Buzz, challenge record,<br>public reputation, and zone pride if<br>cross-zone. |

Simple distinction: inter-zone match = football result between zones. Challenge = public reputation duel with RP on the line.

## 10. Zone Engine Responsibilities

| Input | Processing | Output |
| --- | --- | --- |
| Clubs, Areas, Zones, Belts,<br>Venues, matches, RP Engine<br>outputs, season config, challenge<br>results | Area-to-zone mapping, club zone<br>rank, active club checks, zone leader<br>detection, inter-zone records,<br>snapshot generation | Zone snapshot, leaderboard,<br>club zone rank, zone leader,<br>inter-zone table, area mapping<br>output |

Important update: the Zone Engine consumes trusted RP Engine outputs. It must not calculate RP itself.

## 11. Engine Philosophy

- One source of truth per engine.

- Flexible outputs depending on use case.

- Backend owns the rules.

- Frontend displays the result.

- Do not calculate Zone leaders, rankings, eligibility, or scores in React.

- Start as a modular monolith, not microservices.

- All value-driven thresholds and weights should be configurable where applicable.

## 12. Dependencies and Related Engines

| Related system / engine | How Zones affect it |
| --- | --- |
| Challenge Engine | Determines same-zone call-outs, cross-zone call-outs, Zone Leader Duels,<br>and Open Call-out Window context. |
| RP Engine | Provides Season RP, ranks, and RP outputs consumed by Zone Engine.<br>Zone Engine does not recalculate RP. |
| Season Engine | Controls when Zone mappings are locked, when rankings reset, and when<br>snapshots are archived. |
| Venue Engine | Stores venue Area/Zone/Belt, GPS, photos, pitch types, and mapping data. |
| Fixture / Match Engine | Determines match location Zone and inter-zone match records. |
| Leaderboard Engine | Uses Zone Engine outputs for club and Zone rankings. |
| Fan Buzz / Feed Engine | Can surface hot challenges, active Zones, and followed territories. |
| Admin Governance Engine | Handles Area suggestions, mapping changes, merges, splits, and review<br>workflows. |

<!-- Page 4 -->

## 13. Parked for Later

- Zone Score formula.

- Exact Tamale Zone/Belt map.

- Area-to-Zone mapping table.

- Inter-zone competition formats.

- Zone leaderboard weighting.

- Zone leader qualification rules.

- Area confidence levels such as Confirmed, Suggested, Merged, Archived.

## 14. Updated Locked Summary

Kalaanba organizes grassroots football using City Hubs, Zones/Belts, Areas, and Clubs. A City Hub is a practical football home, not a strict municipal boundary. A Zone is a core competitive division; a Belt is a Zone-type used for outer connected areas; an Area is the real locality users identify with. Users choose Area first, and Kalaanba maps it to a Zone or Belt. The system is admin-controlled, season-stable, and flexible enough to reflect football culture rather than official boundaries. The Zone Engine consumes RP Engine outputs; it does not calculate RP itself.
