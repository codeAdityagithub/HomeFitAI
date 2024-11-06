import { useToast } from "@/hooks/use-toast";
import { AchievementIcons } from "@/lib/utils";
import { ShareAchievementAction } from "@/routes/api+/achievement.share";
import { LoaderAchievement } from "@/routes/dashboard+/_layout";
import { useFetcher } from "@remix-run/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AchievementDialog = ({
  achievement,
}: {
  achievement: LoaderAchievement;
}) => {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (achievement) {
      setOpen(true);
    }
  }, [achievement]);

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
      onOpenChange={setOpen}
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
