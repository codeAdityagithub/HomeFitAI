import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin, capitalizeEachWord } from "@/utils/general";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Dumbbell, Flame, PersonStanding, Ribbon } from "lucide-react";
import { TbJumpRope } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";

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

const icons = {
  calories: <Flame size={30} />,
  equipment: {
    rope: <TbJumpRope size={30} />,
    "body weight": <PersonStanding size={30} />,
    dumbbell: <Dumbbell size={30} />,
    band: <Ribbon size={30} />,
  },
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

      <div className="mt-6">
        <ul className="flex py-4 gap-4 flex-wrap *:flex-1 *:xs:min-w-[200px] *:max-w-fit *:min-w-full">
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
          <li>
            <Badge
              className="text-[13px] flex gap-1 py-1.5 px-3"
              variant="secondary"
            >
              <p className="font-semibold">Secondary Muscles :</p>
              {exercise.secondaryMuscles.join(", ")}
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
              <span className="w-6 h-6 bg-accent/80 text-accent-foreground flex items-center justify-center rounded-full font-bold text-sm">
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
