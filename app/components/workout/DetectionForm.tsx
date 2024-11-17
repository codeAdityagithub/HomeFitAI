import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { LOG_CONSTANTS } from "@/lib/constants";
import { cn, combineRepsIntoOne, getImageFromVideoId } from "@/lib/utils";
import { ExerciseDetectionLoader } from "@/routes/dashboard+/workout+/$eId.detect";
import { capitalizeEachWord } from "@/utils/general";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

type Props =
  | {
      totalTime: number;
      reps: number;
    }
  | {
      totalTime: number;
      reps: { left: number; right: number };
    };

const RepControl = ({
  value,
  min,
  max,
  text,
  disabled,
  decrement,
  increment,
}: {
  value: number;
  min: number;
  max: number;
  text: string;
  disabled: boolean;
  decrement: () => void;
  increment: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2",
        text.endsWith("t") ? "" : "col-span-full"
      )}
    >
      <Button
        variant="outline"
        type="button"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-full"
        onClick={() => {
          if (value > min) decrement();
        }}
        disabled={value <= min || disabled}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease</span>
      </Button>
      <div className="flex-1 text-center">
        <div className="text-3xl md:text-4xl font-bold tracking-tighter">
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
        onClick={() => {
          if (value < max) increment();
        }}
        disabled={value >= max || disabled}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
};

const DetectionForm = ({ totalTime, reps }: Props) => {
  const [finalReps, setFinalReps] = useState(
    typeof reps === "number" ? reps : { left: reps.left, right: reps.right }
  );

  useEffect(() => {
    setFinalReps(
      typeof reps === "number" ? reps : { left: reps.left, right: reps.right }
    );
  }, [reps]);

  const total_reps = useMemo(
    () => (typeof reps === "number" ? reps : (reps.left + reps.right) / 2),
    [reps]
  );
  const avg_rep_time = useMemo(
    () => Number((totalTime / total_reps).toFixed(1)),
    [total_reps, totalTime]
  );

  const [finalTime, setFinalTime] = useState(totalTime);
  useEffect(() => {
    if (typeof finalReps === "number") {
      setFinalTime(Number((finalReps * avg_rep_time).toFixed(1)));
    } else {
      setFinalTime(
        Number(
          (((finalReps.left + finalReps.right) / 2) * avg_rep_time).toFixed(1)
        )
      );
    }
  }, [finalReps, avg_rep_time]);

  const { exercise } = useLoaderData<ExerciseDetectionLoader>();

  const { log } = useDashboardLayoutData();

  const fetcher = useFetcher<any>();
  const disabled = fetcher.state !== "idle";

  const [weight, setWeight] = useState(5);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Submitted data:", sets);
    fetcher.submit(
      {
        sets: [
          {
            reps:
              typeof finalReps === "number"
                ? finalReps
                : combineRepsIntoOne(finalReps),
            avgRepTime: avg_rep_time,
            weight: exercise.equipment === "dumbbell" ? weight : null,
          },
        ],
        logId: log.id,
        exerciseId: exercise.id,
        duration: finalTime,
      },
      {
        method: "put",
        encType: "application/json",
      }
    );
  };

  const increment = (type?: "left" | "right") => {
    setFinalReps((prev) => {
      if (typeof prev === "number") {
        return prev + 1;
      }
      if (type === "left")
        return {
          ...prev,
          left: prev.left + 1,
        };
      if (type === "right")
        return {
          ...prev,
          right: prev.right + 1,
        };
      return prev;
    });
  };
  const decrement = (type?: "left" | "right") => {
    setFinalReps((prev) => {
      if (typeof prev === "number") {
        return prev - 1;
      }
      if (type === "left")
        return {
          ...prev,
          left: prev.left - 1,
        };
      if (type === "right")
        return {
          ...prev,
          right: prev.right - 1,
        };
      return prev;
    });
  };
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
      <div className="grid grid-cols-1 xs:grid-cols-2  gap-3 max-w-md mx-auto">
        {typeof finalReps === "number" && typeof reps === "number" ? (
          <RepControl
            value={finalReps}
            min={Math.max(reps - 3, LOG_CONSTANTS.exercise.reps.min)}
            max={Math.min(reps + 3, LOG_CONSTANTS.exercise.reps.max)}
            text="reps"
            disabled={disabled}
            decrement={() => {
              setFinalReps(finalReps - 1);
            }}
            increment={() => {
              setFinalReps(finalReps + 1);
            }}
          />
        ) : (
          typeof reps === "object" &&
          typeof finalReps === "object" && (
            <>
              <RepControl
                value={finalReps.left}
                min={Math.max(reps.left - 3, LOG_CONSTANTS.exercise.reps.min)}
                max={Math.min(reps.left + 3, LOG_CONSTANTS.exercise.reps.max)}
                text="reps left"
                disabled={false}
                decrement={() => decrement("left")}
                increment={() => increment("left")}
              />
              <RepControl
                value={finalReps.right}
                min={Math.max(reps.right - 3, LOG_CONSTANTS.exercise.reps.min)}
                max={Math.min(reps.right + 3, LOG_CONSTANTS.exercise.reps.max)}
                text="reps right"
                disabled={false}
                decrement={() => decrement("right")}
                increment={() => increment("right")}
              />
            </>
          )
        )}
        {exercise.equipment === "dumbbell" && (
          <RepControl
            value={weight}
            min={1}
            max={LOG_CONSTANTS.exercise.max_weight}
            text="dumbell weight in KG"
            disabled={disabled}
            decrement={() => {
              setWeight(weight - 1);
            }}
            increment={() => {
              setWeight(weight + 1);
            }}
          />
        )}
        <h3 className="text-base xs:text-lg font-semibold col-span-full grid grid-cols-3 place-items-center">
          <span className="text-muted-foreground place-self-start min-w-fit">
            Total Time{" "}
          </span>
          : <span className="place-self-end">{finalTime} secs</span>
        </h3>

        <h3 className="text-base xs:text-lg font-semibold col-span-full grid grid-cols-3 place-items-center">
          <span className="text-muted-foreground place-self-start min-w-fit">
            Avg. Rep Time{" "}
          </span>
          : <span className="place-self-end">{avg_rep_time} secs</span>
        </h3>
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
export default DetectionForm;
