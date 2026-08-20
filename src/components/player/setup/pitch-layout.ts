/**
 * Where each position stands on the pitch.
 *
 * This map is **presentation, and only presentation**. Admin Config owns which
 * positions exist, what they are called, and what order they come in
 * (`player.positions`, ADR-0007). It does not own coordinates, because a
 * coordinate is not a fact about football, it is a fact about this drawing.
 * Putting x/y in config would make an admin responsible for a layout they
 * cannot see, and would let a config edit break the picture.
 *
 * Coordinates are in the pitch's own SVG space (`PITCH_VIEWBOX`), not
 * percentages, so a marker sits exactly where the lines put it at every size.
 * The attacking goal is at the top, which is why the goalkeeper has the
 * largest y.
 *
 * Any key config serves that is missing here still renders: the picker falls
 * back to a list under the pitch, so a new position is always selectable even
 * before someone places it. A missing coordinate is a cosmetic gap, never a
 * dead end.
 */

export const PITCH_VIEWBOX = { width: 460, height: 600 } as const;

export type PitchZone = "defence" | "midfield" | "attack";

export type PitchSpot = {
  x: number;
  y: number;
  zone: PitchZone;
};

export const PITCH_LAYOUT: Readonly<Record<string, PitchSpot>> = {
  striker: { x: 230, y: 110, zone: "attack" },
  second_striker: { x: 230, y: 178, zone: "attack" },
  left_winger: { x: 88, y: 205, zone: "attack" },
  right_winger: { x: 372, y: 205, zone: "attack" },
  attacking_midfielder: { x: 230, y: 280, zone: "midfield" },
  left_midfielder: { x: 68, y: 332, zone: "midfield" },
  centre_midfielder: { x: 230, y: 350, zone: "midfield" },
  right_midfielder: { x: 392, y: 332, zone: "midfield" },
  defensive_midfielder: { x: 230, y: 420, zone: "midfield" },
  left_back: { x: 68, y: 480, zone: "defence" },
  centre_back: { x: 230, y: 492, zone: "defence" },
  right_back: { x: 392, y: 480, zone: "defence" },
  goalkeeper: { x: 230, y: 556, zone: "defence" },
};

/** Labels down the right touchline, in SVG space. */
export const PITCH_ZONE_LABELS: ReadonlyArray<{
  zone: PitchZone;
  label: string;
  y: number;
}> = [
  { zone: "attack", label: "Attack", y: 160 },
  { zone: "midfield", label: "Midfield", y: 300 },
  { zone: "defence", label: "Defence", y: 440 },
];
