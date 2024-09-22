import CaloriesSourceChart from "@/components/dashboard/charts/CaloriesSourceChart";
import ExercisesChart from "@/components/dashboard/charts/ExercisesChart";
import SleepChart from "@/components/dashboard/charts/SleepChart";
import StepsChart from "@/components/dashboard/charts/StepsChart";
import WeightChart from "@/components/dashboard/charts/WeightChart";
import ExerciseTable from "@/components/dashboard/ExerciseTable";
import TodaysLogs from "@/components/dashboard/TodaysLogs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Flame } from "lucide-react";
import { IoPersonOutline } from "react-icons/io5";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  // sleep for 2 seconds
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const logs = await db.log.findMany({
    where: { date: { lt: date } },
    orderBy: { date: "desc" },
    take: 6,
  });

  return { logs, user };
};

export type DashboardData = SerializeFrom<typeof loader>;

export { clientLoader } from "@/utils/routeCache.client";

export default function Dashboard() {
  const { logs: prev, user } = useLoaderData<typeof loader>();
  const { log, stats } = useDashboardLayoutData();
  const logs = [log, ...prev];
  return (
    <div className="h-full space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-4 flex flex-col gap-2 bg-secondary/50">
          <CardHeader className="flex flex-col relative items-center">
            <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
              Hello <span className="text-primary">{user.username}!</span>👋
            </CardTitle>
            <CardDescription className="text-left w-full">
              Ready to crush today's goals and take a step closer to your
              fitness journey?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <TodaysLogs log={log} />
          </CardContent>
        </Card>
        {/* <Card className="bg-secondary/50">
          <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt={user.username}
                  src={user.image ?? ""}
                ></AvatarImage>
                <AvatarFallback>
                  <IoPersonOutline className="w-full h-full p-2" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
            </div>
            <div className="rounded-lg py-4 px-2 border border-accent/10 bg-secondary flex items-center gap-2">
              <span>
                <Flame
                  size={30}
                  className="text-primary"
                />
              </span>
              <div className="flex flex-col items-start">
                <h2 className="text-xl xs:text-2xl font-bold">
                  {stats.currentStreak}
                </h2>
                <small className="text-muted-foreground">Current Streak</small>
              </div>
            </div>
            <div className="rounded-lg py-4 px-2 border border-accent/10 bg-secondary flex items-center gap-2">
              <span>
                <Flame
                  size={30}
                  className="text-primary"
                />
              </span>
              <div className="flex flex-col items-start">
                <h2 className="text-xl xs:text-2xl font-bold">
                  {stats.bestStreak}
                </h2>
                <small className="text-muted-foreground">Best Streak</small>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 mmd:grid-cols-2 xl:grid-cols-3 gap-6">
        <WeightChart logs={logs} />
        <StepsChart logs={logs} />
        <SleepChart logs={logs} />
        <ExercisesChart logs={logs} />
        <CaloriesSourceChart logs={logs} />
      </div>
      <ExerciseTable exercises={log.exercises} />
    </div>
  );
}
