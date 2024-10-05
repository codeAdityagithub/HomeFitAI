import PlaylistExerciseCard from "@/components/playlists/PlaylistExerciseCard";
import ExerciseCard from "@/components/workout/ExerciseCard";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { capitalizeEachWord, capitalizeFirstLetter } from "@/utils/general";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  const pId = params.pId;
  if (!pId)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });

  const found = Object.keys(PLAYLISTS).find((p) => p === pId);
  if (!found)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });

  const allExercises = PLAYLISTS[pId as PlaylistId].map((e) => {
    const exercise = exercises.find((ex) => ex.id === e.id)!;
    return {
      ...e,
      name: exercise.name,
      imageUrl: getImageFromVideoId(exercise.videoId),
    };
  });
  return {
    allExercises,
    playlistName: capitalizeEachWord(pId.split("_").join(" ").toLowerCase()),
  };
};

const PlaylistPage = () => {
  const { allExercises, playlistName } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl sm:text-3xl py-1 font-bold text-center bg-background">
        <span className="text-accent capitalize">{playlistName} </span>
        Playlist
      </h1>
      <ul className="flex max-w-sm flex-col gap-4">
        {allExercises.map((e) => (
          <PlaylistExerciseCard
            key={e.id}
            id={e.id}
            imageUrl={e.imageUrl}
            label={e.name}
            sets={e.sets}
          />
        ))}
      </ul>
    </div>
  );
};
export default PlaylistPage;
