import { ExerciseId } from "../exercises/types";

export async function importFunction(functionName: ExerciseId) {
  switch (functionName) {
    case "band_biceps_curl":
      return (await import("./functions/band_biceps_curl")).band_biceps_curl;

    default:
      undefined;
  }
}
