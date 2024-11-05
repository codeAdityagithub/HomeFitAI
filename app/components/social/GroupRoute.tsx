import { Group } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import CreateJoinLink from "./CreateJoinLink";
import GroupMembers from "./GroupMembers";
import GroupMessages from "./GroupMessages";

const GroupRoute = ({ group }: { group: SerializeFrom<Group> }) => {
  return (
    <div className="p-4 space-y-4 w-full h-full">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">{group.name}</h1>
        <CreateJoinLink activeToken={group.activeToken} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-items-stretch">
        <h2 className="text-lg font-semibold">Group Challenges/Goals</h2>
        <GroupMembers
          members={group.members}
          creatorId={group.creatorId}
        />
        <GroupMessages messages={group.messages} />
      </div>
    </div>
  );
};
export default GroupRoute;
