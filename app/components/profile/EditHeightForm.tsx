import { useFetcher, useNavigation } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { Unit } from "@prisma/client";
import { convertToCm, convertToFeetInches } from "@/lib/utils";
import CountUp from "react-countup";
import useLongPress from "@/hooks/useLongPress";
import { constants } from "@/utils/detailsPage/zodConstants";

const EditHeightForm = ({ init, unit }: { init: number; unit: Unit }) => {
  const fetcher = useFetcher();
  const [value, setValue] = useState(init);
  const [other, setOther] = useState(convertToFeetInches(init));
  const otherInit = useMemo(() => convertToFeetInches(init), [init]);
  const min = 100,
    max = constants.MAX_HEIGHT;
  const disabled =
    fetcher.state !== "idle" ||
    (unit === "kgcm"
      ? value === init
      : other.feet === otherInit.feet && other.inch === otherInit.inch);
  console.log(init, value);
  function decrement() {
    if (unit === "kgcm")
      setValue((prev) => Math.max(min, Math.min(max, prev - 0.5)));
    else
      setOther((prev) => ({
        feet: prev.inch > 0 ? prev.feet : prev.feet - 1,
        inch: prev.inch > 0 ? prev.inch - 1 : 11,
      }));
  }
  function increment() {
    if (unit === "kgcm")
      setValue((prev) => Math.max(min, Math.min(max, prev + 0.5)));
    else
      setOther((prev) => ({
        feet: prev.inch < 11 ? prev.feet : prev.feet + 1,
        inch: prev.inch < 11 ? prev.inch + 1 : 0,
      }));
  }
  const decrementProps = useLongPress({ callback: decrement });
  const incrementProps = useLongPress({ callback: increment });
  useEffect(() => {
    if (unit === "lbsft")
      setValue(
        Math.min(Math.max(convertToCm(other.feet, other.inch), min), max)
      );
  }, [other]);

  function handleSubmit(e: any) {
    e.preventDefault();

    fetcher.submit(
      { value, _action: "height" },
      {
        method: "put",
        encType: "application/json",
      }
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 pb-0"
    >
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          disabled={value <= min || fetcher.state === "submitting"}
          {...decrementProps}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="flex-1 text-center">
          {unit === "kgcm" ? (
            <div className="text-5xl md:text-6xl font-bold tracking-tighter">
              <CountUp
                start={value}
                end={value}
                decimals={1}
              />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-0.5">
              <span className="text-5xl md:text-6xl font-bold">
                {other.feet}
              </span>
              ft
              <span className="text-5xl md:text-6xl font-bold">
                {other.inch}
              </span>
              in
            </div>
          )}
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            Height
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-8 w-8 shrink-0 rounded-full"
          disabled={value >= max || fetcher.state === "submitting"}
          {...incrementProps}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
      <Button
        variant="accent"
        disabled={disabled}
        className="w-full mt-4"
      >
        Save
      </Button>
    </form>
  );
};
export default EditHeightForm;
