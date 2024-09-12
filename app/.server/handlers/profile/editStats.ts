import db from "@/utils/db.server";
import { json } from "@remix-run/node";
import { z } from "zod";

const schema = z
  .object({
    stat: z.enum(["age", "height", "weight", "goalWeight"]),
    userId: z.string(),
    value: z.number(),
  })
  .refine(({ stat, value }) => {
    switch (stat) {
      case "age":
        return value >= 5 && value <= 100;
      case "height":
        return value >= 100 && value <= 251;
      case "weight":
        return value >= 30 && value <= 200;
      case "goalWeight":
        return value >= 30 && value <= 200;
      default:
        return false;
    }
  });

export async function editStats(input: {
  stat: string;
  userId: string;
  value: number;
}) {
  const { data, error } = schema.safeParse(input);
  if (error) return json({ error: "Invalid Values." }, { status: 403 });
  try {
    await db.stats.update({
      where: { userId: data.userId },
      data: { [data.stat]: data.value },
    });
    return json({ message: "Stats updated successfully." });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update stats." }, { status: 500 });
  }
}
