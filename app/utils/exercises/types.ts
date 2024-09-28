import { z } from "zod";

export type ExerciseId =
  | "jump_rope"
  | "mountain_climber_cross_body"
  | "burpee"
  | "bulgarian_split_squats"
  | "dynamic_chest_stretch"
  | "dumbbell_single_leg_deadlift"
  | "plank"
  | "russian_twist"
  | "situp"
  | "hanging_knee_raise"
  | "hanging_straight_leg_raise"
  | "seated_knee_tucks"
  | "incline_side_plank"
  | "side_plank"
  | "jump_squat"
  | "squat"
  | "dumbbell_front_squat"
  | "clap_push_up"
  | "band_alternating_biceps_curl"
  | "band_bench_press"
  | "band_closegrip_pulldown"
  | "band_concentration_curl"
  | "band_front_raise"
  | "band_lateral_raise"
  | "band_biceps_curl"
  | "band_reverse_fly"
  | "band_shoulder_press"
  | "band_single_leg_split_squat"
  | "band_squat"
  | "band_stiff_leg_deadlift"
  | "dumbbell_bench_press"
  | "dumbbell_fly"
  | "chest_dip"
  | "archer_pull_up"
  | "band_assisted_pullup"
  | "pullup"
  | "wide_grip_pullup"
  | "scapular_pullup"
  | "close_grip_chinup"
  | "band_standing_rear_delt_row"
  | "bodyweight_standing_row"
  | "bodyweight_standing_row_with_towel"
  | "dumbbell_bent_over_row"
  | "suspended_row"
  | "dumbbell_standing_overhead_press"
  | "dumbbell_arnold_press"
  | "dumbbell_lateral_raise"
  | "dumbbell_one_arm_lateral_raise"
  | "dumbbell_rear_lateral_raise"
  | "dumbbell_biceps_curl"
  | "dumbbell_alternate_biceps_curl"
  | "band_triceps_extension"
  | "bodyweight_kneeling_triceps_extension"
  | "dumbbell_hammer_curl"
  | "dumbbell_lunge"
  | "bodyweight_lunge"
  | "dumbbell_rear_lunge"
  | "bodyweight_standing_calf_raise"
  | "dumbbell_standing_calf_raise"
  | "standing_split_squats"
  | "glute_bridge_on_bench"
  | "low_glute_bridge_on_floor"
  | "archer_push_up"
  | "band_pushup"
  | "deep_push_up"
  | "wide_hand_push_up"
  | "decline_pushup"
  | "diamond_pushup"
  | "handstand_pushup"
  | "pike_pushup"
  | "incline_closegrip_pushup"
  | "incline_pushup"
  | "kneeling_pushup"
  | "pushup"
  | "pushup_wall"
  | "single_arm_pushup"
  | "ring_pushup"
  | "single_leg_squat_pistol"
  | "jumping_jacks";

export enum ExercisePosition {
  Top = 0, // 0 means Top or Up position
  Mid = 1, // 1 means Mid position
  Bottom = 2, // 2 means Bottom or Down position
}

export const ExerciseGoalSchema = z
  .object({
    goal: z.enum(["Reps", "TUT", "Timed", "Free"]),
    duration: z.number().min(0, "Invalid duration selected."),
  })
  .refine(({ goal, duration }) => {
    switch (goal) {
      case "Reps":
        return duration <= 100 && duration >= 3;
      case "TUT":
        return duration <= 10 && duration >= 1;
      case "Timed":
        return duration <= 300 && duration >= 10;
      case "Free":
        return true;
      default:
        return false;
    }
  });

export type ExerciseGoals = typeof ExerciseGoalSchema._input.goal;

