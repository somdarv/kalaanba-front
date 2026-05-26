import { MockListPage } from "../../_components/mock-list-page";

export default function ModerationPage() {
  return (
    <MockListPage
      title="Moderation queue"
      description="Public content safety holds, escalations, takedowns. Moderation never decides football truth."
      callout="Moderation owns public content safety only (Law 10 + engine boundary). Football truth lives in Match + Trust."
      columns={[
        { key: "id", label: "Report" },
        { key: "kind", label: "Content" },
        { key: "reason", label: "Reason" },
        { key: "stage", label: "Stage" },
        { key: "age", label: "Age" },
      ]}
      rows={[
        { id: "REP-0918", kind: "Match comment", reason: "Hate speech", stage: "On hold", age: "12m" },
        { id: "REP-0917", kind: "Club banner", reason: "Misleading", stage: "Reviewing", age: "1h" },
        { id: "REP-0916", kind: "Player profile photo", reason: "Minor PII", stage: "Resolved (removed)", age: "Yesterday" },
      ]}
    />
  );
}
