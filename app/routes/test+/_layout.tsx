import { Outlet } from "@remix-run/react";

const TestLayout = () => {
  return (
    <div>
      TestLayout
      <Outlet />
    </div>
  );
};
export default TestLayout;
