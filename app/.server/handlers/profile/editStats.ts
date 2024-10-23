import { STATS_CONSTANTS } from "@/lib/constants";
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
        return (
          value >= STATS_CONSTANTS.MIN_AGE && value <= STATS_CONSTANTS.MAX_AGE
        );
      case "height":
        return (
          value >= STATS_CONSTANTS.MIN_HEIGHT &&
          value <= STATS_CONSTANTS.MAX_HEIGHT
        );
      case "weight":
        return (
          value >= STATS_CONSTANTS.MIN_WEIGHT &&
          value <= STATS_CONSTANTS.MAX_WEIGHT
        );
      case "goalWeight":
        return (
          value >= STATS_CONSTANTS.MIN_WEIGHT &&
          value <= STATS_CONSTANTS.MAX_WEIGHT
        );
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
