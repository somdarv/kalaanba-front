"use client";

import { Crest, Divider } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";
import { clubTypeLabel, PROFESSIONAL_TIER } from "@/lib/api/club";
import { useObjectUrl } from "@/hooks/use-object-url";
import { useAreas, useHubs } from "@/lib/api/hooks/use-zone";

import { stepLead, type ClubStepProps } from "./step-props";

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
      <StepHeading lead={stepLead(wizard)}>Check this over</StepHeading>

      <StepStagger index={1}>
        <div className="rounded-card bg-surface flex flex-col gap-4 p-4 shadow-md">
          <div className="flex items-center gap-3">
            <Crest name={values.name} src={crestUrl} size="lg" />
            <div className="min-w-0">
              <p className="font-display text-fg truncate text-lg font-bold tracking-tight">
                {values.name}
              </p>
              <p className="text-fg-muted truncate text-sm">
                {clubTypeLabel(meta, values.club_type)}
              </p>
            </div>
          </div>

          <Divider />

          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Kind" value={wizard.tier?.label ?? values.tier} />
            <Row label="City hub" value={hubName} />
            <Row label="Area" value={areaName} />
          </dl>
        </div>

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="text-fg min-w-0 truncate text-right font-medium">
        {value}
      </dd>
    </div>
  );
}
