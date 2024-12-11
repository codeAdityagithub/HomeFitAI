import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import useLongPress from "@/hooks/useLongPress";
import { getImageFromVideoId } from "@/lib/utils";
import { ExerciseDetectionLoader } from "@/routes/dashboard+/workout+/$eId.detect";
import { capitalizeEachWord } from "@/utils/general";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  totalTime: number;
};

const StaticForm = ({ totalTime }: Props) => {
  const { exercise } = useLoaderData<ExerciseDetectionLoader>();
  const { log } = useDashboardLayoutData();
  const fetcher = useFetcher<any>();
  const [value, setValue] = useState(totalTime);
  const min = totalTime,
    max = totalTime * 2;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Submitted data:", sets);
    fetcher.submit(
      {
        sets: [],
        logId: log.id,
        exerciseId: exercise.id,
        duration: value,
      },
      {
        method: "put",
        encType: "application/json",
      }
    );
  };
  function decrement() {
    setValue((prev) => Math.max(min, Math.min(max, prev - 1)));
  }
  function increment() {
    setValue((prev) => Math.max(min, Math.min(max, prev + 1)));
  }
  const decrementProps = useLongPress({ callback: decrement });
  const incrementProps = useLongPress({ callback: increment });

  return (
    <div className="px-4 md:px-0 space-y-4">
      <div className="relative max-w-md mx-auto">
        <img
          src={getImageFromVideoId(exercise.videoId)}
          alt={exercise.name}
          width={100}
          height={60}
          className="object-cover w-full aspect-[2/1] rounded-md border"
        />

        <span className="flex-1 font-medium p-2 bg-black/70 rounded-bl absolute left-0 bottom-0">
          {capitalizeEachWord(exercise.name)}
        </span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          {...decrementProps}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-5xl md:text-6xl font-bold tracking-tighter">
            {value}
          </div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            seconds
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-8 w-8 shrink-0 rounded-full"
          {...incrementProps}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
      {fetcher.data?.error && (
        <div className="px-3 py-2 rounded w-full bg-destructive text-destructive-foreground">
          {fetcher.data.error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="py-2 px-4 bg-primary text-white rounded-md w-full"
        >
          Save
        </Button>
      </form>
    </div>
  );
};
export default StaticForm;