export enum ExerciseStartPosition {
  jump_rope = ExercisePosition.Top, // TODO
  mountain_climber_cross_body = ExercisePosition.Top, // TODO
  burpee = ExercisePosition.Bottom, // TODO
  bulgarian_split_squats = ExercisePosition.Top,
  dynamic_chest_stretch = ExercisePosition.Top,
  dumbbell_single_leg_deadlift = ExercisePosition.Top,
  plank = ExercisePosition.Top, // TODO
  russian_twist = ExercisePosition.Top, // TODO
  situp = ExercisePosition.Bottom,
  hanging_knee_raise = ExercisePosition.Top,
  hanging_straight_leg_raise = ExercisePosition.Top,
  seated_knee_tucks = ExercisePosition.Top,
  incline_side_plank = ExercisePosition.Top, // TODO
  side_plank = ExercisePosition.Top, // TODO
  jump_squat = ExercisePosition.Top,
  squat = ExercisePosition.Bottom,
  dumbbell_front_squat = ExercisePosition.Bottom,
  clap_push_up = ExercisePosition.Top,
  band_alternating_biceps_curl = ExercisePosition.Bottom,
  band_bench_press = ExercisePosition.Top,
  band_closegrip_pulldown = ExercisePosition.Bottom,
  band_concentration_curl = ExercisePosition.Bottom,
  band_front_raise = ExercisePosition.Bottom,
  band_lateral_raise = ExercisePosition.Bottom,
  band_biceps_curl = ExercisePosition.Bottom,
  band_reverse_fly = ExercisePosition.Bottom,
  band_shoulder_press = ExercisePosition.Top,
  band_single_leg_split_squat = ExercisePosition.Top,
  band_squat = ExercisePosition.Top,
  band_stiff_leg_deadlift = ExercisePosition.Bottom,
  dumbbell_bench_press = ExercisePosition.Top,
  dumbbell_fly = ExercisePosition.Top,
  chest_dip = ExercisePosition.Top,
  archer_pull_up = ExercisePosition.Bottom,
  band_assisted_pullup = ExercisePosition.Bottom,
  pullup = ExercisePosition.Bottom,
  wide_grip_pullup = ExercisePosition.Bottom,
  scapular_pullup = ExercisePosition.Bottom,
  close_grip_chinup = ExercisePosition.Bottom,
  band_standing_rear_delt_row = ExercisePosition.Bottom,
  bodyweight_standing_row = ExercisePosition.Bottom,
  bodyweight_standing_row_with_towel = ExercisePosition.Bottom,
  dumbbell_bent_over_row = ExercisePosition.Bottom,
  suspended_row = ExercisePosition.Bottom,
  dumbbell_standing_overhead_press = ExercisePosition.Top,
  dumbbell_arnold_press = ExercisePosition.Top,
  dumbbell_lateral_raise = ExercisePosition.Bottom,
  dumbbell_one_arm_lateral_raise = ExercisePosition.Bottom,
  dumbbell_rear_lateral_raise = ExercisePosition.Bottom,
  dumbbell_biceps_curl = ExercisePosition.Bottom,
  dumbbell_alternate_biceps_curl = ExercisePosition.Bottom,
  band_triceps_extension = ExercisePosition.Bottom,
  bodyweight_kneeling_triceps_extension = ExercisePosition.Bottom,
  dumbbell_hammer_curl = ExercisePosition.Bottom,
  dumbbell_lunge = ExercisePosition.Top,
  bodyweight_lunge = ExercisePosition.Top,
  dumbbell_rear_lunge = ExercisePosition.Top,
  bodyweight_standing_calf_raise = ExercisePosition.Bottom,
  dumbbell_standing_calf_raise = ExercisePosition.Bottom,
  standing_split_squats = ExercisePosition.Top,
  glute_bridge_on_bench = ExercisePosition.Bottom,
  low_glute_bridge_on_floor = ExercisePosition.Bottom,
  archer_push_up = ExercisePosition.Top,
  band_pushup = ExercisePosition.Top,
  deep_push_up = ExercisePosition.Top,
  wide_hand_push_up = ExercisePosition.Top,
  decline_pushup = ExercisePosition.Top,
  diamond_pushup = ExercisePosition.Top,
  handstand_pushup = ExercisePosition.Top,
  pike_pushup = ExercisePosition.Top,
  incline_closegrip_pushup = ExercisePosition.Top,
  incline_pushup = ExercisePosition.Top,
  kneeling_pushup = ExercisePosition.Top,
  pushup = ExercisePosition.Top,
  pushup_wall = ExercisePosition.Top,
  single_arm_pushup = ExercisePosition.Top,
  ring_pushup = ExercisePosition.Top,
  single_leg_squat_pistol = ExercisePosition.Top,
  jumping_jacks = ExercisePosition.Top, // TODO
}
