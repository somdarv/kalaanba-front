import { MockListPage } from "../../_components/mock-list-page";

export default function CityHubsPage() {
  return (
    <MockListPage
      title="City hubs"
      description="Hub administration and area assignments. Each hub is run by a Hub Admin with scoped capabilities."
      callout="Hub Admin can manage zones/areas/clubs inside their hub but cannot touch global config or other hubs."
      columns={[
        { key: "name", label: "Hub" },
        { key: "country", label: "Country" },
        { key: "zones", label: "Zones" },
        { key: "areas", label: "Areas" },
        { key: "admin", label: "Hub admin" },
      ]}
      rows={[
        { name: "Tamale", country: "Ghana", zones: 6, areas: 33, admin: "Kojo Amponsah" },
        { name: "Kumasi", country: "Ghana", zones: 0, areas: 0, admin: "—" },
        { name: "Accra", country: "Ghana", zones: 0, areas: 0, admin: "—" },
      ]}
    />
  );
}
