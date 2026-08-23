"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ApiError } from "@/lib/api/envelope";
import type { Club, ClubMeta } from "@/lib/api/club";
import { useCreateClub, useUploadClubCrest } from "@/lib/api/hooks/use-clubs";

/**
 * State machine behind the club-creation flow (WP-20260823-club-creation).
 * Owns step order, per-step validation, submission and server-error routing;
 * renders nothing.
 *
 * Club engine §5 fixes the V1 fields. Every option set and bound arrives in
 * `ClubMeta` (ADR-0007), so this file holds no config value, only the shape of
 * the questions.
 *
 * **It holds no copy of the reserved-name list either.** Whether a name may be
 * used is backend truth and the list changes without a deploy, so the name step
 * submits and reacts to `club.name_reserved` (ADR-0017 §4). The cost is one
 * round trip before the error shows, which is the correct trade.
 */

export type ClubCreateValues = {
  tier: string;
  club_type: string;
  name: string;
  city_hub_id: string;
  area_id: string;
};

export type ClubStepId =
  | "tier"
  | "type"
  | "name"
  | "crest"
  | "hub"
  | "area"
  | "review";

/**
 * Step order. **Tier leads, and that is the load-bearing decision.** Everything
 * after it depends on the answer: which types are offered, whether a protected
 * name is refused or routed to review, and whether the club goes live on
 * submit (ADR-0017 §2). Asking it last would mean re-validating the name.
 */
export const CLUB_STEPS = [
  "tier",
  "type",
  "name",
  "crest",
  "hub",
  "area",
  "review",
] as const satisfies ReadonlyArray<ClubStepId>;

function stepAt(index: number): ClubStepId {
  return CLUB_STEPS[index] ?? CLUB_STEPS[0];
}

const STEP_FIELDS: Record<ClubStepId, ReadonlyArray<keyof ClubCreateValues>> = {
  tier: ["tier"],
  type: ["club_type"],
  name: ["name"],
  // The crest is optional (Club §5 step 6) and is not a form field: it is a
  // Blob held beside the form until the club exists to attach it to.
  crest: [],
  hub: ["city_hub_id"],
  area: ["area_id"],
  review: [],
};

/** Where a rejected field lives, so a 422 lands the person back on it. */
const FIELD_STEP: Record<keyof ClubCreateValues, ClubStepId> = {
  tier: "tier",
  club_type: "type",
  name: "name",
  city_hub_id: "hub",
  area_id: "area",
};

/**
 * Stable error codes from the create endpoint mapped to the step that owns
 * them, and the copy shown there. Codes are backend truth; the words are ours
 * (Constitution Law 4).
 *
 * **Only the codes the controller throws actually arrive today** —
 * `club.name_reserved` and `club.location_unknown`. The rest are declared by the
 * Form Request, and the API renders a failed Form Request in Laravel's own
 * `{ message, errors }` shape rather than the standard error envelope, so
 * `ApiError.code` comes back as `api.unknown_error` and those keys are lost at
 * the boundary. Fixing that is an API-wide change (it moves 18 existing tests
 * across four engines) and belongs in its own packet, not this one.
 *
 * They stay listed because the mapping is correct and costs nothing, and
 * because none of them is reachable from this flow in practice: the tier and
 * type options are rendered from the vocabulary and re-checked by a Zod schema
 * built from the same vocabulary, so a client that offers only what config
 * allows cannot submit a value the Form Request refuses. If one ever slips
 * through, the generic submit error is shown, which is honest.
 */
const ERROR_ROUTING: Record<
  string,
  { step: ClubStepId; field: keyof ClubCreateValues; message: string }
