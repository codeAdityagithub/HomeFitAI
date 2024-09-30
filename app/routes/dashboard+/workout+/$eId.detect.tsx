import type { ActionFunctionArgs } from "@remix-run/node";
import Detection from "@/components/workout/Detection";
import { requireUser } from "@/utils/auth/auth.server";
import exercises, { Exercise } from "@/utils/exercises/exercises.server";
import { importFunction } from "@/utils/tensorflow/imports";
import {
  ClientActionFunctionArgs,
  Link,
  useParams,
  useRouteError,
} from "@remix-run/react";
// import { flexing } from "@/utils/tensorflow/functions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DetectionUnilateral from "@/components/workout/DetectionUnilateral";
import {
  ExerciseGoalSchema,
  ExerciseStartPosition,
} from "@/utils/exercises/types";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { cacheClientAction } from "@/utils/routeCache.client";
import { addWorkout } from "@/.server/handlers/workout/addWorkout";

export type ExerciseDetectionLoader = {
  exercise: Pick<Exercise, "name" | "id" | "videoId" | "movement">;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });

  invariant(params.eId);
  const sp = new URL(request.url).searchParams;
  const g = sp.get("goal");
  if (!g) return redirect("?goal=Free");

  const dur = sp.get("duration");
  let { data } = ExerciseGoalSchema.safeParse({
    goal: g,
    duration: Number(dur),
  });
  if (!data)
    throw new Error("Invalid configuration entered for exercise tracker.");

  const exercise = exercises.find((e) => e.id === params.eId);
  if (!exercise)
    throw json("Exercise not found.", {
      status: 404,
      statusText: `Exercise ${params.eId} not found`,
    });

  return {
    exercise: {
      id: exercise.id,
      name: exercise.name,
      videoId: exercise.videoId,
      movement: exercise.movement,
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const { sets, logId, exerciseId, duration } = await request.json();
  return await addWorkout({
    duration,
    exerciseId,
    logId,
    sets,
    userId: user.id,
  });
};

export { clientLoader } from "@/utils/routeCache.client";
export const clientAction = ({
  serverAction,
  request,
}: ClientActionFunctionArgs) =>
  cacheClientAction(["dashboardLayout"], serverAction);

const DetectWorkoutPage = () => {
  const { exercise } = useLoaderData<typeof loader>();
  useEffect(() => {
    if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/service-worker.js").then(
        (registration) => {
          console.log("ServiceWorker registration successful!");
        },
        (error) => {
          console.log("ServiceWorker registration failed: ", error);
        }
      );
    }
  }, []);

  const [func, setFunc] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const funcName = exercise.id;
    async function loadFunction() {
      setLoading(true);
      const fetchedFunction = await importFunction(funcName);

      setLoading(false);
      setFunc(() => fetchedFunction);
    }
    loadFunction();
  }, []);

  return (
    <div className="max-w-4xl mx-auto md:p-4">
      {loading ? (
        <div className="h-[calc(100vh-104px)] md:h-[calc(100vh-48px)] flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : !func ? (
        <div className="flex items-center justify-center h-[calc(100vh-104px)] md:h-[calc(100vh-48px)]">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Error!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The detection function for{" "}
                <span className="text-accent">{exercise.name}</span> is not
                implemented yet! Visit later
              </p>
            </CardContent>
            <CardFooter>
              <Link
                to={"/dashboard/workout/" + exercise.id}
                replace
              >
                <Button>Back to Workout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ) : exercise.movement === "bilateral" ? (
        <Detection
          name={exercise.name}
          pos_function={func}
          start_pos={ExerciseStartPosition[exercise.id]}
        />
      ) : exercise.movement === "unilateral" ? (
        <DetectionUnilateral
          name={exercise.name}
          pos_function={func}
          start_pos={ExerciseStartPosition[exercise.id]}
        />
      ) : (
        <div className="">Static exercise Todo</div>
      )}
    </div>
  );
};
export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();

  if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center h-svh">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Error!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
          <CardFooter>
            <Link to={"/dashboard/workout/" + params.eId}>
              <Button>Back to Workout</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default DetectWorkoutPage;
