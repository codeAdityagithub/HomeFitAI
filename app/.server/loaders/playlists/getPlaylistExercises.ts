import db from "@/utils/db.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { ExerciseId } from "@/utils/exercises/types";
import { json } from "@remix-run/node";

type pType = { id: ExerciseId; sets: number }[];
export default async function getPlaylistExercises(
  pId: string,
  isUserPlaylist: boolean,
  userId: string
): Promise<pType> {
  if (isUserPlaylist) {
    const playlist = await db.playlist.findUnique({
      where: { userId, id: pId },
    });

    if (!playlist)
      throw json("Requested Playlist not found", {
        status: 404,
        statusText: "Playlist not found",
      });
    return playlist.exercises.map((e) => ({
      id: e.eId as ExerciseId,
      sets: e.sets,
    }));
  } else {
    const found = Object.keys(PLAYLISTS).find((p) => p === pId);
    if (!found)
      throw json("Requested Playlist not found", {
        status: 404,
        statusText: "Playlist not found",
      });

    const allExercises = PLAYLISTS[pId as PlaylistId];
    return allExercises;
  }
}
