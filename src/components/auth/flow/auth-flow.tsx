"use client";

import { useState } from "react";

import { EmailVerifyPending } from "../email-verify-pending";
import { IdentifierStep } from "./identifier-step";
import { PhoneOtpStep } from "./phone-otp-step";
import { PhoneProfileStep } from "./phone-profile-step";
import { EmailLoginStep } from "./email-login-step";
import { EmailCreateStep } from "./email-create-step";

/**
 * AuthFlow — identifier-first progressive authentication (ADR-0004).
 *
 * One neutral entry. The person enters a phone or email; `POST /auth/lookup`
 * resolves returning-vs-new; the flow branches copy + steps accordingly. No
 * explicit "log in vs sign up" choice is ever presented.
 *
 * This component owns only the step state machine + cross-step data hand-off.
 * Each step renders its own header/copy and calls the relevant API.
 *
 * Design: per docs/design-system/DESIGN_LANGUAGE.md — steps reuse the input
 * suite + Button primitives; the page wraps this in <AuthShell>.
 */

export type AuthFlowProps = {
  /** A session token has been stored — proceed into the app. */
  onAuthed: () => void;
};

type Step =
  | { kind: "identifier" }
  | { kind: "phone-name"; phoneE164: string }
  | { kind: "phone-otp"; phoneE164: string; mode: "login" | "register"; name?: string }
  | { kind: "email-login"; email: string }
  | { kind: "email-create"; email: string }
  | { kind: "email-verify"; email: string; devToken: string | null };

export function AuthFlow({ onAuthed }: AuthFlowProps) {
  const [step, setStep] = useState<Step>({ kind: "identifier" });
  const backToIdentifier = () => setStep({ kind: "identifier" });

  switch (step.kind) {
    case "identifier":
      return (
        <IdentifierStep
          onPhoneResolved={(phoneE164, exists) =>
            setStep(
              exists
                ? { kind: "phone-otp", phoneE164, mode: "login" }
                : { kind: "phone-name", phoneE164 },
            )
          }
          onEmailResolved={(email, exists) =>
            setStep(
              exists
                ? { kind: "email-login", email }
                : { kind: "email-create", email },
            )
          }
        />
      );

    case "phone-name":
      return (
        <PhoneProfileStep
          onContinue={(name) =>
            setStep({
              kind: "phone-otp",
              phoneE164: step.phoneE164,
              mode: "register",
              name,
            })
          }
          onChangeNumber={backToIdentifier}
        />
      );

    case "phone-otp":
      return (
        <PhoneOtpStep
          phoneE164={step.phoneE164}
          mode={step.mode}
          name={step.name}
          onAuthed={onAuthed}
          onChangeNumber={backToIdentifier}
        />
      );

    case "email-login":
      return (
        <EmailLoginStep
          email={step.email}
          onAuthed={onAuthed}
          onChangeEmail={backToIdentifier}
        />
      );

    case "email-create":
      return (
        <EmailCreateStep
          email={step.email}
          onPending={(devToken) =>
            setStep({ kind: "email-verify", email: step.email, devToken })
          }
          onChangeEmail={backToIdentifier}
        />
      );

    case "email-verify":
      return (
        <EmailVerifyPending
          email={step.email}
          devToken={step.devToken}
          onVerified={onAuthed}
        />
      );
  }
}
