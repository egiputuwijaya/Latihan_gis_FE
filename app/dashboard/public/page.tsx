import RoleGuard from "@/app/components/layout/RoleGuard";
import PublicStats from "@/app/components/public/PublicStats";
// import BecomeMerchantCard from "@/app/components/public/BecomeMerchantCar";

export default function PublicDashboardPage() {
  return (
    <RoleGuard allowedRoles={["public"]}>
      <div className="space-y-6">
        <PublicStats />
        {/* <BecomeMerchantCard /> */}
      </div>
    </RoleGuard>
  );
}