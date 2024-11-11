import { MILESTONE_ACHIEVEMENTS, STREAK_ACHIEVEMENTS } from "@/lib/constants";
import { AuthUser } from "@/services/auth.server";
import { Achievement, AchievementType, Stats } from "@prisma/client";

export const addAchievements = async ({
  currentStreak,
  bestStreak,
  tx,
  user,
  stats,
}: {
  bestStreak: number;
  currentStreak: number;
  tx: any;
  user: AuthUser;
  stats: Stats;
}) => {
  let newAchievements: Achievement[] = [];

  let achievementsToAdd: {
    title: string;
    description: string;
    type: AchievementType;
  }[] = [];

  let userAchievements = (
    await tx.user.findUnique({
      where: { id: user.id },
      select: { achievements: true },
    })
  )?.achievements as Achievement[] | undefined;

  if (!userAchievements) return [];

  if (
    currentStreak === bestStreak &&
    Object.keys(STREAK_ACHIEVEMENTS).includes(String(bestStreak))
  ) {
    if (
      !userAchievements.find(
        // @ts-expect-error
        (a) => a.title === STREAK_ACHIEVEMENTS[bestStreak].title
      )
    ) {
      achievementsToAdd.push({
        type: "STREAK",
        // @ts-expect-error
        title: STREAK_ACHIEVEMENTS[bestStreak].title,
        // @ts-expect-error
        description: STREAK_ACHIEVEMENTS[bestStreak].description,
      });
    }
  }
  if (
    stats.totalCalories >= 5000 &&
    !userAchievements.find(
      (a) => a.title === MILESTONE_ACHIEVEMENTS.totalCalories[5000].title
    )
  ) {
    achievementsToAdd.push({
      type: "MILESTONE_REACHED",
      ...MILESTONE_ACHIEVEMENTS.totalCalories[5000],
    });
  }
  if (
    stats.totalCalories >= 10000 &&
    !userAchievements.find(
      (a) => a.title === MILESTONE_ACHIEVEMENTS.totalCalories[10000].title
    )
  ) {
    achievementsToAdd.push({
      type: "MILESTONE_REACHED",
      ...MILESTONE_ACHIEVEMENTS.totalCalories[10000],
    });
  }
  if (
    stats.totalSteps >= 100000 &&
    !userAchievements.find(
      (a) => a.title === MILESTONE_ACHIEVEMENTS.totalSteps[100000].title
    )
  ) {
    achievementsToAdd.push({
      type: "MILESTONE_REACHED",
      ...MILESTONE_ACHIEVEMENTS.totalSteps[100000],
    });
  }
  if (achievementsToAdd.length > 0) {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        achievements: {
          push: achievementsToAdd,
        },
      },
      select: {
        achievements: true,
      },
    });

    newAchievements = updatedUser.achievements.filter(
      (a: Achievement) =>
        achievementsToAdd.find((ach) => ach.title === a.title) !== undefined
    );
  }
  return newAchievements;
};
