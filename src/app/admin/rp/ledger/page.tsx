import { MockListPage } from "../../_components/mock-list-page";

export default function RpLedgerPage() {
  return (
    <MockListPage
      title="RP ledger"
      description="Append-only RP ledger. Wallet balances are projections — corrections via compensating entries only."
      callout="RP is mutated ONLY via ledger entries (Law 11). Never in-place update a balance. Buzz never mints RP (Law 8)."
      columns={[
        { key: "at", label: "When" },
        { key: "actor", label: "Subject" },
        { key: "kind", label: "Kind" },
        { key: "amount", label: "Δ RP" },
        { key: "ref", label: "Reference" },
      ]}
      rows={[
        { at: "2026-05-26 09:12", actor: "Real Tamale FC", kind: "match.win", amount: "+45", ref: "match #2118" },
        { at: "2026-05-26 09:12", actor: "Sakasaka United", kind: "match.loss", amount: "-15", ref: "match #2118" },
        { at: "2026-05-25 18:04", actor: "Northern Eagles", kind: "challenge.settled", amount: "+120", ref: "chall #44" },
        { at: "2026-05-25 12:30", actor: "Bantama Boys", kind: "compensating.correction", amount: "+30", ref: "audit #DSP-115" },
      ]}
    />
  );
}
