import { Button } from "@/components/ui/button";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  // sleep for 2 seconds
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const logs = await db.log.findMany({
    where: { date: { lt: date } },
    take: 6,
  });
  return { logs };
};

export { clientLoader } from "@/utils/routeCache.client";

export default function Dashboard() {
  const { logs } = useLoaderData<typeof loader>();
  const matches = useDashboardLayoutData();
  // console.log(matches.log);
  return (
    <div className="h-full">
      {/* <Form
        method="post"
        action="/dashboard"
      >
        <Button> Submit</Button>
      </Form> */}
    </div>
  );
}
