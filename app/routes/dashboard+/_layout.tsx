import Sidebar from "@/components/dashboard/sidebar";
import { Outlet } from "@remix-run/react";

const DashboardLayout = () => {
  return (
    <div className="h-svh flex gap-4">
      <Sidebar />
      <main className="flex-1 w-full bg-secondary p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
