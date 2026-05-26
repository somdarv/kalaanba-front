import { MockListPage } from "../../_components/mock-list-page";

export default function UsersRolesPage() {
  return (
    <MockListPage
      title="Users & roles"
      description="Promote, demote, or archive users. Roles are scoped (hub / zone / engine)."
      callout="Role changes are two-person approved and audited. Public PII (phone) is masked unless you have the `user.read_pii` capability."
      columns={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "role", label: "Role" },
        { key: "scope", label: "Scope" },
        { key: "status", label: "Status" },
      ]}
      rows={[
        { name: "Kojo Amponsah", phone: "+233 24 *** 2104", role: "Hub Admin", scope: "Tamale", status: "Active" },
        { name: "Ama Ofori", phone: "+233 24 *** 8810", role: "Zone Lead", scope: "Tamale / Sakasaka", status: "Active" },
        { name: "Yaw Boakye", phone: "+233 24 *** 0019", role: "Club Owner", scope: "Real Tamale FC", status: "Active" },
        { name: "Linda Mensah", phone: "+233 24 *** 4422", role: "Moderator", scope: "Global", status: "Suspended" },
      ]}
    />
  );
}
