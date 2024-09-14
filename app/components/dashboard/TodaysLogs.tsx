import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Droplet, Footprints, MoonStar, SquareActivity } from "lucide-react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import EditLogForm from "./EditLogForm";
import EditCaloriesForm from "./EditCaloriesForm";

const elems = [
  {
    type: "waterIntake",
    icon: (
      <Droplet
        size={30}
        className="text-blue-500"
      />
    ),
    text: "Water Intake",
    unit: "glasses",
    min: 0,
    max: 20,
    step: 1,
  },
  {
    type: "sleep",
    icon: (
      <MoonStar
        size={30}
        className="text-violet-600"
      />
    ),
    text: "Sleep",
    unit: "hours",
    min: 0,
    max: 16,
    step: 0.5,
  },
  {
    type: "steps",
    icon: (
      <Footprints
        size={30}
        className="text-primary"
      />
    ),
    text: "Steps",
    min: 0,
    max: 25000,
    step: 500,
  },
  {
    type: "totalCalories",
    icon: (
      <SquareActivity
        className="text-orange-500"
        size={30}
      />
    ),
    text: "Total Calories",
    unit: "calories",
  },
];
const TodaysLogs = ({ log }: { log: SerializeFrom<Log> }) => {
  return (
    <div className="w-full grid grid-cols-1 xs:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
      {elems.map((e) => (
        <ResponsiveDialog
          key={e.type + "dialog"}
          title={`Edit ${e.text}`}
          description={
            e.type === "totalCalories"
              ? "Its recommended to track exercises for much better accuracy."
              : `Update your ${e.text} to keep progress consistent.`
          }
          trigger={
            <div className="rounded-lg p-2 sm:p-4 border border-accent/10 bg-secondary hover:cursor-pointer flex items-center gap-4">
              <span>{e.icon}</span>
              <div className="flex flex-col items-start">
                <h2 className="text-xl xs:text-2xl font-bold">
                  {
                    // @ts-expect-error
                    log[e.type]
                  }
                  <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
                    {e.unit}
                  </small>
                </h2>

                <small className="text-muted-foreground">{e.text}</small>
              </div>
            </div>
          }
        >
          {e.type !== "totalCalories" ? (
            <EditLogForm
              logId={log.id}
              init={
                // @ts-expect-error
                log[e.type]
              }
              text={e.text}
              // @ts-expect-error
              type={e.type}
              // @ts-expect-error
              min={e.min}
              // @ts-expect-error
              max={e.max}
              // @ts-expect-error
              step={e.step}
            />
          ) : (
            <EditCaloriesForm logId={log.id} />
          )}
        </ResponsiveDialog>
      ))}
    </div>
  );
};
export default TodaysLogs;
