import { cn } from "@/lib/utils";
import { useFetcher } from "@remix-run/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

const ThemeToggle = ({
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
      action="/api/changeTheme"
      className={cn("w-full", className ?? "")}
    >
      {children ? (
        children
      ) : (
        <Button
          variant="ghost"
          title="Toggle theme"
          size={iconOnly ? "icon" : "sm"}
          className={cn(
            "font-normal",
            iconOnly ? "w-8 h-8" : "w-full justify-start gap-2"
          )}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className={cn(iconOnly ? "hidden" : "dark:hidden")}>Light</span>
          <span className={cn(iconOnly ? "hidden" : "hidden dark:inline")}>
            Dark
          </span>
        </Button>
      )}
    </fetcher.Form>
  );
};
export default ThemeToggle;
