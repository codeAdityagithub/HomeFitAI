import db from "@/utils/db.server";
import { capitalizeEachWord } from "@/utils/general";
import { json } from "@remix-run/node";
import { calculateDuration } from "./calculatePlaylistDuration";
import { PlaylistFnReturn } from "./getDefaultPlaylist";

export default async function getUserPlaylist(
  pId: string,
  userId: string
): Promise<PlaylistFnReturn> {
  const playlist = await db.playlist.findUnique({ where: { userId, id: pId } });

  if (!playlist)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });
  const { allExercises, calorieMultiplier, expectedDuration } =
    calculateDuration(playlist.exercises);

  return {
    allExercises,
    description: playlist.description ?? undefined,
    playlistName: capitalizeEachWord(playlist.name),
    expectedDuration: Math.ceil(expectedDuration / 60),
    calorieMultiplier,
  };
}
