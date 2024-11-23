import { useUser } from "@/hooks/userContext";
import { GroupLoader } from "@/routes/dashboard+/social+/group.index";
import { SerializeFrom } from "@remix-run/node";
import CreateJoinLink from "./CreateJoinLink";
import GroupActivities from "./GroupActivities";
import GroupMembers from "./GroupMembers";
import GroupMessages from "./GroupMessages";

type NonNullableType<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type GroupRouteRes = NonNullableType<SerializeFrom<GroupLoader>>;

const GroupRoute = ({ group, membersInfo }: GroupRouteRes) => {
  const user = useUser();
  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold max-w-[180px] xs:max-w-[200px] ssm:max-w-xs sm:max-w-md md:max-w-sm mmd:max-w-fit break-words overflow-ellipsis">
          {group.name}
        </h1>
        {user?.id === group.creatorId && (
          <CreateJoinLink activeToken={group.activeToken} />
        )}
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
