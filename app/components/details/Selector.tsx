import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

import useLongPress from "@/hooks/useLongPress";
import CountUp from "react-countup";
function WeightInput({
  unit,
  form,
  setValue,
  goalWeight,
  setGoalWeight,
  weight,
  error,
  disabled,
}: any) {
  const decrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentValue, setCurrentValue] = useState(
    unit === "kgcm" ? form.goalWeight : goalWeight
  );
  const diff = currentValue - (unit === "kgcm" ? form.weight : weight);

  const incrementCurrentValue = () => {
    setCurrentValue((prev: any) => prev + 0.5);
  };

  const decrementCurrentValue = () => {
    setCurrentValue((prev: any) => prev - 0.5);
  };

  const decrementProps = useLongPress({ callback: decrementCurrentValue });
  const incrementProps = useLongPress({ callback: incrementCurrentValue });

  return (
    <div>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <p className="text-center font-semibold md:text-muted-foreground">
        {diff === 0
          ? "Maintain Weight"
          : diff > 0
          ? `Gain ${Math.abs(diff)} ${unit === "kgcm" ? "kg" : "lbs"}`
          : `Lose ${Math.abs(diff)} ${unit === "kgcm" ? "kg" : "lbs"}`}
      </p>
      <div className="h-[20vh] flex items-center justify-center gap-4">
        <Button
          type="button"
          className="h-9 w-9"
          size="icon"
          {...decrementProps}
          disabled={disabled}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <h2
          className={cn(
            "text-3xl transition-all font-semibold font-mono tabular-nums text-center",
            currentValue > 99 ? "w-[83px]" : "w-[66px]"
          )}
        >
          <CountUp
            start={currentValue}
            end={currentValue}
            decimals={1}
          />
        </h2>
        <Button
          type="button"
          className="h-9 w-9"
          size="icon"
          {...incrementProps}
          disabled={disabled}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default WeightInput;
