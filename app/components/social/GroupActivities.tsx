import { DailyGoals, GroupMember } from "@prisma/client";
import { Flame, Footprints, GlassWater, Moon } from "lucide-react";
import { useMemo } from "react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GroupRouteRes } from "./GroupRoute";

const goalType: Record<keyof DailyGoals, string> = {
  steps: "steps",
  sleep: "sleep",
  water: "waterIntake",
  calories: "totalCalories",
};
const goalUtil = {
  steps: {
    icon: (
      <Footprints
        size={30}
        className="text-amber-600"
      />
    ),
    text: "Steps",
    unit: "steps",
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
  },
  water: {
    icon: (
      <GlassWater
        size={30}
        className="text-blue-500"
      />
    ),
    text: "Water",
    unit: "glasses",
  },
};

type Goals = Record<
  keyof DailyGoals,
  { user: GroupMember; goal: number; value: number | undefined }[]
>;

const GroupActivities = ({
  membersInfo,
  members,
}: Pick<GroupRouteRes, "membersInfo"> & { members: GroupMember[] }) => {
  const membersGoalsCategorized = useMemo(() => {
    const goals: Goals = {
      water: [],
      steps: [],
      sleep: [],
      calories: [],
    };
    Object.keys(membersInfo).forEach((memId) => {
      const { dailyGoals, log } = membersInfo[memId];
      const member = members.find((m) => m.id === memId)!;
      Object.keys(goals).forEach((g) => {
        const goal = g as keyof DailyGoals;

        goals[goal].push({
          user: member,
          goal: dailyGoals[goal],
          // @ts-expect-error
          value: log ? log[goalType[goal]] : undefined,
        });
      });
    });
    const sorter = (a: any, b: any) => {
      if (!a.value && !b.value) return 0;
      if (!a.value) return 1;
      if (!b.value) return -1;
      return b.value - a.value;
    };
    goals.water.sort(sorter);
    goals.calories.sort(sorter);
    goals.sleep.sort(sorter);
    goals.steps.sort(sorter);
    return goals;
  }, [membersInfo]);

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <h2 className="text-lg font-semibold">Group Activities/Challenges</h2>
      <div className="w-full max-h-[60vh] overflow-y-auto overflow-x-hidden ver_scroll">
        <div className="p-3 rounded-lg bg-background grid grid-cols-1 ssm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 items-stretch gap-2 w-full">
          <h2 className="text-base font-semibold col-span-full">
            Individual Daily Goals
          </h2>
          {Object.keys(membersGoalsCategorized).map((goal) => {
            const { icon, text, unit } = goalUtil[goal as keyof DailyGoals];
            const members = membersGoalsCategorized[goal as keyof DailyGoals];
            return (
              <ResponsiveDialog
                key={`${goal}-trigger`}
                trigger={
                  <div className="bg-secondary shadow shadow-foreground/10 hover:outline hover:outline-1 hover:outline-accent/30 transition-colors flex items-center gap-2 p-4 rounded-md cursor-pointer">
                    <span>{icon}</span>
                    {text}
                  </div>
                }
                title={`${text} Daily Goal Progress`}
                description={`Showing ${text} Daily Goal Progress for all group members.`}
              >
                <div className="px-4 md:px-0 space-y-2 max-h-[70vh] overflow-auto ver_scroll">
                  {members.map((m) => {
                    return (
                      <div
                        key={`${goal}${m.user.name}`}
                        className="flex items-center p-2 gap-2 bg-secondary rounded-md"
                      >
                        <Avatar>
                          <AvatarImage
                            src={m.user.image || ""}
                            alt={m.user.name}
                          />
                          <AvatarFallback>{m.user.name}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{m.user.name}</span>

                        <span className="text-xl font-mono ml-auto">
                          {m.value || 0}/{m.goal}
                          <span className="text-xs">
                            {" "}
                            {
                              // @ts-expect-error
                              goalUtil[goal].unit
                            }
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ResponsiveDialog>
            );
          })}
          <h2 className="text-base font-semibold col-span-full">
            Other Challenges
          </h2>
          <div className="col-span-full"> Work in Progress </div>
        </div>
      </div>
    </div>
  );
};
export default GroupActivities;
