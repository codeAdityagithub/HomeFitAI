import { Outlet } from "@remix-run/react";

const AuthLayout = () => {
  return (
    <div className="h-svh flex relative">
      <div className="h-full flex-1 overflow-hidden absolute -z-10 md:static">
        <img
          src="personRunning.jpg"
          alt="personRunning image"
          className="h-full w-full object-cover"
        />
      </div>
      <Outlet />
    </div>
  );
};
export default AuthLayout;
