import { ExerciseId } from "../exercises/types";
import {
  PositionFunction,
  PositionFunctionUnilateral,
  StaticPosFunction,
} from "./functions.client";

const exerciseToFile: Partial<
  Record<
    ExerciseId,
    {
      module: () => Promise<
        StaticPosFunction | PositionFunction | PositionFunctionUnilateral
      >;
    }
  >
> = {
  jumping_jacks: {
    module: () =>
      import("../../.client/functions/jumping_jacks").then((m) => m.default),
  },
  squat: {
    module: () =>
      import("../../.client/functions/squat").then((m) => m.default),
  },
  jump_squat: {
    module: () =>
      import("../../.client/functions/squat").then((m) => m.default),
  },
  band_squat: {
    module: () =>
      import("../../.client/functions/squat").then((m) => m.default),
  },
  dumbbell_front_squat: {
    module: () =>
      import("../../.client/functions/squat").then((m) => m.default),
  },
  band_biceps_curl: {
    module: () =>
      import("../../.client/functions/biceps").then((m) => m.default),
  },
  dumbbell_biceps_curl: {
    module: () =>
      import("../../.client/functions/biceps").then((m) => m.default),
  },
  dumbbell_hammer_curl: {
    module: () =>
      import("../../.client/functions/biceps").then((m) => m.default),
  },
  band_concentration_curl: {
    module: () =>
      import("../../.client/functions/conc_curl").then((m) => m.default),
  },
  band_alternating_biceps_curl: {
    module: () =>
      import("../../.client/functions/alternating_biceps").then(
        (m) => m.default
      ),
  },
  dumbbell_alternate_biceps_curl: {
    module: () =>
      import("../../.client/functions/alternating_biceps").then(
        (m) => m.default
      ),
  },
  plank: {
    module: () =>
      import("../../.client/functions/plank").then((m) => m.default),
  },
  side_plank: {
    module: () =>
      import("../../.client/functions/plank").then((m) => m.default),
  },
  incline_side_plank: {
    module: () =>
      import("../../.client/functions/plank").then((m) => m.default),
  },
  band_bench_press: {
    module: () =>
      import("../../.client/functions/band_bench_press").then((m) => m.default),
  },
  band_stiff_leg_deadlift: {
    module: () =>
      import("../../.client/functions/deadlift").then((m) => m.default),
  },
  dumbbell_single_leg_deadlift: {
    module: () =>
      import("../../.client/functions/deadlift_alter").then((m) => m.default),
  },
  standing_split_squats: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  bodyweight_lunge: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  band_single_leg_split_squat: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  dumbbell_rear_lunge: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  dumbbell_lunge: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  bulgarian_split_squats: {
    module: () =>
      import("../../.client/functions/alternating_lunge").then(
        (m) => m.default
      ),
  },
  dumbbell_standing_calf_raise: {
    module: () =>
      import("../../.client/functions/calf_raises").then((m) => m.default),
  },
  bodyweight_standing_calf_raise: {
    module: () =>
      import("../../.client/functions/calf_raises").then((m) => m.default),
  },
  kneeling_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  // bodyweight_kneeling_triceps_extension: {
  //   module: ()=>import("../../.client/functions/triceps_ext_bw").then(m=>m.default),
  // },
  pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  ring_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  incline_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  clap_push_up: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  decline_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  deep_push_up: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  diamond_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  incline_closegrip_pushup: {
    module: () =>
      import("../../.client/functions/pushup").then((m) => m.default),
  },
  band_shoulder_press: {
    module: () => import("../../.client/functions/ohp").then((m) => m.default),
  },
  dumbbell_standing_overhead_press: {
    module: () => import("../../.client/functions/ohp").then((m) => m.default),
  },
  dumbbell_arnold_press: {
    module: () => import("../../.client/functions/ohp").then((m) => m.default),
  },
  band_lateral_raise: {
    module: () =>
      import("../../.client/functions/lateral_raise").then((m) => m.default),
  },
  dumbbell_lateral_raise: {
    module: () =>
      import("../../.client/functions/lateral_raise").then((m) => m.default),
  },
  dumbbell_one_arm_lateral_raise: {
    module: () =>
      import("../../.client/functions/lateral_raise_alter").then(
        (m) => m.default
      ),
  },
  // band_standing_rear_delt_row: {
  //   module: ()=>import("../../.client/functions/band_readdelt_row").then(m=>m.default),
  // },
  scapular_pullup: {
    module: () =>
      import("../../.client/functions/scap_pull").then((m) => m.default),
  },
  pullup: {
    module: () =>
      import("../../.client/functions/pullup").then((m) => m.default),
  },
  wide_grip_pullup: {
    module: () =>
      import("../../.client/functions/pullup").then((m) => m.default),
  },
  close_grip_chinup: {
    module: () =>
      import("../../.client/functions/pullup").then((m) => m.default),
  },
  band_assisted_pullup: {
    module: () =>
      import("../../.client/functions/pullup").then((m) => m.default),
  },
  archer_pull_up: {
    module: () =>
      import("../../.client/functions/pullup_archer").then((m) => m.default),
  },
  bodyweight_standing_row_with_towel: {
    module: () => import("../../.client/functions/row").then((m) => m.default),
  },
  suspended_row: {
    module: () => import("../../.client/functions/row").then((m) => m.default),
  },
  dumbbell_bent_over_row: {
    module: () =>
      import("../../.client/functions/bent_row").then((m) => m.default),
  },
  band_closegrip_pulldown: {
    module: () =>
      import("../../.client/functions/pulldown").then((m) => m.default),
  },
  mountain_climber_cross_body: {
    module: () =>
      import("../../.client/functions/mountain_climber").then((m) => m.default),
  },
  russian_twist: {
    module: () =>
      import("../../.client/functions/russian_twist").then((m) => m.default),
  },
  band_triceps_extension: {
    module: () =>
      import("../../.client/functions/triceps_ext").then((m) => m.default),
  },
  low_glute_bridge_on_floor: {
    module: () =>
      import("../../.client/functions/glute_bridge").then((m) => m.default),
  },
  glute_bridge_on_bench: {
    module: () =>
      import("../../.client/functions/glute_bridge").then((m) => m.default),
  },
  // band_reverse_fly: {
  //   module: ()=>import("../../.client/functions/reverse_fly").then(m=>m.default),
  // },
  hanging_knee_raise: {
    module: () =>
      import("../../.client/functions/knee_raise").then((m) => m.default),
  },
  hanging_straight_leg_raise: {
    module: () =>
      import("../../.client/functions/knee_raise").then((m) => m.default),
  },
  seated_knee_tucks: {
    module: () =>
      import("../../.client/functions/knee_tucks").then((m) => m.default),
  },
  situp: {
    module: () =>
      import("../../.client/functions/situp").then((m) => m.default),
  },
  // dumbbell_fly:{
  //   module: ()=>import("../../.client/functions/fly").then(m=>m.default),
  // }
  pike_pushup: {
    module: () => import("../../.client/functions/pike").then((m) => m.default),
  },
};

export async function importFunction(functionName: ExerciseId) {
  if (typeof window === undefined) throw new Error("Client only functions");
  const file = exerciseToFile[functionName];
  if (!file) return undefined;
  return file.module();
}
