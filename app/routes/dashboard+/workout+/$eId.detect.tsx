import Detection from "@/components/workout/Detection";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { flexing } from "@/utils/tensorflow/functions";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect } from "react";
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

const DetectWorkoutPage = () => {
  const { exercise } = useLoaderData<typeof loader>();
  useEffect(() => {
    if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/service-worker.js").then(
        (registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        (error) => {
          console.log("ServiceWorker registration failed: ", error);
        }
      );
    }
  }, []);
  const func = useCallback(flexing, []);

  return (
    <div>
      <Detection
        name={exercise.name}
        pos_function={func}
        start_pos={2}
      />
    </div>
  );
};
export default DetectWorkoutPage;
