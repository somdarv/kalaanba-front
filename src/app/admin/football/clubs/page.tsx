import { MockListPage } from "../../_components/mock-list-page";

export default function ClubsPage() {
  return (
    <MockListPage
      title="Clubs"
      description="Identity, verification level, related-club flags, archive. Verification is granted by Club engine policy."
      callout="Archive preserves history (Law 13). Related-club detection writes signals only; doesn't block actions."
      columns={[
        { key: "name", label: "Club" },
        { key: "type", label: "Type" },
        { key: "maturity", label: "Maturity" },
        { key: "hub", label: "Hub" },
        { key: "verified", label: "Verified" },
      ]}
      rows={[
        { name: "Real Tamale FC", type: "Community", maturity: "Verified", hub: "Tamale", verified: "Yes" },
        { name: "Sakasaka United", type: "School", maturity: "Structured", hub: "Tamale", verified: "—" },
        { name: "Northern Eagles", type: "Academy", maturity: "Registered", hub: "Tamale", verified: "Yes" },
        { name: "Bantama Boys", type: "Informal", maturity: "Informal", hub: "Tamale", verified: "—" },
      ]}
    />
  );
}
