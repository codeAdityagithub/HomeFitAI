import { editStats } from "@/.server/handlers/profile/editStats";
import EditUserStats from "@/components/profile/EditUserStats";
import OtherStats from "@/components/profile/OtherStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { authenticator } from "@/services/auth.server";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { cacheClientAction } from "@/utils/routeCache.client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  json,
  useLoaderData,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { IoPersonOutline } from "react-icons/io5";
import invariant from "tiny-invariant";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const dbuser = await db.user.findUnique({
    where: { id: user.id },
    include: { _count: { select: { achievements: true, logs: true } } },
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
  const { value, _action } = await request.json();
  if (!value || !_action || typeof value !== "number")
    return json({ error: "Invalid Input." }, { status: 403 });

  return await editStats({ stat: _action, userId: user.id, value });
};

export { clientLoader } from "@/utils/routeCache.client";
export const clientAction = ({ serverAction }: ClientActionFunctionArgs) =>
  cacheClientAction("dashboardLayout", serverAction);

const DashboardProfile = () => {
  const { user, creationTime } = useLoaderData<typeof loader>();
  const { stats, log } = useDashboardLayoutData();
  // console.log(user._count.logs);
  return (
    <div className="h-full space-y-6">
      {/* Profile info */}
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                alt={user.username}
                src={user.image ?? ""}
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
          <div className="w-full grid grid-cols-1 xs:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
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
            totalLogs={user._count.logs}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
