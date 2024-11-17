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
  jump_squat: {
    module: "./functions/squat",
  },
  band_squat: {
    module: "./functions/squat",
  },
  dumbbell_front_squat: {
    module: "./functions/squat",
  },
  band_biceps_curl: {
    module: "./functions/biceps",
  },
  dumbbell_biceps_curl: {
    module: "./functions/biceps",
  },
  dumbbell_hammer_curl: {
    module: "./functions/biceps",
  },
  band_concentration_curl: {
    module: "./functions/conc_curl",
  },
  band_alternating_biceps_curl: {
    module: "./functions/alternating_biceps",
  },
  dumbbell_alternate_biceps_curl: {
    module: "./functions/alternating_biceps",
  },
  plank: { module: "./functions/plank" },
  side_plank: { module: "./functions/plank" },
  incline_side_plank: { module: "./functions/plank" },
  band_bench_press: {
    module: "./functions/band_bench_press",
  },
  band_stiff_leg_deadlift: {
    module: "./functions/deadlift",
  },
  dumbbell_single_leg_deadlift: {
    module: "./functions/deadlift_alter",
  },
  standing_split_squats: {
    module: "./functions/alternating_lunge",
  },
  bodyweight_lunge: {
    module: "./functions/alternating_lunge",
  },
  band_single_leg_split_squat: {
    module: "./functions/alternating_lunge",
  },
  dumbbell_rear_lunge: {
    module: "./functions/alternating_lunge",
  },
  dumbbell_lunge: {
    module: "./functions/alternating_lunge",
  },
  bulgarian_split_squats: {
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
  // bodyweight_kneeling_triceps_extension: {
  //   module: "./functions/triceps_ext_bw",
  // },
  pushup: {
    module: "./functions/pushup",
  },
  ring_pushup: {
    module: "./functions/pushup",
  },
  incline_pushup: {
    module: "./functions/pushup",
  },
  clap_push_up: {
    module: "./functions/pushup",
  },
  decline_pushup: {
    module: "./functions/pushup",
  },
  deep_push_up: {
    module: "./functions/pushup",
  },
  diamond_pushup: {
    module: "./functions/pushup",
  },
  incline_closegrip_pushup: {
    module: "./functions/pushup",
  },
  band_shoulder_press: {
    module: "./functions/ohp",
  },
  dumbbell_standing_overhead_press: {
    module: "./functions/ohp",
  },
  dumbbell_arnold_press: {
    module: "./functions/ohp",
  },
  band_lateral_raise: {
    module: "./functions/lateral_raise",
  },
  dumbbell_lateral_raise: {
    module: "./functions/lateral_raise",
  },
  dumbbell_one_arm_lateral_raise: {
    module: "./functions/lateral_raise_alter",
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
  archer_pull_up: {
    module: "./functions/pullup_archer",
  },
  bodyweight_standing_row_with_towel: {
    module: "./functions/row",
  },
  suspended_row: {
    module: "./functions/row",
  },
  dumbbell_bent_over_row: {
    module: "./functions/bent_row",
  },
  band_closegrip_pulldown: {
    module: "./functions/pulldown",
  },
  mountain_climber_cross_body: {
    module: "./functions/mountain_climber",
  },
  russian_twist: {
    module: "./functions/russian_twist",
  },
  band_triceps_extension: {
    module: "./functions/triceps_ext",
  },
  low_glute_bridge_on_floor: {
    module: "./functions/glute_bridge",
  },
  glute_bridge_on_bench: {
    module: "./functions/glute_bridge",
  },
  // band_reverse_fly: {
  //   module: "./functions/reverse_fly",
  // },
  hanging_knee_raise: {
    module: "./functions/knee_raise",
  },
  hanging_straight_leg_raise: {
    module: "./functions/knee_raise",
  },
  seated_knee_tucks: {
    module: "./functions/knee_tucks",
  },
  situp: {
    module: "./functions/situp",
  },
  // dumbbell_fly:{
  //   module: "./functions/fly",
  // }
  pike_pushup: {
    module: "./functions/pike",
  },
};

export async function importFunction(functionName: ExerciseId) {
  const file = exerciseToFile[functionName];
  if (!file) return undefined;
  const { module, functionName: funcName = "default" } = file;
  return (await import(/* @vite-ignore */ module))[funcName];
}
