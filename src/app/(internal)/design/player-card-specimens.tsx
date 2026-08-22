import { Eyebrow } from "@/components/ui";
import { PlayerCard } from "@/components/player/setup/player-card";
import { ALL_PATTERNS } from "@/components/player/setup/player-card-patterns";
import { PLAYER_CARD_VARIANTS } from "@/components/player/setup/player-card-variants";
import type { LabelledOption, Player, VerifiedRecord } from "@/lib/api/player";

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

const POSITIONS: LabelledOption[] = [
  { key: "left_winger", label: "Left Winger" },
  { key: "goalkeeper", label: "Goalkeeper" },
  { key: "centre_back", label: "Centre Back" },
];

const MARKET_STATUSES: LabelledOption[] = [
  { key: "free_agent", label: "Free agent" },
  { key: "affiliated", label: "Signed" },
];

const AVAILABILITY: LabelledOption[] = [
  { key: "available", label: "Available" },
  { key: "injured", label: "Injured" },
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
 */
const FEATURED: Record<string, ReadonlyArray<string>> = {
  left_winger: ["appearances", "goals", "assists"],
  goalkeeper: ["appearances", "clean_sheets", "minutes"],
  centre_back: ["appearances", "clean_sheets", "goals"],
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
          hashed separately. Colours are the theme-stable{" "}
          <code>--card-*</code> set (ADR-0014): a card in a WhatsApp thread must
          not depend on the sender&apos;s theme. Each ground clears 4.5:1
          against white <em>through</em> its pattern, which is why the grounds
          sit darker than the brand fills. No state colour appears here, since a
          green card would read as a status the player has not earned (§4.3).
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
                marketStatuses={MARKET_STATUSES}
                availability={AVAILABILITY}
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
                marketStatuses={MARKET_STATUSES}
                availability={AVAILABILITY}
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
        <Eyebrow>Record state, and the portrait slot</Eyebrow>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[2]! as Player}
              positions={POSITIONS}
              marketStatuses={MARKET_STATUSES}
              availability={AVAILABILITY}
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
              marketStatuses={MARKET_STATUSES}
              availability={AVAILABILITY}
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
              marketStatuses={MARKET_STATUSES}
              availability={AVAILABILITY}
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
        </div>
      </div>
    </section>
  );
}
