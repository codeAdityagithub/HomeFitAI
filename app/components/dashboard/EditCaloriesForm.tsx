import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { caloriePerMin, capitalizeEachWord } from "@/utils/general";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CaloriesExerciseSelectForm from "./CaloriesExerciseSelectForm";

type Exercise = { name: string; id: string; imageUrl: string; met: number };

const EditCaloriesForm = ({ logId }: { logId: string }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const weight = useDashboardLayoutData().stats.weight;
  const fetcher = useFetcher<any>({ key: "totalCalories-fetcher" });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (fetcher.data?.message) {
      setSelected(null);
      setInput("");
      setMessage(fetcher.data.message);
      setTimeout(() => setMessage(""), 1000);
      // resetFetcher(fetcher);
    }
  }, [fetcher.data]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`/api/exercises`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setExercises(data.exercises));

    return () => {
      abortController.abort("Fetch abort");
    };
  }, [logId]);

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
                {caloriePerMin(selected.met, weight)}
              </span>{" "}
              Kcal/min
            </span>
          </div>
          <CaloriesExerciseSelectForm
            exerciseId={selected.id}
            logId={logId}
          />
        </div>
      )}
    </div>
  );
};
export default EditCaloriesForm;
