import { Set } from "@prisma/client";
import { DateTime } from "luxon";

export function getDayDiff(d1: Date, d2: Date) {
  const date1 = DateTime.fromJSDate(d1);
  const date2 = DateTime.fromJSDate(d2);

  // Calculate the difference in days
  const diffInDays = date2.diff(date1, "days").as("days");
  return Math.floor(Math.abs(diffInDays));
}

export function getDurationFromSets(
  sets: {
    reps: number;
    intensity: "explosive" | "controlled";
    weight: number | null;
  }[]
): { duration: number; sets: Set[] } {
  let duration = 0;
  const exerciseSets: Set[] = [];

  for (const set of sets) {
    const repTime = set.intensity === "explosive" ? 1.5 : 3;
    duration += set.reps * repTime;
    exerciseSets.push({
      avgRepTime: repTime,
      reps: set.reps,
      weight: set.weight,
    });
  }

  const durationInMin = Number((duration / 60).toFixed(2));
  return { duration: durationInMin, sets: exerciseSets };
}
