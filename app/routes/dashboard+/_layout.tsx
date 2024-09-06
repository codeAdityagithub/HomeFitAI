import { getStatsandLogs } from "@/.server/handlers/getStatsandLogs";
import Sidebar from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { themeCookie } from "@/utils/themeCookie.server";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  json,
  Outlet,
  redirect,
  ShouldRevalidateFunction,
  useLoaderData,
} from "@remix-run/react";
import axios from "axios";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const theme: string = await themeCookie.parse(request.headers.get("Cookie"));
  const { stats } = await getStatsandLogs(user.id);
  if (!theme) {
    return json(
      { theme: "dark", stats },
      {
        headers: {
          "Set-Cookie": await themeCookie.serialize("dark"),
        },
      }
    );
  }

  return { theme, stats };
};

export type DashboardLayoutData = SerializeFrom<typeof loader>;

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  return formAction === "/api/changeTheme";
};

const DashboardLayout = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <div className={cn("flex flex-col-reverse md:flex-row", data.theme)}>
      <Sidebar />
      <main className="flex-1 w-full h-full min-h-[calc(100vh-56px)] md:min-h-screen bg-secondary text-secondary-foreground p-6 md:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
