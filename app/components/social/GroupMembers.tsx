import { useUser } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { GroupMember } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const GroupMemberCard = ({ member }: { member: GroupMember }) => {
  const user = useUser();

  return (
    <div
      className={cn(
        "flex items-center w-full gap-4 p-3 rounded-md border border-foreground/10 relative",
        member.id === user?.id
          ? "bg-gradient-to-br from-accent/80 to-accent/20 text-accent-foreground"
          : ""
      )}
    >
      <div
        className={cn(
          member.id === user?.id
            ? "absolute -top-0.5 -right-0.5 px-1 pb-0.5 bg-background text-foreground z-20 rounded-tr text-xs"
            : "hidden"
        )}
      >
        Creator
      </div>
      <Avatar className="border border-foreground/10">
        <AvatarImage src={member.image ?? ""} />
        <AvatarFallback>{member.name}</AvatarFallback>
      </Avatar>
      <p className="break-words max-w-full line-clamp-1">{member.name}</p>
    </div>
  );
};
const GroupMembers = ({ members }: { members: GroupMember[] }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-lg font-semibold">
        Group Members ( {members.length} )
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-2 w-full">
        {members.map((m) => (
          <GroupMemberCard member={m} />
        ))}
      </div>
    </div>
  );
};
export default GroupMembers;
