/**
 * One-off data-sourcing tool: pull real Ghana geography from Google Maps so the
 * Zone engine can be seeded with places that exist.
 *
 * This is NOT part of the app and never runs in a request. Zone geography is
 * admin-controlled reference data (Zone engine §2/§5) and Google cannot mint an
 * `area_id`; this only produces a candidate list for a human to confirm and an
 * admin to map to Zones/Belts. Output is JSON on stdout.
 *
 * Usage:  node scripts/source-geography.mjs [City ...]
 *
 * Costs money per call (Places API is billed), so it is a script you run
 * deliberately, not a build step.
 */

import { readFileSync } from "node:fs";

function loadKey() {
  if (process.env.GOOGLE_MAPS_API_KEY) return process.env.GOOGLE_MAPS_API_KEY;
  for (const file of [".env.local", ".env"]) {
    try {
      const line = readFileSync(file, "utf8")
        .split(/\r?\n/)
        .find((l) => l.startsWith("GOOGLE_MAPS_API_KEY="));
      if (line) return line.slice("GOOGLE_MAPS_API_KEY=".length).trim();
    } catch {
      /* next file */
    }
  }
  throw new Error("GOOGLE_MAPS_API_KEY not found in env or .env.local");
}

const KEY = loadKey();

/** Canonical name, region and centre for a city. */
async function geocodeCity(city) {
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(`${city}, Ghana`)}&key=${KEY}`;
  const data = await fetch(url).then((r) => r.json());
  if (data.status !== "OK" || !data.results.length) return null;
  const top = data.results[0];
  const component = (type) =>
    top.address_components.find((c) => c.types.includes(type))?.long_name ??
    null;
  return {
    name: component("locality") ?? city,
    region: component("administrative_area_level_1"),
    country: component("country"),
    place_id: top.place_id,
    lat: top.geometry.location.lat,
    lng: top.geometry.location.lng,
  };
}

/**
 * Neighbourhoods inside a city. Google has no "list the suburbs of X" call, so
 * this runs several phrasings and keeps only results Google itself typed as a
 * neighbourhood or sublocality. Anything else is a shop with a place name.
 */
async function findAreas(city) {
  const queries = [
    `neighbourhoods in ${city} Ghana`,
    `suburbs of ${city} Ghana`,
    `communities in ${city} Ghana`,
    `residential areas in ${city} Ghana`,
  ];
  const found = new Map();

  for (const textQuery of queries) {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.types,places.location",
      },
      body: JSON.stringify({ textQuery, maxResultCount: 20 }),
    }).then((r) => r.json());

    for (const place of res.places ?? []) {
      const types = place.types ?? [];
      const isArea =
        types.includes("neighborhood") ||
        types.includes("sublocality") ||
        types.includes("sublocality_level_1");
      if (!isArea) continue;
      // Same place can come back from several phrasings.
      if (found.has(place.id)) continue;
      found.set(place.id, {
        name: place.displayName?.text,
        place_id: place.id,
        address: place.formattedAddress,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
      });
    }
  }

  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const cities = process.argv.slice(2);
if (cities.length === 0) {
  console.error("usage: node scripts/source-geography.mjs <City> [City ...]");
  process.exit(1);
}

const out = [];
for (const city of cities) {
  const hub = await geocodeCity(city);
  if (!hub) {
    console.error(`  ! ${city}: no geocode result`);
    continue;
  }
  const areas = await findAreas(city);
  console.error(`  ${hub.name} (${hub.region}) — ${areas.length} areas`);
  out.push({ hub, areas });
}

console.log(JSON.stringify(out, null, 2));
