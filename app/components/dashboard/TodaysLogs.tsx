import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { LOG_CONSTANTS } from "@/lib/constants";
import { stepsToCal } from "@/utils/general";
import { DailyGoals, Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Droplet, Footprints, MoonStar, SquareActivity } from "lucide-react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import EditCaloriesForm from "./EditCaloriesForm";
import EditLogForm from "./EditLogForm";

const elems = [
  {
    type: "waterIntake",
    icon: (
      <Droplet
        size={30}
        className="text-blue-500"
      />
    ),
    text: "Water Intake",
    unit: "glasses",
    min: LOG_CONSTANTS.waterIntake.min,
    max: LOG_CONSTANTS.waterIntake.max,
    step: 1,
  },
  {
    type: "sleep",
    icon: (
      <MoonStar
        size={30}
        className="text-violet-600"
      />
    ),
    text: "Sleep",
    unit: "hours",
    min: LOG_CONSTANTS.sleep.min,
    max: LOG_CONSTANTS.sleep.max,
    step: 0.5,
  },
  {
    type: "steps",
    icon: (
      <Footprints
        size={30}
        className="text-primary"
      />
    ),
    text: "Steps",
    unit: "steps",
    min: LOG_CONSTANTS.steps.min,
    max: LOG_CONSTANTS.steps.max,
    step: 500,
  },
  {
    type: "totalCalories",
    icon: (
      <SquareActivity
        className="text-orange-500"
        size={30}
      />
    ),
    text: "Calories Burned",
    unit: "calories",
  },
];

export const goalType: Record<string, keyof DailyGoals> = {
  steps: "steps",
  sleep: "sleep",
  waterIntake: "water",
  totalCalories: "calories",
};

const TodaysLogs = ({ log }: { log: SerializeFrom<Log> }) => {
  const { stats } = useDashboardLayoutData();
  // const { toast } = useToast();
  // const stepsachieved = log.steps >= stats.dailyGoals.steps;
  // const sleepachieved = log.sleep >= stats.dailyGoals.sleep;
  // const waterachieved = log.waterIntake >= stats.dailyGoals.water;
  // const calachieved = log.totalCalories >= stats.dailyGoals.calories;

  // useEffect(() => {
  //   if (stepsachieved || sleepachieved || waterachieved || calachieved) {
  //     console.log("hi");
  //     toast({
  //       title: "Daily Goal Achieved",
  //       description: `You have reached your daily goal. Keep up the good work!`,
  //       variant: "success",
  //     });
  //   }
  // }, [stepsachieved, sleepachieved, waterachieved, calachieved]);
  return (
    <div className="w-full grid grid-cols-1 ssm:grid-cols-2 xl:grid-cols-4 items-stretch gap-4">
      {elems.map((e) => (
        <ResponsiveDialog
          key={e.type + "dialog"}
          title={`Edit ${e.text}`}
          description={
            e.type === "totalCalories"
              ? "Its recommended to track exercises for much better accuracy."
              : `Update your ${e.text} to keep progress consistent.`
          }
          trigger={
            <div className="rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer flex items-center gap-4">
              <span>{e.icon}</span>
              <div className="flex flex-col items-start">
                <h2 className="text-xl xs:text-2xl font-bold">
                  {e.type === "totalCalories"
                    ? log[e.type] +
                      Math.floor(
                        stepsToCal(stats.height, stats.weight, log.steps)
                      )
                    : // @ts-expect-error
                      log[e.type]}
                  <span className="text-foreground/60 text-sm">
                    {" "}
                    / {stats.dailyGoals[goalType[e.type]]}
                  </span>
                  <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
                    {e.unit}
                  </small>
                </h2>

                <small className="text-muted-foreground">{e.text}</small>
              </div>
            </div>
          }
        >
          {e.type !== "totalCalories" ? (
            <EditLogForm
              logId={log.id}
              init={
                // @ts-expect-error
                log[e.type]
              }
              text={e.text}
              type={e.type as "waterIntake" | "sleep" | "steps"}
              min={e.min!}
              max={e.max!}
              step={e.step!}
              unit={e.unit}
            />
          ) : (
            <EditCaloriesForm logId={log.id} />
          )}
        </ResponsiveDialog>
      ))}
    </div>
  );
};
export default TodaysLogs;
