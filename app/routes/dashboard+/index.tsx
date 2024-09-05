import db from "@/utils/db.server";
import { authenticator } from "@/services/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { requireUser } from "@/utils/auth/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const stats = await db.stats.findUnique({ where: { userId: user.id } });

  if (!stats)
    return redirect(
      `/details?error=${"Fill in the details to access the dasboard."}`
    );

  return { stats };
};

export { clientLoader } from "@/utils/routeCache.client";

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  // console.log(data);
  return <div className="h-full">Dashboard</div>;
}