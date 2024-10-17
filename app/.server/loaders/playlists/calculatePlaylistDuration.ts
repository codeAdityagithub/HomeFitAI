import { getImageFromVideoId } from "@/lib/utils";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin } from "@/utils/general";
import { PlaylistExercise } from "@prisma/client";
import { PlaylistFnReturn } from "./getDefaultPlaylist";

const EXERCISE_DURATION = 40;
const EXERCISE_DURATION_MIN = EXERCISE_DURATION / 60;
export function calculateDuration(
  list: PlaylistExercise[]
): Pick<
  PlaylistFnReturn,
  "allExercises" | "calorieMultiplier" | "expectedDuration"
> {
  let expectedDuration = 0;
  let calorieMultiplier = 0;
  const allExercises = list.map((e) => {
    const exercise = exercises.find((ex) => ex.id === e.eId)!;
    const rest = exercise.met < 4 ? 30 : exercise.met < 6 ? 45 : 60;

    expectedDuration += e.sets * (EXERCISE_DURATION + rest);
    calorieMultiplier +=
      Number(caloriePerMin(exercise.met, 1)) * (e.sets * EXERCISE_DURATION_MIN);

    return {
      sets: e.sets,
      id: exercise.id,
      name: exercise.name,
      imageUrl: getImageFromVideoId(exercise.videoId),
    };
  });
  return {
    allExercises,
    calorieMultiplier,
    expectedDuration,
  };
}
