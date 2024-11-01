import { Outlet } from "@remix-run/react";

const WorkoutLayout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default WorkoutLayout;
