import { editDailyGoals } from "@/.server/handlers/profile/editDailyGoals";
import { editStats } from "@/.server/handlers/profile/editStats";
import LogoutButton from "@/components/dashboard/Logout";
import ThemeToggle from "@/components/dashboard/themeButton";
import Achievements from "@/components/profile/Achievements";
import EditUserGoals from "@/components/profile/EditUserGoals";
import EditUserStats from "@/components/profile/EditUserStats";
import OtherStats from "@/components/profile/OtherStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { authenticator } from "@/services/auth.server";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { cacheClientAction } from "@/utils/routeCache.client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  json,
  useLoaderData,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { IoPersonOutline } from "react-icons/io5";

export const meta: MetaFunction = () => {
  return [
    { title: "Profile & Settings - Manage Your Account | HomeFitAI" },
    { property: "og:title", content: "Manage Your HomeFitAI Profile" },
    {
      name: "description",
      content:
        "Update your personal details, preferences, and fitness goals. Manage your HomeFitAI profile settings effortlessly.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const dbuser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbuser) return await authenticator.logout(request, { redirectTo: "/" });
  const creationTime = DateTime.fromJSDate(dbuser.createdAt)
    .setZone(dbuser.timezone!)
    .toLocaleString();

  return {
    user: { ...dbuser },
    creationTime:
      creationTime || new Date(dbuser.createdAt).toLocaleDateString(),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  if (request.method === "PUT") {
    const { value, _action } = await request.json();
    if (!value || !_action || typeof value !== "number")
      return json({ error: "Invalid Input." }, { status: 403 });

    if (_action.startsWith("dailyGoals")) {
      return await editDailyGoals({
        goal: _action.split(":")[1],
        userId: user.id,
        value,
      });
    }
    return await editStats({ stat: _action, userId: user.id, value });
  } else {
    return json({ errr: "Invalid Method" }, { status: 405 });
  }
};

export type ProfileAction = typeof action;

export { clientLoader } from "@/utils/routeCache.client";
export const clientAction = ({
  serverAction,
  request,
}: ClientActionFunctionArgs) =>
  cacheClientAction(["dashboardLayout"], serverAction);

const DashboardProfile = () => {
  const { user, creationTime } = useLoaderData<typeof loader>();
  const { stats } = useDashboardLayoutData();
  // console.log(user._count.logs);
  return (
    <div className="h-full space-y-6 p-4">
      {/* Profile info */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-row gap-4 pb-2 pt-4 relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4 mt-2">
            My Profile
          </CardTitle>
          <ThemeToggle
            className="w-fit"
            iconOnly
          />
          <LogoutButton
            className="w-fit"
            iconOnly
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                alt={user.username}
                src={user.image || ""}
              ></AvatarImage>
              <AvatarFallback>
                <IoPersonOutline className="w-full h-full p-2" />
              </AvatarFallback>
            </Avatar>
            <div className="">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-muted-foreground text-sm">
                created {creationTime}
              </p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 ssm:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
            <EditUserStats
              stat="age"
              init={stats.age}
            />
            <EditUserStats
              stat="height"
              init={stats.height}
              unit={stats.unit}
            />
            <EditUserStats
              stat="goalWeight"
              init={stats.goalWeight}
              unit={stats.unit}
            />
            <EditUserStats
              stat="weight"
              init={stats.weight}
              unit={stats.unit}
            />
          </div>
        </CardContent>
      </Card>
      {/* Daily goals */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="w-full grid grid-cols-1 ssm:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
            <EditUserGoals
              goal="steps"
              init={stats.dailyGoals.steps}
            />
            <EditUserGoals
              goal="sleep"
              init={stats.dailyGoals.sleep}
            />
            <EditUserGoals
              goal="calories"
              init={stats.dailyGoals.calories}
            />
            <EditUserGoals
              goal="water"
              init={stats.dailyGoals.water}
            />
          </div>
        </CardContent>
      </Card>
      {/* Other Stats */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Other Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <OtherStats
            stats={stats}
            totalWorkoutDays={stats.totalWorkoutDays}
          />
        </CardContent>
      </Card>
      {/* Achievements */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Achievements achievements={user.achievements} />
        </CardContent>
      </Card>
      {/* Exercise stats */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Exercise Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          All exercises PB's displayed here.
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
