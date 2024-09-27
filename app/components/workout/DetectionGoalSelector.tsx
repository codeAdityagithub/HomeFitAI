import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { ArrowBigRightDash, Repeat1, TimerReset } from "lucide-react";
import { GiTimeTrap } from "react-icons/gi";
import { ExerciseGoals } from "@/utils/exercises/types";
import { ReactNode } from "react";

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

function DetectionGoalSelector() {
  return (
    <ResponsiveDialog
      title="Detection Goal"
      description="Select a Detection Goal or continue with normal..."
      trigger={<Button>Detect</Button>}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 md:p-0">
        {goals.map((g) => (
          <Link
            to={`detect?goal=${g.name}`}
            className="flex items-center gap-4 justify-between rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer"
          >
            {g.text}
            {g.icon}
          </Link>
        ))}
      </div>
    </ResponsiveDialog>
  );
}
export default DetectionGoalSelector;
