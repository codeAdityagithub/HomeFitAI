import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import {
  ArrowBigRightDash,
  ArrowLeft,
  Minus,
  Plus,
  Repeat1,
  TimerReset,
} from "lucide-react";
import { GiTimeTrap } from "react-icons/gi";
import { ExerciseGoals } from "@/utils/exercises/types";
import { ReactNode, useEffect, useMemo, useState } from "react";
import useLongPress from "@/hooks/useLongPress";

const goals: { name: ExerciseGoals; text: string; icon: ReactNode }[] = [
  {
    name: "Reps",
    text: "Reps",
    icon: <Repeat1 size={30} />,
  },
  {
    name: "TUT",
    text: "Time Under Tension",
    icon: <GiTimeTrap size={30} />,
  },
  {
    name: "Timed",
    text: "Timed Set",
    icon: <TimerReset size={30} />,
  },
  {
    name: "Free",
    text: "Free Mode",
    icon: <ArrowBigRightDash size={30} />,
  },
];

const constraints: Record<
  Exclude<ExerciseGoals, "Free">,
  {
    min: number;
    max: number;
    unit: string;
    step: number;
    title: string;
    desc: string;
  }
> = {
  Reps: {
    min: 3,
    max: 100,
    unit: "Reps",
    step: 1,
    title: "Number of Reps",
    desc: "Select the desired number of reps to perform.",
  },
  Timed: {
    min: 10,
    max: 300,
    unit: "Seconds",
    step: 5,
    title: "Timed Sets",
    desc: "Select the time for a timed set.",
  },
  TUT: {
    min: 1,
    max: 10,
    unit: "Seconds",
    step: 1,
    title: "Time Under Tension",
    desc: "It is the number of seconds that each rep should be performed. The greater the number the more the time under tension.",
  },
};

function DetectionGoalSelector() {
  const [selectedGoal, setSelectedGoal] = useState<Exclude<
    ExerciseGoals,
    "Free"
  > | null>(null);
  const selected = useMemo(
    () => (selectedGoal ? constraints[selectedGoal] : null),
    [selectedGoal]
  );
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (selected) setValue(selected.min);
  }, [selected]);
  function decrement() {
    if (!selected) return;
    setValue((prev) =>
      Math.max(selected.min, Math.min(selected.max, prev - selected.step))
    );
  }
  function increment() {
    if (!selected) return;

    setValue((prev) =>
      Math.max(selected.min, Math.min(selected.max, prev + selected.step))
    );
  }
  const decrementProps = useLongPress({ callback: decrement });
  const incrementProps = useLongPress({ callback: increment });

  function onClick(adjustment: number) {
    if (!selectedGoal) return;

    setValue(
      Math.max(
        constraints[selectedGoal].min,
        Math.min(constraints[selectedGoal].max, value + adjustment)
      )
    );
  }

  return (
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
            {selected.title}
          </div>
        )
      }
      description={
        !selected
          ? "Select a Detection Goal or continue with normal..."
          : selected.desc
      }
      trigger={<Button>Detect</Button>}
    >
      {!selected ? (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 md:p-0">
          {goals.map((g) =>
            g.name !== "Free" ? (
              <div
                key={g.name}
                // @ts-expect-error
                onClick={() => setSelectedGoal(g.name)}
                className="flex items-center gap-4 justify-between rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer"
              >
                {g.text}
                {g.icon}
              </div>
            ) : (
              <Link
                key={g.name}
                to={`detect?goal=${g.name}`}
                className="flex items-center gap-4 justify-between rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer"
              >
                {g.text}
                {g.icon}
              </Link>
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
          <Link to={`detect?goal=${selectedGoal}&duration=${value}`}>
            <Button
              variant="accent"
              className="w-full mt-2"
            >
              Continue
            </Button>
          </Link>
        </div>
      )}
    </ResponsiveDialog>
  );
}
export default DetectionGoalSelector;
