import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AddReactionAction } from "@/routes/api+/group.reaction";
import { ReactionType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { reactionIcons } from "./GroupMessages";

const AddMessageReaction = ({
  isMyMessage,
  messageId,
  currentReaction,
}: {
  isMyMessage: boolean;
  messageId: string;
  currentReaction: ReactionType | undefined;
}) => {
  const fetcher = useFetcher<AddReactionAction>();
  const { toast } = useToast();

  const [value, setValue] = useState<ReactionType | undefined>();

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
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "absolute top-1/2 -translate-y-1/2 cursor-pointer hover:text-accent transition-colors",
          isMyMessage ? "-left-10" : "-right-10"
        )}
      >
        <Button
          size="icon"
          className="bg-transparent hover:bg-secondary w-8 h-8"
          disabled={fetcher.state !== "idle"}
        >
          <SmilePlus
            className="text-foreground/80"
            size={20}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[4rem]">
        {/* <DropdownMenuLabel>Reactions</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <fetcher.Form
          action="/api/group/reaction"
          method="post"
          onSubmit={(e) => {
            if (value === currentReaction) e.preventDefault();
          }}
        >
          <input
            type="hidden"
            name="messageId"
            value={messageId}
          />
          <input
            type="hidden"
            name="reaction"
            value={value}
          />
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
          >
            <button
              type="submit"
              onClick={() => setValue("LIKE")}
              className="w-full"
            >
              {reactionIcons.LIKE}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
          >
            <button
              type="submit"
              onClick={() => setValue("HEART")}
              className="w-full"
            >
              {reactionIcons.HEART}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
          >
            <button
              type="submit"
              onClick={() => setValue("CELEBRATE")}
              className="w-full"
            >
              {reactionIcons.CELEBRATE}
            </button>
          </DropdownMenuItem>
        </fetcher.Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AddMessageReaction;
