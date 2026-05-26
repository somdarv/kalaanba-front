import { MockListPage } from "../../_components/mock-list-page";

export default function AnalyticsEventsPage() {
  return (
    <MockListPage
      title="Events"
      description="Recent event stream. Engines communicate via versioned named events (`engine.action`)."
      callout="Events are append-only and versioned. Consumers idempotent on `event_id`."
      columns={[
        { key: "at", label: "When" },
        { key: "name", label: "Event" },
        { key: "version", label: "v" },
        { key: "source", label: "Source engine" },
        { key: "id", label: "Event ID" },
      ]}
      rows={[
        { at: "2026-05-26 09:14:02", name: "match.result_confirmed", version: "v1", source: "Match", id: "evt_8f3a…" },
        { at: "2026-05-26 09:14:03", name: "trust.match_cleared", version: "v1", source: "Trust", id: "evt_2b1c…" },
        { at: "2026-05-26 09:14:04", name: "rp.match_settled", version: "v1", source: "RP Economy", id: "evt_91d0…" },
        { at: "2026-05-26 09:14:05", name: "notification.dispatched", version: "v1", source: "Notification", id: "evt_44a0…" },
      ]}
    />
  );
}
