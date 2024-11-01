import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "@remix-run/react";

const PlaylistLayout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};
export default PlaylistLayout;
