import { MockListPage } from "../../_components/mock-list-page";

export default function DisputesPage() {
  return (
    <MockListPage
      title="Disputes"
      description="Active disputes with private evidence threads. Evidence is NEVER on public surfaces (Law 10)."
      callout="Dispute notes, admin overrides, and reasoning are private. Public-facing outcome is a single status code only."
      columns={[
        { key: "id", label: "Dispute" },
        { key: "match", label: "Match" },
        { key: "filedBy", label: "Filed by" },
        { key: "stage", label: "Stage" },
        { key: "age", label: "Age" },
      ]}
      rows={[
        { id: "DSP-118", match: "Bulpela FC vs Choggu Hearts", filedBy: "Bulpela FC", stage: "Evidence gathering", age: "2h" },
        { id: "DSP-117", match: "Sakasaka United vs Vitin", filedBy: "Vitin", stage: "Trust deciding", age: "1d" },
        { id: "DSP-116", match: "Northern Eagles vs Real Tamale", filedBy: "Real Tamale", stage: "Resolved (upheld)", age: "3d" },
      ]}
    />
  );
}
