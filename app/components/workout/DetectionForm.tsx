import { getImageFromVideoId } from "@/lib/utils";
import { ExerciseDetectionLoader } from "@/routes/dashboard+/workout+/$eId.detect";
import { Exercise } from "@/utils/exercises/exercises.server";
import { capitalizeEachWord } from "@/utils/general";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "../ui/button";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { useEffect } from "react";

type Props =
  | {
      totalTime: number;
      reps: number;
    }
  | {
      totalTime: number;
      reps: { left: number; right: number };
    };

const DetectionForm = ({ totalTime, reps }: Props) => {
  const total_reps =
    typeof reps === "number" ? reps : (reps.left + reps.right) / 2;
  const avg_rep_time = Number((totalTime / total_reps).toFixed(2));
  const { exercise } = useLoaderData<ExerciseDetectionLoader>();
  const { log } = useDashboardLayoutData();
  const fetcher = useFetcher();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Submitted data:", sets);
    fetcher.submit(
      {
        sets: [
          {
            reps:
              typeof reps === "number"
                ? reps
                : Math.round((reps.left + reps.right) / 2),
            avgRepTime: avg_rep_time,
          },
        ],
        logId: log.id,
        exerciseId: exercise.id,
        duration: totalTime,
      },
      {
        method: "put",
        encType: "application/json",
      }
    );
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
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 max-w-md mx-auto">
        <h2 className="text-base xs:text-lg font-semibold grid grid-cols-2 xs:block">
          <span className="text-muted-foreground">Total Time </span>:{" "}
          {totalTime} secs
        </h2>
        <div className="text-base xs:text-lg font-semibold grid grid-cols-2 grid-rows-1">
          <span className="text-muted-foreground">Total Reps </span>{" "}
          {typeof reps === "number" ? (
            reps
          ) : (
            <span className="flex items-center gap-1">
              :
              <span className="flex items-center gap-1">
                <span className="text-sm">L -</span> <p>{reps.left}</p>
              </span>
              ,
              <span className="flex items-center gap-1">
                <span className="text-sm">R -</span> <p>{reps.right}</p>
              </span>
            </span>
          )}
        </div>

        <h3 className="text-base xs:text-lg font-semibold grid grid-cols-2 xs:block">
          <span className="text-muted-foreground">Avg. Rep Time </span>:{" "}
          {avg_rep_time} secs
        </h3>
      </div>
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
