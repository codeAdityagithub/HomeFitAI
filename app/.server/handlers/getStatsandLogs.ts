import { STREAK_ACHIEVEMENTS } from "@/lib/constants";
import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { stepsToCal } from "@/utils/general";
import { Achievement, Stats } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { getDayDiff } from "../utils";

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
    let achievement: Achievement | undefined;

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
          if (
            currentStreak === bestStreak &&
            Object.keys(STREAK_ACHIEVEMENTS).includes(String(bestStreak))
          ) {
            const dbuser = await tx.user.findUnique({
              where: { id: user.id },
              select: { achievements: true },
            });

            if (
              dbuser &&
              !dbuser.achievements.find(
                // @ts-expect-error
                (a) => a.title === STREAK_ACHIEVEMENTS[bestStreak].title
              )
            ) {
              const res = await tx.user.update({
                where: { id: user.id },
                data: {
                  achievements: {
                    push: {
                      type: "STREAK",
                      // @ts-expect-error
                      title: STREAK_ACHIEVEMENTS[bestStreak].title,
                      // @ts-expect-error
                      description: STREAK_ACHIEVEMENTS[bestStreak].description,
                    },
                  },
                },
                select: {
                  achievements: true,
                },
              });
              achievement = res.achievements.find(
                // @ts-expect-error
                (a) => a.title === STREAK_ACHIEVEMENTS[bestStreak].title
              );
            }
          }

          const updatedStats = await tx.stats.update({
            where: { id: stats.id },
            data: {
              totalCalories: { increment: prevLog.totalCalories },
              totalSteps: { increment: prevLog.steps },
              currentStreak: currentStreak,
              bestStreak: bestStreak,
            },
          });

          return updatedStats;
        };

        const newStats = await updateLogAndStats();

        return { newLog, newStats };
      });

      log = newLog;
      updatedStats = newStats;
    }

    return { stats: updatedStats ? updatedStats : stats, log, achievement };
  } catch (error) {
    console.log("Stats log error", error);
    throw new Error("Something went wrong while fetching stats and logs.");
  }
}