> = {
  "club.name_reserved": {
    step: "name",
    field: "name",
    message: "That name belongs to a well known club. Pick your own.",
  },
  "club.name_invalid": {
    step: "name",
    field: "name",
    message: "Pick a different name.",
  },
  "club.type_unknown": {
    step: "type",
    field: "club_type",
    message: "Pick one of the kinds shown.",
  },
  "club.type_wrong_tier": {
    step: "type",
    field: "club_type",
    message: "Pick one of the kinds shown.",
  },
  "club.tier_unknown": {
    step: "tier",
    field: "tier",
    message: "Pick one of the two.",
  },
  "club.city_hub_invalid": {
    step: "hub",
    field: "city_hub_id",
    message: "Pick a city hub.",
  },
  "club.area_invalid": {
    step: "area",
    field: "area_id",
    message: "Pick an area.",
  },
  "club.location_unknown": {
    step: "area",
    field: "area_id",
    message: "We do not know that area. Pick another.",
  },
};

/**
 * Pause between tapping a single-choice option and the step advancing. Matches
 * the player flow's beat so the two do not feel like different products
 * (DESIGN_LANGUAGE §3.2).
 */
export const CONFIRM_BEAT_MS = 220;

const DRAFT_STORAGE_KEY = "kx:club-create:draft";

/**
 * Build the form schema from the config-served bounds. Deriving it, rather than
 * restating 2 and 120 as literals, is what stops the two validation layers
 * engineering-standards §5 requires from drifting apart (ADR-0007 §3).
 */
export function buildClubCreateSchema(meta: ClubMeta) {
  const tierKeys = meta.tiers.map((tier) => tier.key);
  const typeKeys = meta.types.map((type) => type.key);
  const { min_length: min, max_length: max } = meta.name;

  return z.object({
    tier: z.string().refine((value) => tierKeys.includes(value), {
      message: "Pick one of the two",
    }),
    club_type: z.string().refine((value) => typeKeys.includes(value), {
      message: "Pick one of the kinds shown",
    }),
    name: z
      .string()
      .trim()
      .min(min, `Use at least ${min} letters`)
      .max(max, `Keep it under ${max} letters`),
    city_hub_id: z.string().uuid("Pick a city hub"),
    area_id: z.string().uuid("Pick an area"),
  });
}

export type UseClubCreateWizard = {
  form: UseFormReturn<ClubCreateValues>;
  step: ClubStepId;
  stepIndex: number;
  stepCount: number;
  direction: 1 | -1;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  /** The created club, once it exists. Ends the flow. */
  club: Club | null;
  /** Club types belonging to the chosen tier, in config order. */
  typesForTier: ClubMeta["types"];
  /** The chosen tier's option, for copy that changes by door. */
  tier: ClubMeta["tiers"][number] | undefined;
  /** The cropped badge, held until there is a club to attach it to. */
  crest: Blob | null;
  setCrest: (blob: Blob | null) => void;
  goNext: () => Promise<void>;
  goBack: () => void;
  /** Set a single-choice field and advance after the confirm beat. */
  choose: (field: keyof ClubCreateValues, value: string) => void;
};

