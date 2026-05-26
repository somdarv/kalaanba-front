import { MockListPage } from "../../_components/mock-list-page";

export default function PlayersPage() {
  return (
    <MockListPage
      title="Players & affiliations"
      description="Ghost claims, affiliations, minor-protected flag. Affiliations are versioned (joined/transferred/loaned/left)."
      callout="Minor-protected players have restricted visibility (Law 10). Ghost rows are linked to users via OTP-verified claim flow."
      columns={[
        { key: "name", label: "Player" },
        { key: "club", label: "Current club" },
        { key: "status", label: "Status" },
        { key: "claim", label: "Claim" },
        { key: "protected", label: "Minor-protected" },
      ]}
      rows={[
        { name: "Issahaku Fuseini", club: "Real Tamale FC", status: "Active", claim: "Claimed", protected: "—" },
        { name: "Ibrahim Yakubu", club: "Sakasaka United", status: "Active", claim: "Ghost", protected: "—" },
        { name: "Abdul-Rahman M.", club: "Northern Eagles", status: "Active", claim: "Ghost", protected: "Yes" },
        { name: "Kwabena Owusu", club: "Free agent", status: "Free agent", claim: "Claimed", protected: "—" },
      ]}
    />
  );
}
