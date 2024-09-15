import { ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/general";
import { Checkbox } from "../ui/checkbox";
import { useFetcher } from "@remix-run/react";

function CaloriesExerciseSelectForm({
  exerciseId,
  logId,
}: {
  exerciseId: string;
  logId: string;
}) {
  const [step, setStep] = useState(1);
  const [numberOfSets, setNumberOfSets] = useState(1);
  const [sets, setSets] = useState([{ reps: 1, intensity: "explosive" }]);
  const [currentSet, setCurrentSet] = useState(0);
  const fetcher = useFetcher<any>({ key: "totalCalories-fetcher" });

  const handleNumberOfSetsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNumber = Math.max(1, Math.min(6, parseInt(e.target.value, 10)));
    setNumberOfSets(newNumber);
    if (!isNaN(newNumber))
      setSets(
        Array.from({ length: newNumber }, () => ({
          reps: 1,
          intensity: "explosive",
        }))
      );
  };

  const handleSetChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "intensity") {
      const newSets = sets.map((set, i) =>
        i === index ? { ...set, intensity: value } : set
      );
      setSets(newSets);
    } else {
      const newReps = Math.max(1, Math.min(50, parseInt(value, 10)));

      const newSets = sets.map((set, i) =>
        i === index ? { ...set, reps: newReps } : set
      );
      setSets(newSets);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Submitted data:", sets);
    fetcher.submit(
      { value: sets, _action: "totalCalories", logId, exerciseId },
      {
        method: "put",
        action: "/dashboard",
        encType: "application/json",
      }
    );
  };

  return (
    <form
      className="my-4 max-w-md"
      onSubmit={handleSubmit}
    >
      {step === 1 && (
        <div className="space-y-2">
          <Label className="flex flex-col gap-2">
            Number of Sets:
            <Input
              type="number"
              value={numberOfSets}
              onChange={handleNumberOfSetsChange}
              min={1}
              max={6}
            />
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isNaN(numberOfSets)}
            onClick={() => setStep(2)}
          >
            Next
            <ArrowRight size={15} />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">
            Enter Details for{" "}
            <span className="text-accent underline underline-offset-4">
              Set {currentSet + 1}
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Label className="flex flex-col gap-2">
              Reps:
              <Input
                type="number"
                name="reps"
                value={sets[currentSet].reps}
                onChange={(e) => handleSetChange(currentSet, e)}
                min="1"
                max={50}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              Intensity:
              <Select
                name="intensity"
                value={sets[currentSet].intensity}
                onValueChange={(e) =>
                  handleSetChange(currentSet, {
                    // @ts-expect-error
                    target: { name: "intensity", value: e },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Set Intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="explosive">Explosive</SelectItem>
                  <SelectItem value="controlled">Controlled</SelectItem>
                </SelectContent>
              </Select>
            </Label>
          </div>
          {currentSet === 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                disabled={isNaN(sets[0].reps)}
                onCheckedChange={(e) => {
                  const newSets = sets.map((set) => ({
                    ...set,
                    reps: e ? sets[0].reps : 1,
                    intensity: e ? sets[0].intensity : "explosive",
                  }));
                  setSets(newSets);
                  if (e) {
                    setCurrentSet(sets.length - 1);
                  } else {
                    setCurrentSet(0);
                  }
                }}
                id="same"
              />
              <label
                htmlFor="same"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Same Reps and Intensity for all sets.
              </label>
            </div>
          )}
          <div className="w-full flex justify-between">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="hover:bg-secondary"
              onClick={() => {
                setCurrentSet((prev) => Math.max(prev - 1, 0));
                if (currentSet === 0) {
                  setStep(1);
                }
              }}
            >
              <ArrowLeft size={15} />
              {currentSet === 0 ? "Sets" : "Prev"}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isNaN(sets[currentSet].reps)}
              onClick={() => {
                setCurrentSet((prev) => Math.min(prev + 1, sets.length - 1));
                if (currentSet === sets.length - 1) {
                  setStep(3);
                }
              }}
            >
              Next
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <strong>Review:</strong>
          <div className="p-2 space-y-2">
            {sets.map((s, i) => (
              <div
                key={"set-" + i}
                className="flex gap-2"
              >
                <p>
                  Set {i + 1} : {s.reps} {capitalizeFirstLetter(s.intensity)}{" "}
                  Reps
                </p>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-between">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="hover:bg-secondary"
              onClick={() => setStep(2)}
            >
              <ArrowLeft size={15} />
              Sets
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                fetcher.state !== "idle" || sets.some((s) => isNaN(s.reps))
              }
            >
              Add To Log
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
export default CaloriesExerciseSelectForm;
