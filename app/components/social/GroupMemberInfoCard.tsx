import useFetch from "@/hooks/useFetch";
import { MemberInfoApiRes } from "@/routes/api+/memberInfo";
import { GroupMember } from "@prisma/client";
import { Crown, Flame, SquareActivity } from "lucide-react";
import StylishDiv from "../custom/StylishDiv";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

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
];

const GroupMemberInfoCard = ({ member }: { member: GroupMember }) => {
  const { data, error, loading } = useFetch<MemberInfoApiRes>(
    `/api/memberInfo?memberId=${member.id}`
  );
  return (
    <div className="">
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
              since{" "}
              {new Date(data.profile.stats.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      {!data ? (
        <Skeleton className="p-1 rounded w-full" />
      ) : (
        <StylishDiv
          icon={"hello"}
          text=""
          unit="fdas"
          value={data.profile.stats.currentStreak}
        />
      )}
    </div>
  );
};
export default GroupMemberInfoCard;
