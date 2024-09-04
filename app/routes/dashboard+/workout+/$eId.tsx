import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

  return { exercise };
};

const ExercisePage = () => {
  const { exercise } = useLoaderData<typeof loader>();
  console.log(exercise);
  return <div>{exercise.instructions}</div>;
};
export default ExercisePage;
