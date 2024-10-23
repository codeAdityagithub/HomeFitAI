import { LOG_CONSTANTS } from "@/lib/constants";
import { ExerciseGoals } from "@/utils/exercises/types";
import { useEffect, useMemo, useState } from "react";
import useLongPress from "./useLongPress";

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
    min: LOG_CONSTANTS.exercise.reps.min,
    max: LOG_CONSTANTS.exercise.reps.max,
    unit: "Reps",
    step: 1,
    title: "Number of Reps",
    desc: "Select the desired number of reps to perform.",
  },
  Timed: {
    min: 10,
    max: LOG_CONSTANTS.exercise.max_duration,
    unit: "Seconds",
    step: 5,
    title: "Timed Sets",
    desc: "Select the time for a timed set.",
  },
  TUT: {
    min: 1,
    max: LOG_CONSTANTS.exercise.max_TUT,
    unit: "Seconds",
    step: 1,
    title: "Time Under Tension",
    desc: "It is the number of seconds that each rep should be performed. The greater the number the more the time under tension.",
  },
};

const useGoalSelector = () => {
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

  return {
    selectedGoal,
    selected,
    setSelectedGoal,
    value,
    setValue,
    decrementProps,
    incrementProps,
  } as const;
};
export default useGoalSelector;
