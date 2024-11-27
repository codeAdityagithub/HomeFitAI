import { useToast } from "@/hooks/use-toast";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import useLongPress from "@/hooks/useLongPress";
import { DashboardAction } from "@/routes/dashboard+/_layout";
import { stepsToCal } from "@/utils/general";
import { useFetcher } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { Button } from "../ui/button";
import { goalType } from "./TodaysLogs";

const EditLogForm = ({
  init,
  type,
  min,
  max,
  text,
  step,
  logId,
  unit,
}: {
  logId: string;
  init: number;
  type: "waterIntake" | "sleep" | "steps";
  text: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}) => {
  const fetcher = useFetcher<DashboardAction>();
  const [value, setValue] = useState(init);
  const { stats, log } = useDashboardLayoutData();
  const { toast } = useToast();
  const disabled = fetcher.state !== "idle" || value === init;

  const curval = useRef(log[type]);
  const prev_cal_val = useRef(
    type === "steps"
      ? stepsToCal(stats.height, stats.weight, log.steps) + log.totalCalories
      : Infinity
  );
  function decrement() {
    setValue((prev) => Math.max(min, Math.min(max, prev - step)));
  }
  function increment() {
    setValue((prev) => Math.max(min, Math.min(max, prev + step)));
  }
  const decrementProps = useLongPress({ callback: decrement });
  const incrementProps = useLongPress({ callback: increment });

  function handleSubmit(e: any) {
    e.preventDefault();

    fetcher.submit(
      { value, _action: type, logId },
      {
        method: "put",
        action: "/dashboard",
        encType: "application/json",
      }
    );
  }
  useEffect(() => {
    let description = "";
    if (
      // @ts-expect-error
      fetcher.data?.updatedStat &&
      // @ts-expect-error
      fetcher.data.updatedStat === type &&
      curval.current < stats.dailyGoals[goalType[type]] &&
      log[type] >= stats.dailyGoals[goalType[type]]
    ) {
      description += `Congratulations 🎉! You have reached your daily goal for ${text} of ${
        stats.dailyGoals[goalType[type]]
      } ${unit}.`;
      toast({
        title: "Daily Goal reached.",
        description,
        variant: "success",
      });
    }
    if (
      // @ts-expect-error
      fetcher.data?.updatedStat === "steps" &&
      prev_cal_val.current < stats.dailyGoals.calories &&
      log.totalCalories +
        Math.floor(stepsToCal(stats.height, stats.weight, log.steps)) >=
        stats.dailyGoals.calories
    ) {
      description += `\nCongratulations 🎉! You have reached your daily goal for Total Calories of ${stats.dailyGoals.calories} Kcal.`;
      toast({
        title: "Daily Goal reached.",
        description,
        variant: "success",
      });
    }
    // @ts-expect-error
    if (fetcher.data?.error) {
      toast({
        // @ts-expect-error
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data, stats, log]);

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-0 p-4"
    >
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          {...decrementProps}
          disabled={value <= min || fetcher.state === "submitting"}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-5xl md:text-6xl font-bold tracking-tighter">
            <CountUp
              start={value}
              end={value}
              decimals={type === "sleep" ? 1 : 0}
            />
          </div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            {text}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-8 w-8 shrink-0 rounded-full"
          {...incrementProps}
          disabled={value >= max || fetcher.state === "submitting"}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
      <Button
        variant="accent"
        disabled={disabled}
        className="w-full mt-2"
      >
        Save
      </Button>
    </form>
  );
};
export default EditLogForm;
