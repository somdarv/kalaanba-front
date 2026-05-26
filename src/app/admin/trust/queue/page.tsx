import { MockListPage } from "../../_components/mock-list-page";

export default function TrustQueuePage() {
  return (
    <MockListPage
      title="Trust queue"
      description="Pending verification clearances. Each row carries the full decision trace — referee report, both-rep confirmation, signal flags."
      callout="Trust clearance is the gate to RP, standings, awards, and verified stats (Law 7). Verdicts are append-only."
      columns={[
        { key: "match", label: "Match" },
        { key: "submitted", label: "Submitted" },
        { key: "signals", label: "Signal flags" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { match: "Northern Eagles vs Bantama Boys", submitted: "10m ago", signals: "Both reps confirmed", status: "Auto-clearing" },
        { match: "Bulpela FC vs Choggu Hearts", submitted: "1h ago", signals: "Score mismatch", status: "Manual review" },
        { match: "Lamashegu vs Vitin", submitted: "Yesterday", signals: "Late submission", status: "Cleared" },
      ]}
    />
  );
}
