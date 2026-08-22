"use client";

// A client component, and only because of the last specimen. The owner's card
// takes an `onEditPhoto` callback, and a function cannot cross a server
// component boundary — the build refuses it rather than serialising it away.
// Everything else on this page would render fine on the server; the preview of
// an interactive control is what makes it interactive.

import {
  Allura,
  Great_Vibes,
  Ms_Madi,
  Satisfy,
  Style_Script,
  Yellowtail,
} from "next/font/google";

import { Eyebrow } from "@/components/ui";
import { PlayerCard } from "@/components/player/setup/player-card";
import { PlayerCardSignature } from "@/components/player/setup/player-card-signature";
import { ALL_PATTERNS } from "@/components/player/setup/player-card-patterns";
import { PLAYER_CARD_VARIANTS } from "@/components/player/setup/player-card-variants";
import type { Player, PositionOption, VerifiedRecord } from "@/lib/api/player";

/**
 * The player card, across the axes it varies on.
 *
 * Real cards derive both look and pattern from the player's own key, so no
 * single account can ever show you the set. This forces each one so they can be
 * judged against each other, which is the only way to tell whether they read as
 * one family or as unrelated cards.
 *
 * Three sections, each isolating one variable: gradient, pattern, and the state
 * of the record. Everything else is held constant inside a section.
 */

/**
 * Signature candidates, loaded on this route only.
 *
 * Six faces is six font files, which is exactly the sort of thing that must
 * never reach a player. They are imported here rather than in the root layout
 * so they ship with `/design` and nowhere else — `next/font` scopes each family
 * to the modules that import it.
 *
 * Each loader is called at module scope and assigned to its own `const`,
 * because `next/font` requires it: the loaders are compiled away at build time,
 * so a call nested inside an object literal is not something the compiler can
 * resolve. The build refuses rather than shipping a broken font, which is the
 * right failure.
 *
 * Every one is a single weight. Script faces on Google Fonts almost all ship
 * 400 alone, which is itself part of the decision: there is no heavier cut to
 * fall back on if a face turns out too faint against the card.
 */
