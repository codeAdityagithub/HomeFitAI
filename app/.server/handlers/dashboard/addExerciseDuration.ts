import { getDurationFromSets } from "@/.server/utils";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin } from "@/utils/general";
import { json } from "@remix-run/node";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  logId: z.string(),
  duration: z.number().min(0.5).max(15),

  exerciseId: z.string(),
});

export async function addExercseDuration(input: z.infer<typeof schema>) {
  const { data, error } = schema.safeParse(input);
  if (error) return json({ error: error.message }, { status: 403 });
  try {
    const eId = data.exerciseId;
    const exercise = exercises.find((e) => e.id === eId);
    if (!exercise)
      return json({ error: "Invalid Exercise Id." }, { status: 404 });

    const stat = await db.stats.findUnique({
      where: { userId: data.userId },
      select: { weight: true },
    });
    if (!stat) return json({ error: "Invalid User." }, { status: 401 });

    const duration = data.duration;
    const calories = Math.round(
      Number(caloriePerMin(exercise.met, stat.weight)) * duration
    );

    const log = await db.log.findUnique({
      where: { userId: data.userId, id: data.logId },
      select: { exercises: true },
    });
    if (!log) return json({ error: "Log not found" }, { status: 404 });

    let newExercises = log.exercises;
    const index = newExercises.findIndex((e) => e.name === exercise.name);
    if (index != -1) {
      // update the existing exercise
      const entry = newExercises[index];
      newExercises[index] = {
        ...entry,
        calories: entry.calories + calories,
        duration: entry.duration + duration,
        sets: [],
      };
    } else {
      newExercises.push({
        calories: calories,
        duration: duration,
        name: exercise.name,
        sets: [],
        target: exercise.target,
        time: new Date(),
      });
    }

    await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: {
        totalCalories: { increment: calories },
        exercises: {
          set: newExercises,
        },
      },
    });

    return json({
      message: "Calories updated successfully.",
      updatedStat: "totalCalories",
    });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
