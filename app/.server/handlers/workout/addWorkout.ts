import { LOG_CONSTANTS } from "@/lib/constants";
import { commitSession, getSession } from "@/services/session.server";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin, stepsToCal } from "@/utils/general";
import { ratelimitId } from "@/utils/ratelimit/ratelimit.server";
import { AchievementType } from "@prisma/client";
import { json } from "@remix-run/node";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  logId: z.string(),
  sets: z
    .array(
      z.object({
        reps: z
          .number()
          .min(LOG_CONSTANTS.exercise.reps.min)
          .max(LOG_CONSTANTS.exercise.reps.max),
        avgRepTime: z
          .number()
          .min(0)
          .max(LOG_CONSTANTS.exercise.max_avgreptime),
        weight: z
          .number()
          .min(1)
          .max(LOG_CONSTANTS.exercise.max_weight)
          .nullable(),
      })
    )
    .max(1),
  duration: z.number().min(0).max(LOG_CONSTANTS.exercise.max_duration),
  exerciseId: z.string(),
  cookie: z.string(),
});

export async function addWorkout(input: z.infer<typeof schema>) {
  const { data, error } = schema.safeParse(input);

  if (error) return json({ error: error.message }, { status: 403 });

  try {
    const { tries_left } = await ratelimitId("workoutAdd", data.userId, 60, 5);

    if (tries_left === 0)
      return json(
        { error: "Too many attempts try again later." },
        { status: 429 }
      );

    const eId = data.exerciseId;

    const exercise = exercises.find((e) => e.id === eId);

    if (
      !exercise ||
      (data.sets.some((s) => s.weight !== null) &&
        exercise.equipment !== "dumbbell")
    )
      return json({ error: "Invalid Exercise Id." }, { status: 404 });

    const stat = await db.stats.findUnique({
      where: { userId: data.userId },
      select: {
        weight: true,
        firstWorkout: true,
        dailyGoals: true,
        height: true,
      },
    });

    if (!stat) return json({ error: "Invalid User." }, { status: 401 });

    const duration = Number((data.duration / 60).toFixed(2));

    const calories = Math.round(
      Number(caloriePerMin(exercise.met, stat.weight)) * duration
    );

    const log = await db.log.findUnique({
      where: { userId: data.userId, id: data.logId },
      select: { exercises: true, totalCalories: true, steps: true },
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
        sets: entry.sets.concat(data.sets),
      };
    } else {
      newExercises.push({
        calories: calories,
        duration: duration,
        name: exercise.name,
        sets: data.sets,
        target: exercise.target,
        time: new Date(),
      });
    }
    // console.log(data.sets);
    const headers = new Headers();
    const session = await getSession(data.cookie);
    let sessionModified = false;

    if (stat.firstWorkout) {
      await db.user.update({
        where: { id: data.userId },
        data: {
          achievements: {
            push: {
              type: AchievementType.FIRST_WORKOUT,
              description: "Completed your first workout detection",
              title: "First Workout",
            },
          },
          stats: {
            update: {
              firstWorkout: false,
            },
          },
        },
      });

      session.flash("achievement", {
        type: AchievementType.FIRST_WORKOUT,
        title: "First Workout",
        description: "Completed your first workout detection",
        shared: false,
        createdAt: Date.now(),
      });

      sessionModified = true;
    }
    const updatedLog = await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: {
        totalCalories: { increment: calories },
        exercises: {
          set: newExercises,
        },
      },
    });

    const stepCal = stepsToCal(stat.height, stat.weight, log.steps);
    if (
      log.totalCalories + stepCal < stat.dailyGoals.calories &&
      updatedLog.totalCalories + stepCal >= stat.dailyGoals.calories
    ) {
      session.flash("goalAchieved", {
        title: "Daily Goal Achieved",
        description: `Congratulations 🎉! You have reached your daily goal for Total Calories of ${stat.dailyGoals.calories} calories`,
      });
      sessionModified = true;
    }
    if (sessionModified) {
      headers.set("Set-Cookie", await commitSession(session));
    }
    return headers;
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to add workout" }, { status: 500 });
  }
}
