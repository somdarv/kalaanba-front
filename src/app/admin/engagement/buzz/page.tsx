import { MockListPage } from "../../_components/mock-list-page";

export default function FanBuzzPage() {
  return (
    <MockListPage
      title="Fan Buzz"
      description="Attention signals, ranking, badges. ATTENTION-ONLY — never moves football truth, never mints RP."
      callout="Buzz drives visibility. Results drive respect (Law 8). Deptrac/Pest Architecture lints enforce that Buzz cannot mutate RP or settle challenges."
      columns={[
        { key: "subject", label: "Subject" },
        { key: "kind", label: "Signal" },
        { key: "score", label: "Buzz score" },
        { key: "window", label: "Window" },
      ]}
      rows={[
        { subject: "Real Tamale FC", kind: "Club", score: 8124, window: "7d" },
        { subject: "Issahaku Fuseini", kind: "Player", score: 4912, window: "7d" },
        { subject: "Tamale Belt Cup Final", kind: "Match", score: 12433, window: "Live" },
        { subject: "Northern Eagles", kind: "Club", score: 3110, window: "7d" },
      ]}
    />
  );
}
