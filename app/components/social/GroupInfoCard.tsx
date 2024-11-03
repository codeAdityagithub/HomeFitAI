import { type GroupInfoLoader } from "@/.server/loaders/social/joinGroupLoader";
import { useToast } from "@/hooks/use-toast";
import { JoinGroupAction } from "@/routes/dashboard+/social+/group.join";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const GroupInfoCard = ({ group }: { group: GroupInfoLoader }) => {
  const fetcher = useFetcher<JoinGroupAction>();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        description: fetcher.data.error,
        variant: "destructive",
      });
    } else if (fetcher.data?.message) {
      toast({
        description: fetcher.data.message,
        variant: "success",
      });
    }
  }, [fetcher.data]);

  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      {/* A responsive card showing the group info and the group creator info */}
      <div className="flex flex-col gap-4 p-4 mb-14 rounded-lg w-full ssm:max-w-md items-stretch justify-items-center bg-background">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-3xl sm:text-4xl font-bold ">{group.name}</h1>
          <p className="text-lg">
            {group.members} {group.members > 1 ? "Members" : "Member"}
          </p>
        </div>
        <div className="flex items-center gap-6 bg-secondary relative p-4 rounded">
          <h1 className="font-bold absolute top-0 right-0 bg-accent text-accent-foreground rounded-tr p-1">
            Creator
          </h1>
          <Avatar className="border border-foreground/10">
            <AvatarImage src={group.creator.image ?? ""} />
            <AvatarFallback>{group.creator.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="break-words max-w-full line-clamp-1">
              {group.creator.name}
            </p>
          </div>
        </div>
        <fetcher.Form
          className="w-full"
          method="post"
        >
          <Button
            disabled={fetcher.state !== "idle"}
            className="w-full"
          >
            Join Group
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
};
export default GroupInfoCard;
