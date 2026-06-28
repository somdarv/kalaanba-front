"use client";

import { useState } from "react";

import { Button, PasswordField, TextField } from "@/components/ui";
import { useRegisterEmail } from "@/lib/api/hooks/use-auth";
import { SubmitError, messageFor } from "../auth-feedback";

/**
 * EmailCreateStep — new email user (ADR-0004).
 *
 * Reached only when lookup found no account, so the framing is the start of
 * the player's career. A name is collected here (registration requires it —
 * see Identity §7.1) alongside the password + confirmation. On success the
 * backend dispatches a verification link and we move to the pending screen.
 */

const MIN_PASSWORD = 10;

export type EmailCreateStepProps = {
  email: string;
  onPending: (devToken: string | null) => void;
  onChangeEmail: () => void;
};

export function EmailCreateStep({
  email,
  onPending,
  onChangeEmail,
}: EmailCreateStepProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const register = useRegisterEmail();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (password.length < MIN_PASSWORD)
      next.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      const res = await register.mutateAsync({ name: name.trim(), email, password });
      const devToken =
        "verification_token" in res ? (res.verification_token ?? null) : null;
      onPending(devToken);
    } catch (error) {
      setSubmitError(messageFor(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg lg:text-3xl">
          First time here, let&rsquo;s start your career
        </h1>
        <p className="text-sm text-fg-muted">
          Create a password and get on the record.
        </p>
      </header>

      <TextField
        label="Your name"
        placeholder="e.g. Kojo Mensah"
        autoComplete="name"
        inputMode="text"
        enterKeyHint="next"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <PasswordField
        label="Password"
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD} characters.`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <PasswordField
        label="Confirm password"
        autoComplete="new-password"
        enterKeyHint="go"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      <p className="text-xs text-fg-muted">
        We&rsquo;ll send a link to{" "}
        <span className="font-medium text-fg">{email}</span> to confirm it&rsquo;s
        yours.
      </p>

      <SubmitError message={submitError} />

      <Button type="submit" fullWidth loading={register.isPending}>
        Continue
      </Button>

      <button
        type="button"
        onClick={onChangeEmail}
        className="mx-auto text-sm text-fg-muted underline-offset-2 hover:text-fg hover:underline"
      >
        Use a different email
      </button>
    </form>
  );
}
