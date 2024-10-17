import { PLAYLISTS, PlaylistId } from "@/utils/exercises/playlists.server";
import { ExerciseId } from "@/utils/exercises/types";
import { capitalizeEachWord } from "@/utils/general";
import { json } from "@remix-run/node";
import { calculateDuration } from "./calculatePlaylistDuration";

export type PlaylistFnReturn = {
  allExercises: {
    name: string;
    imageUrl: string;
    sets: number;
    id: ExerciseId;
  }[];
  playlistName: string;
  expectedDuration: number;
  calorieMultiplier: number;
  description?: string;
};
export default async function getDefaultPlaylist(
  pId: string
): Promise<PlaylistFnReturn> {
  const found = Object.keys(PLAYLISTS).find((p) => p === pId);
  if (!found)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });
  const { allExercises, calorieMultiplier, expectedDuration } =
    calculateDuration(
      PLAYLISTS[pId as PlaylistId].map((e) => ({ eId: e.id, sets: e.sets }))
    );

  return {
    allExercises,
    playlistName: capitalizeEachWord(pId.split("_").join(" ").toLowerCase()),
    expectedDuration: Math.ceil(expectedDuration / 60),
    calorieMultiplier,
  };
}
