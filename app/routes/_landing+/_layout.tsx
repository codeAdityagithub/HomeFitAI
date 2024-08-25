import Navbar from "@/components/landing/Navbar";
import { Outlet } from "@remix-run/react";

const HomeLayout = () => {
  return (
    <main className="relative h-full max-w-[1450px] mx-auto">
      <Navbar />
      <Outlet />
    </main>
  );
};
export default HomeLayout;
