import db from "@/utils/db.server";
import { redirect } from "@remix-run/node";

export async function getStatsandLogs(userId: string) {
  const stats = await db.stats.findUnique({ where: { userId } });

  if (!stats)
    throw redirect(
      `/details?error=${"Fill in the details to access the dasboard."}`
    );
  const onlyDate = new Date(new Date().toISOString().split("T")[0]);
  console.log(onlyDate);

  //   const logs = await db.log.findUnique({
  //     where: { date_userId: {} },
  //     orderBy: { createdAt: "desc" },
  //     take: 10,
  //   });
  return { stats };
}
