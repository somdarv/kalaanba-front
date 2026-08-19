"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ApiError } from "@/lib/api/envelope";
import type { CreatePlayerInput, Player, PlayerMeta } from "@/lib/api/player";
import { useCreatePlayer } from "@/lib/api/hooks/use-player";

/**
 * State machine behind the player-profile setup flow
 * (WP-20260819-player-setup-wizard). Owns step order, per-step validation,
 * submission and server-error routing; renders nothing.
 *
 * Player & Affiliation §6 "V1 fields" fixes what may be asked; §3 fixes the
 * name model. Every bound and option set arrives in `PlayerMeta` (ADR-0007) —
 * this file holds no config value, only the shape of the questions.
 */

export type PlayerSetupValues = {
  first_name: string;
  last_name: string;
  stage_name: string;
  /** Held as a string so an empty field reads as "skipped", not as `0`. */
  preferred_number: string;
  /** "" means skipped — the field is optional in the contract. */
  primary_position: string;
  availability_status: string;
};

export type WizardStepId =
  | "identity"
  | "stage_name"
  | "number"
  | "position"
  | "availability";

/**
 * Step order. Identity leads because it is prefilled from the account and so
 * costs the player nothing; the two optional steps sit late, where abandoning
 * them still leaves a usable profile.
 */
export const WIZARD_STEPS = [
  "identity",
  "stage_name",
  "number",
  "position",
  "availability",
] as const satisfies ReadonlyArray<WizardStepId>;

/**
 * Index into the step list. `noUncheckedIndexedAccess` is on, and an
 * out-of-range index means the state machine is already wrong — falling back
 * to the first step keeps the flow usable instead of rendering nothing.
 */
function stepAt(index: number): WizardStepId {
  return WIZARD_STEPS[index] ?? WIZARD_STEPS[0];
}

const STEP_FIELDS: Record<
  WizardStepId,
  ReadonlyArray<keyof PlayerSetupValues>
> = {
  identity: ["first_name", "last_name"],
  stage_name: ["stage_name"],
  number: ["preferred_number"],
  position: ["primary_position"],
  availability: ["availability_status"],
};

/** Where a rejected field lives, so a 422 lands the player back on it. */
const FIELD_STEP: Record<keyof PlayerSetupValues, WizardStepId> = {
  first_name: "identity",
  last_name: "identity",
  stage_name: "stage_name",
  preferred_number: "number",
  primary_position: "position",
  availability_status: "availability",
};

/**
 * Pause between tapping a single-choice option and the step advancing. Long
 * enough that the selection is seen and felt, short enough not to read as lag:
 * one `--dur-quick` beat plus the press settle (DESIGN_LANGUAGE §3.2).
 */
export const CONFIRM_BEAT_MS = 220;

const DRAFT_STORAGE_KEY = "kx:player-setup:draft";

/**
 * Build the form schema from config-served bounds. Deriving it — rather than
 * restating `1..99` and the position keys as literals — is what stops the two
 * validation layers required by engineering-standards §5 from drifting apart.
 * See ADR-0007 §3.
 */
export function buildPlayerSetupSchema(meta: PlayerMeta) {
  const { min, max } = meta.preferred_number;
  const positionKeys = meta.positions.map((option) => option.key);
  const availabilityKeys = meta.availability.map((option) => option.key);

  return z.object({
    first_name: z
      .string()
      .trim()
      .min(1, "Enter your first name")
      .max(meta.name.max_length),
    last_name: z
      .string()
      .trim()
      .min(1, "Enter your last name")
      .max(meta.name.max_length),
    stage_name: z
      .string()
      .trim()
      .min(1, "Enter the name they call you")
      .max(meta.name.stage_name_max_length),
    preferred_number: z.string().refine(
      (value) => {
        if (value === "") return true;
        if (!/^\d+$/.test(value)) return false;
        const parsed = Number(value);
        return parsed >= min && parsed <= max;
      },
      { message: `Pick a number between ${min} and ${max}` },
    ),
    primary_position: z
      .string()
      .refine((value) => value === "" || positionKeys.includes(value), {
        message: "Choose one of the positions shown",
      }),
    availability_status: z
      .string()
      .refine((value) => availabilityKeys.includes(value), {
        message: "Choose how available you are",
      }),
  });
}

function readDraft(): Partial<PlayerSetupValues> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<PlayerSetupValues>) : null;
  } catch {
    return null;
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* storage disabled — the draft is a convenience, never a requirement */
  }
}

export type UsePlayerSetupWizardOptions = {
  meta: PlayerMeta;
  /** Prefill from the Identity account name — another engine's field (§3). */
  defaults?: { firstName?: string; lastName?: string };
};

