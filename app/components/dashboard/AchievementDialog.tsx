import { useToast } from "@/hooks/use-toast";
import { AchievementIcons } from "@/lib/utils";
import { ShareAchievementAction } from "@/routes/api+/achievement.share";
import { LoaderAchievement } from "@/routes/dashboard+/_layout";
import { SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AchievementDialog = ({
  achievements,
}: {
  achievements: SerializeFrom<LoaderAchievement>[];
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (achievements.length > 0) {
      setOpen(true);
    }
  }, [achievements]);
  // console.log(achievements);
  const [current, setCurrent] = useState(0);
  const achievement = achievements[current];

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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setCurrent(0);
        } else if (current < achievements.length - 1) {
          setCurrent((prev) => prev + 1);
          setOpen(false);
          setTimeout(() => setOpen(true), 150);
        } else {
          setOpen(false);
        }
      }}
    >
      <DialogTrigger className="hidden"></DialogTrigger>
      <DialogContent className="p-0 border-none sm:max-w-[425px] gradient-border">
        <div className="bg-background p-4 rounded-sm">
          <DialogHeader>
            <DialogTitle className="tracking-wider font-mono">
              Achievement Unlocked!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex items-center justify-center flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              {achievement?.type && AchievementIcons[achievement?.type]}
              {achievement?.title}
            </h2>
            <p className="text-muted-foreground">{achievement?.description}</p>
            {achievement && !achievement.shared && (
              <fetcher.Form
                action="/api/achievement/share"
                method="POST"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  name="achievementId"
                  value={achievement.id}
                  onClick={() => setOpen(false)}
                  disabled={fetcher.state !== "idle"}
                >
                  Share in Group
                </Button>
              </fetcher.Form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AchievementDialog;
