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
import { deleteKey } from "@/utils/routeCache.client";
import {
  ActionFunctionArgs,
  json,
  MetaFunction,
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
    return { ...(await getUserPlaylist(pId, user.id)), isDefault: false };
  } else {
    return { ...(await getDefaultPlaylist(pId)), isDefault: true };
  }
};
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const playlist = data; // Assuming the playlist data is passed through the loader

  return [
    { title: `${playlist?.playlistName} - Playlist Details | HomeFitAI` },
    {
      property: "og:title",
      content: `${playlist?.playlistName} Playlist - HomeFitAI`,
    },
    {
      name: "description",
      content: `Explore the ${playlist?.playlistName} playlist, featuring a selection of exercises tailored to your fitness goals. Get detailed workout instructions and tips on HomeFitAI.`,
    },
    {
      property: "og:description",
      content: `Check out the ${playlist?.playlistName} playlist, with exercises designed for all fitness levels. Stay motivated and improve your workout with HomeFitAI.`,
    },
    { name: "og:image", content: playlist?.allExercises[0].imageUrl }, // Optional: if playlist has an image URL
  ];
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

export { clientLoader } from "@/utils/routeCache.client";

const PlaylistPage = () => {
  const {
    allExercises,
    playlistName,
    expectedDuration,
    calorieMultiplier,
    description,
    isDefault,
  } = useLoaderData<typeof loader>();
  const { stats } = useDashboardLayoutData();
  const expectedCalories = Math.round(calorieMultiplier * stats.weight);

  const { toast } = useToast();
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const deletePlaylist = () => {
    deleteKey("/dashboard/playlists");
    deleteKey(window.location.pathname);
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
          <div className="flex items-center gap-2 p-4 text-white">
            <GoBack className="bg-accent/80 hover:bg-accent border-none" />
            <h1 className="text-xl sm:text-2xl py-1 font-bold">
              <span className=" capitalize">{playlistName}</span>
            </h1>
          </div>
          <div className="flex items-center justify-center flex-1">
            <Link to="play?cur=0">
              <Button
                size="icon"
                className="rounded-full mb-16 h-14 w-14 bg-accent/80 hover:bg-accent"
              >
                <Play />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 place-items-center bg-accent dark:bg-accent/80 text-accent-foreground p-4 rounded-b">
          <span className="font-semibold">
            {expectedDuration}
            <span className="text-accent-foreground text-sm font-light">
              {" "}
              mins
            </span>
          </span>
          <span className="font-semibold">
            {expectedCalories}
            <span className="text-accent-foreground text-sm font-light">
              {" "}
              Kcal
            </span>
          </span>
          <span className="font-semibold">
            {allExercises.length}
            <span className="text-accent-foreground text-sm font-light">
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
      {!isDefault && (
        <DeleteButtonwDialog
          action={deletePlaylist}
          disabled={navigation.state !== "idle"}
          label="Playlist"
        />
      )}
    </div>
  );
};
export default PlaylistPage;
