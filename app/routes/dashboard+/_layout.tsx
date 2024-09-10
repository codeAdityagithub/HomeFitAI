import { getStatsandLogs } from "@/.server/handlers/getStatsandLogs";
import Sidebar from "@/components/dashboard/sidebar";
import { useTheme } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import {
  cacheClientAction,
  cacheClientLoader,
} from "@/utils/routeCache.client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/node";
import type {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const { stats, log } = await getStatsandLogs(user);

  return { stats, log };
};
export const action = ({ request }: ActionFunctionArgs) => {
  console.log("layout");
  return null;
};

export type DashboardLayoutData = SerializeFrom<typeof loader>;

export const clientLoader = async ({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) =>
  cacheClientLoader("dashboardLayout", serverLoader);

clientLoader.hydrate = true;

export const clientAction = ({ serverAction }: ClientActionFunctionArgs) =>
  cacheClientAction("dashboardLayout", serverAction);

const DashboardLayout = () => {
  // const data = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Sidebar />
      <main className="flex-1 w-full h-full min-h-[calc(100vh-56px)] md:min-h-screen bg-background text-foreground p-6 md:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
