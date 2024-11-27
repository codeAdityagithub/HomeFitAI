import { Link, useSearchParams } from "@remix-run/react";
import { Button } from "../ui/button";

const ToggleView = () => {
  const sp = useSearchParams()[0];
  const currentView = sp.get("view");

  return (
    <div className="flex items-center gap-2 font-medium text-muted-foreground">
      Viewing :
      <Link
        to={
          !currentView || currentView === "week" ? "?view=month" : "?view=week"
        }
      >
        <Button
          variant="secondary"
          size="sm"
        >
          <div className="flex items-center gap-1">
            <span className="text-sm">
              {currentView === "month"
                ? "Last month sessions"
                : "Last 7 sessions"}
            </span>
          </div>
        </Button>
      </Link>
    </div>
  );
};
export default ToggleView;
