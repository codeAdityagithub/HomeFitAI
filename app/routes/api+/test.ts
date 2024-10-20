import db from "@/utils/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  //   await db.log.updateMany({
  //     data: { exercises: { updateMany: { data: { target: "" }, where: {} } } },
  //   });
  // console.log(
  //   await db.stats.updateMany({
  //     data: {
  //       dailyGoals: {},
  //     },
  //   })
  // );
  return "done";
};
