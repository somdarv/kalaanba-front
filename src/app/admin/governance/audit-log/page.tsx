import { MockListPage } from "../../_components/mock-list-page";

export default function AuditLogPage() {
  return (
    <MockListPage
      title="Audit log"
      description="Append-only record of every admin action. Filter by actor, route, status, or engine."
      callout="Backed by `admin_audit_log`. Auto-populated by AdminAuditMiddleware on all authenticated mutating calls (Constitution Law 5)."
      columns={[
        { key: "at", label: "When" },
        { key: "actor", label: "Actor" },
        { key: "method", label: "Method" },
        { key: "route", label: "Route" },
        { key: "status", label: "Status" },
        { key: "request", label: "Request ID" },
      ]}
      rows={[
        { at: "2026-05-26 09:14", actor: "super_admin#1", method: "POST", route: "/admin/zone/area-suggestions/{id}/approve", status: 200, request: "req_8f3a…" },
        { at: "2026-05-26 09:12", actor: "super_admin#1", method: "POST", route: "/admin/zone/area-suggestions/{id}/reject", status: 200, request: "req_2b1c…" },
        { at: "2026-05-26 08:55", actor: "hub_admin#7", method: "GET",  route: "/admin/configs", status: 200, request: "req_9e7d…" },
        { at: "2026-05-26 08:40", actor: "super_admin#1", method: "POST", route: "/admin/users/{id}/role", status: 422, request: "req_44a0…" },
      ]}
    />
  );
}
