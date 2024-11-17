import { LOG_CONSTANTS } from "@/lib/constants";
import { ExerciseEquipment } from "@/utils/exercises/exercises.server";
import { capitalizeFirstLetter } from "@/utils/general";
import { useFetcher } from "@remix-run/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function CaloriesExerciseSelectForm({
  exerciseId,
  logId,
  exerciseEquipment,
}: {
  exerciseId: string;
  logId: string;
  exerciseEquipment: ExerciseEquipment;
}) {
  const isWeighted = exerciseEquipment === "dumbbell";

  const [step, setStep] = useState(1);
  const [numberOfSets, setNumberOfSets] = useState(1);
  const [sets, setSets] = useState([
    { reps: 1, intensity: "explosive", weight: isWeighted ? 1 : null },
  ]);
  const [currentSet, setCurrentSet] = useState(0);
  const fetcher = useFetcher<any>({ key: "totalCalories-fetcher" });

  const min = LOG_CONSTANTS.exercise.reps.min,
    max = LOG_CONSTANTS.exercise.reps.max;
  const handleNumberOfSetsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNumber = Math.max(1, Math.min(6, parseInt(e.target.value, 10)));
    setNumberOfSets(newNumber);
    if (!isNaN(newNumber))
      setSets(
        Array.from({ length: newNumber }, () => ({
          reps: 1,
          intensity: "explosive",
          weight: isWeighted ? 1 : null,
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
    } else if (name === "weight") {
      const newWeight = Math.max(
        1,
        Math.min(LOG_CONSTANTS.exercise.max_weight, parseInt(value, 10))
      );

      const newSets = sets.map((set, i) =>
        i === index ? { ...set, weight: newWeight } : set
      );
      setSets(newSets);
    } else {
      const newReps = Math.max(min, Math.min(max, parseInt(value, 10)));

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
                min={min}
                max={max}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              Intensity:
              <select
                name="intensity"
                value={sets[currentSet].intensity}
                onChange={(e) =>
                  handleSetChange(currentSet, {
                    // @ts-expect-error
                    target: { name: "intensity", value: e.target.value },
                  })
                }
                className="w-full bg-transparent h-full p-2 rounded-md border"
              >
                {/* <SelectTrigger id="intensity">
                  <SelectValue placeholder="Set Intensity" />
                </SelectTrigger> */}
                {/* <SelectContent> */}
                <option
                  className="bg-background "
                  value="explosive"
                >
                  Explosive
                </option>
                <option
                  className="bg-background "
                  value="controlled"
                >
                  Controlled
                </option>
                {/* </SelectContent> */}
              </select>
            </Label>
            {isWeighted && sets[currentSet].weight !== null && (
              <Label className="flex flex-col gap-2">
                Weight (in kgs):
                <Input
                  type="number"
                  name="weight"
                  value={sets[currentSet].weight}
                  onChange={(e) => handleSetChange(currentSet, e)}
                  min="1"
                  max={LOG_CONSTANTS.exercise.max_weight}
                />
              </Label>
            )}
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
                    weight: e ? sets[0].weight : null,
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
                {isWeighted
                  ? "Same Reps, Intensity and Weight for all sets?"
                  : "Same Reps and Intensity for all sets?"}
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
                  Rep{s.reps > 1 && "s"} {s.weight ? ` , ${s.weight} kg` : ""}
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
