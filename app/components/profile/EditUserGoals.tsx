import { DAILY_GOALS_LIMITS } from "@/lib/constants";
import { DailyGoals } from "@prisma/client";
import { Droplet, Flame, Footprints, Moon } from "lucide-react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import EditGoalForm from "./EditGoalForm";

const goals = {
  steps: {
    icon: (
      <Footprints
        size={30}
        className="text-primary"
      />
    ),
    text: "Steps",
    unit: "steps",
    step: 500,
  },
  sleep: {
    icon: (
      <Moon
        size={30}
        className="text-violet-600"
      />
    ),
    text: "Sleep",
    unit: "hr",
    step: 0.5,
  },
  calories: {
    icon: (
      <Flame
        size={30}
        className="text-primary"
      />
    ),
    text: "Calories",
    unit: "Kcal",
    step: 10,
  },
  water: {
    icon: (
      <Droplet
        size={30}
        className="text-blue-500"
      />
    ),
    text: "Water",
    unit: "glasses",
    step: 1,
  },
};

type Props = {
  goal: keyof DailyGoals;
  init: number;
};

const EditUserGoals = (props: Props) => {
  const { goal, init } = props;

  return (
    <ResponsiveDialog
      title={`Edit ${goals[goal].text}`}
      description={`Edit your profile settings to keep progress consistent.`}
      trigger={
        <div className="rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer flex items-center gap-4">
          <span>{goals[goal].icon}</span>
          <div className="flex flex-col items-start">
            <h2 className="text-xl xs:text-2xl font-bold">
              {init}
              <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
                {goals[goal].unit}
              </small>
            </h2>
            <small className="text-muted-foreground">{goals[goal].text}</small>
          </div>
        </div>
      }
    >
      <EditGoalForm
        init={init}
        min={DAILY_GOALS_LIMITS[goal].min}
        max={DAILY_GOALS_LIMITS[goal].max}
        type={goal}
        step={goals[goal].step}
        text={goals[goal].text}
        unit={goals[goal].unit}
      />
    </ResponsiveDialog>
  );
};
export default EditUserGoals;
