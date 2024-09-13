import { Achievement, type AchievementType } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

const icons = {
  FIRST_WORKOUT: "🏅",
  GOAL_ACHIEVED: "🎖",
  MILESTONE_REACHED: "🎯",
  PERSONAL_BEST: "🏆",
  STREAK: "🔥",
};

const Achievements = ({
  achievements,
}: {
  achievements: SerializeFrom<Achievement>[];
}) => {
  achievements = [
    {
      title: "First Workout",
      description: "Completed your first workout session!",
      type: "FIRST_WORKOUT",
      createdAt: "2024-08-18",
    },
    {
      title: "100 Workouts",
      description: "Completed 100 workouts!",
      type: "GOAL_ACHIEVED",
      createdAt: "2024-08-18",
    },
    {
      title: "30-day Streak",
      description: "Successfully completed the 30-day fitness challenge!",
      type: "MILESTONE_REACHED",
      createdAt: "2024-08-18",
    },
  ];
  return (
    <div className="w-full grid grid-cols-1 xs:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
      {achievements.map((a, ind) => (
        <div
          key={`achi-${ind}`}
          className="rounded-lg p-2 sm:p-4 border border-accent/10 bg-secondary flex items-center gap-4"
        >
          <span className="text-xl">{icons[a.type]}</span>
          <div className="flex flex-col items-start">
            <h2 className="text-lg sm:text-xl font-bold">{a.title}</h2>
            <small className="text-muted-foreground">
              {new Date(a.createdAt).toDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Achievements;
