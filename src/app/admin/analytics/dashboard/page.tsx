import { MockListPage } from "../../_components/mock-list-page";

export default function AnalyticsDashboardPage() {
  return (
    <MockListPage
      title="Dashboards"
      description="Operational KPIs and engine health. Analytics consumes events — never the source-of-truth for any domain."
      callout="Analytics, Insights & Intelligence reads from the event stream + read-only projections only (Law 6 + boundary)."
      columns={[
        { key: "metric", label: "Metric" },
        { key: "value", label: "Today" },
        { key: "delta", label: "Δ vs 7d avg" },
        { key: "engine", label: "Owner engine" },
      ]}
      rows={[
        { metric: "Matches confirmed", value: 42, delta: "+12%", engine: "Match / Fixture" },
        { metric: "Trust clearance latency (p95)", value: "6m 12s", delta: "-8%", engine: "Trust & Verification" },
        { metric: "Active challenges", value: 18, delta: "+3", engine: "Challenge" },
        { metric: "RP ledger entries", value: 1284, delta: "+22%", engine: "RP Economy" },
        { metric: "Bookings settled", value: "GH₵ 4,820", delta: "+5%", engine: "Venue / Surface / Booking" },
      ]}
    />
  );
}
