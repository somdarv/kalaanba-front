import { MockListPage } from "../../_components/mock-list-page";

export default function ApprovalsQueuePage() {
  return (
    <MockListPage
      title="Approvals queue"
      description="Two-person approvals for sensitive admin changes — config edits, role grants, archive requests, RP compensating entries."
      callout="Wires into the governance approval store (config_proposals + admin_audit_log). Hub admins see hub-scoped proposals only; super admins see all."
      columns={[
        { key: "id", label: "Proposal" },
        { key: "kind", label: "Kind" },
        { key: "actor", label: "Proposed by" },
        { key: "status", label: "Status" },
        { key: "created", label: "Created" },
      ]}
      rows={[
        { id: "PROP-0421", kind: "config.update", actor: "kojo.amponsah@kalaanba", status: "Awaiting 2nd approver", created: "5m ago" },
        { id: "PROP-0420", kind: "user.role_grant", actor: "ama.ofori@kalaanba", status: "Approved", created: "1h ago" },
        { id: "PROP-0419", kind: "club.archive", actor: "yaw.boakye@kalaanba", status: "Rejected", created: "Yesterday" },
        { id: "PROP-0418", kind: "rp.compensating_entry", actor: "kwame.mensah@kalaanba", status: "Awaiting 1st approver", created: "Yesterday" },
      ]}
    />
  );
}
