import useFetch from "@/hooks/useFetch";
import { AchievementIcons } from "@/lib/utils";
import { MemberInfoApiRes } from "@/routes/api+/memberInfo";
import { GroupMember } from "@prisma/client";
import { Crown, Flame, Footprints, SquareActivity } from "lucide-react";
import { ReactNode } from "react";
import StylishDivNoGradient from "../custom/StylishDivNoGradient";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const memberStats: {
  stat:
    | "currentStreak"
    | "bestStreak"
    | "totalCalories"
    | "totalSteps"
    | "totalWorkoutDays";
  icon: ReactNode;
  text: string;
  unit: string;
}[] = [
  {
    stat: "currentStreak",
    icon: (
      <Flame
        className="text-primary"
        size={30}
      />
    ),
    text: "Current Streak",
    unit: "days",
  },
  {
    stat: "bestStreak",
    icon: (
      <Crown
        className="text-[#FFD700]"
        size={30}
      />
    ),
    text: "Best Streak",
    unit: "days",
  },
  {
    stat: "totalCalories",
    icon: (
      <SquareActivity
        className="text-orange-500"
        size={30}
      />
    ),
    text: "Calories Burned",
    unit: "Kcal",
  },
  {
    stat: "totalSteps",
    icon: (
      <Footprints
        size={30}
        className="text-violet-500"
      />
    ),
    text: "Total Steps",
    unit: "steps",
  },
  {
    stat: "totalWorkoutDays",
    icon: (
      <SquareActivity
        size={30}
        className="text-violet-500"
      />
    ),
    text: "Total Workout Days",
    unit: "days",
  },
];

const GroupMemberInfoCard = ({ member }: { member: GroupMember }) => {
  const { data, error, loading } = useFetch<MemberInfoApiRes>(
    `/api/memberInfo?memberId=${member.id}`
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center w-full gap-4 p-3 rounded-md border border-foreground/10 relative">
        <Avatar className="border border-foreground/10 w-20 h-20">
          <AvatarImage src={member.image ?? ""} />
          <AvatarFallback>{member.name}</AvatarFallback>
        </Avatar>
        <div className="">
          <p className="break-words max-w-full line-clamp-1">{member.name}</p>
          {!data ? (
            <Skeleton className="p-1 rounded w-full" />
          ) : (
            <div className="text-muted-foreground text-xs">
              joined{" "}
              {new Date(data.profile.stats.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-2 grid-cols-1 ssm:grid-cols-2 min-h-[350px] ssm:min-h-[280px] items-stretch">
        {!data ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="p-1 rounded w-full"
              />
            ))}
          </>
        ) : (
          <>
            <h2 className="col-span-1 ssm:col-span-2 text-lg font-semibold">
              Stats
            </h2>
            {memberStats.map((s) => (
              <StylishDivNoGradient
                key={s.stat}
                icon={s.icon}
                text={s.text}
                unit={s.unit}
                value={data.profile.stats[s.stat]}
                size="sm"
              />
            ))}
            <h2 className="col-span-1 ssm:col-span-2 text-lg font-semibold">
              Achievements
            </h2>

            {data.profile.achievements.map((a) => (
              <StylishDivNoGradient
                key={a.title}
                icon={a.type && AchievementIcons[a.type]}
                text={"achieved " + new Date(a.createdAt).toLocaleDateString()}
                unit=""
                value={a.title}
                size="sm"
              />
            ))}

            {data.profile.achievements.length === 0 && (
              <p className="text-muted-foreground">No Achievements to show</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default GroupMemberInfoCard;
