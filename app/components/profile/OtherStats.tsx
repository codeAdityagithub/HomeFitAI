import { Stats } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import {
  CalendarRange,
  Crown,
  Flame,
  Footprints,
  SquareActivity,
} from "lucide-react";

const elems = [
  {
    icon: (
      <Flame
        className="text-primary"
        size={30}
      />
    ),
    text: "Current Streak",
    type: "currentStreak",
  },
  {
    icon: (
      <Crown
        className="text-[#FFD700]"
        size={30}
      />
    ),
    text: "Best Streak",
    type: "bestStreak",
  },
  {
    icon: (
      <SquareActivity
        className="text-orange-500"
        size={30}
      />
    ),
    text: "Total Calories Burned",
    type: "totalCalories",
  },
  {
    icon: <CalendarRange size={30} />,
    text: "Total Workouts",
    type: "totalWorkouts",
  },
  {
    icon: (
      <Footprints
        className="text-violet-600"
        size={30}
      />
    ),
    text: "Total Steps",
    type: "totalSteps",
  },
];

const OtherStats = ({
  stats,
  totalWorkoutDays,
}: {
  stats: SerializeFrom<Stats>;
  totalWorkoutDays: number;
}) => {
  return (
    <div className="w-full grid grid-cols-1 ssm:grid-cols-2 xl:grid-cols-4 place-content-start gap-4">
      {elems.map((e) => (
        <div
          key={e.text}
          className="rounded-lg p-2 sm:p-4 border border-accent/10 bg-secondary flex items-center gap-4"
        >
          <span>{e.icon}</span>
          <div className="flex flex-col items-start">
            <h2 className="text-xl xs:text-2xl font-bold">
              {e.type === "totalWorkouts"
                ? totalWorkoutDays
                : // @ts-expect-error
                  stats[e.type]}
              {e.type === "currentStreak" || e.type === "bestStreak" ? (
                <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
                  days
                </small>
              ) : null}
            </h2>
            <small className="text-muted-foreground">{e.text}</small>
          </div>
        </div>
      ))}
    </div>
  );
};
export default OtherStats;
