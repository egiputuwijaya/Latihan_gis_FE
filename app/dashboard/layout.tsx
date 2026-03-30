import ProtectedRoute from "@/app/components/layout/ProtectedRoute";
import DashboardSidebar from "@/app/components/layout/DashboardSidebar";
import DashboardHeader from "@/app/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar  />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
