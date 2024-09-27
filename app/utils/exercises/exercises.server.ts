import fs from "fs";
import { singleton } from "../singleton.server";
import path from "path";
import { ExerciseId } from "./types";

const exercises = singleton("exercises", () => {
  try {
    const content = fs.readFileSync(
      path.resolve(import.meta.dirname, "newexercises2.json"),
      "utf-8"
    );
    return JSON.parse(content);
  } catch (error) {
    console.log("Error reading exercises", error);
    return [];
  }
});

export type Exercise = {
  bodyPart: string;
  met: number;
  equipment: "rope" | "body weight" | "dumbbell" | "band";
  movement: "bilateral" | "unilateral" | "static";
  id: ExerciseId;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  videoId: string;
  type: "duration" | "sets";
};

export default exercises as Exercise[];
