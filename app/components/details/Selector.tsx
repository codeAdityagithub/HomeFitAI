import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import CountUp from "react-countup";
function WeightInput({
  unit,
  form,
  setValue,
  goalWeight,
  setGoalWeight,
  weight,
  error,
}: any) {
  const decrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentValue, setCurrentValue] = useState(
    unit === "kgcm" ? form.goalWeight : goalWeight
  );
  const diff = currentValue - (unit === "kgcm" ? form.weight : weight);
  const startDecrement = () => {
    if (decrementIntervalRef.current !== null) return;
    decrementIntervalRef.current = setInterval(() => {
      setCurrentValue((prev: any) => prev - 0.5);
    }, 100); // Decrease every 100ms
  };

  const startIncrement = () => {
    if (incrementIntervalRef.current !== null) return;

    incrementIntervalRef.current = setInterval(() => {
      setCurrentValue((prev: any) => prev + 0.5);
    }, 100); // Increase every 100ms
  };

  const stopDecrement = () => {
    if (decrementIntervalRef.current !== null) {
      clearInterval(decrementIntervalRef.current);
      if (unit === "kgcm") {
        setValue("goalWeight", currentValue);
      } else setGoalWeight(currentValue);
      decrementIntervalRef.current = null;
    }
  };

  const stopIncrement = () => {
    if (incrementIntervalRef.current !== null) {
      clearInterval(incrementIntervalRef.current);
      if (unit === "kgcm") {
        setValue("goalWeight", currentValue);
      } else setGoalWeight(currentValue);
      incrementIntervalRef.current = null;
    }
  };

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
          onClick={() => setCurrentValue((prev: any) => prev - 0.5)}
          onMouseDown={startDecrement}
          onMouseUp={stopDecrement}
          onMouseLeave={stopDecrement}
          onTouchStart={startDecrement} // For touch devices
          onTouchEnd={stopDecrement}
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
          onClick={() => setCurrentValue((prev: any) => prev + 0.5)}
          onMouseDown={startIncrement}
          onMouseUp={stopIncrement}
          onMouseLeave={stopIncrement}
          onTouchStart={startIncrement} // For touch devices
          onTouchEnd={stopIncrement}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default WeightInput;
