import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/userContext";
import { AddReactionAction } from "@/routes/api+/group.reaction";
import { GroupMessageReaction, ReactionType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { reactionIcons } from "./GroupMessages";

const DisplayMessageReaction = ({
  reactions,
  getName,
  messageId,
}: {
  reactions: Record<ReactionType, GroupMessageReaction[]>;
  getName: (id: string) => string;
  messageId: string;
}) => {
  const user = useUser()!;
  const fetcher = useFetcher<AddReactionAction>();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.message) {
      toast({
        description: fetcher.data.message,
        variant: "success",
      });
    } else if (fetcher.data?.error) {
      toast({
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data]);
  return (
    <>
      {Object.entries(reactions).map(([k, v]) => (
        <Popover key={k}>
          <PopoverTrigger className="flex items-center gap-1">
            {reactionIcons[k as ReactionType]}
            <span>{v.length}</span>
          </PopoverTrigger>
          <PopoverContent className="bg-secondary p-2 rounded shadow-foreground/10 shadow-lg w-full space-y-2">
            {v.map((r) => (
              <fetcher.Form
                key={r.from + "del"}
                onSubmit={(e) => {
                  if (r.from !== user.id) e.preventDefault();
                }}
                method="delete"
                action="/api/group/reaction"
              >
                <button
                  key={r.from}
                  type="submit"
                  name="messageId"
                  value={messageId}
                  className="grid grid-cols-2 place-items-start w-full"
                >
                  <span className="text-sm">
                    {r.from === user.id ? "You" : getName(r.from)}
                  </span>
                  <span>{reactionIcons[k as ReactionType]}</span>
                  {r.from === user.id && (
                    <span className="col-span-2 text-xs">click to remove</span>
                  )}
                </button>
              </fetcher.Form>
            ))}
          </PopoverContent>
        </Popover>
      ))}
    </>
  );
};
export default DisplayMessageReaction;
