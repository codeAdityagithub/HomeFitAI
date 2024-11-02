import { GroupMessage } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

const GroupMessages = ({
  messages,
}: {
  messages: SerializeFrom<GroupMessage>[];
}) => {
  return (
    <div className="flex flex-col w-full items-start col-span-2">
      <h2 className="text-lg font-semibold">
        Group Messages ( {messages.length} )
      </h2>
      <div className="flex items-center gap-2">
        {/* {members.map((m) => (
          <GroupMemberCard member={m} />
        ))} */}
      </div>
    </div>
  );
};
export default GroupMessages;
