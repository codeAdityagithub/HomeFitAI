import PlaylistCard from "@/components/playlists/PlaylistCard";
import { Button } from "@/components/ui/button";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { type PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { capitalizeFirstLetter } from "@/utils/general";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const users_playlists = await db.playlist.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      exercises: true,
    },
  });
  const user_playlists_reduced = users_playlists.map((p) => ({
    ...p,
    totalExercises: p.exercises.length,
  }));
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

  const user_images = user_playlists_reduced.reduce(
    (acc, p) => ({
      ...acc,
      [p.id]:
        p.exercises.length > 0
          ? getImageFromVideoId(
              // @ts-expect-error
              exercises.find((e) => e.id === p.exercises[0].eId).videoId
            )
          : "",
    }),
    {} as Record<string, string>
  );

  const allImages = { ...images, ...user_images };
  return {
    playlists,
    users_playlists: user_playlists_reduced,
    images: allImages,
  };
};

// export { clientLoader } from "@/utils/routeCache.client";

const PlaylistPage = () => {
  const { images, playlists, users_playlists } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>
        <div className="text-2xl sm:text-3xl py-1 font-bold flex items-center gap-2 bg-background">
          <span className="text-primary">Your </span>
          Playlists
          {users_playlists.length < 4 && (
            <Link to="create">
              <Button
                size="sm"
                className="w-fit hover:bg-primary"
                variant="outline"
              >
                Create
              </Button>
            </Link>
          )}
        </div>
        <ul className="grid p-2 sm:p-4 grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
          {users_playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              label={p.name}
              imageUrl={images[p.id as PlaylistId]}
              exercises={p.totalExercises}
              id={p.id}
            />
          ))}
          {users_playlists.length === 0 && (
            <li className="font-semibold w-full text-xl flex flex-col gap-2">
              No Playlists Created
              <Link to="create">
                <Button
                  size="sm"
                  className="w-fit ml-10"
                >
                  Create One
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </div>
      {Object.keys(playlists).map((key) => (
        <div key={key}>
          <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 bg-background">
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
