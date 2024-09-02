import Sidebar from "@/components/dashboard/sidebar";
import { Outlet } from "@remix-run/react";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Sidebar />
      <main className="flex-1 w-full h-full md:bg-secondary md:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
