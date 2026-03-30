import EditLocationFull from "@/app/components/admin/locations/EditLocationFull";
import RoleGuard from "@/app/components/layout/RoleGuard";

export default function CreateLocationPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="">
        <EditLocationFull />
      </div>
    </RoleGuard>
  );
}
