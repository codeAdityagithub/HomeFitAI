import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "@remix-run/react";

const PlaylistLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};
export default PlaylistLayout;
