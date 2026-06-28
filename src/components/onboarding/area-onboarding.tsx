"use client";

import { useMemo, useState } from "react";
import { MapPin } from "@phosphor-icons/react";

import {
  Button,
  ErrorState,
  Select,
  Skeleton,
  useToast,
  type SelectOption,
} from "@/components/ui";
import { useUpdateProfile } from "@/lib/api/hooks/use-auth";
import { useAreas, useHubs } from "@/lib/api/hooks/use-zone";

import { SuggestAreaDialog } from "./suggest-area-dialog";

/**
 * AreaOnboarding — post-signup profile completion (Zone §5 user flow:
 * "Choose City Hub" then "Choose Area"; suggest if missing). Skippable by
 * product decision (WP-20260625-onboarding-area) — area is captured, never
 * gated. Persists via Identity §8 `PATCH /users/me { area_id }`.
 *
 * Backend owns area→zone mapping (Constitution Law 3); this only picks a Hub
 * and an Area id and stores it.
 */

export type AreaOnboardingProps = {
  /** Called when the user finishes — whether they saved an area or skipped. */
  onDone: () => void;
};

export function AreaOnboarding({ onDone }: AreaOnboardingProps) {
  const hubs = useHubs();
  const [hubId, setHubId] = useState<string | null>(null);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const areas = useAreas({ city_hub_id: hubId ?? undefined });
  const updateProfile = useUpdateProfile();
  const toast = useToast();

  const hubOptions: SelectOption[] = useMemo(
    () =>
      (hubs.data ?? []).map((h) => ({
        value: h.id,
        label: h.name,
        description: h.region ?? undefined,
      })),
    [hubs.data],
  );

  const areaOptions: SelectOption[] = useMemo(
    () => (areas.data ?? []).map((a) => ({ value: a.id, label: a.name })),
    [areas.data],
  );

  const hubName =
    hubOptions.find((o) => o.value === hubId)?.label ?? "your hub";

  const save = async () => {
    if (!areaId) return;
    try {
      await updateProfile.mutateAsync({ area_id: areaId });
      toast.push({ title: "You're on the map", tone: "success" });
      onDone();
    } catch {
      toast.push({
        title: "Couldn't save your area",
        description: "Check your connection and try again.",
        tone: "danger",
      });
    }
  };

  if (hubs.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <OnboardingHeader />
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    );
  }

  if (hubs.isError) {
    return (
      <ErrorState
        title="Couldn't load hubs"
        description="We couldn't reach the area list. You can skip this for now and set it later."
        onRetry={async () => {
          await hubs.refetch();
        }}
        secondaryAction={
          <Button intent="ghost" onClick={onDone}>
            Skip for now
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OnboardingHeader />

      <Select
        label="City Hub"
        placeholder="Choose your hub"
        searchable
        leftIcon={<MapPin size={18} weight="bold" />}
        options={hubOptions}
        value={hubId}
        onChange={(next) => {
          setHubId(next);
          setAreaId(null);
        }}
      />

      <Select
        label="Area"
        placeholder={hubId ? "Find your area" : "Choose a hub first"}
        searchable
        disabled={!hubId || areas.isLoading}
        options={areaOptions}
        value={areaId}
        onChange={setAreaId}
        hint={
          hubId
            ? "Your locality, suburb, or quarter."
            : undefined
        }
      />

      {hubId ? (
        <button
          type="button"
          onClick={() => setSuggestOpen(true)}
          className="self-start text-left text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Can&rsquo;t find your area? Suggest it
        </button>
      ) : null}

      <div className="mt-2 flex flex-col gap-3">
        <Button
          fullWidth
          disabled={!areaId}
          loading={updateProfile.isPending}
          onClick={save}
        >
          Save and continue
        </Button>
        <Button
          intent="ghost"
          fullWidth
          onClick={onDone}
          disabled={updateProfile.isPending}
        >
          Skip for now
        </Button>
      </div>

      {hubId ? (
        <SuggestAreaDialog
          open={suggestOpen}
          onOpenChange={setSuggestOpen}
          cityHubId={hubId}
          hubName={hubName}
          onSuggested={() => areas.refetch()}
        />
      ) : null}
    </div>
  );
}

function OnboardingHeader() {
  return (
    <header className="space-y-1.5">
      <h1 className="font-display text-2xl font-bold tracking-tight text-fg lg:text-3xl">
        Where do you play?
      </h1>
      <p className="text-sm text-fg-muted">
        Pick your home turf so we can place you on the map. You can change this
        later.
      </p>
    </header>
  );
}
