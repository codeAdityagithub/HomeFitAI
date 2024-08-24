import Navbar from "@/components/landing/Navbar";
import { Outlet } from "@remix-run/react";

const HomeLayout = () => {
  return (
    <main className="min-h-screen h-full">
      <Navbar />
      <Outlet />
    </main>
  );
};
export default HomeLayout;
