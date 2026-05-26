import { MockListPage } from "../../_components/mock-list-page";

export default function SurfacesPage() {
  return (
    <MockListPage
      title="Surface calendar"
      description="Surface availability windows and maintenance blocks."
      callout="Surface calendar is the source of truth for what can be booked when. Maintenance blocks override bookings."
      columns={[
        { key: "surface", label: "Surface" },
        { key: "venue", label: "Venue" },
        { key: "window", label: "Window" },
        { key: "state", label: "State" },
      ]}
      rows={[
        { surface: "Main pitch", venue: "Aliu Mahama Stadium", window: "2026-05-26 16:00 → 18:00", state: "Booked" },
        { surface: "Pitch A", venue: "Real Tamale TG", window: "2026-05-26 17:00 → 19:00", state: "Available" },
        { surface: "Pitch B", venue: "Real Tamale TG", window: "2026-05-26 09:00 → 12:00", state: "Maintenance" },
        { surface: "Main pitch", venue: "Sakasaka Community Park", window: "2026-05-27 16:00 → 18:00", state: "Available" },
      ]}
    />
  );
}
