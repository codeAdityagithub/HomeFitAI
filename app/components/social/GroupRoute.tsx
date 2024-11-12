import { GroupLoader } from "@/routes/dashboard+/social+/group.index";
import { SerializeFrom } from "@remix-run/node";
import CreateJoinLink from "./CreateJoinLink";
import GroupMembers from "./GroupMembers";
import GroupMessages from "./GroupMessages";
import GroupActivities from "./GroupActivities";

type NonNullableType<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type GroupRouteRes = NonNullableType<SerializeFrom<GroupLoader>>;

const GroupRoute = ({ group, membersInfo }: GroupRouteRes) => {
  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">{group.name}</h1>
        <CreateJoinLink activeToken={group.activeToken} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-1 justify-items-stretch">
        <GroupActivities
          membersInfo={membersInfo}
          members={group.members}
        />
        <GroupMembers
          members={group.members}
          creatorId={group.creatorId}
        />
        <GroupMessages
          members={group.members}
          messages={group.messages}
        />
      </div>
    </div>
  );
};
export default GroupRoute;
