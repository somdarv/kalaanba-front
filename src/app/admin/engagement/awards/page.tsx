import { MockListPage } from "../../_components/mock-list-page";

export default function AwardsPage() {
  return (
    <MockListPage
      title="Awards & recognition"
      description="Weekly and seasonal recognition. Performance awards require Trust + stats clearance."
      callout="Recognition uses verified records only (Law 9). Buzz-based recognition (if any) must be clearly labelled as attention-based."
      columns={[
        { key: "award", label: "Award" },
        { key: "period", label: "Period" },
        { key: "winner", label: "Winner" },
        { key: "source", label: "Source" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { award: "Player of the Week", period: "Week 21 — 2025/26", winner: "Issahaku Fuseini", source: "Verified stats", status: "Published" },
        { award: "Club of the Month", period: "April 2025/26", winner: "Real Tamale FC", source: "Verified standings", status: "Published" },
        { award: "Fan Pick — Goal of the Week", period: "Week 21 — 2025/26", winner: "Northern Eagles", source: "Buzz (attention-based)", status: "Published" },
        { award: "Player of the Season", period: "2025/26", winner: "—", source: "Verified stats", status: "Awaiting season end" },
      ]}
    />
  );
}
