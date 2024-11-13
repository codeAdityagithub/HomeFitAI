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
    { id: "jumping_jacks", sets: 1 },
    { id: "squat", sets: 2 },
    { id: "band_stiff_leg_deadlift", sets: 2 },
    { id: "standing_split_squats", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 2 },
    { id: "kneeling_pushup", sets: 2 },
    { id: "incline_pushup", sets: 2 },
    { id: "band_shoulder_press", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "band_standing_rear_delt_row", sets: 1 },
    { id: "scapular_pullup", sets: 1 },
    { id: "band_assisted_pullup", sets: 2 },
    { id: "bodyweight_standing_row_with_towel", sets: 2 },
    { id: "band_closegrip_pulldown", sets: 1 },
    { id: "mountain_climber_cross_body", sets: 1 },
    { id: "plank", sets: 1 },
    { id: "russian_twist", sets: 1 },
  ],

  // BEGINNER UPPER BODY
  BEGINNER_UPPER_BODY: [
    { id: "kneeling_pushup", sets: 2 },
    { id: "scapular_pullup", sets: 1 },
    { id: "band_standing_rear_delt_row", sets: 1 },
    { id: "incline_pushup", sets: 2 },
    { id: "bodyweight_standing_row_with_towel", sets: 2 },
    { id: "band_shoulder_press", sets: 2 },
    { id: "band_assisted_pullup", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "band_closegrip_pulldown", sets: 2 },
    { id: "mountain_climber_cross_body", sets: 1 },
    { id: "plank", sets: 1 },
    { id: "russian_twist", sets: 1 },
    { id: "band_biceps_curl", sets: 2 },
    { id: "band_triceps_extension", sets: 2 },
  ],

  // BEGINNER LOWER BODY
  BEGINNER_LOWER_BODY: [
    { id: "jumping_jacks", sets: 1 },
    { id: "squat", sets: 2 },
    { id: "band_stiff_leg_deadlift", sets: 2 },
    { id: "bodyweight_lunge", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 2 },
    { id: "low_glute_bridge_on_floor", sets: 1 },
  ],

  // INTERMEDIATE FULL BODY
  INTERMEDIATE_FULL_BODY: [
    { id: "jumping_jacks", sets: 1 },
    { id: "squat", sets: 2 },
    { id: "dumbbell_single_leg_deadlift", sets: 3 },
    { id: "band_single_leg_split_squat", sets: 1 },
    { id: "dumbbell_rear_lunge", sets: 1 },
    { id: "dumbbell_standing_calf_raise", sets: 2 },
    { id: "pushup", sets: 2 },
    { id: "incline_pushup", sets: 2 },
    { id: "incline_closegrip_pushup", sets: 2 },
    { id: "dumbbell_standing_overhead_press", sets: 2 },
    { id: "dumbbell_lateral_raise", sets: 2 },
    { id: "band_lateral_raise", sets: 1 },
    { id: "band_reverse_fly", sets: 2 },
    { id: "scapular_pullup", sets: 1 },
    { id: "band_assisted_pullup", sets: 2 },
    { id: "close_grip_chinup", sets: 2 },
    { id: "suspended_row", sets: 2 },
    { id: "dumbbell_bent_over_row", sets: 1 },
    { id: "hanging_knee_raise", sets: 1 },
    { id: "seated_knee_tucks", sets: 1 },
    { id: "situp", sets: 1 },
    { id: "russian_twist", sets: 1 },
    { id: "dumbbell_biceps_curl", sets: 2 },
    { id: "band_triceps_extension", sets: 2 },
  ],

  // INTERMEDIATE LOWER BODY
  INTERMEDIATE_LOWER_BODY: [
    { id: "jumping_jacks", sets: 1 },
    { id: "squat", sets: 2 },
    { id: "dumbbell_single_leg_deadlift", sets: 2 },
    { id: "band_stiff_leg_deadlift", sets: 2 },
    { id: "dumbbell_lunge", sets: 1 },
    { id: "dumbbell_rear_lunge", sets: 1 },
    { id: "dumbbell_standing_calf_raise", sets: 2 },
    { id: "glute_bridge_on_bench", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 1 },
  ],

  // INTERMEDIATE UPPER BODY
  INTERMEDIATE_UPPER_BODY: [
    { id: "incline_pushup", sets: 2 },
    { id: "pushup", sets: 2 },
    { id: "incline_closegrip_pushup", sets: 2 },
    { id: "dumbbell_fly", sets: 1 },
    { id: "dumbbell_standing_overhead_press", sets: 2 },
    { id: "dumbbell_lateral_raise", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "scapular_pullup", sets: 1 },
    { id: "band_assisted_pullup", sets: 2 },
    { id: "close_grip_chinup", sets: 2 },
    { id: "suspended_row", sets: 2 },
    { id: "dumbbell_bent_over_row", sets: 2 },
    { id: "band_reverse_fly", sets: 2 },
    { id: "hanging_knee_raise", sets: 2 },
    { id: "situp", sets: 1 },
    { id: "russian_twist", sets: 1 },
    { id: "dumbbell_biceps_curl", sets: 2 },
    { id: "dumbbell_hammer_curl", sets: 1 },
    { id: "band_triceps_extension", sets: 2 },
    { id: "bodyweight_kneeling_triceps_extension", sets: 1 },
  ],

  // ADVANCED FULL BODY
  ADVANCED_FULL_BODY: [
    { id: "jumping_jacks", sets: 1 },
    { id: "dumbbell_front_squat", sets: 2 },
    { id: "dumbbell_single_leg_deadlift", sets: 3 },
    { id: "bulgarian_split_squats", sets: 2 },
    { id: "dumbbell_rear_lunge", sets: 1 },
    { id: "band_stiff_leg_deadlift", sets: 1 },
    { id: "dumbbell_standing_calf_raise", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 2 },
    { id: "decline_pushup", sets: 2 },
    { id: "deep_push_up", sets: 2 },
    { id: "diamond_pushup", sets: 2 },
    { id: "dumbbell_fly", sets: 1 },
    { id: "pike_pushup", sets: 2 },
    { id: "dumbbell_lateral_raise", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "scapular_pullup", sets: 1 },
    { id: "pullup", sets: 2 },
    { id: "wide_grip_pullup", sets: 1 },
    { id: "close_grip_chinup", sets: 2 },
    { id: "suspended_row", sets: 2 },
    { id: "dumbbell_bent_over_row", sets: 2 },
    { id: "band_reverse_fly", sets: 1 },
    { id: "hanging_straight_leg_raise", sets: 1 },
    { id: "hanging_knee_raise", sets: 2 },
    { id: "russian_twist", sets: 1 },
    { id: "dumbbell_biceps_curl", sets: 2 },
    { id: "band_concentration_curl", sets: 1 },
    { id: "dumbbell_hammer_curl", sets: 1 },
    { id: "bodyweight_kneeling_triceps_extension", sets: 2 },
    { id: "band_triceps_extension", sets: 2 },
  ],
  // ADVANCED LOWER BODY
  ADVANCED_LOWER_BODY: [
    { id: "jumping_jacks", sets: 1 },
    { id: "dumbbell_front_squat", sets: 2 },
    { id: "dumbbell_single_leg_deadlift", sets: 2 },
    { id: "dumbbell_rear_lunge", sets: 2 },
    { id: "bulgarian_split_squats", sets: 2 },
    { id: "band_stiff_leg_deadlift", sets: 2 },
    { id: "dumbbell_standing_calf_raise", sets: 2 },
    { id: "bodyweight_standing_calf_raise", sets: 2 },
  ],
  // ADVANCED UPPER BODY
  ADVANCED_UPPER_BODY: [
    { id: "decline_pushup", sets: 2 },
    { id: "deep_push_up", sets: 2 },
    { id: "diamond_pushup", sets: 2 },
    { id: "dumbbell_fly", sets: 1 },
    { id: "pike_pushup", sets: 2 },
    { id: "dumbbell_lateral_raise", sets: 2 },
    { id: "band_lateral_raise", sets: 2 },
    { id: "scapular_pullup", sets: 1 },
    { id: "pullup", sets: 2 },
    { id: "wide_grip_pullup", sets: 2 },
    { id: "close_grip_chinup", sets: 2 },
    { id: "suspended_row", sets: 2 },
    { id: "dumbbell_bent_over_row", sets: 2 },
    { id: "band_reverse_fly", sets: 1 },
    { id: "hanging_straight_leg_raise", sets: 1 },
    { id: "hanging_knee_raise", sets: 2 },
    { id: "russian_twist", sets: 1 },
    { id: "dumbbell_biceps_curl", sets: 2 },
    { id: "dumbbell_hammer_curl", sets: 1 },
    { id: "band_concentration_curl", sets: 1 },
    { id: "bodyweight_kneeling_triceps_extension", sets: 2 },
    { id: "band_triceps_extension", sets: 2 },
  ],
};
