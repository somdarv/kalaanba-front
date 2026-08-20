"use client";

import { MapPin } from "@phosphor-icons/react";

import { ButtonLink } from "@/components/ui";

/**
 * The area strip under the header. Kalaanba's home is personalised by *place*
 * before it is personalised by anything else: Zone §5 has users pick a City
 * Hub and an Area, and every discovery surface below this line is scoped to it.
 *
 * Three states, because all three are real:
 *   - signed out          -> nothing. There is no area to show and prompting a
 *                            stranger to set one is asking before explaining.
 *   - signed in, no area  -> the prompt. This is the one thing that unlocks the
 *                            rest of the page, so it is the loudest thing here.
 *   - signed in, area set -> the place, quietly, with a way to change it.
 *
 * It does NOT resolve the area name yet. `GET /users/me` returns `area_id`
 * only, and there is no endpoint that turns one id into its name without
 * knowing its hub first. Inventing a lookup here would put a second source of
 * geography in the frontend, which is exactly what Law 3 forbids. Flagged for
 * the Zone read WP that follows.
 */

export type AreaPillProps = {
  isSignedIn: boolean;
  hasArea: boolean;
};

export function AreaPill({ isSignedIn, hasArea }: AreaPillProps) {
  if (!isSignedIn) return null;

  return (
    <div className="flex items-center gap-2">
      <MapPin
        size={16}
        weight="bold"
        aria-hidden
        className={hasArea ? "text-fg-muted" : "text-primary-ink"}
      />
      {hasArea ? (
        <p className="text-sm text-fg-muted">
          Your area.{" "}
          <ButtonLink
            href="/onboarding/area"
            intent="ghost"
            size="sm"
            className="px-1"
          >
            Change
          </ButtonLink>
        </p>
      ) : (
        <p className="text-sm text-fg">
          Set your area to see clubs near you.{" "}
          <ButtonLink
            href="/onboarding/area"
            intent="ghost"
            size="sm"
            className="px-1 text-primary-ink"
          >
            Set it
          </ButtonLink>
        </p>
      )}
    </div>
  );
}
