import { MockListPage } from "../../_components/mock-list-page";

export default function ZonesBeltsPage() {
  return (
    <MockListPage
      title="Zones & belts"
      description="Manage zone/belt mapping and zone scores. Versioned per season."
      callout="Zone scores are computed from verified records inside the zone. Buzz never moves zone scores (Law 8)."
      columns={[
        { key: "name", label: "Zone" },
        { key: "belt", label: "Belt" },
        { key: "areas", label: "Areas" },
        { key: "score", label: "Score" },
        { key: "season", label: "Season" },
      ]}
      rows={[
        { name: "Sakasaka", belt: "Inner", areas: 7, score: 312, season: "2025/26" },
        { name: "Choggu", belt: "Inner", areas: 5, score: 244, season: "2025/26" },
        { name: "Lamashegu", belt: "Outer", areas: 9, score: 198, season: "2025/26" },
        { name: "Vitin", belt: "Outer", areas: 6, score: 91, season: "2025/26" },
      ]}
    />
  );
}
