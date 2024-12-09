import GoBack from "@/components/GoBack";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin, capitalizeEachWord } from "@/utils/general";
import { json, MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Badge } from "@/components/ui/badge";
import DetectionGoalSelector from "@/components/workout/DetectionGoalSelector";
import StaticGoalSelector from "@/components/workout/StaticGoalSelector";

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const exercise = data?.exercise; // Assuming you pass exercise data from your loader

  return [
    { title: `${exercise?.name} - Exercise Details | HomeFitAI` },
    { property: "og:title", content: `${exercise?.name} - HomeFitAI` },
    {
      name: "description",
      content: `Learn how to perform the ${exercise?.name} exercise with detailed instructions and best youtube tutorials on HomeFitAI.`,
    },
    {
      property: "og:description",
      content: `Discover the full guide to ${exercise?.name}, including step-by-step instructions and tips for best results.`,
    },
  ];
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
      {exercise.type === "duration" ? (
        <StaticGoalSelector />
      ) : (
        <DetectionGoalSelector />
      )}
      <div className="my-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 mmd:grid-cols-3 *:max-w-md gap-4">
          <li>
            <Badge
              className="text-[13px] flex gap-1 py-1.5 px-3"
              variant="secondary"
            >
              <p className="font-semibold">Calories :</p>
              {caloriePerMin(exercise.met, data?.stats.weight ?? 0)} Kcal/min
            </Badge>
          </li>
          <li>
            <Badge
              className="text-[13px] flex gap-1 py-1.5 px-3"
              variant="secondary"
            >
              <p className="font-semibold">Equipment :</p>
              {exercise.equipment}
            </Badge>
          </li>
          <li>
            <Badge
              className="text-[13px] flex gap-1 py-1.5 px-3"
              variant="secondary"
            >
              <p className="font-semibold">Target Muscle :</p>
              {exercise.target}
            </Badge>
          </li>
          <li className="col-span-1 sm:col-span-2">
            <Badge
              className="text-[13px] flex gap-1 py-1.5 px-3"
              variant="secondary"
            >
              <p className="font-semibold">Secondary Muscles</p>:
              <p>{exercise.secondaryMuscles.join(", ")}</p>
            </Badge>
          </li>
        </ul>
      </div>

      <div className="rounded-lg w-full mt-6">
        <h2 className="text-2xl font-bold mb-4">Exercise Instructions</h2>
        <ul className="space-y-4">
          {exercise.instructions.map((instruction, index) => (
            <li
              key={index + "inst"}
              className="flex items-center justify-start gap-2 rounded-lg leading-relaxed font-medium"
            >
              <span className="w-6 min-w-6 h-6 bg-accent/80 text-accent-foreground flex items-center justify-center rounded-full font-bold text-sm">
                {index + 1}
              </span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ExercisePage;
