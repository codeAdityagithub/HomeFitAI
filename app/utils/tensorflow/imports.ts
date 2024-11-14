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
  plank: { module: "./functions/plank" },
  band_bench_press: {
    module: "./functions/band_bench_press",
  },
  band_stiff_leg_deadlift: {
    module: "./functions/deadlift",
  },
  standing_split_squats: {
    module: "./functions/alternating_lunge",
  },
  dumbbell_standing_calf_raise: {
    module: "./functions/calf_raises",
  },
  bodyweight_standing_calf_raise: {
    module: "./functions/calf_raises",
  },
  kneeling_pushup: {
    module: "./functions/pushup",
  },
  incline_pushup: {
    module: "./functions/pushup",
  },
  incline_closegrip_pushup: {
    module: "./functions/pushup",
  },
  band_shoulder_press: {
    module: "./functions/ohp",
  },
  band_lateral_raise: {
    module: "./functions/lateral_raise",
  },
  dumbbell_lateral_raise: {
    module: "./functions/lateral_raise",
  },
  // band_standing_rear_delt_row: {
  //   module: "./functions/band_readdelt_row",
  // },
  scapular_pullup: {
    module: "./functions/scap_pull",
  },
  pullup: {
    module: "./functions/pullup",
  },
  wide_grip_pullup: {
    module: "./functions/pullup",
  },
  close_grip_chinup: {
    module: "./functions/pullup",
  },
  band_assisted_pullup: {
    module: "./functions/pullup",
  },
};

export async function importFunction(functionName: ExerciseId) {
  const file = exerciseToFile[functionName];
  if (!file) return undefined;
  const { module, functionName: funcName = "default" } = file;
  return (await import(/* @vite-ignore */ module))[funcName];
}
