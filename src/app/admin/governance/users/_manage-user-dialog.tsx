"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api";
import type { AdminUser } from "@/lib/api/admin";
import {
  useArchiveUser,
  useClearUserLockout,
  useDisableUser,
  useEnableUser,
  useForceVerifyUser,
  useResendUserOtp,
  useSetUserPassword,
  useUpdateUserEmail,
  useUpdateUserPhone,
} from "@/lib/api/hooks/use-admin";

type Feedback = { ok: boolean; message: string } | null;

/**
 * The per-user support panel. Groups every action behind one dialog.
 * Destructive actions (set password, force-verify) require the admin access
 * code entered at the top (ADR-0005). No secret is ever shown.
 */
export function ManageUserDialog({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState(user.email ?? "");
  const [otpPhone, setOtpPhone] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const setPw = useSetUserPassword();
  const forceVerify = useForceVerifyUser();
  const updatePhone = useUpdateUserPhone();
  const updateEmail = useUpdateUserEmail();
  const disable = useDisableUser();
  const enable = useEnableUser();
  const resendOtp = useResendUserOtp();
  const clearLockout = useClearUserLockout();
  const archive = useArchiveUser();

  async function run(label: string, fn: () => Promise<unknown>) {
    setFeedback(null);
    try {
      await fn();
      setFeedback({ ok: true, message: `${label} — done.` });
    } catch (e) {
      setFeedback({
        ok: false,
        message: e instanceof ApiError ? `${e.code}: ${e.message}` : "Action failed.",
      });
    }
  }

  function requireCode(label: string, fn: () => Promise<unknown>) {
    if (accessCode.trim() === "") {
      setFeedback({ ok: false, message: "Enter the admin access code for this action." });
      return;
    }
    void run(label, fn);
  }

  async function archiveUser() {
    if (accessCode.trim() === "") {
      setFeedback({ ok: false, message: "Enter the admin access code for this action." });
      return;
    }
    if (
      !window.confirm(
        `Archive ${user.name}? The account is removed from the app and its phone/email is freed for re-registration. History is preserved; this is not reversible here.`,
      )
    ) {
      return;
    }
    setFeedback(null);
    try {
      await archive.mutateAsync([user.id, accessCode]);
      onClose();
    } catch (e) {
      setFeedback({
        ok: false,
        message: e instanceof ApiError ? `${e.code}: ${e.message}` : "Action failed.",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="flex max-h-full w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-surface p-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-xs text-muted-foreground">
              {user.phone_masked ?? "no phone"} · {user.email ?? "no email"} ·{" "}
              <span className="capitalize">{user.status}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-surface-2"
          >
            Close
          </button>
        </header>

        {feedback ? (
          <p
            className={`rounded-md border px-3 py-2 text-xs ${
              feedback.ok
                ? "border-success/40 bg-success/5 text-success"
                : "border-danger/40 bg-danger/5 text-danger"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        {/* Non-destructive support actions */}
        <Section title="Unblock auth">
          <div className="flex flex-wrap gap-2">
            <ActionButton
              label="Clear lockout"
              pending={clearLockout.isPending}
              onClick={() => run("Clear lockout", () => clearLockout.mutateAsync([user.id]))}
            />
            {user.status === "disabled" ? (
              <ActionButton
                label="Enable account"
                pending={enable.isPending}
                onClick={() => run("Enable", () => enable.mutateAsync([user.id]))}
              />
            ) : (
              <ActionButton
                label="Disable account"
                pending={disable.isPending}
                onClick={() => run("Disable", () => disable.mutateAsync([user.id]))}
              />
            )}
          </div>
          <InlineForm
            placeholder="Tester's number (+233…) to resend OTP"
            value={otpPhone}
            onChange={setOtpPhone}
            buttonLabel="Resend OTP"
            pending={resendOtp.isPending}
            onSubmit={() => run("Resend OTP", () => resendOtp.mutateAsync([user.id, otpPhone]))}
          />
        </Section>

        {/* Edit identifiers */}
        <Section title="Edit identifiers">
          <InlineForm
            placeholder="New phone (+233…)"
            value={newPhone}
            onChange={setNewPhone}
            buttonLabel="Update phone"
            pending={updatePhone.isPending}
            onSubmit={() => run("Update phone", () => updatePhone.mutateAsync([user.id, newPhone]))}
          />
          <InlineForm
            placeholder="New email"
            value={newEmail}
            onChange={setNewEmail}
            buttonLabel="Update email"
            pending={updateEmail.isPending}
            onSubmit={() => run("Update email", () => updateEmail.mutateAsync([user.id, newEmail]))}
          />
        </Section>

        {/* Destructive — access code required */}
        <Section title="Destructive — needs access code">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Admin access code"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
          <InlineForm
            placeholder="New password (≥10 chars)"
            type="password"
            value={password}
            onChange={setPassword}
            buttonLabel="Set password"
            pending={setPw.isPending}
            onSubmit={() =>
              requireCode("Set password", () =>
                setPw.mutateAsync([user.id, password, accessCode]),
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            <ActionButton
              label="Force-verify phone"
              pending={forceVerify.isPending}
              onClick={() =>
                requireCode("Force-verify phone", () =>
                  forceVerify.mutateAsync([user.id, "phone", accessCode]),
                )
              }
            />
            <ActionButton
              label="Force-verify email"
              pending={forceVerify.isPending}
              onClick={() =>
                requireCode("Force-verify email", () =>
                  forceVerify.mutateAsync([user.id, "email", accessCode]),
                )
              }
            />
          </div>

          <button
            type="button"
            onClick={archiveUser}
            disabled={archive.isPending}
            className="mt-1 inline-flex h-9 items-center justify-center rounded-md border border-danger/50 bg-danger/5 px-3 text-sm font-semibold text-danger hover:bg-danger/10 disabled:opacity-50"
          >
            {archive.isPending ? "Archiving…" : "Archive (remove) user"}
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ActionButton({
  label,
  pending,
  onClick,
}: {
  label: string;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-2 disabled:opacity-50"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function InlineForm({
  placeholder,
  value,
  onChange,
  buttonLabel,
  pending,
  onSubmit,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  buttonLabel: string;
  pending: boolean;
  onSubmit: () => void;
  type?: "text" | "password";
}) {
  return (
    <div className="flex gap-2">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={pending}
        className="inline-flex h-9 shrink-0 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "…" : buttonLabel}
      </button>
    </div>
  );
}
