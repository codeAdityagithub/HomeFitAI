import { Calendar, Goal, Minus, Plus, Ruler } from "lucide-react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { GiWeightScale } from "react-icons/gi";
import { Unit } from "@prisma/client";
import { convertToFeetInches } from "@/lib/utils";
import EditAgeForm from "./EditAgeForm";
import EditHeightForm from "./EditHeightForm";

const icons = {
  age: <Calendar size={30} />,
  height: <Ruler size={30} />,
  goalWeight: <Goal size={30} />,
  weight: <GiWeightScale size={30} />,
};
const text = {
  age: "Age",
  height: "Height",
  goalWeight: "Goal Weight",
  weight: "Weight",
};
const units = {
  kgcm: {
    age: "years",
    goalWeight: "kg",
    weight: "kg",
  },
  lbsft: {
    age: "years",
    goalWeight: "lbs",
    weight: "lbs",
  },
};

const limits = {
  age: [18, 65],
  height: [140, 220],
  goalWeight: [30, 200],
  weight: [30, 200],
};

type Props =
  | {
      stat: "age";
      init: number;
    }
  | {
      stat: "height" | "goalWeight" | "weight";
      init: number;
      unit: Unit; // Only present when stat is not "age"
    };
const EditUserStats = (props: Props) => {
  const { stat, init } = props;

  return (
    <ResponsiveDialog
      title={`Edit ${text[stat]}`}
      description={`Edit your profile settings to keep progress consistent.`}
      trigger={
        <div className="rounded-lg p-2 sm:p-4 border border-accent/10 bg-secondary hover:cursor-pointer flex items-center gap-4">
          <span>{icons[stat]}</span>
          <div className="flex flex-col items-start">
            {stat !== "height" ? (
              <h2 className="text-xl xs:text-2xl font-bold">
                {init}
                <small className="ml-1 text-xs font-normal text-secondary-foreground/80">
                  {stat === "age"
                    ? "years"
                    : (stat === "weight" || stat === "goalWeight") &&
                      (props.unit === "kgcm" ? "kg" : "lbs")}
                </small>
              </h2>
            ) : (
              <h2 className="text-xl font-bold xs:text-2xl">
                {props.unit === "kgcm" ? (
                  <>
                    {init}
                    <small className="ml-1 text-secondary-foreground/90 text-xs font-normal">
                      cm
                    </small>
                  </>
                ) : (
                  <>
                    {convertToFeetInches(init).feet}
                    <small className="text-secondary-foreground/80 text-xs ml-0.5 font-normal">
                      ft
                    </small>
                    <span className="mx-0.5"></span>
                    {convertToFeetInches(init).inch}
                    <small className="text-secondary-foreground/80 text-xs ml-0.5 font-normal">
                      in
                    </small>
                  </>
                )}
              </h2>
            )}
            <small className="text-muted-foreground">{text[stat]}</small>
          </div>
        </div>
      }
    >
      {stat === "age" ? <EditAgeForm init={init} /> : null}
      {stat === "height" ? (
        <EditHeightForm
          init={init}
          unit={props.unit}
        />
      ) : null}
    </ResponsiveDialog>
  );
};
export default EditUserStats;
