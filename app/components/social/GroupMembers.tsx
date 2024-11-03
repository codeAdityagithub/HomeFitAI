import { useUser } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { GroupMember } from "@prisma/client";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import GroupMemberInfoCard from "./GroupMemberInfoCard";

const GroupMemberCard = ({
  member,
  isCreator,
}: {
  member: GroupMember;
  isCreator: boolean;
}) => {
  const user = useUser();

  return (
    <ResponsiveDialog
      trigger={
        <div
          className={cn(
            "flex items-center w-full cursor-pointer gap-4 p-3 rounded-md border border-foreground/10 relative",
            isCreator
              ? "bg-gradient-to-br from-accent/80 to-accent/20 text-accent-foreground"
              : ""
          )}
        >
          <div
            className={cn(
              isCreator
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
      }
      title={member.name + " Profile"}
      description=""
    >
      <div className="px-4 sm:px-0">
        <GroupMemberInfoCard member={member} />
      </div>
    </ResponsiveDialog>
  );
};
const GroupMembers = ({
  members,
  creatorId,
}: {
  members: GroupMember[];
  creatorId: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-lg font-semibold">
        Group Members ( {members.length} )
      </h2>
      <div className="grid grid-cols-1 ssm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 items-stretch gap-2 w-full">
        {members.map((m) => (
          <GroupMemberCard
            key={m.id}
            member={m}
            isCreator={m.id === creatorId}
          />
        ))}
      </div>
    </div>
  );
};
export default GroupMembers;
