import fs from "fs";
import { singleton } from "../singleton.server";
import path from "path";

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
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  videoId: string;
}

export default exercises as Exercise[];
