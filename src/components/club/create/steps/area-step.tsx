"use client";

import { useMemo, useState } from "react";

import { Button, Select, type SelectOption } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";
import { SuggestAreaDialog } from "@/components/onboarding";
import { useAreas, useHubs } from "@/lib/api/hooks/use-zone";

import { type ClubStepProps } from "./step-props";

/**
 * Step 5 — the Area (Club §6, Zone §5). Kalaanba maps Area to Zone/Belt
 * itself; the club never picks a zone, and this flow never shows one (Law 3).
 *
 * A hub with no areas under it is the ordinary case outside Tamale rather than
 * an error: Zone §5 fills the list through user suggestions. An empty dropdown
 * there reads as broken, so the ask replaces it, reusing the same dialog the
 * post-signup area onboarding uses.
 */
export function AreaStep({ wizard }: ClubStepProps) {
  const { watch, setValue, formState } = wizard.form;
  const hubId = watch("city_hub_id");
  const current = watch("area_id");

  const hubs = useHubs();
  const areas = useAreas({ city_hub_id: hubId || undefined });
  const [suggestOpen, setSuggestOpen] = useState(false);

  const options: SelectOption[] = useMemo(
    () =>
      (areas.data ?? []).map((area) => ({ value: area.id, label: area.name })),
    [areas.data],
  );

  const hubName =
    hubs.data?.find((hub) => hub.id === hubId)?.name ?? "your hub";

  const hasNoAreas =
    Boolean(hubId) && !areas.isLoading && (areas.data?.length ?? 0) === 0;

  return (
    <>
      <StepHeading note="Where the club is from. You can play your matches anywhere.">
        Which area do you play from?
      </StepHeading>

      <StepStagger index={1}>
        {hasNoAreas ? (
          <div className="rounded-card border-border bg-surface border p-4">
            <p className="text-fg text-sm font-medium">
              No areas in {hubName} yet.
            </p>
            <p className="text-fg-muted mt-1 text-sm">
              Tell us yours and we will add it.
            </p>
            <Button
              className="mt-3"
              intent="secondary"
              onClick={() => setSuggestOpen(true)}
            >
              Add your area
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Select
              label="Area"
              placeholder={areas.isLoading ? "Loading areas" : "Find your area"}
              searchable
              disabled={areas.isLoading}
              options={options}
              value={current || null}
              onChange={(next) =>
                setValue("area_id", next ?? "", { shouldValidate: true })
              }
              error={formState.errors.area_id?.message}
              hint="Your locality, suburb, or quarter."
            />

            <button
              type="button"
              onClick={() => setSuggestOpen(true)}
              className="text-primary self-start text-left text-sm font-medium underline-offset-2 hover:underline"
            >
              Can&rsquo;t find your area? Suggest it
            </button>
          </div>
        )}
      </StepStagger>

      {hubId ? (
        <SuggestAreaDialog
          open={suggestOpen}
          onOpenChange={setSuggestOpen}
          cityHubId={hubId}
          hubName={hubName}
          onSuggested={() => areas.refetch()}
        />
      ) : null}
    </>
  );
}
