"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle, Clock } from "@phosphor-icons/react";

import {
  Badge,
  Button,
  Crest,
  KeyboardFooter,
  flowColumn,
  flowGutter,
} from "@/components/ui";
import {
  ANNOUNCEMENT_HOLD_MS,
  FlowAnnouncement,
  RevealBeat,
} from "@/components/ui/wizard";
import {
  CLUB_PENDING_REVIEW,
  clubTypeLabel,
  type Club,
  type ClubMeta,
} from "@/lib/api/club";

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
 *
 * **Two acts, the same shape the player reveal uses** (WP-20260824-setup-
 * surface, owner's request). The tick and the sentence hold the screen on
 * their own, then leave, and the club takes the space they were using.
 * `mode="wait"` is what makes the second act fill the gap rather than slide up
 * into it, and it keeps the whole screen on `transform` and `opacity` (§3.4).
 *
 * The announcement is why the headline underneath does not repeat it. "Club
 * created" then "Rdio FC is live" are two different facts; "Club created" then
 * "Club created" would be noise.
 *
 * **The two ways out sit side by side on the floor of the screen**, in a
 * `<KeyboardFooter>`, exactly as the player reveal does them. Stacked full-
 * width buttons cost a phone ~128px and pushed the badge the owner just made
 * off the bottom. The primary takes more of the row so its label cannot wrap
 * at 320px, which is under the §9.2 design width but still out there.
 */

/** Seconds after the outcome mounts. The announcement has already run. */
const BEAT = {
  crest: 0,
  headline: 0.08,
  note: 0.16,
  badge: 0.24,
  cta: 0.32,
} as const;

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
  const reduce = useReducedMotion();
  const [hasHeld, setHasHeld] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setHasHeld(true),
      ANNOUNCEMENT_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  // Derived, not set from the effect: reduced motion skips the act outright
  // (§3.6) rather than playing a fast version of it.
  const isAnnouncing = !reduce && !hasHeld;
  const isPending = club.verification_state === CLUB_PENDING_REVIEW;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className={`flex-1 ${flowGutter} pt-8 pb-6`}>
        <div className={flowColumn}>
          <AnimatePresence mode="wait">
            {isAnnouncing ? (
              <FlowAnnouncement key="announcement">
                {isPending ? "Sent for checking" : "Club created"}
              </FlowAnnouncement>
            ) : (
              <div
                key="outcome"
                className="flex flex-col items-center gap-4 text-center"
              >
                <RevealBeat delay={BEAT.crest}>
                  <Crest name={club.name} src={club.crest_url} size="2xl" />
                </RevealBeat>

                <RevealBeat delay={BEAT.headline}>
                  <h1 className="font-display text-fg text-3xl font-bold tracking-tight text-balance">
                    {isPending
                      ? "We are checking your club"
                      : `${club.name} is live`}
                  </h1>
                </RevealBeat>

                {/* What kind of club it is sits DIRECTLY under its name, where
                    a name is normally qualified. Owner's call. It used to be
                    last, under the badge, which put the least conditional fact
                    on the screen furthest from the thing it describes. */}
                <RevealBeat delay={BEAT.note}>
                  <p className="text-fg-muted text-sm">
                    {clubTypeLabel(meta, club.club_type)}
                  </p>
                </RevealBeat>

                {/* Only the held club keeps a sentence here, and it is the one
                    sentence this screen exists to say (ADR-0017 §2). The live
                    club's "You own it." is gone: the badge below says it in a
                    word. */}
                {isPending ? (
                  <RevealBeat delay={BEAT.badge}>
                    <p className="text-fg-muted text-sm">
                      Nothing shows publicly yet. We will let you know.
                    </p>
                  </RevealBeat>
                ) : null}

                <RevealBeat delay={BEAT.badge}>
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
                    {isPending ? "Under review" : "Active"}
                  </Badge>
                </RevealBeat>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {isAnnouncing ? null : (
        <KeyboardFooter bordered={false} className={`bg-bg/95 ${flowGutter}`}>
          <RevealBeat delay={BEAT.cta} className={flowColumn}>
            <div className="flex items-center gap-3">
              <Button
                intent="ghost"
                size="md"
                className="flex-1"
                onClick={onGoHome}
              >
                Done
              </Button>
              <Button size="md" className="flex-[1.6]" onClick={onManage}>
                {isPending ? "See your club" : "Manage your club"}
              </Button>
            </div>
          </RevealBeat>
        </KeyboardFooter>
      )}
    </div>
  );
}
