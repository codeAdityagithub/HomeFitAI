import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { Stats } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
export async function getStatsandLogs(user: AuthUser) {
  let stats = await db.stats.findUnique({ where: { userId: user.id } });

  if (!stats || !user.timezone)
    throw redirect(
      `/details?error=${"Fill in the details to access the dasboard."}`
    );
  const todaysDate = DateTime.now().setZone(user.timezone);

  if (!todaysDate.isValid)
    throw new Error(
      "Invalid timezone settings! Please logout and login again."
    );

  try {
    const date = new Date(todaysDate.startOf("day").toISODate());
    let log = await db.log.findUnique({
      where: { date_userId: { date: date, userId: user.id } },
    });
    let updatedStats: Stats | null = null;
    if (!log) {
      const { newLog, newStats } = await db.$transaction(async (tx) => {
        // create todays log
        const logPr = tx.log.create({
          data: {
            date: date,
            weight: stats.weight,
            user: { connect: { id: user.id } },
          },
        });
        // update yesterdays log with any stats updated from yesterday
        const updateLogAndStats = async () => {
          const prevDate = new Date(date);
          prevDate.setDate(prevDate.getDate() - 1);
          const prevLog = await tx.log.update({
            where: { date_userId: { date: prevDate, userId: user.id } },
            data: {
              weight: stats.weight,
            },
          });
          const updatedStats = await tx.stats.update({
            where: { id: stats.id },
            data: { totalCalories: { increment: prevLog.totalCalories } },
          });
          return updatedStats;
        };
        const updatePr = updateLogAndStats();
        const [newLog, newStats] = await Promise.all([logPr, updatePr]);

        return { newLog, newStats };
      });
      log = newLog;
      updatedStats = newStats;
    }

    return { stats: updatedStats ? updatedStats : stats, log };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
