"use client";

import { useMemo, useState } from "react";

import { ApiError } from "@/lib/api";
import type { AreaSuggestion, AreaSuggestionStatus } from "@/lib/api/admin";
import {
  useApproveAreaSuggestion,
  useAreaSuggestions,
  useRejectAreaSuggestion,
} from "@/lib/api/hooks/use-admin";

const TABS: { value: AreaSuggestionStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

type DecisionModal =
  | { kind: "approve"; suggestion: AreaSuggestion }
  | { kind: "reject"; suggestion: AreaSuggestion }
  | null;

export default function ZoneAreaSuggestionsPage() {
  const [status, setStatus] = useState<AreaSuggestionStatus>("pending");
  const [decision, setDecision] = useState<DecisionModal>(null);

  const query = useAreaSuggestions({ status, limit: 200 });
  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Zone — Area suggestions
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve to mint a verified `areas` row inside the suggestion&apos;s
          target zone. Rejection preserves the suggestion (audit trail).
          Both flows are idempotent on the client `Idempotency-Key`.
        </p>
      </header>

      <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-surface-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading suggestions…</p>
      ) : query.isError ? (
        <ErrorState error={query.error} />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No {status} suggestions.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onApprove={() => setDecision({ kind: "approve", suggestion })}
              onReject={() => setDecision({ kind: "reject", suggestion })}
            />
          ))}
        </ul>
      )}

      {decision ? (
        <DecisionDialog
          decision={decision}
          onClose={() => setDecision(null)}
        />
      ) : null}
    </section>
  );
}

function SuggestionCard({
  suggestion,
  onApprove,
  onReject,
}: {
  suggestion: AreaSuggestion;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = suggestion.status === "pending";
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{suggestion.proposed_name}</h2>
        <span className="inline-flex h-6 items-center rounded-full bg-surface-2 px-2 text-xs font-medium capitalize text-muted-foreground">
          {suggestion.status}
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <Field label="Suggestion id" value={suggestion.id} mono />
        <Field label="City hub" value={suggestion.city_hub_id} mono />
        <Field
          label="Target zone"
          value={suggestion.proposed_zone_id ?? "—"}
          mono
        />
        <Field label="Submitted by" value={suggestion.submitted_by_user_id} mono />
        <Field label="Submitted at" value={suggestion.submitted_at} />
        {suggestion.reviewed_at ? (
          <Field label="Reviewed at" value={suggestion.reviewed_at} />
        ) : null}
      </dl>
      {suggestion.note ? (
        <p className="rounded-md bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-semibold">Submitter note:</span> {suggestion.note}
        </p>
      ) : null}
      {suggestion.review_note ? (
        <p className="rounded-md bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-semibold">Review note:</span>{" "}
          {suggestion.review_note}
        </p>
      ) : null}
      {isPending ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            Reject
          </button>
        </div>
      ) : null}
    </li>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wide">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-foreground" : "text-xs text-foreground"}>
        {value}
      </dd>
    </div>
  );
}

function DecisionDialog({
  decision,
  onClose,
}: {
  decision: NonNullable<DecisionModal>;
  onClose: () => void;
}) {
  const approve = useApproveAreaSuggestion();
  const reject = useRejectAreaSuggestion();
  const [finalName, setFinalName] = useState(decision.suggestion.proposed_name);
  const [reviewNote, setReviewNote] = useState("");

  const pending = decision.kind === "approve" ? approve.isPending : reject.isPending;
  const error = decision.kind === "approve" ? approve.error : reject.error;

  async function submit() {
    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `idem-${Date.now()}`;
    try {
      if (decision.kind === "approve") {
        await approve.mutateAsync({
          id: decision.suggestion.id,
          final_name:
            finalName.trim() !== "" && finalName !== decision.suggestion.proposed_name
              ? finalName.trim()
              : undefined,
          review_note: reviewNote.trim() !== "" ? reviewNote.trim() : undefined,
          idempotencyKey,
        });
      } else {
        await reject.mutateAsync({
          id: decision.suggestion.id,
          review_note: reviewNote.trim() !== "" ? reviewNote.trim() : undefined,
          idempotencyKey,
        });
      }
      onClose();
    } catch {
      /* error surfaced below */
    }
  }

  const isApprove = decision.kind === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
        <header>
          <h2 className="text-lg font-semibold">
            {isApprove ? "Approve suggestion" : "Reject suggestion"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {decision.suggestion.proposed_name}
            {decision.suggestion.proposed_zone_id ? (
              <>
                {" "}
                · zone{" "}
                <span className="font-mono">
                  {decision.suggestion.proposed_zone_id.slice(0, 8)}…
                </span>
              </>
            ) : null}
          </p>
        </header>

        {isApprove ? (
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Final area name
            <input
              type="text"
              value={finalName}
              onChange={(e) => setFinalName(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Review note {isApprove ? "(optional)" : "(audited)"}
          <textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            rows={3}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            placeholder={
              isApprove
                ? "Optional context — duplicate of nearby area, renamed, etc."
                : "Required-by-policy reason for rejection."
            }
          />
        </label>

        {error instanceof ApiError ? (
          <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-xs text-danger">
            {error.code}: {error.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-2 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {pending ? "Working…" : isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: unknown }) {
  if (error instanceof ApiError) {
    return (
      <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
        {error.code}: {error.message}
      </p>
    );
  }
  return <p className="text-sm text-danger">Unexpected error.</p>;
}
