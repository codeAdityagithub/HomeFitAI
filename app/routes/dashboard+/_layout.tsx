import type { LoaderFunctionArgs } from "@remix-run/node";
import Sidebar from "@/components/dashboard/sidebar";
import {
  json,
  Outlet,
  ShouldRevalidateFunction,
  useLoaderData,
} from "@remix-run/react";
import { themeCookie } from "@/utils/themeCookie.server";
import { cn } from "@/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme: string = await themeCookie.parse(request.headers.get("Cookie"));
  if (!theme) {
    return json(
      { theme: "dark" },
      {
        headers: {
          "Set-Cookie": await themeCookie.serialize("dark"),
        },
      }
    );
  }
  return { theme };
};
export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  return formAction === "/api/changeTheme";
};

const DashboardLayout = () => {
  const { theme } = useLoaderData<typeof loader>();
  return (
    <div className={cn("flex flex-col-reverse md:flex-row", theme)}>
      <Sidebar />
      <main className="flex-1 w-full h-full min-h-[calc(100vh-56px)] md:min-h-screen bg-secondary text-secondary-foreground p-6 md:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
