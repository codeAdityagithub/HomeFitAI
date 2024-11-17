import { useUser } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/general";
import {
  GroupMember,
  GroupMessage,
  GroupMessageContentType,
  GroupMessageReaction,
  ReactionType,
} from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { SerializeFrom } from "@remix-run/node";
import { Heart, PartyPopper, SquareUserRound, ThumbsUp } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import AddMessageReaction from "./AddMessageReaction";
import DisplayMessageReaction from "./DisplayMessageReactions";

export const reactionIcons: Record<ReactionType, ReactNode> = {
  LIKE: (
    <ThumbsUp
      className="text-yellow-400"
      fill="#fd2"
      size={20}
    />
  ),
  HEART: (
    <Heart
      className="text-red-500"
      fill="#f00"
      size={20}
    />
  ),
  CELEBRATE: (
    <PartyPopper
      className="text-violet-500"
      fill="#fff"
      size={20}
    />
  ),
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
  getName,
}: {
  message: SerializeFrom<GroupMessage>;
  image: string | null;
  name: string;
  getName: (id: string) => string;
}) => {
  const user = useUser()!;
  const isMyMessage = user?.id === message.from;
  // console.log(message.reactions);

  const reactions = useMemo(() => {
    return message.reactions.reduce((acc, r) => {
      if (!acc[r.type]) acc[r.type] = [r];
      else acc[r.type].push(r);
      return acc;
    }, {} as Record<ReactionType, GroupMessageReaction[]>);
  }, [message]);

  return (
    <div
      className={cn(
        "p-2 rounded w-[90%] ssm:max-w-sm md:max-w-md space-y-2",
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
      <div className="flex-1 bg-secondary p-2 rounded shadow shadow-foreground/10 relative">
        <AddMessageReaction
          isMyMessage={isMyMessage}
          messageId={message.id}
          currentReaction={
            message.reactions.find((r) => r.from === user.id)?.type
          }
        />
        <p className="text-secondary-foreground/80">
          {text[message.content.type]}
        </p>
        <div className="text-secondary-foreground font-semibold text-lg">
          {message.content.title}
        </div>
        <p className="text-sm text-foreground/90">
          {message.content.description}
        </p>

        <div
          className={cn(
            "mt-2 space-x-2 flex w-fit",
            isMyMessage ? "ml-auto" : ""
          )}
        >
          <DisplayMessageReaction
            reactions={reactions}
            getName={getName}
            messageId={message.id}
          />
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
  const getName = useCallback(
    (id: string) => memberInfo[id].name,
    [memberInfo]
  );
  return (
    <div className="flex flex-col gap-2 w-full h-full items-start col-span-1 md:col-span-2">
      <h2 className="text-lg font-semibold">
        Group Announcements ( {messages.length} )
      </h2>
      <div className="bg-background h-full w-full rounded-md space-y-4 p-4 flex flex-col-reverse mb-12">
        {messages.map((m, i) => (
          <GroupMessageCard
            key={m.id}
            message={m}
            image={memberInfo[m.from].image}
            name={memberInfo[m.from].name}
            getName={getName}
          />
        ))}
      </div>
    </div>
  );
};
export default GroupMessages;
