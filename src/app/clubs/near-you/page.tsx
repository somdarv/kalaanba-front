"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ClubsFinder } from "@/components/club";
import { Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";

/**
 * Clubs-near-you finder (WP-20260702-club-finder-join, WP-C1). Optional entry
 * from the home CTA — lists clubs in the player's area (Club §6/§15). Requesting
 * to join is wired in WP-C2.
 *
 * Auth-gated; needs an area to search — a user without one is nudged to set it.
 */
export default function ClubsNearYouPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <Spinner size="lg" label="Loading" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-[max(1.5rem,env(safe-area-inset-left))] py-10">
      <header className="mb-6 space-y-1.5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
          Clubs near you
        </h1>
        <p className="text-sm text-fg-muted">
          Find a team playing in your area and ask to join.
        </p>
      </header>

      {user.area_id ? (
        <ClubsFinder areaId={user.area_id} />
      ) : (
        <div className="rounded-card bg-surface p-5 text-center shadow-md">
          <p className="font-semibold">Set your area first</p>
          <p className="mt-1 text-sm text-fg-muted">
            We use your area to find clubs near you.
          </p>
          <Link
            href="/onboarding/area"
            className="mt-3 inline-flex min-h-11 items-center rounded-full bg-primary px-5 font-medium text-on-primary outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Choose your area
          </Link>
        </div>
      )}
    </main>
  );
}
