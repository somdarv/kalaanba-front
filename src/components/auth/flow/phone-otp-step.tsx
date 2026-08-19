"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

import { Button, OtpInput } from "@/components/ui";
import {
  useRegister,
  useRequestOtp,
  useVerifyOtp,
} from "@/lib/api/hooks/use-auth";
import { AuthLink } from "../auth-link";
import { AuthStep } from "../auth-step";

/**
 * PhoneOtpStep — the code screen, and the FINAL step for both paths (ADR-0004).
 *
 * - `mode="login"` (recognised number): verifies the code → session.
 * - `mode="register"` (new number, name already collected): the code is the
 *   last action — it registers the account. The code lives here so any
 *   code error appears in the right place, never on the name screen.
 *
 * The code auto-submits as soon as all six digits are entered; the button is
 * just a fallback. The OTP request fires on mount; resend is throttled.
 */

const RESEND_COOLDOWN_SECONDS = 30;
const CODE_LENGTH = 6;

export type PhoneOtpStepProps = {
  phoneE164: string;
  mode: "login" | "register";
  /** Display name, required for `mode="register"`. */
  name?: string;
  onAuthed: () => void;
  onChangeNumber: () => void;
};

export function PhoneOtpStep({
  phoneE164,
  mode,
  name,
  onAuthed,
  onChangeNumber,
}: PhoneOtpStepProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resentNote, setResentNote] = useState(false);
  const requested = useRef(false);
  const submittedCode = useRef<string | null>(null);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const register = useRegister();
  const isRegister = mode === "register";
  const pending = isRegister ? register.isPending : verifyOtp.isPending;

  // Fire the initial OTP once on mount (StrictMode-safe via the ref guard).
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    requestOtp.mutate({ phone_e164: phoneE164 });
  }, [phoneE164, requestOtp]);

  // Resend cooldown tick.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const submitCode = useCallback(async () => {
    setError(null);
    if (otp.replace(/\D/g, "").length < CODE_LENGTH) {
      setError("Enter the code we sent you.");
      return;
    }
    try {
      if (isRegister) {
        await register.mutateAsync({ phone_e164: phoneE164, otp, name: name ?? "" });
      } else {
        await verifyOtp.mutateAsync({ phone_e164: phoneE164, otp });
      }
      onAuthed();
    } catch {
      setError("That code didn't match. Try again.");
    }
  }, [otp, isRegister, register, verifyOtp, name, phoneE164, onAuthed]);

  // Auto-submit once the code is complete (no need to press the button).
  useEffect(() => {
    const digits = otp.replace(/\D/g, "");
    if (digits.length < CODE_LENGTH) {
      submittedCode.current = null;
      return;
    }
    if (submittedCode.current === digits || pending) return;
    submittedCode.current = digits;
    void submitCode();
  }, [otp, pending, submitCode]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(null);
    setResentNote(false);
    try {
      await requestOtp.mutateAsync({ phone_e164: phoneE164 });
      setResentNote(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Couldn't resend the code. Try again in a moment.");
    }
  };

  return (
    <AuthStep
      onSubmit={(e) => {
        e.preventDefault();
        void submitCode();
      }}
      title={isRegister ? "Verify your number" : "Welcome back"}
      subtitle={
        isRegister ? (
          <>
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-fg">{phoneE164}</span>.
          </>
        ) : (
          "Pick up where you left off."
        )
      }
      action={
        <Button type="submit" size="lg" fullWidth loading={pending}>
          {isRegister ? "Create account" : "Verify"}
        </Button>
      }
      footer={
        <div className="flex flex-col items-center gap-1">
          <AuthLink
            tone="primary"
            onClick={handleResend}
            disabled={cooldown > 0 || requestOtp.isPending}
          >
            {cooldown > 0
              ? `You can request a new code in ${cooldown}s`
              : resentNote
                ? "New code sent. Resend again"
                : "Didn't get it? Resend code"}
          </AuthLink>
          <AuthLink onClick={onChangeNumber}>
            <ArrowLeft size={16} weight="bold" aria-hidden />
            Change number
          </AuthLink>
        </div>
      }
    >
      <OtpInput
        value={otp}
        onChange={setOtp}
        error={error ?? undefined}
        autoFocus
        aria-label="One-time code"
      />
    </AuthStep>
  );
}
