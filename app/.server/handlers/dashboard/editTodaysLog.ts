import { LOG_CONSTANTS } from "@/lib/constants";
import db from "@/utils/db.server";
import { json } from "@remix-run/node";
import { z } from "zod";

const schema = z
  .object({
    type: z.enum(["sleep", "steps", "waterIntake"]),
    userId: z.string(),
    logId: z.string(),
    value: z.number(),
  })
  .refine(({ type, value }) => {
    switch (type) {
      case "sleep":
        return (
          value >= LOG_CONSTANTS.sleep.min && value <= LOG_CONSTANTS.sleep.max
        );
      case "steps":
        return (
          value >= LOG_CONSTANTS.steps.min && value <= LOG_CONSTANTS.steps.max
        );
      case "waterIntake":
        return (
          value >= LOG_CONSTANTS.waterIntake.min &&
          value <= LOG_CONSTANTS.waterIntake.max
        );
      default:
        return false;
    }
  });

export async function editTodaysLog(input: z.infer<typeof schema>) {
  const { data, error } = schema.safeParse(input);
  if (error) return json({ error: error.message }, { status: 403 });
  try {
    const updatedLog = await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: { [data.type]: data.value },
    });
    // const stats = await db.stats.findUnique({
    //   where: { userId: data.userId },
    //   select: { dailyGoals: true },
    // });

    // if (!stats) return json({ error: "Invalid User." }, { status: 401 });

    // switch (data.type) {
    //   case "sleep":
    //     if (stats.dailyGoals.sleep < updatedLog.sleep)
    return json({
      message: "Log updated successfully.",
      updatedStat: data.type,
    });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
