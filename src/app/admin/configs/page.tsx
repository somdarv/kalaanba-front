"use client";

import { useMemo, useState } from "react";

import { useAdminConfigs } from "@/lib/api/hooks/use-admin";
import type { AdminConfig } from "@/lib/api/admin";
import { ApiError } from "@/lib/api";

const APPROVAL_LEVELS = ["all", "low", "medium", "high", "critical"] as const;
type ApprovalFilter = (typeof APPROVAL_LEVELS)[number];

export default function AdminConfigsPage() {
  const [engine, setEngine] = useState<string>("");
  const [approval, setApproval] = useState<ApprovalFilter>("all");

  const query = useAdminConfigs({
    engine: engine.trim() !== "" ? engine.trim() : undefined,
    approval_level: approval === "all" ? undefined : approval,
    limit: 200,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Read-only view of every `admin_config` row visible to a Super
          Admin. Mutations are deferred to God Mode (this slice).
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Engine prefix
          <input
            type="text"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            placeholder="zone, rp, challenge…"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Approval level
          <select
            value={approval}
            onChange={(e) => setApproval(e.target.value as ApprovalFilter)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          >
            {APPROVAL_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading configs…</p>
      ) : query.isError ? (
        <ErrorState error={query.error} />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No configuration rows match the current filter.
        </p>
      ) : (
        <ConfigTable rows={rows} />
      )}
    </section>
  );
}

function ConfigTable({ rows }: { rows: AdminConfig[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Key</th>
            <th className="px-3 py-2">Scope</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">v</th>
            <th className="px-3 py-2">Approval</th>
            <th className="px-3 py-2">Effective</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.key}-${row.scope}-${row.scope_id ?? "_"}`} className="border-t border-border">
              <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
              <td className="px-3 py-2">
                {row.scope}
                {row.scope_id ? (
                  <span className="ml-1 text-muted-foreground">/ {row.scope_id.slice(0, 8)}…</span>
                ) : null}
              </td>
              <td className="px-3 py-2 font-mono text-xs">
                {formatValue(row.value)}
              </td>
              <td className="px-3 py-2">{row.version}</td>
              <td className="px-3 py-2 capitalize">{row.approval_level}</td>
              <td className="px-3 py-2 text-xs text-muted-foreground">
                {row.effective_from}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function ErrorState({ error }: { error: unknown }) {
  if (error instanceof ApiError) {
    return (
      <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
        {error.code}: {error.message}
      </p>
    );
  }
  return (
    <p className="text-sm text-danger">Unexpected error loading configuration.</p>
  );
}
