import { ExerciseId } from "../exercises/types";

const exerciseToFile: Partial<
  Record<ExerciseId, { module: string; functionName?: string }>
> = {
  jumping_jacks: {
    module: "./functions/jumping_jacks",
  },
  squat: {
    module: "./functions/squat",
  },
  band_biceps_curl: {
    module: "./functions/biceps",
  },
  band_alternating_biceps_curl: {
    module: "./functions/alternating_biceps",
  },
  plank: { module: "./functions/plank", functionName: "default" },
  band_bench_press: {
    module: "./functions/band_bench_press",
  },
  band_assisted_pullup: {
    module: "./functions/band_assisted_pull-up",
  },
};

export async function importFunction(functionName: ExerciseId) {
  const file = exerciseToFile[functionName];
  if (!file) return undefined;
  const { module, functionName: funcName = "default" } = file;
  return (await import(/* @vite-ignore */ module))[funcName];
}
