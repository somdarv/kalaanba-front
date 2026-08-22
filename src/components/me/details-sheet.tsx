"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BottomSheet,
  Button,
  Select,
  TextField,
  useToast,
} from "@/components/ui";
import { buildPlayerSetupSchema } from "@/hooks/use-player-setup-wizard";
import { useUpdatePlayer } from "@/lib/api/hooks/use-player";
import { ApiError } from "@/lib/api";
import type { MyPlayer, PlayerMeta } from "@/lib/api/player";

/**
 * Edit the identity half of a player profile.
 *
 * `<BottomSheet>` because it already morphs to a centred `<Dialog>` at 768px —
 * one state machine, two geometries, which is what the primitive exists for.
 *
 * **The schema is `buildPlayerSetupSchema`, reused verbatim.** It derives its
 * bounds from `PlayerMeta` at runtime (ADR-0007), so the sheet and the setup
 * wizard enforce the same config values by construction. A second schema here
 * would be a copy of a config value with a deploy between it and the truth,
 * which is the exact drift the meta endpoint was built to end.
 *
 * Availability is in the schema but NOT in this sheet: it lives on the surface
 * as a one-tap control (§12). It is submitted unchanged so the shared schema
 * still validates.
 *
 * 422s route back to the field that owns them, the same way the wizard handles
 * them — an error printed at the top of a sheet makes the player hunt for which
 * of four inputs it means.
 */

export type DetailsSheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  player: MyPlayer;
  meta: PlayerMeta;
};

type FieldName =
  | "first_name"
  | "last_name"
  | "stage_name"
  | "preferred_number"
  | "primary_position";

const EDITABLE_FIELDS: ReadonlyArray<FieldName> = [
  "first_name",
  "last_name",
  "stage_name",
  "preferred_number",
  "primary_position",
];

function isFieldName(value: string): value is FieldName {
  return (EDITABLE_FIELDS as ReadonlyArray<string>).includes(value);
}

export function DetailsSheet({
  open,
  onOpenChange,
  player,
  meta,
}: DetailsSheetProps) {
  const { push } = useToast();
  const update = useUpdatePlayer(player);
  const schema = buildPlayerSetupSchema(meta);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      first_name: player.first_name,
      last_name: player.last_name,
      stage_name: player.stage_name,
      preferred_number:
        player.preferred_number != null ? String(player.preferred_number) : "",
      primary_position: player.primary_position ?? "",
      availability_status: player.availability_status,
    },
  });

  const { register, handleSubmit, control, reset, setError, formState } = form;

  // Re-seed whenever the sheet opens. Without this, closing without saving and
  // reopening shows the abandoned edits as if they were the saved record.
  useEffect(() => {
    if (!open) return;
    reset({
      first_name: player.first_name,
      last_name: player.last_name,
      stage_name: player.stage_name,
      preferred_number:
        player.preferred_number != null ? String(player.preferred_number) : "",
      primary_position: player.primary_position ?? "",
      availability_status: player.availability_status,
    });
  }, [open, player, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        stage_name: values.stage_name.trim(),
        preferred_number:
          values.preferred_number === ""
            ? null
            : Number(values.preferred_number),
        primary_position:
          values.primary_position === "" ? null : values.primary_position,
      });
      push({ title: "Saved", tone: "success" });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        let routed = false;
        for (const [field, messages] of Object.entries(error.details)) {
          if (!isFieldName(field)) continue;
          const message = Array.isArray(messages)
            ? String(messages[0])
            : String(messages);
          setError(field, { type: "server", message });
          routed = true;
        }
        if (routed) return;
      }
      push({
        title: "That did not save",
        description: "Check your connection and try again.",
        tone: "danger",
      });
    }
  });

  const positionOptions = meta.positions.map((option) => ({
    value: option.key,
    label: option.label,
  }));

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Your details">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label="Football name"
          purpose="name"
          hint="What they call you on the pitch."
          error={formState.errors.stage_name?.message}
          {...register("stage_name")}
        />

        <TextField
          label="First name"
          purpose="given-name"
          error={formState.errors.first_name?.message}
          {...register("first_name")}
        />

        <TextField
          label="Last name"
          purpose="family-name"
          error={formState.errors.last_name?.message}
          {...register("last_name")}
        />

        <TextField
          label="Preferred number"
          purpose="integer"
          hint={`${meta.preferred_number.min} to ${meta.preferred_number.max}. Leave it empty if you have none.`}
          error={formState.errors.preferred_number?.message}
          {...register("preferred_number")}
        />

        <Controller
          control={control}
          name="primary_position"
          render={({ field }) => (
            <Select
              label="Position"
              placeholder="Pick a position"
              options={positionOptions}
              value={field.value === "" ? null : field.value}
              onChange={field.onChange}
              error={formState.errors.primary_position?.message}
            />
          )}
        />

        <div className="mt-2 flex items-center gap-3">
          <Button
            type="button"
            intent="ghost"
            size="md"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            className="flex-[1.4]"
            loading={update.isPending}
            loadingText="Saving"
          >
            Save
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
