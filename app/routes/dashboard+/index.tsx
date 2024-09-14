import ExerciseTable from "@/components/dashboard/ExerciseTable";
import TodaysLogs from "@/components/dashboard/TodaysLogs";
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
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  // sleep for 2 seconds
  const date = new Date();
  // date.setDate(date.getDate() - 1);

  const logs = await db.log.findMany({
    where: { date: { lt: date } },
    orderBy: { date: "desc" },
    take: 7,
  });
  return { logs, user };
};

export { clientLoader } from "@/utils/routeCache.client";

export default function Dashboard() {
  const { logs, user } = useLoaderData<typeof loader>();
  const { log } = useDashboardLayoutData();

  return (
    <div className="h-full space-y-6">
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Hello <span className="text-primary">{user.username}!</span>👋
          </CardTitle>
          <CardDescription className="text-left w-full">
            Ready to crush today's goals and take a step closer to your fitness
            journey?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TodaysLogs log={log} />
        </CardContent>
      </Card>
      <Card className="flex flex-col gap-2 bg-secondary/50">
        <CardHeader className="flex flex-col relative items-center">
          <CardTitle className="border-l-4 border-accent text-left w-full pl-4">
            Exercise Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ExerciseTable exercises={log.exercises} />
        </CardContent>
      </Card>
    </div>
  );
}
