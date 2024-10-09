import PlaylistCard from "@/components/playlists/PlaylistCard";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { type PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { capitalizeFirstLetter } from "@/utils/general";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, {
    failureRedirect: "/login",
  });

  const playlists = {
    beginner: [
      {
        id: "BEGINNER_FULL_BODY",
        name: "Beginner Full Body",
        totalExercises: PLAYLISTS.BEGINNER_FULL_BODY.length,
      },
      {
        id: "BEGINNER_UPPER_BODY",
        name: "Beginner Upper Body",
        totalExercises: PLAYLISTS.BEGINNER_UPPER_BODY.length,
      },
      {
        id: "BEGINNER_LOWER_BODY",
        name: "Beginner Lower Body",
        totalExercises: PLAYLISTS.BEGINNER_LOWER_BODY.length,
      },
    ],
    intermediate: [
      {
        id: "INTERMEDIATE_FULL_BODY",
        name: "Intermediate Full Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_FULL_BODY.length,
      },
      {
        id: "INTERMEDIATE_UPPER_BODY",
        name: "Intermediate Upper Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_UPPER_BODY.length,
      },
      {
        id: "INTERMEDIATE_LOWER_BODY",
        name: "Intermediate Lower Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_LOWER_BODY.length,
      },
    ],
    advanced: [
      {
        id: "ADVANCED_FULL_BODY",
        name: "Advanced Full Body",
        totalExercises: PLAYLISTS.ADVANCED_FULL_BODY.length,
      },
      {
        id: "ADVANCED_UPPER_BODY",
        name: "Advanced Upper Body",
        totalExercises: PLAYLISTS.ADVANCED_UPPER_BODY.length,
      },
      {
        id: "ADVANCED_LOWER_BODY",
        name: "Advanced Lower Body",
        totalExercises: PLAYLISTS.ADVANCED_LOWER_BODY.length,
      },
    ],
  };

  const images = Object.keys(PLAYLISTS)
    .map((p) => ({
      [p]: getImageFromVideoId(
        // @ts-expect-error
        exercises.find((e) => e.id === PLAYLISTS[p][0].id).videoId
      ),
    }))
    .reduce((acc, obj) => ({ ...acc, ...obj }), {}) as Record<
    PlaylistId,
    string
  >;

  return { playlists, images };
};

export { clientLoader } from "@/utils/routeCache.client";

const PlaylistPage = () => {
  const { images, playlists } = useLoaderData<typeof loader>();

  return (
    <div>
      {Object.keys(playlists).map((key) => (
        <div key={key}>
          <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 sticky top-0 bg-background z-20">
            <span className="text-accent">{capitalizeFirstLetter(key)} </span>
            Playlists
          </h1>
          <ul className="grid p-2 sm:p-4 grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
            {playlists[key as "beginner" | "intermediate" | "advanced"].map(
              (e) => (
                <PlaylistCard
                  key={e.id}
                  label={e.name}
                  imageUrl={images[e.id as PlaylistId]}
                  exercises={e.totalExercises}
                  id={e.id}
                />
              )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default PlaylistPage;
