import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
export async function getStatsandLogs(user: AuthUser) {
  const stats = await db.stats.findUnique({ where: { userId: user.id } });

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
    const log = await db.log.upsert({
      where: { date_userId: { date: date, userId: user.id } },
      create: {
        date: date,
        weight: stats.weight,
        user: { connect: { id: user.id } },
      },
      update: {},
    });

    return { stats, log };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
