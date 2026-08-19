"use client";

import { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";

import { Button, TextField } from "@/components/ui";
import { useVerifyEmail } from "@/lib/api/hooks/use-auth";
import { SubmitError, messageFor } from "./auth-feedback";
import { AuthStep } from "./auth-step";

export type EmailVerifyPendingProps = {
  email: string;
  /** Plaintext token when the backend exposes it (dev) — prefills the field. */
  devToken: string | null;
  /** Verified — a session token has been stored. */
  onVerified: () => void;
};

/**
 * Post-signup "check your email" step. In production the user clicks the link
 * in their inbox (which lands on a page that posts the token); here we also
 * accept the token directly so the flow is testable end-to-end, and prefill it
 * in dev when the backend exposes the plaintext token.
 */
export function EmailVerifyPending({
  email,
  devToken,
  onVerified,
}: EmailVerifyPendingProps) {
  const [token, setToken] = useState(devToken ?? "");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const verify = useVerifyEmail();

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    try {
      await verify.mutateAsync({ token: token.trim() });
      onVerified();
    } catch (error) {
      setSubmitError(messageFor(error));
    }
  };

  return (
    <AuthStep
      onSubmit={handleVerify}
      icon={<EnvelopeSimple size={24} weight="bold" aria-hidden />}
      title="Check your email"
      subtitle={
        <>
          We sent a verification link to{" "}
          <span className="font-semibold text-fg">{email}</span>. Open it to
          finish setting up your account.
        </>
      }
      action={
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={verify.isPending}
          disabled={token.trim().length === 0}
        >
          Verify &amp; continue
        </Button>
      }
    >
      <TextField
        label="Verification token"
        hint="Paste the token from your email to verify here."
        inputMode="text"
        autoComplete="one-time-code"
        enterKeyHint="done"
        placeholder="Paste token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <SubmitError message={submitError} />
    </AuthStep>
  );
}
