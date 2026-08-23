"use client";

import { CheckCircle, Clock } from "@phosphor-icons/react";

import { Badge, Button, ButtonLink, Crest } from "@/components/ui";
import { RevealBeat } from "@/components/ui/wizard";
import { CLUB_PENDING_REVIEW, clubTypeLabel, type Club, type ClubMeta } from "@/lib/api/club";

/**
 * What the flow ends on. Two different endings, because two different things
 * happened.
 *
 * A local club is live and owned: it says so, and offers the things an owner
 * can actually do next. An official claim is not live, and pretending
 * otherwise is the one lie this flow must not tell — the club exists, nobody
 * else can see it, and a person has to look at it first (ADR-0017 §2).
 *
 * Both read the state off the created club rather than off the tier that was
 * submitted. The backend decides what was made (Law 3); the client asked for
 * something and is reporting what it got.
 */

export type CreateOutcomeProps = {
  club: Club;
  meta: ClubMeta;
  /** Go and manage the club that now exists. */
  onManage: () => void;
  /** Leave the flow. */
  onGoHome: () => void;
};

export function CreateOutcome({
  club,
  meta,
  onManage,
  onGoHome,
}: CreateOutcomeProps) {
  const isPending = club.verification_state === CLUB_PENDING_REVIEW;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-[max(1.5rem,env(safe-area-inset-left))] py-10">
      <RevealBeat>
        <div className="flex flex-col items-center gap-4 text-center">
          <Crest name={club.name} src={club.crest_url} size="xl" />

          <div>
            <h1 className="font-display text-fg text-3xl font-bold tracking-tight text-balance">
              {isPending ? "We are checking your club" : `${club.name} is live`}
            </h1>
            <p className="text-fg-muted mt-2 text-sm">
              {isPending
                ? "Nothing shows publicly yet. We will let you know."
                : "You own it."}
            </p>
          </div>

          <Badge
            size="sm"
            intent={isPending ? "warning" : "success"}
            className="gap-1.5"
          >
            {isPending ? (
              <Clock size={14} weight="bold" aria-hidden />
            ) : (
              <CheckCircle size={14} weight="bold" aria-hidden />
            )}
            {isPending ? "Under review" : "Owner"}
          </Badge>

          <p className="text-fg-subtle text-sm">
            {clubTypeLabel(meta, club.club_type)}
          </p>
        </div>
      </RevealBeat>

      <RevealBeat delay={0.12}>
        <div className="flex flex-col gap-3">
          <Button size="lg" fullWidth onClick={onManage}>
            {isPending ? "See your club" : "Manage your club"}
          </Button>

          {isPending ? (
            <Button intent="ghost" fullWidth onClick={onGoHome}>
              Done
            </Button>
          ) : (
            <ButtonLink href="/clubs/near-you" intent="ghost" size="md">
              See other clubs near you
            </ButtonLink>
          )}
        </div>
      </RevealBeat>
    </main>
  );
}
