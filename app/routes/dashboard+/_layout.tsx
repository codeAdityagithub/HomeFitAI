import Sidebar from "@/components/dashboard/sidebar";
import { Outlet } from "@remix-run/react";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Sidebar />
      <main className="flex-1 w-full h-full min-h-[calc(100vh-56px)] md:min-h-screen md:bg-secondary p-6 md:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
