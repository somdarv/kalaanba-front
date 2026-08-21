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
      <Card
        tone="flat"
        size="md"
        className="border-dashed text-center"
      >
        <h1 className="font-display text-xl font-bold tracking-tight text-fg">
          Make your player card
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-fg-muted">
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
      <h1 className="sr-only">
        {player.stage_name}, your player card
      </h1>

      <PlayerCard
        player={player}
        positions={meta.positions}
        marketStatuses={meta.market_statuses}
      />

      <div className="flex items-center gap-2">
        <Button intent="secondary" size="sm" onClick={onEdit}>
          Edit details
        </Button>
        <Button intent="ghost" size="sm" disabled>
          Share card
        </Button>
      </div>

      <p className="text-xs text-fg-subtle">
        Sharing your card is coming next.
      </p>
    </div>
  );
}
