"use client";

import { useRouter } from "next/navigation";

import { AuthFlow, AuthHero, AuthShell } from "@/components/auth";

/**
 * Auth entry — identifier-first progressive authentication (ADR-0004).
 *
 * One neutral entry point. There is no separate login vs signup screen: the
 * person enters a phone or email, the system detects returning-vs-new via
 * `POST /auth/lookup`, and `<AuthFlow>` branches the copy and steps. The
 * legacy `/auth/signup` route redirects here.
 */
export default function AuthEntryPage() {
  const router = useRouter();

  return (
    <AuthShell hero={<AuthHero />}>
      <AuthFlow onAuthed={() => router.push("/onboarding/area")} />
    </AuthShell>
  );
}
