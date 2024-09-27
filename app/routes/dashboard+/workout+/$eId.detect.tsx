import Detection from "@/components/workout/Detection";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { importFunction } from "@/utils/tensorflow/imports";
import { Link, useRouteError } from "@remix-run/react";
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
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });

  invariant(params.eId);
  const q = new URL(request.url).searchParams.get("goal");
  let { data: goal } = ExerciseGoalSchema.safeParse(q);
  if (!goal) goal = "Free";

  const exercise = exercises.find((e) => e.id === params.eId);
  if (!exercise)
    throw json("Exercise not found.", {
      status: 404,
      statusText: `Exercise ${params.eId} not found`,
    });

  return { exercise, goal };
};

const DetectWorkoutPage = () => {
  const { exercise, goal } = useLoaderData<typeof loader>();
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
          goal={goal}
        />
      ) : exercise.movement === "unilateral" ? (
        <DetectionUnilateral
          name={exercise.name}
          pos_function={func}
          start_pos={ExerciseStartPosition[exercise.id]}
          goal={goal}
        />
      ) : (
        <div className="">Static exercise Todo</div>
      )}
    </div>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
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
            <Link to="/">
              <Button>Back to HomePage</Button>
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
