import WorkoutSearch from "@/components/dashboard/workoutSearch";
import PlaylistCard from "@/components/playlists/PlaylistCard";
import { Button } from "@/components/ui/button";
import ExerciseCard from "@/components/workout/ExerciseCard";
import useExercises from "@/hooks/useExercises";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import { capitalizeFirstLetter } from "@/utils/general";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Link,
  ShouldRevalidateFunction,
  useLoaderData,
} from "@remix-run/react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type DashboardExercise = {
  name: string;
  id: string;
  imageUrl: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  const filtered: DashboardExercise[] = exercises.map((e) => ({
    name: e.name,
    id: e.id,
    imageUrl: getImageFromVideoId(e.videoId),
    target: e.target,
    equipment: e.equipment,
    secondaryMuscles: e.secondaryMuscles,
  }));

  const playlists = {
    BEGINNER_FULL_BODY: [
      {
        name: "Beginner Full Body",
        totalExercises: PLAYLISTS.BEGINNER_FULL_BODY.length,
      },
    ],
    INTERMEDIATE_LOWER_BODY: [
      {
        name: "Intermediate Lower Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_LOWER_BODY.length,
      },
    ],
    ADVANCED_UPPER_BODY: [
      {
        name: "Advanced Upper Body",
        totalExercises: PLAYLISTS.ADVANCED_UPPER_BODY.length,
      },
    ],
  };

  const images = Object.keys(playlists)
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

  return json(
    { exercises: filtered, popularPlaylists: playlists, images },
    { headers: { "Cache-Control": "public, max-age=600" } }
  );
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export { clientLoader } from "@/utils/routeCache.client";

const WorkoutPage = () => {
  const { exercises, popularPlaylists, images } =
    useLoaderData<typeof loader>();
  const {
    exercisesByTarget,
    bandGrouped,
    dumbbellGrouped,
    bandRows,
    toggleBands,
    dumbRows,
    toggleDumbbell,
  } = useExercises(exercises);

  return (
    <div className="space-y-10">
      <WorkoutSearch exercises={exercises} />
      <div>
        <div className="flex items-end gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 sticky top-0 bg-background text-primary underline underline-offset-4 z-20">
            Popular Playlists
          </h1>
          <Link to="/dashboard/playlists">
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-primary"
            >
              View More
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
          {Object.keys(popularPlaylists).map((key) => (
            <PlaylistCard
              key={key}
              label={
                popularPlaylists[key as keyof typeof popularPlaylists][0].name
              }
              imageUrl={images[key as PlaylistId]}
              exercises={
                popularPlaylists[key as keyof typeof popularPlaylists][0]
                  .totalExercises
              }
              id={key}
            />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 sticky top-0 bg-background z-20">
          <span className="text-[22px] sm:text-[28px] text-accent underline underline-offset-4">
            Resistance Band
          </span>{" "}
          Exercises
        </h1>
        {Object.keys(bandGrouped)
          .splice(0, bandRows)
          .map((key) => (
            <div
              className="sm:px-4 mt-4"
              key={"band" + key}
            >
              <h1 className="text-xl my-2 font-bold leading-8">
                Exercises for{" "}
                <span className="text-xl text-primary">
                  {key.split(" ").map((w) => capitalizeFirstLetter(w) + " ")}
                </span>
              </h1>
              <ul className="transition-opacity duration-300 grid grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
                {bandGrouped[key].map((e) => (
                  <ExerciseCard
                    key={e.name + "band"}
                    e={e}
                  />
                ))}
              </ul>
            </div>
          ))}
        <div className="w-full flex justify-center my-6">
          <Button
            size="sm"
            variant="link"
            onClick={toggleBands}
          >
            {bandRows === 2 ? "View More" : "Collapse"}
            {bandRows === 2 ? (
              <ChevronDown className="h-4 w-4 translate-y-0.5" />
            ) : (
              <ChevronUp className="h-4 w-4 translate-y-0.5" />
            )}
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 sticky top-0 bg-background z-20">
          <span className="text-[22px] sm:text-[28px] text-accent underline underline-offset-4">
            Dumbbell
          </span>{" "}
          Exercises
        </h1>
        {Object.keys(dumbbellGrouped)
          .splice(0, dumbRows)
          .map((key) => (
            <div
              className="sm:px-4 mt-4"
              key={"dumb" + key}
            >
              <h1 className="text-xl my-2 font-bold leading-8">
                Exercises for{" "}
                <span className="text-xl text-primary">
                  {key.split(" ").map((w) => capitalizeFirstLetter(w) + " ")}
                </span>
              </h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
                {dumbbellGrouped[key].map((e) => (
                  <ExerciseCard
                    key={e.name + "dumb"}
                    e={e}
                  />
                ))}
              </ul>
            </div>
          ))}
        <div className="w-full flex justify-center items-center my-6">
          <Button
            size="sm"
            variant="link"
            onClick={toggleDumbbell}
          >
            {dumbRows === 2 ? "View More" : "Collapse"}
            {dumbRows === 2 ? (
              <ChevronDown className="h-4 w-4 translate-y-0.5" />
            ) : (
              <ChevronUp className="h-4 w-4 translate-y-0.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Exercises by target */}
      {Object.keys(exercisesByTarget).map((key) => (
        <div key={key}>
          <h1 className="text-2xl sm:text-3xl py-1 font-bold leading-8 sticky top-0 bg-background z-20">
            Exercises for{" "}
            <span className="text-[22px] sm:text-[28px] text-accent underline underline-offset-4">
              {key.split(" ").map((w) => capitalizeFirstLetter(w) + " ")}
            </span>
          </h1>
          <ul className="grid p-2 sm:p-4 grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center">
            {exercisesByTarget[key].map((e) => (
              <ExerciseCard
                key={e.name}
                e={e}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkoutPage;
