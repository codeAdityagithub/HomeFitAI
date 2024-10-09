import GoBack from "@/components/GoBack";
import PlaylistExerciseCard from "@/components/playlists/PlaylistExerciseCard";
import { Button } from "@/components/ui/button";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { caloriePerMin, capitalizeEachWord } from "@/utils/general";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Play } from "lucide-react";

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

  let expectedDuration = 0;
  let calorieMultiplier = 0;
  const allExercises = PLAYLISTS[pId as PlaylistId].map((e) => {
    const exercise = exercises.find((ex) => ex.id === e.id)!;
    const rest = exercise.met < 4 ? 30 : exercise.met < 6 ? 45 : 60;

    expectedDuration += e.sets * (30 + rest);
    calorieMultiplier +=
      Number(caloriePerMin(exercise.met, 1)) * (e.sets * 0.5);

    return {
      ...e,
      name: exercise.name,
      imageUrl: getImageFromVideoId(exercise.videoId),
    };
  });

  return {
    allExercises,
    playlistName: capitalizeEachWord(pId.split("_").join(" ").toLowerCase()),
    expectedDuration: Math.ceil(expectedDuration / 60),
    calorieMultiplier,
  };
};

const PlaylistPage = () => {
  const { allExercises, playlistName, expectedDuration, calorieMultiplier } =
    useLoaderData<typeof loader>();
  const { stats } = useDashboardLayoutData();
  const expectedCalories = Math.round(calorieMultiplier * stats.weight);

  return (
    <div className="flex flex-col gap-6 w-fit mx-auto max-w-3xl">
      <div className="relative min-w-full">
        <img
          src={allExercises[0].imageUrl}
          alt={playlistName}
          className="w-full aspect-[2/1] min-h-[200px] object-cover rounded-t brightness-50"
        />
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center gap-2 p-4">
            <GoBack className="bg-accent/60 hover:bg-accent/80 border-none" />
            <h1 className="text-xl sm:text-2xl py-1 font-bold">
              <span className="text-foreground capitalize">{playlistName}</span>
            </h1>
          </div>
          <div className="flex items-center justify-center flex-1">
            <Link to="play?cur=0">
              <Button
                size="icon"
                className="rounded-full mb-16 h-14 w-14 bg-accent/60 hover:bg-accent/80"
              >
                <Play />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 place-items-center bg-accent/60 p-4 rounded-b">
          <span className="font-semibold">
            {expectedDuration}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              mins
            </span>
          </span>
          <span className="font-semibold">
            {expectedCalories}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              Kcal
            </span>
          </span>
          <span className="font-semibold">
            {allExercises.length}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              Exercises
            </span>
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-6">Exercises</h2>
      <ul className="flex flex-col gap-4 p-4 pt-0">
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
