import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { Stats } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { getDayDiff } from "../utils";
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
    const date = new Date(todaysDate.toISODate());
    // const date = new Date(todaysDate.startOf("day").toISODate());
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
          const prev = await tx.log.findFirst({
            where: { date: { lt: date }, userId: user.id },
            orderBy: { date: "desc" },
            select: { id: true, totalCalories: true, date: true },
          });
          // when first day of login
          if (!prev) return null;
          const prevPr = tx.log.update({
            where: { id: prev.id },
            data: {
              weight: stats.weight,
            },
          });
          const diff = getDayDiff(prev.date, date);
          let currentStreak = stats.currentStreak,
            bestStreak = stats.bestStreak;
          // streak update
          if (diff > 10) {
            // streak break
            currentStreak = 0;
          } else if (diff <= 10) {
            currentStreak++;
          }
          bestStreak = Math.max(bestStreak, currentStreak);

          const updatedPr = tx.stats.update({
            where: { id: stats.id },
            data: {
              totalCalories: { increment: prev.totalCalories },
              currentStreak: currentStreak,
              bestStreak: bestStreak,
            },
          });
          const [prevLog, updatedStats] = await Promise.all([
            prevPr,
            updatedPr,
          ]);
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
    console.log("Stats log error", error);
    throw new Error("Something went wrong while fetching stats and logs.");
  }
}
