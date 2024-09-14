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
        return value >= 0 && value <= 16;
      case "steps":
        return value >= 0 && value <= 25000;
      case "waterIntake":
        return value >= 0 && value <= 20;
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

    return json({ message: "Log updated successfully." });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
