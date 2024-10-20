import useLongPress from "@/hooks/useLongPress";
import { DailyGoals } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import CountUp from "react-countup";
import { Button } from "../ui/button";

const EditGoalForm = ({
  init,
  min,
  max,
  step,
  type,
  text,
  unit,
}: {
  init: number;
  min: number;
  max: number;
  step: number;
  type: keyof DailyGoals;
  text: string;
  unit: string;
}) => {
  const fetcher = useFetcher<any>();
  const [value, setValue] = useState(init);
  const disabled = fetcher.state !== "idle" || value === init;

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
      { value, _action: "dailyGoals:" + type },
      {
        method: "put",
        encType: "application/json",
      }
    );
  }
  // useEffect(() => {
  //   console.log(fetcher.data);
  //   if (fetcher.data && fetcher.data.message) {
  //     toast({
  //       description: fetcher.data.message,
  //     });
  //   }
  // }, [fetcher.data]);
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 pb-0"
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
      {value === min && (
        <p className="text-xs text-red-500 p-1 rounded text-center">
          {text} less than {min} {unit} is not ideal for health
        </p>
      )}
      {value === max && (
        <p className="text-xs text-red-500 p-1 rounded text-center">
          {text} more than {max} {unit} is not ideal for health
        </p>
      )}
      <Button
        variant="accent"
        disabled={disabled}
        className="w-full mt-4"
      >
        Save
      </Button>
    </form>
  );
};
export default EditGoalForm;
