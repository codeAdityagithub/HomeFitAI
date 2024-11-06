import { useUser } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/general";
import {
  GroupMember,
  GroupMessage,
  GroupMessageContentType,
  ReactionType,
} from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { SerializeFrom } from "@remix-run/node";
import { SquareUserRound } from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

const reactionIcons: Record<ReactionType, string> = {
  LIKE: "👍",
  HEART: "❤️",
  CELEBRATE: "🎉",
};
const text: Record<GroupMessageContentType, string> = {
  ACHIEVEMENT: "Achievement Unlocked",
  CHALLENGE: "Challenge Completed",
  DAILY_GOAL: "Daily Goal Completed",
};
const GroupMessageCard = ({
  message,
  image,
  name,
}: {
  message: SerializeFrom<GroupMessage>;
  image: string | null;
  name: string;
}) => {
  const user = useUser()!;
  const isMyMessage = user?.id === message.from;

  return (
    <div
      className={cn(
        "p-2 rounded w-full ssm:max-w-sm md:max-w-md space-y-2",
        isMyMessage ? "ml-auto" : ""
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          isMyMessage ? "flex-row-reverse" : ""
        )}
      >
        <Avatar className="w-7 h-7 rounded-md">
          <AvatarImage
            src={image ?? ""}
            alt="Sender"
          />
          <AvatarFallback className="rounded">
            <SquareUserRound />
          </AvatarFallback>
        </Avatar>

        <div className={cn("flex flex-col", isMyMessage ? "items-end" : "")}>
          <p className="text-xs">{isMyMessage ? "You" : name}</p>
          <span className="text-[0.7rem] leading-3 text-foreground/60">
            {formatTime(message.sentAt)}
          </span>
        </div>
      </div>
      <div className="flex-1 bg-secondary p-2 rounded drop-shadow-sm">
        <p className="text-secondary-foreground/80">
          {text[message.content.type]}
        </p>
        <div className="text-secondary-foreground font-semibold text-lg">
          {message.content.title}
        </div>
        <p className="text-sm text-foreground/90">
          {message.content.description}
        </p>

        <div className="mt-2 flex space-x-2">
          {message.reactions.map((reaction, index) => (
            <span
              key={index}
              className="text-gray-600"
            >
              {reactionIcons[reaction.type]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const GroupMessages = ({
  messages,
  members,
}: {
  messages: SerializeFrom<GroupMessage>[];
  members: GroupMember[];
}) => {
  const memberInfo = useMemo(
    () =>
      members.reduce((acc, m) => {
        acc[m.id] = {
          image: m.image,
          name: m.name,
        };
        return acc;
      }, {} as Record<string, { image: string | null; name: string }>),
    [members]
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full items-start col-span-1 md:col-span-2">
      <h2 className="text-lg font-semibold">
        Group Activity ( {messages.length} )
      </h2>
      <div className="bg-background h-full w-full rounded-md space-y-4 p-4 flex flex-col-reverse">
        {messages.map((m, i) => (
          <GroupMessageCard
            key={m.id}
            message={m}
            image={memberInfo[m.from].image}
            name={memberInfo[m.from].name}
          />
        ))}
      </div>
    </div>
  );
};
export default GroupMessages;
