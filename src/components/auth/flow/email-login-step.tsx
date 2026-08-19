"use client";

import { useState } from "react";

import { Button, PasswordField } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useLogin } from "@/lib/api/hooks/use-auth";
import { SubmitError } from "../auth-feedback";
import { AuthLink, AuthRouteLink } from "../auth-link";
import { AuthStep } from "../auth-step";

/**
 * EmailLoginStep — returning email user (ADR-0004).
 *
 * Reached only when lookup found an active email account, so "Welcome back"
 * is earned. Wrong-password copy stays generic so the password step does not
 * become a second account-existence oracle (ADR-0004 §3).
 */

export type EmailLoginStepProps = {
  email: string;
  onAuthed: () => void;
  onChangeEmail: () => void;
};

export function EmailLoginStep({
  email,
  onAuthed,
  onChangeEmail,
}: EmailLoginStepProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const login = useLogin();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length === 0) {
      setError("Enter your password.");
      return;
    }

    try {
      await login.mutateAsync({ email, password });
      onAuthed();
    } catch (err) {
      const unverified =
        err instanceof ApiError && /verif/i.test(err.message);
      setError(
        unverified
          ? "Confirm your email first — check your inbox for the link."
          : "That password isn't right. Try again.",
      );
    }
  };

  return (
    <AuthStep
      onSubmit={handleSubmit}
      title="Welcome back"
      subtitle={
        <>
          Pick up where you left off as{" "}
          <span className="font-semibold text-fg">{email}</span>.
        </>
      }
      action={
        <Button type="submit" size="lg" fullWidth loading={login.isPending}>
          Log in
        </Button>
      }
      footer={
        <div className="flex flex-col items-center gap-1">
          <AuthRouteLink href="/auth/forgot-password">
            Forgot password?
          </AuthRouteLink>
          <AuthLink onClick={onChangeEmail}>Use a different email</AuthLink>
        </div>
      }
    >
      <PasswordField
        label="Password"
        autoComplete="current-password"
        enterKeyHint="go"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error ?? undefined}
      />

      <SubmitError message={null} />
    </AuthStep>
  );
}
