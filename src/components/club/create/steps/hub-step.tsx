"use client";

import { useMemo } from "react";
import { MapPin } from "@phosphor-icons/react";

import { Select, Skeleton, type SelectOption } from "@/components/ui";
import { StepHeading, StepStagger } from "@/components/ui/wizard";
import { useHubs } from "@/lib/api/hooks/use-zone";

import { stepLead, type ClubStepProps } from "./step-props";

/**
 * Step 4 — the City Hub (Club §6, Zone §2/§5).
 *
 * Hub before Area, because Areas are listed per hub. The club's identity
 * location, not where it plays its matches: §6 is explicit that a club may
 * represent one area and play official games on a pitch in another.
 *
 * A searchable Select rather than a radio list: there are thirteen hubs and
 * the set grows, which is past the point where a list of tap targets is
 * kinder than a picker.
 */
export function HubStep({ wizard }: ClubStepProps) {
  const hubs = useHubs();
  const { watch, setValue } = wizard.form;
  const current = watch("city_hub_id");

  const options: SelectOption[] = useMemo(
    () =>
      (hubs.data ?? []).map((hub) => ({
        value: hub.id,
        label: hub.name,
        description: hub.region ?? undefined,
      })),
    [hubs.data],
  );

  return (
    <>
      <StepHeading lead={stepLead(wizard)} note="The club's football home.">
        Which city hub?
      </StepHeading>

      <StepStagger index={1}>
        {hubs.isLoading ? (
          <Skeleton className="h-12 w-full rounded-full" />
        ) : (
          <Select
            label="City hub"
            placeholder="Choose a hub"
            searchable
            leftIcon={<MapPin size={18} weight="bold" />}
            options={options}
            value={current || null}
            onChange={(next) => {
              setValue("city_hub_id", next ?? "", { shouldValidate: true });
              // An area belongs to one hub, so a changed hub strands it.
              setValue("area_id", "");
            }}
            error={wizard.form.formState.errors.city_hub_id?.message}
          />
        )}
      </StepStagger>
    </>
  );
}
