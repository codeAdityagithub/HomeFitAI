export const DAILY_GOALS_LIMITS = {
  steps: {
    min: 5000,
    max: 25000,
  },
  sleep: {
    min: 6,
    max: 12,
  },
  water: {
    min: 6,
    max: 20,
  },
  calories: {
    min: 100,
    max: 1000,
  },
};

export const LOG_CONSTANTS = {
  sleep: {
    min: 0,
    max: 16,
  },
  steps: {
    min: 0,
    max: 25000,
  },
  waterIntake: {
    min: 0,
    max: 20,
  },
  exercise: {
    max_duration: 300,
    max_avgreptime: 50,
    reps: {
      min: 1,
      max: 50,
    },
    max_TUT: 10,
  },
};

export const PLAYLIST_CONSTANTS = {
  exercises: {
    min: 5,
    max: 15,
  },
  sets: {
    min: 0,
    max: 6,
  },
  max_playlists: 4,
};

export const STATS_CONSTANTS = {
  MIN_AGE: 5,
  MAX_AGE: 100,
  MIN_HEIGHT: 50,
  MAX_HEIGHT: 250,
  MIN_WEIGHT: 30,
  MAX_WEIGHT: 200,
};

export const MAX_GROUP_MEMBERS = 10;

export const STREAK_ACHIEVEMENTS = {
  7: {
    title: "Consistency Champ",
    description:
      "One week of showing up! You've logged in for 7 days straight, building a powerful foundation for your fitness journey. Keep up the momentum!",
  },
  15: {
    title: "Commitment Keeper",
    description:
      "You've logged in for 15 days straight! Your unwavering commitment to health and fitness is inspiring. Keep up the incredible work, and you'll be a true hero of the fitness community.",
  },
  30: {
    title: "Dedication Master",
    description:
      "A full month of consistency! With 30 days of logging in, you're building lasting habits and making real progress toward your goals. Keep it up!",
  },
};

export const MILESTONE_ACHIEVEMENTS = {
  totalCalories: {
    5000: {
      title: "Calorie Crusher",
      description:
        "Amazing job! You've torched 5,000 calories. Keep up the incredible work!",
    },
    10000: {
      title: "Burn Master",
      description:
        "Phenomenal! You've burned a whopping 10,000 calories. Your dedication is truly inspiring!",
    },
  },
  totalSteps: {
    100000: {
      title: "Trailblazer",
      description:
        "100,000 steps and counting! Your commitment to staying active is truly inspiring. Keep blazing that trail!",
    },
  },
};
