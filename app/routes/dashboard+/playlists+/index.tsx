import { getAllPlaylists } from "@/.server/loaders/playlists/getAllPlaylistsandImages";
import PlaylistCard from "@/components/playlists/PlaylistCard";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/utils/auth/auth.server";
import { type PlaylistId } from "@/utils/exercises/playlists.server";
import { capitalizeFirstLetter } from "@/utils/general";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Workout Playlists - Beginner to Advanced | HomeFitAI" },
    { property: "og:title", content: "Workout Playlists for All Levels" },
    {
      name: "description",
      content:
        "Browse curated playlists for all fitness levels: beginner, intermediate, and advanced. Start your journey with HomeFitAI.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  return await getAllPlaylists(user.id);
};

export { clientLoader } from "@/utils/routeCache.client";

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
