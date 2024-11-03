import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const JoinGroupPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      const url = new URL(e.target[0].value);
      const token = url.searchParams.get("token");
      if (!token) {
        toast({ description: "No token provided", variant: "destructive" });
        return;
      }
      navigate("?token=" + token);
    } catch (error) {
      toast({ description: "Invalid URL Provided", variant: "destructive" });
    }
  };

  return (
    <div className="h-full w-full px-4 flex flex-col items-center justify-center gap-6 rounded-lg relative overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/50 via-accent/20 to-transparent blur-2xl opacity-25"></div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wider font-mono text-center text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
        Fitness Group
      </h1>

      <p className="text-base sm:text-xl text-foreground/70 text-center max-w-lg leading-relaxed">
        Connect, motivate, and achieve your fitness goals together
      </p>

      <div className="z-50 text-center sm:text-left p-8 bg-secondary dark:bg-card text-card-foreground rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col ssm:flex-row items-center gap-4 justify-center"
        >
          <Input
            type="text"
            placeholder="Paste Invite Link..."
            name="link"
            className="bg-background sm:w-[300px] px-4 py-2 outline-none focus:ring-1 focus:ring-accent rounded-md shadow-inner transition-all duration-200"
            required
          />
          <Button variant="accent">View Group</Button>
        </form>
        <Link
          className="text-xs text-foreground/80 mt-2 py-1 ml-2"
          to="../"
        >
          Create your own group
        </Link>
      </div>
    </div>
  );
};
export default JoinGroupPage;
