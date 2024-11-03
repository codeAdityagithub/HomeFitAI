import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const StylishDivNoGradient = ({
  value,
  icon,
  unit,
  text,
  size = "default",
}: {
  value: ReactNode;
  icon: ReactNode;
  unit: string;
  text: string;
  size?: "sm" | "default";
}) => {
  return (
    <div className="rounded-lg p-2 border border-secondary-foreground/10 transition-colors bg-secondary text-secondary-foreground flex items-center gap-4">
      <span>{icon}</span>
      <div className="flex flex-col items-start">
        <h2
          className={cn(
            size === "sm"
              ? "text-base xs:text-lg font-semibold"
              : "text-xl xs:text-2xl font-bold"
          )}
        >
          {value}
          <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
            {unit}
          </small>
        </h2>

        <small className="text-muted-foreground">{text}</small>
      </div>
    </div>
  );
};
export default StylishDivNoGradient;
