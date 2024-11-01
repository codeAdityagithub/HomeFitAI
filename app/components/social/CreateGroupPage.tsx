import { useToast } from "@/hooks/use-toast";
import { SocialAction } from "@/routes/dashboard+/social+/group.index";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const CreateGroupPage = () => {
  const fetcher = useFetcher<SocialAction>();

  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data && fetcher.data.message) {
      toast({
        title: fetcher.data.message,
        variant: "success",
      });
    }
  }, [fetcher.data]);

  return (
    <div className="h-[calc(100vh-86px)] w-full px-4 flex flex-col items-center justify-center gap-6 rounded-lg relative overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/50 via-accent/20 to-transparent blur-2xl opacity-25"></div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wider font-mono text-center text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
        Fitness Group
      </h1>

      <p className="text-base sm:text-xl text-foreground/70 text-center max-w-lg leading-relaxed">
        Connect, motivate, and achieve your fitness goals together
      </p>

      <div className="z-50 p-8 text-center sm:text-left bg-secondary dark:bg-card text-card-foreground rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
        <fetcher.Form
          method="post"
          className="flex flex-col ssm:flex-row items-center gap-4 justify-center"
        >
          <Input
            type="text"
            placeholder="Enter Group Name..."
            name="groupName"
            className="bg-background sm:w-[300px] px-4 py-2 outline-none focus:ring-1 focus:ring-accent rounded-md shadow-inner transition-all duration-200"
            minLength={3}
            maxLength={100}
            required
          />
          <Button
            disabled={fetcher.state !== "idle"}
            variant="accent"
          >
            {fetcher.state === "submitting"
              ? "Creating Group..."
              : "Create Group"}
          </Button>
        </fetcher.Form>
        <Link
          className="text-xs text-foreground/80 mt-2 py-1 ml-2"
          to="join"
        >
          Join a friend's group
        </Link>
      </div>
    </div>
  );
};
export default CreateGroupPage;
