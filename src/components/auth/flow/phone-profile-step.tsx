"use client";

import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

import { Button, TextField } from "@/components/ui";
import { AuthLink } from "../auth-link";
import { AuthStep } from "../auth-step";

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
    <AuthStep
      onSubmit={handleSubmit}
      title={<>First time here, let&rsquo;s start your career</>}
      subtitle="Set up your profile and get on the record."
      action={
        <Button type="submit" size="lg" fullWidth>
          Continue
        </Button>
      }
      footer={
        <AuthLink onClick={onChangeNumber}>
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Change number
        </AuthLink>
      }
    >
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
    </AuthStep>
  );
}
