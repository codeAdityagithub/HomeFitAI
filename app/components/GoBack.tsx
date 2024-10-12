import { cn } from "@/lib/utils";
import { Link, useLocation } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const GoBack = ({ className }: { className?: string }) => {
  const location = useLocation();
  return (
    <Link to={location.pathname.split("/").slice(0, -1).join("/")}>
      <Button
        size="icon"
        variant="outline"
        className={cn("rounded-full hover:bg-primary", className)}
      >
        <ArrowLeft />
      </Button>
    </Link>
  );
};
export default GoBack;
