import { singleton } from "../singleton.server";
import exerciesJson from "./newexercises2.json" assert { type: "json" };
import { ExerciseId } from "./types";

const exercises = singleton("exercises", () => {
  try {
    return exerciesJson as Exercise[];
  } catch (error) {
    console.log("Error reading exercises", error);
    return [];
  }
});

export type ExerciseType = "duration" | "sets";
export type ExerciseEquipment = "rope" | "body weight" | "dumbbell" | "band";
export type Exercise = {
  bodyPart: string;
  met: number;
  equipment: ExerciseEquipment;
  movement: "bilateral" | "unilateral" | "static";
  id: ExerciseId;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  videoId: string;
  type: ExerciseType;
};

export default exercises as Exercise[];
