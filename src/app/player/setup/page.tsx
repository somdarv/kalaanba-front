"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PlayerSetupWizard } from "@/components/player";
import { ErrorState, Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { usePlayerMeta } from "@/lib/api/hooks/use-player";

/**
 * Player-profile setup (WP-20260702-player-profile, reworked as a guided flow
 * in WP-20260819-player-setup-wizard). Optional entry from the home CTA —
 * turns the account into a CLAIMED FREE-AGENT player (Player & Affiliation
 * §4/§22). Club assignment is a separate flow.
 *
 * Auth-gated: the create endpoint needs a session, so a signed-out visitor is
 * sent to sign in. The flow is additionally gated on the profile-form
 * vocabulary (ADR-0007) — without it there is no authority for the option
 * sets or the number bounds, and guessing them locally is the exact drift the
 * meta endpoint exists to end.
 */
export default function PlayerSetupPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const meta = usePlayerMeta();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || meta.isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <Spinner size="lg" label="Loading" />
      </main>
    );
  }

  if (meta.isError || !meta.data) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <ErrorState
          title="Couldn't start setup"
          description="We couldn't load the profile options. Check your connection and try again."
          onRetry={async () => {
            await meta.refetch();
          }}
        />
      </main>
    );
  }

  const [firstName, ...rest] = (user.name ?? "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  return (
    <PlayerSetupWizard
      meta={meta.data}
      defaults={{ firstName: firstName ?? "", lastName }}
      onExit={() => router.push("/")}
      onDone={() => router.push("/")}
    />
  );
}
