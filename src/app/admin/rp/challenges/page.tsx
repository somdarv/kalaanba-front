import { MockListPage } from "../../_components/mock-list-page";

export default function ChallengesPage() {
  return (
    <MockListPage
      title="Challenges"
      description="Lifecycle and counter view of inter-club challenges. RP math/lock owned by RP Economy."
      callout="Challenge engine owns lifecycle + stake-locking trigger only — it never computes RP movements."
      columns={[
        { key: "id", label: "Challenge" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "stake", label: "Stake (RP)" },
        { key: "stage", label: "Stage" },
      ]}
      rows={[
        { id: "CH-0044", from: "Real Tamale", to: "Northern Eagles", stake: 200, stage: "Accepted" },
        { id: "CH-0043", from: "Sakasaka United", to: "Choggu Hearts", stake: 80, stage: "Stakes locked" },
        { id: "CH-0042", from: "Bulpela FC", to: "Vitin", stake: 150, stage: "Settled" },
        { id: "CH-0041", from: "Lamashegu", to: "Bantama Boys", stake: 100, stage: "Declined" },
      ]}
    />
  );
}
