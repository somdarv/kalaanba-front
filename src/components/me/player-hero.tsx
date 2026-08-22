"use client";

import { Button, ButtonLink, Card } from "@/components/ui";
import { PlayerCard } from "@/components/player/setup/player-card";
import type { MyPlayer, PlayerMeta } from "@/lib/api/player";

/**
 * The hero of `/me` — the player's own card.
 *
 * Reuses the `<PlayerCard>` the setup reveal already ships rather than growing a
 * second one. §15 wants ONE card that is shareable and stays current; two
 * implementations of it is how the shared image and the live URL start
 * disagreeing.
 *
 * **This surface is where the card is fullest.** Setup has no record to speak
 * of, so it renders identity alone. Here the card gets the verified counters
 * (§13) too, which is the difference between "your card" at minute one and the
 * same card a season later. They are backend-owned values passed straight
 * through (Constitution Law 3), and which three of them lead is config the
 * card reads by position (Law 2).
 *
 * **No availability on the card here.** `<AvailabilityBlock>` sits directly
 * underneath it as a one-tap control, so the card would be restating a value
 * the player can already see and change six inches lower. The setup reveal
 * still shows it, where the player has just chosen it and nothing else on the
 * screen confirms the choice.
 *
 * **Share is rendered disabled, not hidden.** §15 calls the shareable card the
 * acquisition loop, so a player should be able to see it is coming. It needs a
 * public read and a public route, both fenced out of this packet. The line
 * underneath says why in a way that does not read as an error — a dimmed button
 * with no explanation is the thing that reads as broken.
 *
 * The no-card branch is a real state, not a fallback: post-signup users are
 * `role=user` and player-hood is opt-in (§22), so most accounts land here. It
 * offers one action and does not redirect, because a `/me` that bounces you
 * into the wizard is a trapdoor rather than a page.
 */

export type PlayerHeroProps = {
  player: MyPlayer | null;
  meta: PlayerMeta;
  onEdit: () => void;
};

export function PlayerHero({ player, meta, onEdit }: PlayerHeroProps) {
  if (!player) {
    return (
      <Card tone="flat" size="md" className="border-dashed text-center">
        <h1 className="font-display text-fg text-xl font-bold tracking-tight">
          Make your player card
        </h1>
        <p className="text-fg-muted mx-auto mt-2 max-w-xs text-sm">
          It takes a minute. You pick your number, your position and when you
          play.
        </p>
        <ButtonLink href="/player/setup" size="md" className="mt-5">
          Start
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* The card carries the player's name at display size, so it is the page
          heading. A second visible <h1> above it would say the same thing
          twice; `<PlayerCard>` renders the stage name as its own <h2>, and the
          visually-hidden <h1> is what gives the document one. */}
      <h1 className="sr-only">{player.stage_name}, your player card</h1>

      <PlayerCard
        player={player}
        positions={meta.positions}
        marketStatuses={meta.market_statuses}
        record={player.record}
        featuredStats={meta.card_featured_stats}
      />

      <div className="flex items-center gap-2">
        <Button intent="secondary" size="sm" onClick={onEdit}>
          Edit details
        </Button>
        <Button intent="ghost" size="sm" disabled>
          Share card
        </Button>
      </div>

      <p className="text-fg-subtle text-xs">Sharing your card is coming next.</p>
    </div>
  );
}
