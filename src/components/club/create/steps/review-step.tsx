"use client";

import { Card, Crest, Divider, Eyebrow } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";
import { clubTypeLabel, PROFESSIONAL_TIER } from "@/lib/api/club";
import { useObjectUrl } from "@/hooks/use-object-url";
import { useAreas, useHubs } from "@/lib/api/hooks/use-zone";

import { type ClubStepProps } from "./step-props";

/**
 * Step 6 — read it back before writing it.
 *
 * Names, not ids. The person picked "Tamale City Hub" and "Aboabo"; showing
 * them two UUIDs to confirm is showing them nothing. Hub and area names are
 * resolved from the same Zone queries the pickers used, so nothing extra is
 * fetched.
 *
 * For an official claim this screen carries the one thing that must not be a
 * surprise: the club does not go live here. The CTA above it reads "Send for
 * checking" rather than "Create club" for the same reason.
 *
 * **`Card tone="spotlight"`, the recipe `/me` runs on** (owner's request,
 * WP-20260824-setup-surface). This is the last thing seen before the club
 * exists, and it is the one screen in the flow showing an OBJECT rather than
 * asking a question — the same job the blocks on `/me` do. A hand-rolled
 * `bg-surface … shadow-md` was approximating that recipe rather than composing
 * it, which is what DESIGN_LANGUAGE §2.4 says not to do.
 *
 * Sizes come up with it: the badge is the thing being confirmed and at 48px it
 * was an icon beside a name rather than the club's own mark.
 */
export function ReviewStep({ meta, wizard }: ClubStepProps) {
  const values = wizard.form.getValues();
  const hubs = useHubs();
  const areas = useAreas({ city_hub_id: values.city_hub_id || undefined });

  const hubName =
    hubs.data?.find((hub) => hub.id === values.city_hub_id)?.name ?? "";
  const areaName =
    areas.data?.find((area) => area.id === values.area_id)?.name ?? "";

  const isProfessional = wizard.tier?.key === PROFESSIONAL_TIER;

  // The badge has not been uploaded yet — the club has to exist first — so it
  // is previewed from the local Blob. That is the point of showing it here:
  // the person sees the framing they actually chose before they commit.
  const crestUrl = useObjectUrl(wizard.crest);

  return (
    <>
      <StepHeading>Check this over</StepHeading>

      <StepStagger index={1}>
        <Card tone="spotlight" size="md">
          <div className="flex items-center gap-4">
            <Crest name={values.name} src={crestUrl} size="xl" />
            <div className="min-w-0">
              <p className="font-display text-fg truncate text-xl font-extrabold tracking-tight">
                {values.name}
              </p>
              <p className="text-fg-muted truncate text-sm">
                {clubTypeLabel(meta, values.club_type)}
              </p>
            </div>
          </div>

          <dl className="mt-5">
            <Row label="Kind" value={wizard.tier?.label ?? values.tier} />
            <Divider />
            <Row label="City hub" value={hubName} />
            <Divider />
            <Row label="Area" value={areaName} />
          </dl>
        </Card>

        {isProfessional ? (
          <p className="text-fg-muted mt-4 text-sm">
            We check official clubs before they go live. Nothing shows publicly
            until then.
          </p>
        ) : null}
      </StepStagger>
    </>
  );
}

/**
 * The same label/value shape `/me` uses: a tracked uppercase micro-label
 * against a semibold value. Written out rather than imported from
 * `components/me/`, because a club flow reaching into the player surface for a
 * six-line row would be a feature depending on a feature
 * (engineering-standards §3). Both compose `<Eyebrow>`, which is where the
 * rule actually lives.
 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <Eyebrow as="dt" tone="muted" className="shrink-0">
        {label}
      </Eyebrow>
      <dd className="text-fg min-w-0 truncate text-right text-sm font-semibold">
        {value}
      </dd>
    </div>
  );
}
