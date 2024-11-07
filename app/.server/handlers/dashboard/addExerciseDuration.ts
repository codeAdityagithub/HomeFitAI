import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin, stepsToCal } from "@/utils/general";
import { json } from "@remix-run/node";
import { z } from "zod";
import { dailyGoalText } from "./editTodaysLog";

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

    const [stat, log] = await Promise.all([
      db.stats.findUnique({
        where: { userId: data.userId },
        select: {
          weight: true,
          dailyGoals: true,
          height: true,
          user: { select: { groupId: true } },
        },
      }),
      db.log.findUnique({
        where: { userId: data.userId, id: data.logId },
        select: { exercises: true },
      }),
    ]);
    if (!stat) return json({ error: "Invalid User." }, { status: 401 });
    if (!log) return json({ error: "Log not found" }, { status: 404 });

    const duration = data.duration;
    const calories = Math.round(
      Number(caloriePerMin(exercise.met, stat.weight)) * duration
    );

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

    const updatedLog = await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: {
        totalCalories: { increment: calories },
        exercises: {
          set: newExercises,
        },
      },
    });

    if (
      stat.user.groupId &&
      stat.dailyGoals.calories <=
        updatedLog.totalCalories +
          Math.floor(stepsToCal(stat.height, stat.weight, updatedLog.steps))
    ) {
      // update group message as dailyGoal Achieved
      const group = await db.group.findUnique({
        where: { id: stat.user.groupId },
        select: { messages: true },
      });
      if (!group)
        return json(
          { error: "Group not found", updatedStat: "totalCalories" },
          { status: 200 }
        );

      const alreadyMessage = group.messages.find(
        (m) =>
          m.from === data.userId &&
          m.content.type === "DAILY_GOAL" &&
          m.content.title === dailyGoalText.totalCalories.title
      );

      if (!alreadyMessage) {
        // there doesnt exists a message already for daily goal
        await db.group.update({
          where: { id: stat.user.groupId },
          data: {
            messages: {
              push: {
                from: data.userId,
                content: {
                  type: "DAILY_GOAL",
                  title: dailyGoalText.totalCalories.title,
                  description: `Congratulations! You have successfully met your daily goal of Total Calories Burned of ${stat.dailyGoals.calories} Kcal`,
                },
              },
            },
          },
        });
      } else {
        await db.group.update({
          where: { id: stat.user.groupId },
          data: {
            messages: {
              push: {
                from: data.userId,
                content: {
                  type: "DAILY_GOAL",
                  title: dailyGoalText.totalCalories.title,
                  description: `Congratulations! You have successfully met your daily goal of Total Calories Burned of ${stat.dailyGoals.calories} Kcal`,
                },
              },
              deleteMany: {
                where: {
                  id: alreadyMessage.id,
                },
              },
            },
          },
        });
      }
    }

    return json({
      message: "Calories updated successfully.",
      updatedStat: "totalCalories",
    });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
