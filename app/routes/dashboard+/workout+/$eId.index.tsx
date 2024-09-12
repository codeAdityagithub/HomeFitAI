import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin, capitalizeEachWord } from "@/utils/general";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  invariant(params.eId);
  const exercise = exercises.find((e) => e.id === params.eId);
  if (!exercise)
    throw json("Exercise not found.", {
      status: 404,
      statusText: `Exercise ${params.eId} not found`,
    });
  const { videoId, ...rest } = exercise;
  const exerciseWithVideo = {
    ...rest,
    embed: `https://www.youtube.com/embed/${videoId}${
      videoId.includes("?") ? "&" : "?"
    }modestbranding=1&showinfo=0&rel=0`,
  };
  return { exercise: exerciseWithVideo };
};

const ExercisePage = () => {
  const { exercise } = useLoaderData<typeof loader>();
  // console.log(exercise);
  const data = useDashboardLayoutData();

  return (
    <div className="max-w-4xl mx-auto md:p-4">
      <div className="sm:flex sm:gap-2">
        <GoBack />
        <h1 className="text-3xl font-bold mb-4">
          {capitalizeEachWord(exercise.name)}
        </h1>
      </div>

      <div className="mb-6">
        <iframe
          className="w-full aspect-[2/1] rounded-lg"
          src={exercise.embed}
          title={exercise.name}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <Link to="detect">
        <Button>Detect</Button>
      </Link>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Exercise Information</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>Calories:</strong>{" "}
            {caloriePerMin(exercise.met, data?.stats.weight ?? 0)} Kcal/min
          </li>
          <li>
            <strong>Equipment:</strong> {exercise.equipment}
          </li>
          <li>
            <strong>Target Muscle:</strong> {exercise.target}
          </li>
          <li>
            <strong>Secondary Muscles:</strong>{" "}
            {exercise.secondaryMuscles.join(", ")}
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <ol className="list-decimal list-inside mt-2">
          {exercise.instructions.map((instruction, index) => (
            <li
              key={index}
              className="mt-1"
            >
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default ExercisePage;