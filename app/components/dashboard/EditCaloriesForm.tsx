import { useToast } from "@/hooks/use-toast";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { caloriePerMin, capitalizeEachWord, stepsToCal } from "@/utils/general";
import { resetFetcher } from "@/utils/resetFetcher";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CaloriesExerciseDurationForm from "./CaloriesExerciseDurationForm";
import CaloriesExerciseSelectForm from "./CaloriesExerciseSelectForm";

type Exercise = {
  name: string;
  id: string;
  imageUrl: string;
  met: number;
  type: "duration" | "sets";
};

const EditCaloriesForm = ({ logId }: { logId: string }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const { stats, log } = useDashboardLayoutData();
  const fetcher = useFetcher<any>({ key: "totalCalories-fetcher" });
  const [message, setMessage] = useState("");

  const { toast } = useToast();
  const curval = useRef(
    log.totalCalories + stepsToCal(stats.height, stats.weight, log.steps)
  );

  useEffect(() => {
    if (fetcher.data?.message) {
      setSelected(null);
      setInput("");
      setMessage(fetcher.data.message);
      setTimeout(() => setMessage(""), 2000);
      resetFetcher(fetcher);
    }
    if (
      fetcher.data &&
      fetcher.data.updatedStat &&
      fetcher.data.updatedStat === "totalCalories" &&
      curval.current < stats.dailyGoals.calories &&
      log.totalCalories + stepsToCal(stats.height, stats.weight, log.steps) >=
        stats.dailyGoals.calories
    ) {
      toast({
        title: "Daily Goal reached.",
        description: `You have reached your daily goal for Total Calories of ${stats.dailyGoals.calories} Kcal.`,
        variant: "success",
      });
    }
  }, [fetcher.data, stats, log]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`/api/exercises`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setExercises(data.exercises));

    return () => {
      abortController.abort("Fetch abort");
    };
  }, []);

  const filtered = useMemo(() => {
    const inp = input.toLowerCase().trim();
    if (inp === "") return [];
    return exercises.filter((e) => e.name.includes(inp));
  }, [input, exercises]);

  return (
    <div className="px-2 max-w-md w-full mx-auto">
      {!selected ? (
        <>
          {message !== "" && <p className="text-accent">{message}</p>}
          <Input
            placeholder="Search an exercise..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {filtered.length !== 0 && (
            <p className="px-1 mt-1">Select One Exercise:</p>
          )}
          <div className="max-h-[300px] max-w-md mx-auto space-y-2 overflow-auto ver_scroll p-1 mt-2">
            {filtered.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelected(e)}
                className="flex border rounded-md bg-secondary/50 h-16 overflow-hidden cursor-pointer hover:bg-secondary transition-colors"
              >
                <img
                  src={e.imageUrl}
                  alt={e.name}
                  width={100}
                  height={60}
                  className="object-cover flex-1"
                />
                <p className="p-2 text-sm flex-[2]">{e.name}</p>
                <Link
                  className="my-auto mr-2"
                  to={`/dashboard/workout/${e.id}`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    View
                  </Button>
                </Link>
              </div>
            ))}
            {filtered.length === 0 && input.trim().length !== 0 && (
              <p className="p-2 border">No Exercises Found.</p>
            )}
          </div>
        </>
      ) : (
        <div>
          <img
            src={selected.imageUrl}
            alt={selected.name}
            width={100}
            height={60}
            className="object-cover w-full aspect-[2/1] rounded-md border"
          />
          <div className="flex">
            <span className="flex-1 font-medium">
              {capitalizeEachWord(selected.name)}
            </span>
            <span className="text-xs">
              <span className="text-accent text-base">
                {caloriePerMin(selected.met, stats.weight)}
              </span>{" "}
              Kcal/min
            </span>
          </div>
          {selected.type === "duration" ? (
            <CaloriesExerciseDurationForm
              exerciseId={selected.id}
              logId={logId}
              caloriePerMin={Number(caloriePerMin(selected.met, stats.weight))}
            />
          ) : (
            <CaloriesExerciseSelectForm
              exerciseId={selected.id}
              logId={logId}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default EditCaloriesForm;
