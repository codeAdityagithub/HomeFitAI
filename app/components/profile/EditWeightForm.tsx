import { useFetcher, useNavigation } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { Unit } from "@prisma/client";
import { convertToKg, convertToLbs } from "@/lib/utils";
import useLongPress from "@/hooks/useLongPress";
import { constants } from "@/utils/detailsPage/zodConstants";
import { ProfileAction } from "@/routes/dashboard+/profile+";
import { useToast } from "@/hooks/use-toast";

const EditWeightForm = ({
  init,
  unit,
  type,
}: {
  init: number;
  unit: Unit;
  type: "Weight" | "Goal Weight";
}) => {
  const fetcher = useFetcher<ProfileAction>();
  const [value, setValue] = useState(init);
  const [other, setOther] = useState(convertToLbs(init));
  const min = constants.MIN_AGE,
    max = constants.MAX_AGE;
  const disabled = fetcher.state !== "idle" || value === init;

  function decrement() {
    if (unit === "kgcm")
      setValue((prev) =>
        Math.max(min, Math.min(max, Number((prev - 0.1).toFixed(2))))
      );
    else setOther((prev) => Number((prev - 0.1).toFixed(2)));
  }
  function increment() {
    if (unit === "kgcm")
      setValue((prev) =>
        Math.max(min, Math.min(max, Number((prev + 0.1).toFixed(2))))
      );
    else setOther((prev) => Number((prev + 0.1).toFixed(2)));
  }
  const decrementProps = useLongPress({ callback: decrement });
  const incrementProps = useLongPress({ callback: increment });
  useEffect(() => {
    setValue(Math.min(Math.max(convertToKg(other), min), max));
  }, [other]);

  function handleSubmit(e: any) {
    e.preventDefault();

    fetcher.submit(
      { value, _action: type === "Weight" ? "weight" : "goalWeight" },
      {
        method: "put",
        encType: "application/json",
      }
    );
  }
  const { toast } = useToast();
  useEffect(() => {
    // @ts-expect-error
    if (fetcher.data?.error) {
      toast({
        // @ts-expect-error
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data]);

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
          <div className="text-5xl md:text-6xl font-bold tracking-tighter">
            {unit === "kgcm" ? value.toFixed(1) : other.toFixed(1)}
          </div>

          <div className="text-[0.70rem] uppercase text-muted-foreground">
            {type}
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
export default EditWeightForm;
