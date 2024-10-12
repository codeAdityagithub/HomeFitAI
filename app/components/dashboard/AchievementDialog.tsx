import { LoaderAchievement } from "@/routes/dashboard+/_layout";
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
      //   console.log(achievement);
      setOpen(true);
    }
  }, [achievement]);

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
              {achievement?.title}
            </h2>
            <p className="text-muted-foreground">{achievement?.description}</p>
            <Button
              size="sm"
              variant="secondary"
            >
              Share in Social
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AchievementDialog;
