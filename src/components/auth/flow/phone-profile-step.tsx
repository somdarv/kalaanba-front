"use client";

import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

import { Button, TextField } from "@/components/ui";

/**
 * PhoneProfileStep — new-number profile setup: just the name (ADR-0004).
 *
 * This is the FIRST step for a new number. It collects the display name only;
 * the code is entered afterwards on the verify screen, which registers the
 * account. Keeping name and code on separate screens means a code error can
 * never surface here.
 */

export type PhoneProfileStepProps = {
  onContinue: (name: string) => void;
  onChangeNumber: () => void;
};

export function PhoneProfileStep({
  onContinue,
  onChangeNumber,
}: PhoneProfileStepProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter your name to continue.");
      return;
    }
    onContinue(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg lg:text-3xl">
          First time here, let&rsquo;s start your career
        </h1>
        <p className="text-sm text-fg-muted">
          Set up your profile and get on the record.
        </p>
      </header>

      <TextField
        label="Your name"
        placeholder="e.g. Kojo Mensah"
        autoComplete="name"
        inputMode="text"
        enterKeyHint="go"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError(null);
        }}
        error={error ?? undefined}
      />

      <Button type="submit" fullWidth>
        Continue
      </Button>

      <div className="mt-auto border-t border-divider pt-5">
        <button
          type="button"
          onClick={onChangeNumber}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted underline-offset-2 hover:text-fg hover:underline"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Change number
        </button>
      </div>
    </form>
  );
}
