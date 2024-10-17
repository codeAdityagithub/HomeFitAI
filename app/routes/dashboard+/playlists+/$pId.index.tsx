import deletePlaylist from "@/.server/handlers/playlist/deletePlaylist";
import getDefaultPlaylist from "@/.server/loaders/playlists/getDefaultPlaylist";
import getUserPlaylist from "@/.server/loaders/playlists/getUserPlaylist";
import DeleteButtonwDialog from "@/components/custom/DeleteButtonwDialog";
import GoBack from "@/components/GoBack";
import PlaylistExerciseCard from "@/components/playlists/PlaylistExerciseCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { requireUser } from "@/utils/auth/auth.server";
import { isObjectId } from "@/utils/general";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Play } from "lucide-react";
import { useEffect } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const pId = params.pId;
  if (!pId)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });
  const isUserPlaylist = isObjectId(pId);

  if (isUserPlaylist) {
    return await getUserPlaylist(pId, user.id);
  } else {
    return await getDefaultPlaylist(pId);
  }
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const pId = params.pId;
  if (!pId)
    throw json("Requested Playlist not found", {
      status: 404,
      statusText: "Playlist not found",
    });

  if (isObjectId(pId)) {
    return await deletePlaylist(pId, user.id);
  }
  return json({ error: "Invalid Method", ok: false }, { status: 405 });
};
export { clientAction, clientLoader } from "@/utils/routeCache.client";

const PlaylistPage = () => {
  const {
    allExercises,
    playlistName,
    expectedDuration,
    calorieMultiplier,
    description,
  } = useLoaderData<typeof loader>();
  const { stats } = useDashboardLayoutData();
  const expectedCalories = Math.round(calorieMultiplier * stats.weight);

  const { toast } = useToast();
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const deletePlaylist = () => {
    submit(
      {},
      {
        method: "delete",
      }
    );
  };
  useEffect(() => {
    // @ts-expect-error
    if (actionData && actionData.ok && actionData.message) {
      toast({
        // @ts-expect-error
        title: actionData.message,
        variant: "success",
      });
      navigate("/dashboard/playlists", { replace: true });
    }
  }, [actionData]);
  return (
    <div className="flex flex-col gap-4 w-fit mx-auto max-w-3xl">
      <div className="relative min-w-full">
        <img
          src={allExercises[0].imageUrl}
          alt={playlistName}
          className="w-full aspect-[2/1] min-h-[200px] object-cover rounded-t brightness-50"
        />
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center gap-2 p-4">
            <GoBack className="bg-accent/60 hover:bg-accent/80 border-none" />
            <h1 className="text-xl sm:text-2xl py-1 font-bold">
              <span className="text-foreground capitalize">{playlistName}</span>
            </h1>
          </div>
          <div className="flex items-center justify-center flex-1">
            <Link to="play?cur=0">
              <Button
                size="icon"
                className="rounded-full mb-16 h-14 w-14 bg-accent/60 hover:bg-accent/80"
              >
                <Play />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 place-items-center bg-accent/60 p-4 rounded-b">
          <span className="font-semibold">
            {expectedDuration}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              mins
            </span>
          </span>
          <span className="font-semibold">
            {expectedCalories}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              Kcal
            </span>
          </span>
          <span className="font-semibold">
            {allExercises.length}
            <span className="text-accent-foreground/80 text-sm font-normal">
              {" "}
              Exercises
            </span>
          </span>
        </div>
      </div>
      {description && <p className="text-foreground/80">{description}</p>}
      <h2 className="text-2xl font-bold mt-2">Exercises</h2>
      <ul className="flex flex-col gap-4 p-4 pt-0">
        {allExercises.map((e) => (
          <PlaylistExerciseCard
            key={e.id}
            id={e.id}
            imageUrl={e.imageUrl}
            label={e.name}
            sets={e.sets}
          />
        ))}
      </ul>
      <DeleteButtonwDialog
        action={deletePlaylist}
        disabled={navigation.state !== "idle"}
        label="Playlist"
      />
    </div>
  );
};
export default PlaylistPage;
