import { useLocation, useNavigate } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const GoBack = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        // if (window.history.state.idx === 0)
        navigate(location.pathname.split("/").slice(0, -1).join("/"));
        // else navigate(-1);
      }}
      className={cn("rounded-full hover:bg-primary", className)}
    >
      <ArrowLeft />
    </Button>
  );
};
export default GoBack;
