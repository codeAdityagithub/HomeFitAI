import GoBack from "@/components/GoBack";
import ExerciseCard from "@/components/workout/ExerciseCard";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import {
  MetaFunction,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  const query = new URL(request.url).searchParams.get("query")?.trim();
  if (!query || query === "") return redirect("/dashboard/workout");

  // Search for workouts based on query
  const filtered = exercises
    .filter((ex) => ex.name.includes(query.toLowerCase()))
    .map((e) => ({
      name: e.name,
      id: e.id,
      imageUrl: getImageFromVideoId(e.videoId),
      target: e.target,
      equipment: e.equipment,
      secondaryMuscles: e.secondaryMuscles,
    }));

  return { filtered, query };
};

export const meta: MetaFunction = ({ location }) => {
  const searchQuery = new URLSearchParams(location.search).get("query")?.trim();
  return [
    {
      title: `Search results for "${searchQuery}"`,
    },
  ];
};

const WorkoutSearchPage = () => {
  const { filtered, query } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-2">
        <GoBack />
        <h1 className="text-2xl sm:text-3xl font-bold">
          Showing Results for "{query}":
        </h1>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 llg:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-6 md:gap-4 lg:gap-6">
        {filtered.map((ex) => (
          <ExerciseCard e={ex} />
        ))}
      </div>
    </div>
  );
};
export default WorkoutSearchPage;
