"use client";

import { Badge, Button, Divider, LinkButton } from "@/components/ui";
import { useSignOut } from "@/components/site/account-actions";
import type { CurrentUser } from "@/lib/api/auth";

import { MeRow, MeSection } from "./me-section";

/**
 * The account half of `/me` (Identity engine).
 *
 * This block is why the surface exists in the shape it does: the owner's call
 * was that `/me` absorbs the avatar popover, so football sits at the top of one
 * page and account sits at the bottom of it. Three separate menu destinations
 * for area, profile and sign out were three places to look for one thing.
 *
 * **The phone is last four only.** Constitution Law 10 and the engineering
 * standards both forbid a full number on a surface; Identity stores
 * `phone_e164_last4` precisely so a UI can confirm which number is on file
 * without holding the number.
 *
 * **Change phone and change email are absent, not disabled.** The endpoints
 * exist (`POST /users/me/channels/*`) but no flow does — binding a channel
 * needs an OTP round trip and a screen to run it on. A row that says "Change"
 * and opens nothing is a promise the product cannot keep. Area is here because
 * `/onboarding/area` is a real, reachable screen.
 */

export type AccountBlockProps = {
  user: CurrentUser;
};

export function AccountBlock({ user }: AccountBlockProps) {
  const { signOut, isPending } = useSignOut();

  // The area NAME is not resolvable yet. `GET /users/me` returns `area_id`
  // only, and no endpoint turns one id into its name without knowing its hub
  // first. `site/area-pill.tsx` hit the same wall and made the same call:
  // report whether it is set, never guess what it is (Law 3).
  const hasArea = Boolean(user.area_id);

  return (
    <MeSection
      title="Your account"
      action={
        <LinkButton href="/onboarding/area" tone="tonal">
          Change area
        </LinkButton>
      }
    >
      <dl>
        <MeRow label="Area" value={hasArea ? "Set" : "Not set"} />
        <Divider />
        <MeRow
          label="Phone"
          value={
            user.phone_e164_last4
              ? `Ends in ${user.phone_e164_last4}`
              : "Not set"
          }
        />
        <Divider />
        <MeRow
          label="Email"
          value={user.email ?? "Not set"}
          trailing={
            user.email && !user.email_verified_at ? (
              <Badge intent="warning" size="sm">
                Unverified
              </Badge>
            ) : null
          }
        />
      </dl>

      <div className="mt-4">
        <Button
          intent="ghost"
          size="md"
          onClick={() => void signOut()}
          loading={isPending}
          loadingText="Signing out"
        >
          Sign out
        </Button>
      </div>
    </MeSection>
  );
}
