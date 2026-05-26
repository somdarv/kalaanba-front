import { MockListPage } from "../../_components/mock-list-page";

export default function SeasonsPage() {
  return (
    <MockListPage
      title="Seasons"
      description="Calendar, cutoffs, phase transitions, archive windows. One season runs April → end of February."
      callout="Phase transitions emit `season.phase_changed` / `season.cutoff_passed` / `season.rp_reset_due`. Cutoffs are configurable per season."
      columns={[
        { key: "name", label: "Season" },
        { key: "phase", label: "Phase" },
        { key: "starts", label: "Starts" },
        { key: "ends", label: "Ends" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { name: "2025/26", phase: "Final run-in", starts: "2025-04-01", ends: "2026-02-28", status: "Active" },
        { name: "2024/25", phase: "Archived", starts: "2024-04-01", ends: "2025-02-28", status: "Archived" },
        { name: "2026/27", phase: "Planned", starts: "2026-04-01", ends: "2027-02-28", status: "Draft" },
      ]}
    />
  );
}
