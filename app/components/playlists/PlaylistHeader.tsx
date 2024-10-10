import useGoalSelector from "@/hooks/useGoalSelector";
import { cn } from "@/lib/utils";
import { ExerciseType } from "@/utils/exercises/exercises.server";
import { PlaylistType } from "@/utils/exercises/playlists.server";
import { ExerciseGoals, ExerciseGoalText } from "@/utils/exercises/types";
import { useParams, useSearchParams } from "@remix-run/react";
import {
  ArrowBigRightDash,
  ArrowLeft,
  Minus,
  Plus,
  Repeat1,
  TimerReset,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { GiTimeTrap } from "react-icons/gi";
import GoBack from "../GoBack";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Button } from "../ui/button";

const goalIcons: Record<ExerciseGoals, { text: string; icon: ReactNode }> = {
  Reps: {
    text: "Reps",
    icon: <Repeat1 size={30} />,
  },
  TUT: {
    text: "Time Under Tension",
    icon: <GiTimeTrap size={30} />,
  },
  Timed: {
    text: "Timed Set",
    icon: <TimerReset size={30} />,
  },
  Free: {
    text: "Free Mode",
    icon: <ArrowBigRightDash size={30} />,
  },
};

const PlaylistHeader = ({
  playlist,
  exerciseType,
}: {
  playlist: PlaylistType;
  exerciseType: ExerciseType;
}) => {
  const pName = useParams().pId;
  const [sp, setSp] = useSearchParams();
  const cur = Number(sp.get("cur"));
  const goal = sp.get("goal");
  const itemRefs = useRef<HTMLSpanElement[]>(
    Array.from({ length: playlist.length })
  );
  const goals =
    exerciseType === "duration"
      ? { Timed: ExerciseGoalText.Timed, Free: ExerciseGoalText.Free }
      : ExerciseGoalText;
  const {
    selectedGoal,
    selected,
    setSelectedGoal,
    decrementProps,
    incrementProps,
    setValue,
    value,
  } = useGoalSelector();

  const [s_goal, setGoal] = useState(selectedGoal ?? goal);
  useEffect(() => {
    console.log(goal);
    if (goal && goal !== "Free") {
      setGoal(goal);
    }
  }, [goal]);

  useEffect(() => {
    if (itemRefs.current[cur]) {
      itemRefs.current[cur].scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "nearest",
      });
    }
  }, [cur]);
  return (
    <>
      <div className="flex gap-2 items-center w-full justify-start">
        <GoBack />
        <h1 className="capitalize text-xl sm:text-2xl font-bold">
          {playlist[cur].id.split("_").join(" ").toLowerCase()}
        </h1>
        <ResponsiveDialog
          title={
            !selected ? (
              "Detection Goal"
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => {
                    setSelectedGoal(null);
                    setValue(0);
                  }}
                  className="h-6 w-6 rounded-full"
                >
                  <ArrowLeft size={20} />
                </Button>
                {selectedGoal}
              </div>
            )
          }
          description={
            !selected
              ? "Select a Detection Goal or continue with normal..."
              : selected.desc
          }
          trigger={
            <Button
              variant="outline"
              className="ml-2"
              size="sm"
            >
              Goal : {s_goal ?? "Select Goal"}
            </Button>
          }
        >
          {!selectedGoal || !selected ? (
            <div
              className={cn(
                "grid grid-cols-2 gap-4 p-4 md:p-0",
                exerciseType === "sets" ? "grid-rows-2" : ""
              )}
            >
              {Object.keys(goals).map((g) =>
                g !== "Free" ? (
                  <div
                    key={g}
                    onClick={() =>
                      setSelectedGoal(g as Exclude<ExerciseGoals, "Free">)
                    }
                    className="flex items-center gap-4 justify-between rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer"
                  >
                    {goalIcons[g as ExerciseGoals].text}
                    {goalIcons[g as ExerciseGoals].icon}
                  </div>
                ) : (
                  <div
                    key={g}
                    onClick={() =>
                      setSp((prev) => {
                        prev.set("goal", g);
                        return prev;
                      })
                    }
                    className="flex items-center gap-4 justify-between rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer"
                  >
                    {goalIcons[g as ExerciseGoals].text}
                    {goalIcons[g as ExerciseGoals].icon}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="pb-0 p-4">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  {...decrementProps}
                  disabled={value <= selected.min}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-5xl md:text-6xl font-bold tracking-tighter">
                    {value}
                  </div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    {selected.unit}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  {...incrementProps}
                  disabled={value >= selected.max}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>

              <Button
                variant="accent"
                onClick={() => {
                  setSp((prev) => {
                    prev.set("goal", selectedGoal);
                    prev.set("duration", value.toString());
                    return prev;
                  });
                }}
                className="w-full mt-2"
              >
                Continue
              </Button>
            </div>
          )}
        </ResponsiveDialog>
      </div>
      <div className="flex gap-2 p-2 mb-4 overflow-x-auto w-full ver_scroll snap-x">
        {playlist.map((e, i) => {
          return (
            <span
              ref={(el) => (itemRefs.current[i] = el!)}
              onClick={() => {
                if (i === cur) return;
                setSp((prev) => {
                  prev.set("cur", String(i));
                  return prev;
                });
              }}
              key={e.id}
              className={cn(
                "font-bold capitalize snap-center min-w-max cursor-pointer text-xs xs:text-sm px-3 py-1.5 rounded-full outline outline-1 outline-secondary",
                i === cur && "text-accent bg-secondary"
              )}
            >
              {e.id.split("_").join(" ").toLowerCase()}
            </span>
          );
        })}
      </div>
    </>
  );
};
export default PlaylistHeader;
