import { DAILY_GOALS_LIMITS } from "@/lib/constants";
import db from "@/utils/db.server";
import { ratelimitId } from "@/utils/ratelimit/ratelimit.server";
import { json } from "@remix-run/node";
import { z } from "zod";

const schema = z
  .object({
    goal: z.enum(["steps", "sleep", "water", "calories"]),
    userId: z.string(),
    value: z.number(),
  })
  .refine(({ goal, value }) => {
    return (
      value >= DAILY_GOALS_LIMITS[goal].min &&
      value <= DAILY_GOALS_LIMITS[goal].max
    );
  });

export async function editDailyGoals(input: {
  goal: string;
  userId: string;
  value: number;
}) {
  const { data, error } = schema.safeParse(input);
  if (error) return json({ error: "Invalid Values." }, { status: 403 });
  try {
    const { tries_left } = await ratelimitId("userDG", data.userId, 60, 8);

    if (tries_left === 0)
      return json(
        { error: "Too many attempts try again later." },
        { status: 429 }
      );
    await db.stats.update({
      where: { userId: data.userId },
      data: {
        dailyGoals: {
          update: {
            [data.goal]: data.value,
          },
        },
      },
    });
    return json({ message: "Daily goals updated successfully." });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update daily goals." }, { status: 500 });
  }
}
