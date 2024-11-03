import { cn } from "@/lib/utils";
import { useFetcher } from "@remix-run/react";
import { LogOut } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

const LogoutButton = ({
  children,
  className,
  iconOnly,
}: {
  children?: ReactNode;
  className?: string;
  iconOnly?: boolean;
}) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="POST"
      action="/logout"
      className={cn("w-full", className ?? "")}
    >
      {children ? (
        children
      ) : (
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "sm"}
          className={cn(
            "font-normal hover:bg-primary hover:text-primary-foreground",
            iconOnly ? "w-8 h-8" : "w-full justify-start gap-2"
          )}
        >
          <LogOut
            strokeWidth={1.5}
            size={20}
          />
          <span className={cn(iconOnly ? "hidden" : "")}>Logout</span>
        </Button>
      )}
    </fetcher.Form>
  );
};
export default LogoutButton;
