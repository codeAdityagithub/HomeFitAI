import { addWorkout } from "@/.server/handlers/workout/addWorkout";
import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Detection from "@/components/workout/Detection";
import DetectionUnilateral from "@/components/workout/DetectionUnilateral";
import StaticDetection from "@/components/workout/StaticDetection";
import useServiceWorker from "@/hooks/useServiceWorker";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";
import {
  ExerciseGoalSchema,
  ExerciseStartPosition,
} from "@/utils/exercises/types";
import { capitalizeEachWord } from "@/utils/general";
import { cacheClientAction } from "@/utils/routeCache.client";
import { importFunction } from "@/utils/tensorflow/imports";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useLocation,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  const pId = params.pId;
  invariant(pId, "Exercise id is required");

  const found = Object.keys(PLAYLISTS).find((p) => p === pId);
  if (!found)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });

  const allExercises = PLAYLISTS[pId as PlaylistId];

  const url = new URL(request.url);
  const sp = url.searchParams;
  const g = sp.get("goal");
  const cur = sp.get("cur");

  if (!g) {
    url.searchParams.set("goal", "Free");
    return redirect(url.toString());
  }
  if (!cur) {
    url.searchParams.set("cur", "0");
    return redirect(url.toString());
  }

  const dur = sp.get("duration");

  let { data } = ExerciseGoalSchema.safeParse({
    goal: g,
    duration: Number(dur),
  });
  if (!data)
    throw new Error("Invalid configuration entered for exercise tracker.");
  const index = Number(cur);

  if (isNaN(index) || index >= allExercises.length)
    throw new Error("Invalid current exercise index.");

  const exercise = exercises.find((e) => e.id === allExercises[index].id)!;

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
    index,
    pId,
    url,
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

const PlaylistPlayPage = () => {
  const { exercise, index, pId, url } = useLoaderData<typeof loader>();
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
            <CardFooter className="gap-4">
              <Link
                to={"/dashboard/playlists/" + pId}
                replace
              >
                <Button>Back to Playlist</Button>
              </Link>
              <Link
                to={(function () {
                  const red = new URL(url);
                  red.searchParams.set("cur", (index + 1).toString());
                  return red.toString();
                })()}
              >
                <Button variant="outline">Next Exercise</Button>
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
          <Link to={"/dashboard/playlists/" + params.pId}>
            <Button>Back to Playlist</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PlaylistPlayPage;
