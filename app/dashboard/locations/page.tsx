import RoleGuard from "@/app/components/layout/RoleGuard";
import LocationManagement from "@/app/components/admin/LocationManagement";

export default function LocationsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <LocationManagement />
    </RoleGuard>
  );
}
