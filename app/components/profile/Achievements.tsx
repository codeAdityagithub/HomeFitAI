import { useToast } from "@/hooks/use-toast";
import { AchievementIcons, AchievementIcons as icons } from "@/lib/utils";
import { ShareAchievementAction } from "@/routes/api+/achievement.share";
import { Achievement } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Button } from "../ui/button";

const Achievements = ({
  achievements,
}: {
  achievements: SerializeFrom<Achievement>[];
}) => {
  // console.log(achievements);
  const fetcher = useFetcher<ShareAchievementAction>();
  const { toast } = useToast();
  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data]);
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
          description={
            a.shared
              ? "You have shared your achievements on social section."
              : "Share your achievements on social section"
          }
          title={
            a.shared ? "Viewing Achievement Unlocked" : "Share your achievement"
          }
        >
          <div className="bg-background p-4 rounded-lg gradient-border mx-4 md:mx-0">
            <div className="py-4 flex items-center justify-center flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                {a.type && AchievementIcons[a.type]}
                {a.title}
              </h2>
              <p className="text-muted-foreground text-center">
                {a.description}
              </p>
              {!a.shared && (
                <fetcher.Form
                  action="/api/achievement/share"
                  method="POST"
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    name="achievementId"
                    value={a.id}
                    disabled={fetcher.state !== "idle"}
                  >
                    Share in Group
                  </Button>
                </fetcher.Form>
              )}
            </div>
          </div>
        </ResponsiveDialog>
      ))}
    </div>
  );
};
export default Achievements;
