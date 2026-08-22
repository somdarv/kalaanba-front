"use client";

import type { ReactNode } from "react";

import { Badge, Button, Divider, LinkButton } from "@/components/ui";
import { useSignOut } from "@/components/site/account-actions";
import type { CurrentUser } from "@/lib/api/auth";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { COMING_SECTIONS } from "./me-sections";

/**
 * The repeating row of the index pane: a label on the left, its value on the
 * right, hairline between.
 *
 * Baseline-aligned rather than centred, so a value that wraps still lines its
 * first line up with its label.
 */
export function IndexRow({
  label,
  value,
  trailing,
}: {
  label: ReactNode;
  value: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-fg-muted shrink-0 text-sm">{label}</dt>
      <dd className="text-fg flex min-w-0 items-baseline gap-2 text-right text-sm font-medium">
        <span className="min-w-0 break-words">{value}</span>
        {trailing}
      </dd>
    </div>
  );
}

/**
 * Identity fields (Player & Affiliation §6), read-only.
 *
 * Rows rather than a form, for the reason v1 gave: a football name is picked
 * once, so five permanent inputs would spend the pane on something nobody came
 * here to do. Editing is one deliberate tap away in `<DetailsSheet>`.
 *
 * "Not set" rather than a blank cell on the two nullable fields. An empty row
 * reads as a loading state, and both are legitimately optional at creation.
 *
 * Availability is absent on purpose: §12 makes it the field with a consequence
 * past this page, so it lives on the surface as its own control. Two places to
 * change one thing is one too many.
 */
export function DetailRows({
  player,
  meta,
}: {
  player: MyPlayer;
  meta: PlayerMeta;
}) {
  const fullName = `${player.first_name} ${player.last_name}`.trim();

  const rows: ReadonlyArray<{ label: string; value: string }> = [
    { label: "Football name", value: player.stage_name },
    { label: "Full name", value: fullName },
    {
      label: "Number",
      value:
        player.preferred_number != null
          ? String(player.preferred_number)
          : "Not set",
    },
    {
      label: "Position",
      value: labelFor(meta.positions, player.primary_position) ?? "Not set",
    },
  ];

  return (
    <dl>
      {rows.map((row, index) => (
        <div key={row.label}>
          {index > 0 ? <Divider /> : null}
          <IndexRow label={row.label} value={row.value} />
        </div>
      ))}
    </dl>
  );
}

/**
 * The account half of the surface (Identity engine).
 *
 * **Last four digits only.** Constitution Law 10 keeps a phone number off any
 * surface, and Identity stores `phone_e164_last4` precisely so a UI can
 * confirm which number is on file without holding the number.
 *
 * **Change phone and change email are absent, not disabled.** The endpoints
 * exist; no flow does. Binding a channel needs an OTP round trip and a screen
 * to run it on, and a row that says "Change" and opens nothing is a promise
 * the product cannot keep. Area is here because `/onboarding/area` is real.
 */
export function AccountRows({ user }: { user: CurrentUser }) {
  const { signOut, isPending } = useSignOut();

  // The area NAME is not resolvable yet: `GET /users/me` returns `area_id`
  // only, and no endpoint turns one id into its name without knowing its hub
  // first. `site/area-pill.tsx` hit the same wall and made the same call:
  // report whether it is set, never guess what it is (Law 3).
  const hasArea = Boolean(user.area_id);

  return (
    <>
      <dl>
        <IndexRow label="Area" value={hasArea ? "Set" : "Not set"} />
        <Divider />
        <IndexRow
          label="Phone"
          value={
            user.phone_e164_last4
              ? `Ends in ${user.phone_e164_last4}`
              : "Not set"
          }
        />
        <Divider />
        <IndexRow
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

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <LinkButton href="/onboarding/area" tone="tonal">
          Change area
        </LinkButton>
        <Button
          intent="ghost"
          size="sm"
          onClick={() => void signOut()}
          loading={isPending}
          loadingText="Signing out"
        >
          Sign out
        </Button>
      </div>
    </>
  );
}

/**
 * What this surface becomes.
 *
 * Dimmed and inert rather than dropped, the pattern `site/nav-items.ts` set
 * for destinations that are designed but not built. A player who sees a card
 * and an empty record learns that Kalaanba tracks almost nothing; a player who
 * also sees where their matches, RP and awards will sit learns what it is for.
 *
 * No ARIA state on the rows. They are plain text, not disabled controls: there
 * is nothing to focus and nothing in the keyboard path, so `aria-disabled`
 * would describe an interaction that does not exist. The group's own "Not built
 * yet" line carries the meaning for everyone (§6 — colour is never the only
 * signal).
 */
export function ComingRows() {
  return (
    <ul>
      {COMING_SECTIONS.map((section, index) => (
        <li key={section.key} className="opacity-55">
          {index > 0 ? <Divider /> : null}
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <span className="text-fg text-sm font-medium">{section.label}</span>
            <span className="text-fg-subtle text-xs">{section.engine}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
