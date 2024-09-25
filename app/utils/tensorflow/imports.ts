import { ExerciseId } from "../exercises/types";

export async function importFunction(functionName: ExerciseId) {
  switch (functionName) {
    case "band_biceps_curl":
      return (await import("./functions/band_biceps_curl")).band_biceps_curl;
    case "band_alternating_biceps_curl":
      return (await import("./functions/band_alternating_biceps_curl")).default;
    case "plank":
      return (await import("./functions/plank")).default;
    case "band_bench_press":
      return (await import("./functions/band_bench_press")).default;
    case "band_assisted_pullup":
      return (await import("./functions/band_assisted_pull-up")).default;
    default:
      undefined;
  }
}
