import { type DashboardLayoutData } from "@/routes/dashboard+/_layout";
import { useMatchesData } from "./userContext";
import { Stats } from "@prisma/client";

export default function useDashboardLayoutData() {
  const data = useMatchesData("routes/dashboard+/_layout");

  return data as DashboardLayoutData;
}
