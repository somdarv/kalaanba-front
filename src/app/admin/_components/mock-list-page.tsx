import type { ReactNode } from "react";

type Column = { key: string; label: string; className?: string };
type Row = Record<string, ReactNode>;

export type MockListPageProps = {
  title: string;
  description?: string;
  callout?: string;
  columns: Column[];
  rows: Row[];
  empty?: string;
  actions?: ReactNode;
};

export function MockListPage({
  title,
  description,
  callout,
  columns,
  rows,
  empty = "No records yet.",
  actions,
}: MockListPageProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </header>

      {callout ? (
        <div className="rounded-lg border border-dashed border-border bg-surface-2 p-4 text-xs text-muted-foreground">
          {callout}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-2 text-left font-medium ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 text-foreground ${c.className ?? ""}`}
                    >
                      {row[c.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Mock data — backend wiring pending. All actions are display-only in this slice.
      </p>
    </div>
  );
}
