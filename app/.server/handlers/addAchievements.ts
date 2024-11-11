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

  for (const [statType, milestones] of Object.entries(MILESTONE_ACHIEVEMENTS)) {
    // @ts-expect-error
    const currentStatValue = stats[statType];

    milestones.forEach(({ value, title, description }) => {
      const alreadyAchieved = userAchievements.some((a) => a.title === title);

      if (currentStatValue >= value && !alreadyAchieved) {
        achievementsToAdd.push({
          type: "MILESTONE_REACHED",
          title,
          description,
        });
      }
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
