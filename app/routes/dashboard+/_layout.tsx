import { addExerciseCalories } from "@/.server/handlers/dashboard/addExerciseCalories";
import { addExercseDuration } from "@/.server/handlers/dashboard/addExerciseDuration";
import { editTodaysLog } from "@/.server/handlers/dashboard/editTodaysLog";
import { getStatsandLogs } from "@/.server/handlers/getStatsandLogs";
import AchievementDialog from "@/components/dashboard/AchievementDialog";
import Sidebar from "@/components/dashboard/sidebar";
import { commitSession, getSession } from "@/services/session.server";
import { requireUser } from "@/utils/auth/auth.server";
import {
  cacheClientAction,
  cacheClientLoader,
} from "@/utils/routeCache.client";
import { Achievement } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/node";
import type {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "@remix-run/react";
import { json, Outlet, useLoaderData } from "@remix-run/react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const { stats, log } = await getStatsandLogs(user);

  const session = await getSession(request.headers.get("Cookie"));
  const achievement: LoaderAchievement = session.get("achievement") || null;
  return json(
    { stats, log, achievement },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};
export type LoaderAchievement = Omit<Achievement, "createdAt"> | null;
export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  if (request.method === "PUT") {
    const { value, _action, logId, exerciseId, duration } =
      await request.json();
    if (((value === null || value === undefined) && !duration) || !_action)
      return json({ error: "Invalid Input." }, { status: 403 });

    if (_action !== "totalCalories") {
      return await editTodaysLog({
        type: _action,
        userId: user.id,
        logId,
        value,
      });
    }
    // console.log(duration);
    if (duration) {
      return addExercseDuration({
        exerciseId,
        logId,
        duration,
        userId: user.id,
      });
    }
    return await addExerciseCalories({
      exerciseId,
      logId,
      value,
      userId: user.id,
    });
  } else {
    return json({ error: "Invalid Method" }, { status: 404 });
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

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  defaultShouldRevalidate,
}) => {
  if (actionResult && actionResult.error) return false;
  return defaultShouldRevalidate;
};

const DashboardLayout = () => {
  const { achievement } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-[500px]">
      <Sidebar />
      <AchievementDialog achievement={achievement} />
      <main className="flex-1 w-full h-full min-h-[calc(100lvh-56px)] md:min-h-screen bg-background text-foreground pb-16 p-6 md:p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
