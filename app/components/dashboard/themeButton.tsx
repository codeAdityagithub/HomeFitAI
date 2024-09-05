import { useFetcher } from "@remix-run/react";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeToggle = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="POST"
      action="/api/changeTheme"
      className="w-full"
    >
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 font-normal"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="dark:hidden">Light</span>
        <span className="hidden dark:inline">Dark</span>
      </Button>
    </fetcher.Form>
  );
};
export default ThemeToggle;
