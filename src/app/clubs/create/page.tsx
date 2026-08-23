"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ClubCreateWizard } from "@/components/club";
import { ErrorState, Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { useClubMeta } from "@/lib/api/hooks/use-clubs";

/**
 * Start a club (WP-20260823-club-creation). Open to any signed-in user: Club
 * engine §5 wants creation to feel as easy as making a WhatsApp group, and the
 * gates that matter sit elsewhere — the reserved-name policy at the door and
 * verification for anyone claiming to be an official club (ADR-0017).
 *
 * Auth-gated, because the create endpoint needs a session. Also gated on the
 * creation vocabulary: without it there is no authority for the tiers, the club
 * types or the name bounds, and guessing them locally is the drift the meta
 * endpoint exists to end (ADR-0007).
 */
export default function CreateClubPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const meta = useClubMeta();

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
          title="Couldn't start"
          description="We couldn't load the club options. Check your connection and try again."
          onRetry={async () => {
            await meta.refetch();
          }}
        />
      </main>
    );
  }

  return (
    <ClubCreateWizard
      meta={meta.data}
      onExit={() => router.back()}
      onManage={() => router.push("/clubs/manage")}
      onGoHome={() => router.push("/")}
    />
  );
}
