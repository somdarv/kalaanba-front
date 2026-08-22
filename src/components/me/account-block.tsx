"use client";

import { PencilSimple } from "@phosphor-icons/react";

import { Badge, Button, ButtonLink, Divider } from "@/components/ui";
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
 * **Every value here is read straight off `GET /users/me`.** Nothing is
 * derived, defaulted or filled in. "Not set" means the API sent null, which on
 * this surface is a fact worth showing rather than a gap worth hiding.
 *
 * **The phone is last four only.** Constitution Law 10 and the engineering
 * standards both forbid a full number on a surface; Identity stores
 * `phone_e164_last4` precisely so a UI can confirm which number is on file
 * without holding the number. `MeResource` sends nothing longer, so this is
 * the most the client could show even if the rule allowed it.
 *
 * **The edit affordance is per row, not per block.** A "Change area" button on
 * the heading row was answering a question the heading does not ask, and it
 * sat as far as the layout allows from the row it changes. A pencil on the
 * area row points at the thing it edits.
 *
 * **Change phone and change email are absent, not disabled.** The endpoints
 * exist (`POST /users/me/channels/*`) but no flow does — binding a channel
 * needs an OTP round trip and a screen to run it on. A row that says "Change"
 * and opens nothing is a promise the product cannot keep. Area has a pencil
 * because `/onboarding/area` is a real, reachable screen.
 */

export type AccountBlockProps = {
  user: CurrentUser;
};

export function AccountBlock({ user }: AccountBlockProps) {
  const { signOut, isPending } = useSignOut();

  // The area NAME is not resolvable on this build. `GET /users/me` returns
  // `area_id` and no `city_hub_id`, and `GET /zone/areas` REQUIRES a hub
  // (422 `zone.city_hub_id_required`), so there is no single read that turns
  // one id into one name. `site/area-pill.tsx` hit the same wall and made the
  // same call: report whether it is set, never guess what it is (Law 3).
  const hasArea = Boolean(user.area_id);

  return (
    <MeSection title="Your account">
      <dl>
        <MeRow
          label="Area"
          value={hasArea ? "Set" : "Not set"}
          trailing={
            <ButtonLink
              href="/onboarding/area"
              intent="ghost"
              size="sm"
              aria-label={hasArea ? "Change your area" : "Set your area"}
              className="px-2"
            >
              <PencilSimple size={15} weight="bold" aria-hidden />
            </ButtonLink>
          }
        />
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

      {/* Filled danger rather than a quiet ghost. Signing out on a shared
          phone is the one thing on this page a player cannot undo without
          their number to hand, so it reads as what it is. */}
      <div className="mt-4">
        <Button
          intent="danger"
          size="sm"
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
