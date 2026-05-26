import { MockListPage } from "../../_components/mock-list-page";

export default function MatchesPage() {
  return (
    <MockListPage
      title="Matches"
      description="Match lifecycle, events, lineups, verification status. Trust gates downstream RP/standings."
      callout="No RP, no standings, no awards until `result_confirmed = true` AND Trust clearance recorded (Law 7)."
      columns={[
        { key: "date", label: "Date" },
        { key: "fixture", label: "Fixture" },
        { key: "score", label: "Score" },
        { key: "state", label: "Lifecycle" },
        { key: "trust", label: "Trust" },
      ]}
      rows={[
        { date: "2026-05-25", fixture: "Real Tamale FC vs Sakasaka United", score: "2 – 1", state: "result_confirmed", trust: "Cleared" },
        { date: "2026-05-24", fixture: "Northern Eagles vs Bantama Boys", score: "0 – 0", state: "result_confirmed", trust: "Awaiting Trust" },
        { date: "2026-05-24", fixture: "Bulpela FC vs Choggu Hearts", score: "3 – 2", state: "disputed", trust: "On hold" },
        { date: "2026-05-23", fixture: "Lamashegu vs Vitin", score: "—", state: "scheduled", trust: "—" },
      ]}
    />
  );
}
