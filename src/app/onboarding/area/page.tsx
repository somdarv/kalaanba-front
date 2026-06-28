"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AreaOnboarding } from "@/components/onboarding";
import { Spinner } from "@/components/ui";
import { useUser } from "@/lib/api/hooks/use-auth";

/**
 * Post-signup area onboarding (WP-20260625-onboarding-area).
 *
 * Smart pass-through, resolving to exactly one outcome so it can never hang on
 * the loader:
 *   - still loading the session        → spinner
 *   - no usable session (null OR error) → /auth/login (onboarding needs auth)
 *   - already has an area               → /dashboard
 *   - signed in, no area                → the skippable picker
 */
export default function AreaOnboardingPage() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (isLoading) return;
    // `user` is null when logged out, and undefined when the profile fetch
    // failed — neither can onboard, so send both to sign-in.
    if (!user) {
      router.replace("/auth/login");
    } else if (user.area_id) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const showPicker = !isLoading && Boolean(user) && !user?.area_id;

  if (showPicker) {
    return (
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-[max(1rem,env(safe-area-inset-left))] py-10">
        <AreaOnboarding onDone={() => router.replace("/dashboard")} />
      </main>
    );
  }

  return (
    <main className="grid min-h-[100dvh] place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-3 text-fg-muted">
        <Spinner size="lg" label="Loading" />
        <p className="text-sm">
          {isError ? "Taking you to sign in…" : "Getting things ready…"}
        </p>
      </div>
    </main>
  );
}
