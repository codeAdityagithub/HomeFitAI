import { ReactNode } from "react";

const StylishDiv = ({
  value,
  icon,
  unit,
  text,
}: {
  value: ReactNode;
  icon: ReactNode;
  unit: string;
  text: string;
}) => {
  return (
    <div className="rounded-lg p-2 sm:p-4 border border-accent/20 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 flex items-center gap-4">
      <span>{icon}</span>
      <div className="flex flex-col items-start">
        <h2 className="text-xl xs:text-2xl font-bold">
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
export default StylishDiv;
