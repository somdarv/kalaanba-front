"use client";

import { useState } from "react";
import Link from "next/link";

import { Button, PasswordField } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useLogin } from "@/lib/api/hooks/use-auth";
import { SubmitError } from "../auth-feedback";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg lg:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-fg-muted">
          Pick up where you left off as{" "}
          <span className="font-medium text-fg">{email}</span>.
        </p>
      </header>

      <PasswordField
        label="Password"
        autoComplete="current-password"
        enterKeyHint="go"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error ?? undefined}
      />

      <SubmitError message={null} />

      <Button type="submit" fullWidth loading={login.isPending}>
        Log in
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm">
        <Link
          href="/auth/forgot-password"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Forgot password?
        </Link>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-fg-muted underline-offset-2 hover:text-fg hover:underline"
        >
          Use a different email
        </button>
      </div>
    </form>
  );
}
