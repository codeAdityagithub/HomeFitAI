import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const GoPrevPath = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        navigate(location.pathname.split("/").slice(0, -1).join("/"));
      }}
      className={cn("rounded-full hover:bg-primary", className)}
    >
      <ArrowLeft />
    </Button>
  );
};
export default GoPrevPath;
