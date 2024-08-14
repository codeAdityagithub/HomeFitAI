import { Outlet } from "@remix-run/react";

const AuthLayout = () => {
  return (
    <div>
      AuthLayout
      <Outlet />
    </div>
  );
};
export default AuthLayout;
