import EditUserStats from "@/components/profile/EditUserStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { authenticator } from "@/services/auth.server";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { IoPersonOutline } from "react-icons/io5";

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

const DashboardProfile = () => {
  const { user, creationTime } = useLoaderData<typeof loader>();
  const { stats } = useDashboardLayoutData();

  return (
    <div className="h-full">
      <Card className="flex flex-col gap-2 bg-secondary">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
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
          <div className="">
            <EditUserStats stat="age" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
