import RoleGuard from "@/app/components/layout/RoleGuard";
import MerchantActions from "@/app/components/merchant/MerchantActions";

export default function MerchantShopsPage() {
  return (
    <RoleGuard allowedRoles={["MERCHANT"]}>
      <MerchantActions />
    </RoleGuard>
  );
}
