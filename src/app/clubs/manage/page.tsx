"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ClubRequestsManager } from "@/components/club";
import { Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";
import { useMyClubs } from "@/lib/api/hooks/use-clubs";

/**
 * Club admin surface (WP-20260702-club-finder-join, WP-C2): review and decide
 * pending join requests for the clubs you administer (Player & Affiliation
 * §8/§11). Auth-gated; empty when you administer no clubs.
 */
export default function ManageClubsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: clubs, isLoading: clubsLoading } = useMyClubs();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/auth/login");
    }
  }, [userLoading, user, router]);

  if (userLoading || !user || clubsLoading) {
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
          Manage your clubs
        </h1>
        <p className="text-sm text-fg-muted">
          Accept or decline players who asked to join.
        </p>
      </header>

      {!clubs || clubs.length === 0 ? (
        <div className="rounded-card bg-surface p-5 text-center shadow-md">
          <p className="font-semibold">You don&apos;t administer any clubs</p>
          <p className="mt-1 text-sm text-fg-muted">
            Clubs you own or admin will appear here with their join requests.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {clubs.map((club) => (
            <ClubRequestsManager key={club.id} club={club} />
          ))}
        </div>
      )}
    </main>
  );
}
