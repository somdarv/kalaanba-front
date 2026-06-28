"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api";
import type { AdminUser, AdminUserStatus } from "@/lib/api/admin";
import { useAdminUsers } from "@/lib/api/hooks/use-admin";
import { ManageUserDialog } from "./_manage-user-dialog";

const STATUS_FILTERS: { value: AdminUserStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "unverified", label: "Unverified" },
  { value: "disabled", label: "Disabled" },
];

const PER_PAGE = 25;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [managing, setManaging] = useState<AdminUser | null>(null);

  const query = useAdminUsers({
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    per_page: PER_PAGE,
    page,
  });
  const rows = query.data ?? [];

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Registered users + pre-alpha support tools. Passwords and OTPs are
          never shown — unblock testers via actions. Destructive actions need
          the admin access code.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name, email, or phone last-4…"
          className="h-10 min-w-64 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
        />
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                status === f.value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Phone</th>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Auth</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Verified</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {query.isLoading ? (
              <RowMessage text="Loading users…" />
            ) : query.isError ? (
              isAuthError(query.error) ? (
                <RowMessage danger>
                  You&rsquo;re not signed in as an administrator.{" "}
                  <a href="/auth/login" className="font-medium underline">
                    Log in
                  </a>{" "}
                  with a super-admin account.
                </RowMessage>
              ) : (
                <RowMessage
                  danger
                  text={
                    query.error instanceof ApiError
                      ? `${query.error.code}: ${query.error.message}`
                      : "Failed to load users."
                  }
                />
              )
            ) : rows.length === 0 ? (
              <RowMessage text="No users match." />
            ) : (
              rows.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {user.phone_masked ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{user.email ?? "—"}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {user.auth_method}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {user.phone_verified ? "📱✓ " : ""}
                    {user.email_verified ? "✉︎✓" : ""}
                    {!user.phone_verified && !user.email_verified ? "—" : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setManaging(user)}
                      className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-surface-2"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Page {page}</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={rows.length < PER_PAGE}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {managing ? (
        <ManageUserDialog user={managing} onClose={() => setManaging(null)} />
      ) : null}
    </section>
  );
}

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const tone: Record<AdminUserStatus, string> = {
    active: "bg-success/10 text-success",
    unverified: "bg-warning/10 text-warning",
    disabled: "bg-danger/10 text-danger",
    archived: "bg-surface-2 text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium capitalize ${tone[status]}`}
    >
      {status}
    </span>
  );
}

function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

function RowMessage({
  text,
  children,
  danger,
}: {
  text?: string;
  children?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <tr>
      <td
        colSpan={7}
        className={`px-4 py-8 text-center text-sm ${danger ? "text-danger" : "text-muted-foreground"}`}
      >
        {children ?? text}
      </td>
    </tr>
  );
}
