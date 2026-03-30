import RoleGuard from "@/app/components/layout/RoleGuard";
import MerchantStats from "@/app/components/merchant/MerchantStats";

export default function MerchantDashboardPage() {
  return (
    <RoleGuard allowedRoles={["MERCHANT"]}>
      <MerchantStats />
    </RoleGuard>
  );
}
