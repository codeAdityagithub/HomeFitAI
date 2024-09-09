import { MetaFunction } from "@remix-run/react";
import { isRouteErrorResponse, Link, useRouteError } from "@remix-run/react";
import Detection from "@/components/workout/Detection";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { PositionFunction } from "@/utils/tensorflow/functions";
import { importFunction } from "@/utils/tensorflow/imports";
// import { flexing } from "@/utils/tensorflow/functions";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
  const [func, setFunc] = useState<PositionFunction>();

  useEffect(() => {
    const funcName = exercise.id;
    async function loadFunction() {
      const fetchedFunction = await importFunction(funcName);

      setFunc(() => fetchedFunction);
    }
    loadFunction();
  }, []);

  return (
    <>
      {func ? (
        <Detection
          name={exercise.name}
          pos_function={func}
          start_pos={2}
        />
      ) : (
        <div className="flex items-center justify-center h-svh">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Error!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The detection function for
                {exercise.name}
                is not implemented yet! Visit later
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
      )}
    </>
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
