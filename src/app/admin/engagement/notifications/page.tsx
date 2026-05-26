import { MockListPage } from "../../_components/mock-list-page";

export default function NotificationsPage() {
  return (
    <MockListPage
      title="Notifications"
      description="Recipient targeting, channel, delivery audit. Notifications never own truth — they relay events."
      callout="Notification engine consumes events (Law 6). It doesn't poll domain tables. Templates and channels are configurable."
      columns={[
        { key: "at", label: "When" },
        { key: "event", label: "Event" },
        { key: "channel", label: "Channel" },
        { key: "recipients", label: "Recipients" },
        { key: "status", label: "Delivery" },
      ]}
      rows={[
        { at: "2026-05-26 09:14", event: "match.result_confirmed", channel: "Push + SMS", recipients: 412, status: "98% delivered" },
        { at: "2026-05-26 09:00", event: "challenge.accepted", channel: "Push", recipients: 35, status: "100% delivered" },
        { at: "2026-05-25 19:30", event: "season.cutoff_passed", channel: "SMS", recipients: 1820, status: "92% delivered" },
      ]}
    />
  );
}
