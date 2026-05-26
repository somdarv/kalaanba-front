import { MockListPage } from "../../_components/mock-list-page";

export default function BookingsPage() {
  return (
    <MockListPage
      title="Bookings"
      description="Bookings, settlement, refunds. All money in integer pesewas (minor units) — display converted at API boundary."
      callout="Money is integer minor units (Law 12). Never floats. Booking commission, settlement and refunds all use pesewas."
      columns={[
        { key: "id", label: "Booking" },
        { key: "venue", label: "Venue" },
        { key: "club", label: "Booked by" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { id: "BK-2218", venue: "Aliu Mahama Stadium", club: "Real Tamale FC", amount: "GH₵ 500.00", status: "Settled" },
        { id: "BK-2217", venue: "Sakasaka Community Park", club: "Sakasaka United", amount: "GH₵ 80.00", status: "Pending settlement" },
        { id: "BK-2216", venue: "Real Tamale Training Ground", club: "Northern Eagles", amount: "GH₵ 120.00", status: "Refunded" },
      ]}
    />
  );
}
