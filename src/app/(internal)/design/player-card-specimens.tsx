import { Eyebrow } from "@/components/ui";
import { PlayerCard } from "@/components/player/setup/player-card";
import { PLAYER_CARD_VARIANTS } from "@/components/player/setup/player-card-variants";
import type { LabelledOption, Player } from "@/lib/api/player";

/**
 * All three player-card looks, side by side.
 *
 * Real cards derive their look from the player's own key, so no single account
 * can ever show you the set. This forces each one so the three can be judged
 * against each other, which is the only way to tell whether they read as one
 * family or as three unrelated cards.
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

const SAMPLES: Array<Pick<
  Player,
  "id" | "stage_name" | "first_name" | "last_name" | "preferred_number" | "primary_position" | "market_status" | "headshot_url"
>> = [
  {
    id: "sample-1",
    stage_name: "KOKO",
    first_name: "Kwame",
    last_name: "Vindalinde",
    preferred_number: 10,
    primary_position: "left_winger",
    market_status: "free_agent",
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
    headshot_url: null,
  },
];

export function PlayerCardSpecimens() {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Eyebrow tone="primary">Player &amp; Affiliation §15</Eyebrow>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
          Player card, three looks
        </h2>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          A player never chooses their card. The look is hashed from their own
          key, so it is the same on every device and for ever, and the person
          next to them has a different one. Colours are `--primary` and
          `--accent` mixed. No state colour appears here: a green card would
          read as a status the player has not earned (§4.3).
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYER_CARD_VARIANTS.map((variant, index) => (
          <div key={variant.key} className="flex flex-col gap-2">
            <PlayerCard
              player={SAMPLES[index]! as Player}
              positions={POSITIONS}
              marketStatuses={MARKET_STATUSES}
              variant={variant}
            />
            <p className="text-fg-subtle text-xs">
              {variant.name} · <code>{variant.key}</code>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
