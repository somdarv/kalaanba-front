"use client";

import { useState } from "react";
import { z } from "zod";

import { Button, TextField } from "@/components/ui";
import { useLookup } from "@/lib/api/hooks/use-auth";
import { SubmitError, messageFor } from "../auth-feedback";

/**
 * IdentifierStep — the single neutral entry screen (ADR-0004).
 *
 * Copy is deliberately non-committal: it never assumes returning vs new and
 * never offers a "create an account" link. The button reads "Continue"
 * because the path is not yet decided. On submit it calls `POST /auth/lookup`
 * and hands the resolved channel + existence up to the orchestrator.
 */

const DEFAULT_DIAL_CODE = "233"; // Ghana — grassroots default when none is given.
const E164_PATTERN = /^\+[1-9]\d{6,14}$/;
const emailSchema = z.string().email();

/**
 * Normalise a freely-typed Ghanaian/international number to E.164. Accepts:
 *   +233244…, +2330244… (extra 0), +233244…, 0244…, 244…
 * Bare and 0-prefixed numbers assume the default dial code.
 */
function toE164(raw: string): string {
  const cleaned = raw.replace(/[\s()-]/g, "");
  const hasPlus = cleaned.startsWith("+");
  let digits = cleaned.replace(/\D/g, "");

  if (hasPlus) {
    // Strip a national trunk "0" sitting right after the default dial code
    // (e.g. +2330244… → +233244…).
    if (digits.startsWith(`${DEFAULT_DIAL_CODE}0`)) {
      digits = DEFAULT_DIAL_CODE + digits.slice(DEFAULT_DIAL_CODE.length + 1);
    }
    return `+${digits}`;
  }

  if (digits.startsWith(`${DEFAULT_DIAL_CODE}0`)) {
    digits = DEFAULT_DIAL_CODE + digits.slice(DEFAULT_DIAL_CODE.length + 1);
  } else if (digits.startsWith("0")) {
    digits = DEFAULT_DIAL_CODE + digits.slice(1);
  } else if (!digits.startsWith(DEFAULT_DIAL_CODE)) {
    digits = DEFAULT_DIAL_CODE + digits;
  }
  return `+${digits}`;
}

export type IdentifierStepProps = {
  onPhoneResolved: (phoneE164: string, exists: boolean) => void;
  onEmailResolved: (email: string, exists: boolean) => void;
};

export function IdentifierStep({
  onPhoneResolved,
  onEmailResolved,
}: IdentifierStepProps) {
  const [channel, setChannel] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const lookup = useLookup();
  const usingPhone = channel === "phone";

  const swapChannel = () => {
    setChannel(usingPhone ? "email" : "phone");
    setFieldError(null);
    setSubmitError(null);
  };

  const handleContinue = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldError(null);
    setSubmitError(null);

    const identifier = usingPhone ? toE164(phone) : email.trim();

    if (usingPhone) {
      if (phone.trim().length === 0) {
        return setFieldError("Enter your phone number to continue.");
      }
      if (!E164_PATTERN.test(identifier)) {
        return setFieldError(
          "That doesn't look like a valid number. Check and try again.",
        );
      }
    } else {
      if (email.trim().length === 0) {
        return setFieldError("Enter your email to continue.");
      }
      if (!emailSchema.safeParse(email.trim()).success) {
        return setFieldError(
          "That doesn't look like a valid email. Check and try again.",
        );
      }
    }

    try {
      const result = await lookup.mutateAsync(identifier);
      if (result.channel === "phone") {
        onPhoneResolved(identifier, result.exists);
      } else {
        onEmailResolved(identifier, result.exists);
      }
    } catch (error) {
      setSubmitError(messageFor(error));
    }
  };

  return (
    <form onSubmit={handleContinue} className="flex flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg lg:text-3xl">
          Get in the game
        </h1>
        <p className="text-sm text-fg-muted">
          Enter your {usingPhone ? "number" : "email"} to play, organise or
          follow.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {usingPhone ? (
          <TextField
            label="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="go"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldError ?? undefined}
          />
        ) : (
          <TextField
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="go"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError ?? undefined}
          />
        )}

        <button
          type="button"
          onClick={swapChannel}
          className="self-start text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {usingPhone ? "Use email instead" : "Use phone instead"}
        </button>
      </div>

      <SubmitError message={submitError} />

      <Button type="submit" fullWidth loading={lookup.isPending}>
        Continue
      </Button>
    </form>
  );
}
