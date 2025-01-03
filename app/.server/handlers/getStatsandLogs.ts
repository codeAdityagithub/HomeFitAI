import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { stepsToCal } from "@/utils/general";
import { Achievement, Stats } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { getDayDiff } from "../utils";
import { addAchievements } from "./addAchievements";

export async function getStatsandLogs(user: AuthUser) {
  let stats = await db.stats.findUnique({ where: { userId: user.id } });

  if (!stats || !user.timezone)
    throw redirect(
      `/details?error=${"Fill in the details to access the dashboard."}`
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
    let newAchievements: Achievement[] = [];

    if (!log) {
      const { newLog, newStats } = await db.$transaction(async (tx) => {
        // Create today's log
        const newLog = await tx.log.create({
          data: {
            date: date,
            weight: stats.weight,
            user: { connect: { id: user.id } },
          },
        });

        // delete the logs older than 30 days
        const thirtyDaysAgo = new Date(
          date.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        await tx.log.deleteMany({
          where: {
            date: { lt: thirtyDaysAgo },
            userId: user.id,
          },
        });

        // Update yesterday's log and stats
        const updateLogAndStats = async () => {
          const prev = await tx.log.findFirst({
            where: { date: { lt: date }, userId: user.id },
            orderBy: { date: "desc" },
            select: { id: true, totalCalories: true, date: true, steps: true },
          });

          if (!prev) return null; // When it's the first day of login

          const prevLog = await tx.log.update({
            where: { id: prev.id },
            data: {
              weight: stats.weight,
              totalCalories: {
                increment: stepsToCal(stats.height, stats.weight, prev.steps),
              },
            },
          });

          const diff = getDayDiff(prev.date, date);
          let currentStreak = stats.currentStreak,
            bestStreak = stats.bestStreak;

          // Update streaks
          if (diff > 1) {
            currentStreak = 1; // Streak break
          } else if (diff === 1) {
            currentStreak++;
          }
          bestStreak = Math.max(bestStreak, currentStreak);

          // give achievements for long streaks
          const updatedStats = await tx.stats.update({
            where: { id: stats.id },
            data: {
              totalCalories: { increment: prevLog.totalCalories },
              totalSteps: { increment: prevLog.steps },
              totalWorkoutDays: {
                increment: prevLog.exercises.length > 0 ? 1 : 0,
              },
              currentStreak: currentStreak,
              bestStreak: bestStreak,
            },
          });

          newAchievements = await addAchievements({
            bestStreak,
            currentStreak,
            tx,
            user,
            stats: updatedStats,
          });

          return updatedStats;
        };

        const newStats = await updateLogAndStats();

        return { newLog, newStats };
      });

      log = newLog;
      updatedStats = newStats;
    }

    return { stats: updatedStats ? updatedStats : stats, log, newAchievements };
  } catch (error) {
    console.log("Stats log error", error);
    throw new Error("Something went wrong while fetching stats and logs.");
  }
}
