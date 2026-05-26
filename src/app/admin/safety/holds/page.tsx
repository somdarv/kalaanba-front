import { MockListPage } from "../../_components/mock-list-page";

export default function HoldsPage() {
  return (
    <MockListPage
      title="Holds & escalations"
      description="Active safety holds and their escalation chains. Holds suppress public visibility without deleting data."
      callout="Archive, don't delete (Law 13). Holds are reversible — they suppress publication while review completes."
      columns={[
        { key: "id", label: "Hold" },
        { key: "target", label: "Target" },
        { key: "reason", label: "Reason" },
        { key: "owner", label: "Owner" },
        { key: "age", label: "Age" },
      ]}
      rows={[
        { id: "HLD-118", target: "Bantama Boys profile", reason: "Related-club signal", owner: "Moderation", age: "2d" },
        { id: "HLD-117", target: "Match #2117 highlights", reason: "PII concern", owner: "Moderation", age: "1d" },
        { id: "HLD-116", target: "Choggu Hearts banner", reason: "Awaiting verification", owner: "Trust", age: "5h" },
      ]}
    />
  );
}
