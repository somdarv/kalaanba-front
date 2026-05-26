import { MockListPage } from "../../_components/mock-list-page";

export default function RefereesPage() {
  return (
    <MockListPage
      title="Referees & officiators"
      description="Assignment, reports, reliability signals. Referee reports feed Trust verdicts (read-only here)."
      callout="Referee reliability never alone decides Trust — it's an input. Verdicts are owned by Trust & Verification."
      columns={[
        { key: "name", label: "Referee" },
        { key: "hub", label: "Hub" },
        { key: "matches", label: "Matches officiated" },
        { key: "reliability", label: "Reliability" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { name: "Mohammed Adams", hub: "Tamale", matches: 47, reliability: "High", status: "Available" },
        { name: "Faisal Iddrisu", hub: "Tamale", matches: 22, reliability: "Building", status: "Available" },
        { name: "Hassan Mumuni", hub: "Tamale", matches: 91, reliability: "High", status: "On rest" },
      ]}
    />
  );
}
