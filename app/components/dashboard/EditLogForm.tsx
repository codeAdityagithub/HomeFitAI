import { useFetcher } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const EditLogForm = ({
  init,
  type,
  min,
  max,
  text,
  step,
  logId,
}: {
  logId: string;
  init: number;
  type: "waterIntake" | "sleep" | "steps";
  text: string;
  min: number;
  max: number;
  step: number;
}) => {
  const fetcher = useFetcher();
  const [value, setValue] = useState(init);

  const disabled = fetcher.state !== "idle" || value === init;

  function onClick(adjustment: number) {
    setValue(Math.max(min, Math.min(max, value + adjustment)));
  }
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
          onClick={() => onClick(step * -1)}
          disabled={value <= min || fetcher.state === "submitting"}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-5xl md:text-6xl font-bold tracking-tighter">
            {value}
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
          onClick={() => onClick(step)}
          disabled={value >= max || fetcher.state === "submitting"}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
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
export default EditLogForm;
