import type { ActionFunctionArgs } from "@remix-run/node";
import Detection from "@/components/workout/Detection";
import { requireUser } from "@/utils/auth/auth.server";
import exercises, { Exercise } from "@/utils/exercises/exercises.server";
import { importFunction } from "@/utils/tensorflow/imports";
import {
  ClientActionFunctionArgs,
  isRouteErrorResponse,
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
import StaticDetection from "@/components/workout/StaticDetection";
import { capitalizeEachWord } from "@/utils/general";
import GoBack from "@/components/GoBack";
import useServiceWorker from "@/hooks/useServiceWorker";

export type ExerciseDetectionLoader = {
  exercise: Pick<Exercise, "name" | "id" | "videoId" | "movement">;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });

  invariant(params.eId, "Exercise id is required");
  const sp = new URL(request.url).searchParams;
  const g = sp.get("goal");
  if (!g) return redirect("?goal=Free");

  const dur = sp.get("duration");

  const exercise = exercises.find((e) => e.id === params.eId);
  if (!exercise)
    throw json("Exercise not found.", {
      status: 404,
      statusText: `Exercise ${params.eId} not found`,
    });

  let { data } = ExerciseGoalSchema.safeParse({
    goal: g,
    duration: Number(dur),
  });
  if (!data)
    throw new Error("Invalid configuration entered for exercise tracker.");

  if (
    exercise.type === "duration" &&
    (data.goal === "Reps" || data.goal === "TUT")
  )
    throw new Error("Invalid configuration entered for exercise tracker.", {
      cause: "Invalid Input",
    });

  return {
    exercise: {
      id: exercise.id,
      name: exercise.name,
      videoId: exercise.videoId,
      movement: exercise.movement,
      type: exercise.type,
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
  useServiceWorker();

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
      ) : exercise.type === "sets" && exercise.movement === "bilateral" ? (
        <>
          <div className="flex gap-2 items-center mb-4">
            <GoBack />
            <h1 className="text-2xl font-bold text-muted-foreground underline underline-offset-4">
              {capitalizeEachWord(exercise.name)}
            </h1>
          </div>
          <Detection
            name={exercise.name}
            pos_function={func}
            start_pos={ExerciseStartPosition[exercise.id]}
          />
        </>
      ) : exercise.type === "sets" && exercise.movement === "unilateral" ? (
        <>
          <div className="flex gap-2 items-center mb-4">
            <GoBack />
            <h1 className="text-2xl font-bold text-muted-foreground underline underline-offset-4">
              {capitalizeEachWord(exercise.name)}
            </h1>
          </div>
          <DetectionUnilateral
            name={exercise.name}
            pos_function={func}
            start_pos={ExerciseStartPosition[exercise.id]}
          />
        </>
      ) : (
        <>
          <div className="flex gap-2 items-center mb-4">
            <GoBack />
            <h1 className="text-2xl font-bold text-muted-foreground underline underline-offset-4">
              {capitalizeEachWord(exercise.name)}
            </h1>
          </div>
          <StaticDetection
            name={exercise.name}
            pos_function={func}
          />
        </>
      )}
    </div>
  );
};
export function ErrorBoundary() {
  const error: any = useRouteError();
  const params = useParams();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex items-center justify-center h-svh">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>
              {error.status} {error.statusText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.data}</p>
          </CardContent>
          <CardFooter>
            <Link to="/">
              <Button>Back to HomePage</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-svh">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Error!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error?.message ?? "Something Went Wrong!"}</p>
        </CardContent>
        <CardFooter>
          <Link to={"/dashboard/workout/" + params.eId}>
            <Button>Back to Workout</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DetectWorkoutPage;