export type PlayerSetupWizard = {
  form: UseFormReturn<PlayerSetupValues>;
  step: WizardStepId;
  stepIndex: number;
  stepCount: number;
  /** 1 = moving forward, -1 = moving back. Drives the transition direction. */
  direction: 1 | -1;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => Promise<void>;
  goBack: () => void;
  /** Set a single-choice field, then advance after the confirm beat. */
  chooseAndAdvance: (field: keyof PlayerSetupValues, value: string) => void;
  isSubmitting: boolean;
  submitError: string | null;
  player: Player | null;
};

export function usePlayerSetupWizard({
  meta,
  defaults,
}: UsePlayerSetupWizardOptions): PlayerSetupWizard {
  const createPlayer = useCreatePlayer();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schema = useMemo(() => buildPlayerSetupSchema(meta), [meta]);

  const form = useForm<PlayerSetupValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      first_name: defaults?.firstName ?? "",
      last_name: defaults?.lastName ?? "",
      stage_name: "",
      preferred_number: "",
      primary_position: "",
      availability_status: meta.availability_default ?? "",
      ...readDraft(),
    },
  });

  const { setError, setValue, trigger, handleSubmit, getValues } = form;

  /**
   * Keep a draft warm so a refresh, an app switch, or a stray back-swipe does
   * not cost the player five answered questions. Written at step boundaries
   * rather than on every keystroke: losing a half-typed word is nothing,
   * losing four answered steps is the whole complaint about long forms.
   */
  const saveDraft = useCallback(() => {
    try {
      window.sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(getValues()),
      );
    } catch {
      /* storage disabled — the draft is a convenience, never a requirement */
    }
  }, [getValues]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  /**
   * Route a rejected field back to the step that owns it. A validation failure
   * surfacing three screens away from the field it concerns is how multi-step
   * forms turn into dead ends.
   */
  const applyServerErrors = useCallback(
    (error: unknown) => {
      if (!(error instanceof ApiError)) {
        setSubmitError("Couldn't save your profile. Please try again.");
        return;
      }

      const details = error.details ?? {};
      let earliest: number | null = null;

      for (const [field, messages] of Object.entries(details)) {
        if (!(field in FIELD_STEP)) continue;
        const name = field as keyof PlayerSetupValues;
        const message = Array.isArray(messages)
          ? String(messages[0])
          : String(messages);
        setError(name, { type: "server", message });
        const index = WIZARD_STEPS.indexOf(FIELD_STEP[name]);
        earliest = earliest === null ? index : Math.min(earliest, index);
      }

      if (earliest !== null) {
        setDirection(-1);
        setStepIndex(earliest);
        return;
      }

      setSubmitError(
        error.status === 401
          ? "Your session expired. Sign in again to finish."
          : "Couldn't save your profile. Please try again.",
      );
    },
    [setError],
  );

  const submit = useCallback(
    async (raw: PlayerSetupValues) => {
      setSubmitError(null);
      const payload: CreatePlayerInput = {
        first_name: raw.first_name.trim(),
        last_name: raw.last_name.trim(),
        stage_name: raw.stage_name.trim(),
        preferred_number: raw.preferred_number
          ? Number(raw.preferred_number)
          : null,
        primary_position: raw.primary_position || null,
        availability_status: raw.availability_status,
      };

      try {
        const created = await createPlayer.mutateAsync(payload);
        clearDraft();
        setDirection(1);
        setPlayer(created);
      } catch (error) {
        applyServerErrors(error);
      }
    },
    [createPlayer, applyServerErrors],
  );

  const goNext = useCallback(async () => {
    const isValid = await trigger([...STEP_FIELDS[stepAt(stepIndex)]]);
    if (!isValid) return;

    saveDraft();
    setDirection(1);
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setStepIndex((index) => index + 1);
      return;
    }
    await handleSubmit(submit)();
  }, [trigger, handleSubmit, stepIndex, submit, saveDraft]);

  const goBack = useCallback(() => {
    saveDraft();
    setDirection(-1);
    setStepIndex((index) => Math.max(0, index - 1));
  }, [saveDraft]);

  const chooseAndAdvance = useCallback(
    (field: keyof PlayerSetupValues, value: string) => {
      setValue(field, value, { shouldValidate: true });
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        void goNext();
      }, CONFIRM_BEAT_MS);
    },
    [setValue, goNext],
  );

  return {
    form,
    step: stepAt(stepIndex),
    stepIndex,
    stepCount: WIZARD_STEPS.length,
    direction,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === WIZARD_STEPS.length - 1,
    goNext,
    goBack,
    chooseAndAdvance,
    isSubmitting: createPlayer.isPending,
    submitError,
    player,
  };
}
