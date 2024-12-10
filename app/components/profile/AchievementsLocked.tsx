import { getAchievementAwardedForValue } from "@/lib/constants";
import { AchievementIcons, AchievementIcons as icons } from "@/lib/utils";
import { AchievementType } from "@prisma/client";
import ResponsiveDialog from "../custom/ResponsiveDialog";

const AchievementsLocked = ({
  achievements,
}: {
  achievements: {
    value: number;
    type: string;
    achievementType: AchievementType;
    title: string;
    description: string;
  }[];
}) => {
  return (
    <div className="w-full grid grid-cols-1 ssm:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
      {achievements.map((a, ind) => (
        <ResponsiveDialog
          key={`achi-lock-${ind}`}
          trigger={
            <div className="rounded-lg cursor-pointer p-2 sm:p-4 border border-accent/10 bg-secondary flex items-center gap-4 grayscale">
              <span className="text-xl">{icons[a.achievementType]}</span>
              <div className="flex flex-col items-start">
                <h2 className="text-lg sm:text-xl font-bold text-muted-foreground">
                  {a.title}
                </h2>
              </div>
            </div>
          }
          description="This achievement is locked. It will be earned if you complete the challenge."
          title="Viewing Locked Achievement"
        >
          <div className="bg-background p-4 rounded-lg gradient-border mx-4 md:mx-0">
            <div className="py-4 flex items-center justify-center flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold grayscale text-muted-foreground">
                {a.achievementType && AchievementIcons[a.achievementType]}
                {a.title}
              </h2>
              <p className="text-muted-foreground grayscale text-center">
                {a.description}
              </p>
              <p className="font-semibold text-center">
                {
                  // @ts-expect-error
                  getAchievementAwardedForValue(a.type, a.value)
                }
              </p>
            </div>
          </div>
        </ResponsiveDialog>
      ))}
    </div>
  );
};
export default AchievementsLocked;
