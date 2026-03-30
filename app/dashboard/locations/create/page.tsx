import CreateLocationFull from "@/app/components/admin/locations/CreateLocationFull";
import RoleGuard from "@/app/components/layout/RoleGuard";

export default function CreateLocationPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="">
        <CreateLocationFull />
      </div>
    </RoleGuard>
  );
}
