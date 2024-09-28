import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

const WorkoutLayout = () => {
  const location = useLocation();
  const [prev, setPrev] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (prev?.endsWith("detect")) {
      navigate(0);
    }
    setPrev(location.pathname);
  }, [location.pathname]);
  return <Outlet />;
};

export default WorkoutLayout;
