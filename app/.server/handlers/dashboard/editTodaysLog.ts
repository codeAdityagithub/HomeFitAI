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
    await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: { [data.type]: data.value },
    });

    return json({
      message: "Log updated successfully.",
      updatedStat: data.type,
    });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
