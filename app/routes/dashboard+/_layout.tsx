import { editTodaysLog } from "@/.server/handlers/dashboard/editTodaysLog";
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
import { json, Outlet, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const { stats, log } = await getStatsandLogs(user);

  return { stats, log };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  if (request.method === "PUT") {
    const { value, _action, logId } = await request.json();
    if (!value || !_action || typeof value !== "number")
      return json({ error: "Invalid Input." }, { status: 403 });

    return await editTodaysLog({
      type: _action,
      userId: user.id,
      logId,
      value,
    });
  } else {
    return json({ errr: "Invalid Method" }, { status: 404 });
  }
};

export type DashboardLayoutData = SerializeFrom<typeof loader>;

export const clientLoader = async ({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) =>
  cacheClientLoader("dashboardLayout", serverLoader);

clientLoader.hydrate = true;

export const clientAction = ({ serverAction }: ClientActionFunctionArgs) =>
  cacheClientAction(["dashboardLayout"], serverAction);

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
