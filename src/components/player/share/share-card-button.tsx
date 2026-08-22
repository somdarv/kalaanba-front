"use client";

import { useState } from "react";
import { ShareNetwork } from "@phosphor-icons/react";

import type { PlayerCardModel } from "@/components/player/setup/player-card-model";
import type { CardStatLabel } from "@/components/player/setup/player-card-stats";
import { Button } from "@/components/ui";
import type { Player, VerifiedRecord } from "@/lib/api/player";
import { IS_SEED_ENABLED } from "@/lib/env";

import { renderShareImage } from "./share-image";

/**
 * Share the card as a picture (Player & Affiliation §15).
 *
 * §15 names the share image as the acquisition loop: a card in a group chat is
 * how the next player hears about the product. So the thing shared is a
 * picture, not a link — a link in a WhatsApp thread is a grey rectangle with a
 * favicon, and a 4:5 image is the player's face at the top of the thread.
 *
 * **One button, three outcomes, in falling order of how good they are.** The
 * Web Share API with a file attached hands the image straight to WhatsApp and
 * is what almost every Android and iOS browser does. Where files are not
 * shareable the image downloads instead, which still ends with the player
 * holding the picture. A failure says so in one line and leaves the button
 * usable.
 *
 * **Fonts are awaited before anything is drawn.** Canvas silently substitutes a
 * fallback for a face that has not loaded, so rendering early produces a card
 * in the wrong typeface with no error anywhere — and the first share is exactly
 * when the fonts are least likely to be warm.
 *
 * The graphic is drawn from the same model the card renders from, so what is
 * sent and what is on screen cannot drift apart.
 */

export type ShareCardButtonProps = {
  player: Player;
  model: PlayerCardModel;
  record?: VerifiedRecord | null;
  statLabels?: Record<string, Partial<CardStatLabel>>;
  className?: string;
};

type Status = "idle" | "working" | "failed";

export function ShareCardButton({
  player,
  model,
  record,
  statLabels,
  className,
}: ShareCardButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function share() {
    setStatus("working");
    try {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }

      const blob = await renderShareImage({
        player,
        model,
        record,
        statLabels,
        isDemo: IS_SEED_ENABLED,
      });

      const file = new File([blob], fileNameFor(player.stage_name), {
        type: "image/png",
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${player.stage_name} on Kalaanba`,
        });
      } else {
        download(blob, file.name);
      }

      setStatus("idle");
    } catch (error) {
      // The player closing the share sheet rejects with AbortError. That is a
      // choice, not a fault, and telling them it failed would be a lie.
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("failed");
    }
  }

  return (
    <div className={className}>
      <Button
        intent="secondary"
        size="sm"
        onClick={share}
        loading={status === "working"}
        leadingIcon={<ShareNetwork size={16} weight="bold" />}
      >
        Share card
      </Button>

      {status === "failed" ? (
        <p role="alert" className="text-danger-ink mt-2 text-xs">
          Could not make your card picture. Try again.
        </p>
      ) : null}
    </div>
  );
}

function fileNameFor(stageName: string): string {
  const slug =
    stageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "player";
  return `${slug}-kalaanba.png`;
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
