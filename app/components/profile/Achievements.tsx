import { AchievementIcons, AchievementIcons as icons } from "@/lib/utils";
import { Achievement } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Button } from "../ui/button";

const Achievements = ({
  achievements,
}: {
  achievements: SerializeFrom<Achievement>[];
}) => {
  return (
    <div className="w-full grid grid-cols-1 ssm:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
      {achievements.map((a, ind) => (
        <ResponsiveDialog
          key={`achi-${ind}`}
          trigger={
            <div className="rounded-lg cursor-pointer p-2 sm:p-4 border border-accent/10 bg-secondary flex items-center gap-4">
              <span className="text-xl">{icons[a.type]}</span>
              <div className="flex flex-col items-start">
                <h2 className="text-lg sm:text-xl font-bold">{a.title}</h2>
                <small className="text-muted-foreground">
                  {new Date(a.createdAt).toDateString()}
                </small>
              </div>
            </div>
          }
          description="Share your achievements on social section"
          title="Share your achievement"
        >
          <div className="bg-background p-4 rounded-lg gradient-border mx-4 md:mx-0">
            <div className="py-4 flex items-center justify-center flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                {a?.type && AchievementIcons[a?.type]}
                {a?.title}
              </h2>
              <p className="text-muted-foreground">{a?.description}</p>
              <Button
                size="sm"
                variant="secondary"
              >
                Share in Social
              </Button>
            </div>
          </div>
        </ResponsiveDialog>
      ))}
      {achievements.length === 0 && (
        <p className="text-muted-foreground">No achievements yet</p>
      )}
    </div>
  );
};
export default Achievements;
