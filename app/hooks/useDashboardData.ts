import { DashboardData } from "@/routes/dashboard+";
import { useMatchesData } from "./userContext";

export default function useDashboardData() {
  const data = useMatchesData("routes/dashboard+/index");
  if (!data) return null;
  return data as DashboardData;
}
