import { MockListPage } from "../../_components/mock-list-page";

export default function VenuesPage() {
  return (
    <MockListPage
      title="Venues"
      description="Venue identity, capacity, surface inventory. Bookings live on a separate calendar."
      callout="Venue identity is owned here. Venue verification status flows from Trust."
      columns={[
        { key: "name", label: "Venue" },
        { key: "hub", label: "Hub" },
        { key: "surfaces", label: "Surfaces" },
        { key: "capacity", label: "Capacity" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { name: "Aliu Mahama Stadium", hub: "Tamale", surfaces: 1, capacity: "20,000", status: "Verified" },
        { name: "Real Tamale Training Ground", hub: "Tamale", surfaces: 2, capacity: "500", status: "Verified" },
        { name: "Sakasaka Community Park", hub: "Tamale", surfaces: 1, capacity: "300", status: "Awaiting verification" },
      ]}
    />
  );
}
