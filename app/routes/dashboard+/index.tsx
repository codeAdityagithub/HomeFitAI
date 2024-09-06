import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  // sleep for 2 seconds
  console.log(user);
  return null;
};

export { clientLoader } from "@/utils/routeCache.client";

export default function Dashboard() {
  // console.log(data);
  const matches = useDashboardLayoutData();
  // console.log(matches);
  return <div className="h-full">Dashboard</div>;
}
