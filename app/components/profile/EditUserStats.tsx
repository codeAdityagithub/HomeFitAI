import { convertToFeetInches, convertToLbs } from "@/lib/utils";
import { Unit } from "@prisma/client";
import { Calendar, Goal, Ruler } from "lucide-react";
import { GiWeightScale } from "react-icons/gi";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import EditAgeForm from "./EditAgeForm";
import EditHeightForm from "./EditHeightForm";
import EditWeightForm from "./EditWeightForm";

const icons = {
  age: (
    <Calendar
      size={30}
      className="text-gray-300"
    />
  ),
  height: (
    <Ruler
      size={30}
      className="text-yellow-600"
    />
  ),
  goalWeight: (
    <Goal
      size={30}
      className="text-red-400"
    />
  ),
  weight: (
    <GiWeightScale
      size={30}
      className="text-indigo-400"
    />
  ),
};
const text = {
  age: "Age",
  height: "Height",
  goalWeight: "Goal Weight",
  weight: "Weight",
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
        <div className="rounded-lg p-2 sm:p-4 border border-accent/20 hover:border-accent/50 transition-colors bg-gradient-to-tr from-secondary/50 to-accent/20 hover:cursor-pointer flex items-center gap-4">
          <span>{icons[stat]}</span>
          <div className="flex flex-col items-start">
            {stat !== "height" ? (
              <h2 className="text-xl xs:text-2xl font-bold">
                {stat !== "age"
                  ? props.unit === "kgcm"
                    ? init.toFixed(1)
                    : convertToLbs(init).toFixed(1)
                  : init}
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
      {stat === "weight" ? (
        <EditWeightForm
          init={init}
          type="Weight"
          unit={props.unit}
        />
      ) : null}
      {stat === "goalWeight" ? (
        <EditWeightForm
          init={init}
          type="Goal Weight"
          unit={props.unit}
        />
      ) : null}
    </ResponsiveDialog>
  );
};
export default EditUserStats;
