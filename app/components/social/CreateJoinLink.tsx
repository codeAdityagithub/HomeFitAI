import { useToast } from "@/hooks/use-toast";
import { CreateJoinLinkAction } from "@/routes/api+/joinLink";
import { JWTExpired } from "@/utils/general";
import { useFetcher } from "@remix-run/react";
import { BadgePlus, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const CreateJoinLink = ({ activeToken }: { activeToken: string | null }) => {
  const fetcher = useFetcher<CreateJoinLinkAction>();
  const { toast } = useToast();

  const [expired, setExpired] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  const copytoClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/dashboard/social/group/join?token=${activeToken}`
      );
      toast({ description: "URL copied successfully", variant: "success" });
    } catch (error) {
      toast({
        title: "Failed To Copy the Link",
        variant: "secondary",
      });
    }
  };

  useEffect(() => {
    if (fetcher.data?.message) {
      toast({
        description: fetcher.data.message,
        variant: "success",
      });
    }
    setExpired(JWTExpired(activeToken));
    intervalRef.current = setInterval(() => {
      setExpired(JWTExpired(activeToken));
    }, 10000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [fetcher.data, activeToken]);

  if (!expired)
    return (
      <div>
        <Button
          size="icon"
          title="Copy Join Link"
          variant="outline"
          onClick={copytoClipboard}
        >
          <Copy />
        </Button>
      </div>
    );
  return (
    <div title="Create a new join link">
      <fetcher.Form
        method="post"
        action="/api/joinLink"
      >
        <Button
          disabled={fetcher.state === "submitting"}
          variant="outline"
          className="gap-2"
          size="sm"
        >
          <BadgePlus size={20} />
          Join Link
        </Button>
      </fetcher.Form>
    </div>
  );
};
export default CreateJoinLink;
