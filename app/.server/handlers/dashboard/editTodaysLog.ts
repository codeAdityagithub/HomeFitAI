import { LOG_CONSTANTS } from "@/lib/constants";
import db from "@/utils/db.server";
import { stepsToCal } from "@/utils/general";
import { DailyGoals, GroupMessageContent } from "@prisma/client";
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

export const dailyGoalText: Record<
  string,
  { key: keyof DailyGoals; title: string; unit: string }
> = {
  sleep: {
    key: "sleep",
    title: "You've Achieved Your daily Sleep Goal!",
    unit: "hr",
  },
  steps: {
    key: "steps",
    title: "Great Job on Reaching Your Steps Goal!",
    unit: "steps",
  },
  waterIntake: {
    key: "water",
    title: "Hydration Goal Successfully Met!",
    unit: "glass",
  },
  totalCalories: {
    key: "calories",
    title: "Daily Calorie Goal Successfully Met!",
    unit: "Kcal",
  },
};

export async function editTodaysLog(input: z.infer<typeof schema>) {
  const { data, error } = schema.safeParse(input);
  if (error) return json({ error: error.message }, { status: 403 });
  try {
    const updatedLog = await db.log.update({
      where: { userId: data.userId, id: data.logId },
      data: { [data.type]: data.value },
    });
    const stats = await db.stats.findUnique({
      where: { userId: data.userId },
      select: {
        dailyGoals: true,
        height: true,
        weight: true,
        user: { select: { groupId: true } },
      },
    });

    if (!stats) return json({ error: "Invalid User." }, { status: 401 });

    if (
      stats.user.groupId &&
      stats.dailyGoals[dailyGoalText[data.type].key] <= updatedLog[data.type]
    ) {
      // update group message as dailyGoal Achieved
      const group = await db.group.findUnique({
        where: { id: stats.user.groupId },
        select: { messages: true },
      });
      if (!group)
        return json(
          { error: "Group not found", updatedStat: data.type },
          { status: 200 }
        );

      const alreadyMessage = group.messages.find(
        (m) =>
          m.from === data.userId &&
          m.content.type === "DAILY_GOAL" &&
          m.content.title === dailyGoalText[data.type].title
      );

      const newMessages: { content: GroupMessageContent; from: string }[] = [];
      const deleteIds: string[] = [];

      // is there is no message for total calorie daily goal then check if steps calories add up to it
      if (
        data.type === "steps" &&
        stats.dailyGoals.calories <=
          updatedLog.totalCalories +
            Math.floor(stepsToCal(stats.height, stats.weight, updatedLog.steps))
      ) {
        // console.log("calories ");
        const prevCalMessage = group.messages.find(
          (m) =>
            m.from === data.userId &&
            m.content.type === "DAILY_GOAL" &&
            m.content.title === dailyGoalText.totalCalories.title
        );
        if (!prevCalMessage) {
          newMessages.push({
            from: data.userId,
            content: {
              type: "DAILY_GOAL",
              title: dailyGoalText.totalCalories.title,
              description: `Congratulations! You have successfully met your daily goal of Total Calories Burned of ${stats.dailyGoals.calories} Kcal`,
            },
          });
        } else {
          deleteIds.push(prevCalMessage.id);
          newMessages.push({
            from: data.userId,
            content: {
              type: "DAILY_GOAL",
              title: dailyGoalText.totalCalories.title,
              description: `Congratulations! You have successfully met your daily goal of Total Calories Burned of ${stats.dailyGoals.calories} Kcal`,
            },
          });
        }
      }

      if (!alreadyMessage) {
        // there doesnt exists a message already for daily goal
        newMessages.push({
          from: data.userId,
          content: {
            type: "DAILY_GOAL",
            title: dailyGoalText[data.type].title,
            description: `Congratulations! You have successfully met your daily goal of ${
              dailyGoalText[data.type].key
            } of ${stats.dailyGoals[dailyGoalText[data.type].key]} ${
              dailyGoalText[data.type].unit
            }`,
          },
        });
      } else {
        deleteIds.push(alreadyMessage.id);
        newMessages.push({
          from: data.userId,
          content: {
            type: "DAILY_GOAL",
            title: dailyGoalText[data.type].title,
            description: `Congratulations! You have successfully met your daily goal of ${
              dailyGoalText[data.type].key
            } of ${stats.dailyGoals[dailyGoalText[data.type].key]} ${
              dailyGoalText[data.type].unit
            }`,
          },
        });
      }

      if (newMessages.length > 0) {
        // there doesnt exists a message already for daily goal

        await db.group.update({
          where: { id: stats.user.groupId },
          data: {
            messages: {
              push: newMessages,
              deleteMany: {
                where: {
                  id: { in: deleteIds },
                },
              },
            },
          },
        });
      }
    }
    return json({
      message: "Log updated successfully.",
      updatedStat: data.type,
    });
  } catch (error) {
    console.log(error);
    return json({ error: "Failed to update log." }, { status: 500 });
  }
}
