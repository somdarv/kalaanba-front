import { MockListPage } from "../../_components/mock-list-page";

export default function CompetitionsPage() {
  return (
    <MockListPage
      title="Competitions"
      description="Containers, rules, standings, format. Standings are computed by Competition & Rules engine from verified matches."
      callout="A competition NEVER computes match truth. Standings depend on `trust.match_cleared` events."
      columns={[
        { key: "name", label: "Competition" },
        { key: "type", label: "Type" },
        { key: "season", label: "Season" },
        { key: "teams", label: "Teams" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { name: "Tamale Belt Cup", type: "Knockout", season: "2025/26", teams: 16, status: "Group stage" },
        { name: "Northern Premier", type: "League", season: "2025/26", teams: 12, status: "Matchday 18" },
        { name: "Sakasaka Friendlies", type: "Friendlies", season: "2025/26", teams: 8, status: "Rolling" },
      ]}
    />
  );
}