export function useClubCreateWizard({
  meta,
}: {
  meta: ClubMeta;
}): UseClubCreateWizard {
  const schema = useMemo(() => buildClubCreateSchema(meta), [meta]);
  const create = useCreateClub();
  const uploadCrest = useUploadClubCrest();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [crest, setCrest] = useState<Blob | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<ClubCreateValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      tier: meta.tiers[0]?.key ?? "",
      club_type: "",
      name: "",
      city_hub_id: "",
      area_id: "",
    },
  });

  // Restore a draft so a dropped connection or an accidental back does not
  // cost the whole flow. Read once, on mount.
  //
  // Driven from the known field list rather than from the stored object's own
  // keys: localStorage is writable by anything running on this origin, and
  // walking whatever it happens to contain would push unknown keys into the
  // form. The step index is deliberately not restored — coming back to the
  // first question with the answers already filled in is easier to understand
  // than being dropped into the middle of a flow.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw) as Record<string, unknown>;

      for (const field of Object.keys(FIELD_STEP) as Array<
        keyof ClubCreateValues
      >) {
        const value = draft[field];
        if (typeof value === "string") {
          form.setValue(field, value);
        }
      }
    } catch {
      // A corrupt or unavailable draft is not worth failing the flow over.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  /**
   * Written at step boundaries rather than on every keystroke, matching the
   * player flow. Losing a half-typed word is nothing; losing five answered
   * steps is the whole complaint about long forms. Subscribing to `watch()`
   * would also opt this hook out of the React Compiler.
   */
  const saveDraft = useCallback(() => {
    try {
      window.localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(form.getValues()),
      );
    } catch {
      // Private mode, or storage full. The flow still works.
    }
  }, [form]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const step = stepAt(stepIndex);
  // `useWatch` rather than `form.watch`: the latter returns a fresh function
  // each render, which opts the whole hook out of the React Compiler.
  const tierKey = useWatch({ control: form.control, name: "tier" });

  const typesForTier = useMemo(
    () => meta.types.filter((type) => type.tier === tierKey),
    [meta.types, tierKey],
  );

  const tier = useMemo(
    () => meta.tiers.find((option) => option.key === tierKey),
    [meta.tiers, tierKey],
  );

  const submit = useCallback(async () => {
    setSubmitError(null);

    try {
      const created = await create.mutateAsync(form.getValues());

      // The badge is a SECOND call, and a failing one must not undo a club that
      // already exists. Club §5 step 6 allows the crest to be completed later,
      // so a lost upload is a missing badge on a real club, not a failed
      // creation — reporting failure here would send someone back to create a
      // duplicate.
      if (crest) {
        try {
          const stored = await uploadCrest.mutateAsync({
            clubId: created.id,
            file: crest,
          });
          created.crest_url = stored.crest_url;
        } catch {
          // Deliberately swallowed. The club is live; the badge can be added
          // from the club's own surface.
        }
      }

      setClub(created);
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Nothing to do; the draft is stale but harmless.
      }
    } catch (error) {
      // `code` is the stable key the backend guarantees; the message is ours
      // (Constitution Law 4). Never switch on the message.
      const routed =
        error instanceof ApiError ? ERROR_ROUTING[error.code] : undefined;

      if (routed) {
        form.setError(routed.field, { message: routed.message });
        setDirection(-1);
        setStepIndex(CLUB_STEPS.indexOf(routed.step));
        return;
      }

      setSubmitError("We could not create the club. Try again.");
    }
  }, [create, crest, form, uploadCrest]);

  const goNext = useCallback(async () => {
    setSubmitError(null);

    const fields = STEP_FIELDS[step];
    if (fields.length > 0) {
      const valid = await form.trigger(fields as (keyof ClubCreateValues)[]);
      if (!valid) return;
    }

    if (step === "review") {
      await submit();
      return;
    }

    // Changing tier can strand a type belonging to the other door, so the
    // choice is cleared rather than carried forward into a request the
    // backend would refuse with club.type_wrong_tier.
    if (step === "tier") {
      const chosenType = form.getValues("club_type");
      const stillOffered = meta.types.some(
        (type) => type.key === chosenType && type.tier === form.getValues("tier"),
      );
      if (!stillOffered) form.setValue("club_type", "");
    }

    // Likewise an area belongs to one hub.
    if (step === "hub") {
      form.setValue("area_id", "");
    }

    saveDraft();
    setDirection(1);
    setStepIndex((index) => Math.min(index + 1, CLUB_STEPS.length - 1));
  }, [form, meta.types, saveDraft, step, submit]);

  const goBack = useCallback(() => {
    setSubmitError(null);
    setDirection(-1);
    setStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  const choose = useCallback(
    (field: keyof ClubCreateValues, value: string) => {
      form.setValue(field, value, { shouldValidate: true });
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        void goNext();
      }, CONFIRM_BEAT_MS);
    },
    [form, goNext],
  );

  return {
    form,
    step,
    stepIndex,
    stepCount: CLUB_STEPS.length,
    direction,
    isFirstStep: stepIndex === 0,
    isLastStep: step === "review",
    isSubmitting: create.isPending,
    submitError,
    club,
    typesForTier,
    tier,
    crest,
    setCrest,
    goNext,
    goBack,
    choose,
  };
}

export { FIELD_STEP };