const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const styleScript = Style_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const msMadi = Ms_Madi({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const allura = Allura({ subsets: ["latin"], weight: ["400"], display: "swap" });
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SIGNATURE_CANDIDATES = [
  {
    // Not loaded here: it is the shipped face, so the root layout already has
    // it and this reads the same token the card does. Loading it a second time
    // would put two copies of one font on the page.
    name: "Chic Budapest",
    note: "Supplied by the team, self-hosted. The current default.",
    font: { style: { fontFamily: "var(--font-signature)" } },
  },
  {
    name: "Satisfy",
    note: "Penned Google script. Keeps its strokes at low opacity.",
    font: satisfy,
  },
  {
    name: "Yellowtail",
    note: "Brush, the heaviest here. Reads sporty rather than formal.",
    font: yellowtail,
  },
  {
    name: "Style Script",
    note: "Signature-shaped and still legible on a long name.",
    font: styleScript,
  },
  {
    name: "Ms Madi",
    note: "Closest to a real handwritten signature. Thin.",
    font: msMadi,
  },
  {
    name: "Allura",
    note: "Flowing calligraphy. Elegant, and faint on a saturated ground.",
    font: allura,
  },
  {
    name: "Great Vibes",
    note: "Formal calligraphy. Hairline strokes, hardest to read small.",
    font: greatVibes,
  },
] as const satisfies ReadonlyArray<{
  name: string;
  note: string;
  font: { style: { fontFamily: string } };
}>;

const POSITIONS: PositionOption[] = [
  { key: "left_winger", label: "Left Winger", abbreviation: "LW" },
  { key: "goalkeeper", label: "Goalkeeper", abbreviation: "GK" },
  { key: "centre_back", label: "Centre Back", abbreviation: "CB" },
];

/** Dev only. Shows where a half-body portrait lands and how the mask fades it
 *  into the panel. Not artwork, and deliberately not mistakable for it. */
const PORTRAIT_PLACEHOLDER = "/images/dev/portrait-placeholder.png";

const FULL_RECORD: VerifiedRecord = {
  appearances: 24,
  goals: 11,
  assists: 7,
  minutes: 1872,
  yellow_cards: 3,
  red_cards: 1,
  starts: 21,
  clean_sheets: 6,
  player_of_the_match: 4,
};

/**
 * Mirrors the `player.card.featured_stats` default for the three positions
 * these samples use. Real cards read it from `/players/meta` (Law 2); this is
 * a fixture so the preview shows what the shipped config does.
 *
 * Full priority orders, not trios: the card bills the first three the player
 * has something in, so the tail is what a card falls back to rather than
 * leading with a zero.
 */
const FEATURED: Record<string, ReadonlyArray<string>> = {
  left_winger: [
    "appearances",
    "goals",
    "assists",
    "minutes",
    "starts",
    "clean_sheets",
  ],
  goalkeeper: [
    "appearances",
    "clean_sheets",
    "minutes",
    "starts",
    "assists",
    "goals",
  ],
  centre_back: [
    "appearances",
    "clean_sheets",
    "goals",
    "starts",
    "minutes",
    "assists",
  ],
};

/** A winger four games into a season, with nothing in the column he is billed on. */
const DRY_SPELL: VerifiedRecord = {
  appearances: 4,
  goals: 0,
  assists: 1,
  minutes: 214,
  yellow_cards: 1,
  red_cards: 0,
  starts: 2,
  clean_sheets: 0,
  player_of_the_match: 0,
};

const EMPTY_RECORD: VerifiedRecord = {
  appearances: 0,
  goals: 0,
  assists: 0,
  minutes: 0,
  yellow_cards: 0,
  red_cards: 0,
};

type Sample = Pick<
  Player,
  | "id"
  | "stage_name"
  | "first_name"
  | "last_name"
  | "preferred_number"
  | "primary_position"
  | "market_status"
  | "availability_status"
  | "headshot_url"
>;

const SAMPLES: Sample[] = [
  {
    id: "sample-1",
    stage_name: "KOKO",
    first_name: "Kwame",
    last_name: "Vindalinde",
    preferred_number: 10,
    primary_position: "left_winger",
    market_status: "free_agent",
    availability_status: "available",
    headshot_url: null,
  },
  {
    id: "sample-2",
    stage_name: "SOMDA",
    first_name: "Abdul",
    last_name: "Rahman",
    preferred_number: 1,
    primary_position: "goalkeeper",
    market_status: "affiliated",
    availability_status: "injured",
    headshot_url: null,
  },
  {
    id: "sample-3",
    stage_name: "BIG MAN",
    first_name: "Yakubu",
    last_name: "Mensah",
    preferred_number: 4,
    primary_position: "centre_back",
    market_status: "free_agent",
    availability_status: "available",
    headshot_url: null,
  },
];

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-subtle text-xs">{children}</p>;
}

export function PlayerCardSpecimens() {
  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <Eyebrow tone="primary">Player &amp; Affiliation §15</Eyebrow>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
          Player card
        </h2>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          A player never chooses their card. The gradient is hashed from their
          own key, and each gradient wears one artwork chosen for it rather than
          hashed separately. Colours are the theme-stable <code>--card-*</code>{" "}
          set (ADR-0014): a card in a WhatsApp thread must not depend on the
          sender&apos;s theme. Each ground clears 4.5:1 against white{" "}
          <em>through</em> its pattern, which is why the grounds sit darker than
          the brand fills. No state colour appears here, since a green card
          would read as a status the player has not earned (§4.3).
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <Eyebrow>The three cards, as a player gets them</Eyebrow>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYER_CARD_VARIANTS.map((variant, index) => (
            <div key={variant.key} className="flex flex-col gap-2">
              <PlayerCard
                player={SAMPLES[index]! as Player}
                positions={POSITIONS}
                record={FULL_RECORD}
                featuredStats={FEATURED}
                variant={variant}
              />
              <Caption>
                {variant.name} · <code>{variant.key}</code> · wears{" "}
                <code>{variant.pattern.key}</code>
              </Caption>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>Every pattern · gradient held constant</Eyebrow>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          Forced onto one ground so the artwork can be compared directly. The
          three drawings each belong to a gradient above; the geometry below
          them is reserve, kept for a ground that ever needs a quiet one.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_PATTERNS.map((texture) => (
            <div key={texture.key} className="flex flex-col gap-2">
              <PlayerCard
                player={SAMPLES[0]! as Player}
                positions={POSITIONS}
                record={FULL_RECORD}
                featuredStats={FEATURED}
                variant={PLAYER_CARD_VARIANTS[2]}
                pattern={texture}
              />
              <Caption>
                {texture.name} · <code>{texture.key}</code> · {texture.size}
              </Caption>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>Signature faces, on the ground they actually sit on</Eyebrow>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          Judge these at 60% opacity over a card gradient, not as black on
          white, because that is the only place the signature renders and it is
          what rules half of them out. The calligraphic faces are hairline by
          construction and go faint against the pink; the brush faces hold. Long
          name on the right is the real test: a signature that loses
          &ldquo;Vindalinde&rdquo; is decoration, not a name.
        </p>
        <div className="border-border bg-surface-elev rounded-card flex flex-col gap-5 border p-6">
          {SIGNATURE_CANDIDATES.map((candidate) => (
            <div key={candidate.name} className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-3">
                <code className="text-fg text-xs font-semibold">
                  {candidate.name}
                </code>
                <span className="text-fg-subtle text-xs">{candidate.note}</span>
              </div>
              <div className="flex gap-3">
                {[0, 2].map((look) => (
                  <span
                    key={look}
                    className="rounded-row flex flex-1 items-center justify-center overflow-hidden px-4 py-4"
                    style={{
                      backgroundImage: PLAYER_CARD_VARIANTS[look]!.background,
                    }}
                  >
                    <span
                      className="text-on-card/60 truncate text-4xl leading-tight"
                      style={{
                        fontFamily: candidate.font.style.fontFamily,
                        transform: "rotate(-7deg)",
                      }}
                    >
                      {look === 0 ? "KOKO" : "Kwame Vindalinde"}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>The signature, across the angles it could take</Eyebrow>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          A card with no confirmed match yet carries the player&apos;s own name
          signed across it, the way a signed card has always paired the printed
          name with the autograph. It is true by construction and says nothing
          the card has to defend, which is more than any tagline managed: every
          candidate was either hype (§8 rule 4 bans it), false for a free agent,
          or a caption apologising for the empty space. The face is Caveat, one
          weight, latin only (ADR-0016) — a marker, not a quill, because those
          calligraphic scripts lose a name like Vindalinde at card size.
        </p>
        <div className="border-border bg-surface-elev rounded-card flex flex-col gap-6 border p-6">
          {[-12, -7, -3, 0].map((angle) => (
            <div key={angle} className="flex items-center gap-6">
              <code className="text-fg-subtle w-16 shrink-0 text-xs">
                {angle}deg
              </code>
              {/* On the card ground, since that is the only place it renders
                  and `--on-card` is what it is tuned against. */}
              <span
                className="rounded-row flex flex-1 justify-center overflow-hidden px-4 py-3"
                style={{ backgroundImage: PLAYER_CARD_VARIANTS[0]!.background }}
              >
                <PlayerCardSignature name="KOKO" angle={angle} />
              </span>
              <span
                className="rounded-row flex flex-1 justify-center overflow-hidden px-4 py-3"
                style={{ backgroundImage: PLAYER_CARD_VARIANTS[2]!.background }}
              >
                <PlayerCardSignature name="Kwame Vindalinde" angle={angle} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>Record state, and the portrait slot</Eyebrow>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[2]! as Player}
              positions={POSITIONS}
              record={EMPTY_RECORD}
              featuredStats={FEATURED}
            />
            <Caption>
              No confirmed matches. The card states the §13 gate rather than
              showing a row of zeros.
            </Caption>
          </div>

          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[1]! as Player}
              positions={POSITIONS}
              record={FULL_RECORD}
              featuredStats={FEATURED}
            />
            <Caption>
              A goalkeeper. Leads with clean sheets rather than goals, from{" "}
              <code>player.card.featured_stats</code> — goals and assists still
              appear, in the strip underneath.
            </Caption>
          </div>

          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[1]! as Player}
              positions={POSITIONS}
              record={FULL_RECORD}
              featuredStats={FEATURED}
              portraitUrl={PORTRAIT_PLACEHOLDER}
            />
            <Caption>
              The same card with a half-body portrait (§7). The figure is a dev
              placeholder. Note the layout does not move: the portrait is a
              masked layer, not a column.
            </Caption>
          </div>

          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[0]! as Player}
              positions={POSITIONS}
              record={DRY_SPELL}
              featuredStats={FEATURED}
            />
            <Caption>
              A winger who has not scored yet. Config bills goals second, but
              the lead row skips an empty counter and promotes minutes: a
              &ldquo;0&rdquo; at display scale reads as a verdict rather than as
              a season that has not started. Goals is still on the card, in the
              strip.
            </Caption>
          </div>

          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[2]! as Player}
              positions={POSITIONS}
              record={FULL_RECORD}
              featuredStats={FEATURED}
              onEditPhoto={() => undefined}
            />
            <Caption>
              The owner&apos;s view. The photo becomes a button with a camera
              badge; every other surface renders the same component with no
              control attached. Availability is omitted here, as it is on
              <code>/me</code>, where the control sits below the card.
            </Caption>
          </div>
        </div>
      </div>
    </section>
  );
}
