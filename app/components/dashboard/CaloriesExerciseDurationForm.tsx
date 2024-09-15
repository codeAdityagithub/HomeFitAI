import { useFetcher } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const CaloriesExerciseDurationForm = ({
  logId,
  exerciseId,
  caloriePerMin,
}: {
  logId: string;
  exerciseId: string;
  caloriePerMin: number;
}) => {
  const fetcher = useFetcher({ key: "totalCalories-fetcher" });
  const [value, setValue] = useState(1);

  const disabled = fetcher.state !== "idle";
  const min = 0.5,
    max = 15;
  function onClick(adjustment: number) {
    setValue(Math.max(min, Math.min(max, value + adjustment)));
  }
  function handleSubmit(e: any) {
    e.preventDefault();

    fetcher.submit(
      { duration: value, _action: "totalCalories", logId, exerciseId },

      {
        method: "put",
        action: "/dashboard",
        encType: "application/json",
      }
    );
  }

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
          onClick={() => onClick(-0.5)}
          disabled={value <= min || fetcher.state === "submitting"}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-5xl md:text-6xl font-bold tracking-tighter">
            {value === 0 ? value : value.toFixed(1)}
          </div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            Minutes
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(0.5)}
          disabled={value >= max || fetcher.state === "submitting"}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
      <div className="mt-4 text-center">
        Total Calores Burned:{" "}
        <span className="text-accent font-semibold">
          {(caloriePerMin * value).toFixed(1)}
        </span>
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
export default CaloriesExerciseDurationForm;
