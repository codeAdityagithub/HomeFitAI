import type { ExerciseId } from "./types";

export type PlaylistType = { sets: number; id: ExerciseId }[];
export type PlaylistId =
  | "BEGINNER_FULL_BODY"
  | "BEGINNER_UPPER_BODY"
  | "BEGINNER_LOWER_BODY"
  | "INTERMEDIATE_FULL_BODY"
  | "INTERMEDIATE_UPPER_BODY"
  | "INTERMEDIATE_LOWER_BODY"
  | "ADVANCED_FULL_BODY"
  | "ADVANCED_UPPER_BODY"
  | "ADVANCED_LOWER_BODY";

export const PLAYLISTS: Record<PlaylistId, PlaylistType> = {
  BEGINNER_FULL_BODY: [
    { id: "mountain_climber_cross_body", sets: 2 },
    { id: "burpee", sets: 2 },
    { id: "jumping_jacks", sets: 2 },
    { id: "pushup_wall", sets: 2 },
    { id: "kneeling_pushup", sets: 2 },
    { id: "incline_pushup", sets: 2 },
  ],

  // BEGINNER UPPER BODY
  BEGINNER_UPPER_BODY: [
    { id: "band_biceps_curl", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "band_shoulder_press", sets: 2 },
    { id: "band_concentration_curl", sets: 2 },
    { id: "band_front_raise", sets: 2 },
    { id: "band_reverse_fly", sets: 2 },
    { id: "band_assisted_pullup", sets: 2 },
    { id: "band_triceps_extension", sets: 2 },
    { id: "bodyweight_kneeling_triceps_extension", sets: 2 },
    { id: "incline_pushup", sets: 2 },
    { id: "pushup", sets: 2 },
  ],

  // BEGINNER LOWER BODY
  BEGINNER_LOWER_BODY: [
    { id: "bodyweight_lunge", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 2 },
    { id: "band_squat", sets: 2 },
    { id: "low_glute_bridge_on_floor", sets: 2 },
    { id: "glute_bridge_on_bench", sets: 2 },
    { id: "standing_split_squats", sets: 2 },
    { id: "squat", sets: 2 },
  ],

  // INTERMEDIATE FULL BODY
  INTERMEDIATE_FULL_BODY: [
    { id: "plank", sets: 2 },
    { id: "russian_twist", sets: 2 },
    { id: "situp", sets: 2 },
    { id: "jump_squat", sets: 2 },
    { id: "archer_push_up", sets: 2 },
    { id: "deep_push_up", sets: 2 },
    { id: "diamond_pushup", sets: 2 },
    { id: "wide_hand_push_up", sets: 2 },
    { id: "incline_side_plank", sets: 2 },
    { id: "side_plank", sets: 2 },
  ],

  // INTERMEDIATE LOWER BODY
  INTERMEDIATE_LOWER_BODY: [
    { id: "dumbbell_lunge", sets: 2 },
    { id: "dumbbell_single_leg_deadlift", sets: 2 },
    { id: "dumbbell_standing_calf_raise", sets: 2 },
    { id: "dumbbell_rear_lunge", sets: 2 },
    { id: "band_single_leg_split_squat", sets: 2 },
    { id: "band_stiff_leg_deadlift", sets: 2 },
  ],

  // INTERMEDIATE UPPER BODY
  INTERMEDIATE_UPPER_BODY: [
    { id: "dumbbell_biceps_curl", sets: 2 },
    { id: "dumbbell_hammer_curl", sets: 2 },
    { id: "dumbbell_fly", sets: 2 },
    { id: "band_bench_press", sets: 2 },
    { id: "band_closegrip_pulldown", sets: 2 },
    { id: "dumbbell_standing_overhead_press", sets: 2 },
    { id: "dumbbell_arnold_press", sets: 2 },
    { id: "dumbbell_lateral_raise", sets: 2 },
    { id: "dumbbell_rear_lateral_raise", sets: 2 },
    { id: "band_standing_rear_delt_row", sets: 2 },
    { id: "pullup", sets: 2 },
    { id: "close_grip_chinup", sets: 2 },
    { id: "band_pushup", sets: 2 },
  ],

  // ADVANCED FULL BODY
  ADVANCED_FULL_BODY: [
    { id: "hanging_knee_raise", sets: 2 },
    { id: "hanging_straight_leg_raise", sets: 2 },
    { id: "single_arm_pushup", sets: 2 },
    { id: "ring_pushup", sets: 2 },
    { id: "single_leg_squat_pistol", sets: 2 },
    { id: "handstand_pushup", sets: 2 },
    { id: "clap_push_up", sets: 2 },
    { id: "pike_pushup", sets: 2 },
    { id: "archer_pull_up", sets: 2 },
    { id: "band_concentration_curl", sets: 2 },
  ],
  // ADVANCED LOWER BODY
  ADVANCED_LOWER_BODY: [
    { id: "bulgarian_split_squats", sets: 2 },
    { id: "dumbbell_front_squat", sets: 2 },
    { id: "jump_squat", sets: 2 },
    { id: "single_leg_squat_pistol", sets: 2 },
  ],
  // ADVANCED UPPER BODY
  ADVANCED_UPPER_BODY: [
    { id: "chest_dip", sets: 2 },
    { id: "wide_grip_pullup", sets: 2 },
    { id: "scapular_pullup", sets: 2 },
    { id: "dumbbell_bench_press", sets: 2 },
    { id: "dumbbell_bent_over_row", sets: 2 },
    { id: "suspended_row", sets: 2 },
    { id: "dumbbell_one_arm_lateral_raise", sets: 2 },
  ],
};
