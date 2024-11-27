import { createPlaylist } from "@/.server/handlers/playlist/createPlaylist";
import GoBack from "@/components/GoBack";
import PlaylistCreateExCard from "@/components/playlists/PlaylistCreateExCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PLAYLIST_CONSTANTS } from "@/lib/constants";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { groupBy } from "@/utils/general";
import { deleteKey } from "@/utils/routeCache.client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardExercise } from "../workout+";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, {
    failureRedirect: "/login",
  });
  const filtered: DashboardExercise[] = exercises.map((e) => ({
    name: e.name,
    id: e.id,
    imageUrl: getImageFromVideoId(e.videoId),
    target: e.target,
    equipment: e.equipment,
    secondaryMuscles: e.secondaryMuscles,
  }));
  return { exercises: filtered };
};

export { clientLoader } from "@/utils/routeCache.client";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const { name, description, exercises } = await request.json();

  return await createPlaylist({
    name,
    description,
    exercises,
    userId: user.id,
  });
};

export const clientAction = async ({
  serverAction,
  request,
}: ClientActionFunctionArgs) => {
  deleteKey("/dashboard/playlists");
  return await serverAction();
};

const CreatePlaylist = () => {
  const { exercises } = useLoaderData<typeof loader>();
  const selected_ref = useRef<Map<string, number>>(new Map<string, number>());

  const [, forceUpdate] = useState(0);

  const { toast } = useToast();

  const addOrIncrement = (id: string) => {
    if (selected_ref.current.size >= PLAYLIST_CONSTANTS.exercises.max) {
      toast({
        title: `You can only select ${PLAYLIST_CONSTANTS.exercises.max} exercises`,
        variant: "destructive",
      });
      return;
    }
    if (selected_ref.current.has(id)) {
      if (selected_ref.current.get(id)! >= PLAYLIST_CONSTANTS.sets.max) return;

      selected_ref.current.set(id, selected_ref.current.get(id)! + 1);
    } else {
      selected_ref.current.set(id, 1);
    }
    forceUpdate((prev) => prev + 1);
  };

  const removeOrDecrement = (id: string) => {
    if (selected_ref.current.has(id)) {
      if (selected_ref.current.get(id) === 1) {
        selected_ref.current.delete(id);
      } else {
        selected_ref.current.set(id, selected_ref.current.get(id)! - 1);
      }
    }
    forceUpdate((prev) => prev + 1);
  };

  const exercisesByTarget = useMemo(() => {
    return groupBy(exercises, "target");
  }, [exercises]);
  const keys = useMemo(() => {
    return Object.keys(exercisesByTarget);
  }, [exercisesByTarget]);

  const submit = useSubmit();

  const navigation = useNavigation();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (selected_ref.current.size < PLAYLIST_CONSTANTS.exercises.min) {
      toast({
        title: `Playlist must have atleast ${PLAYLIST_CONSTANTS.exercises.min} exercises`,
        variant: "destructive",
      });
      return;
    }
    const exercises = Array.from(selected_ref.current).map(([e, sets]) => ({
      eId: e,
      sets,
    }));

    submit(
      {
        name: e.target.name.value,
        description: e.target.description.value,
        exercises,
      },
      {
        encType: "application/json",
        method: "post",
      }
    );
  };
  const actionData = useActionData<typeof action>();
  // error handling
  useEffect(() => {
    if (actionData?.error && typeof actionData.error === "string") {
      toast({
        description: actionData.error,
        variant: "destructive",
      });
    } else if (actionData?.error && typeof actionData.error === "object") {
      toast({
        description: actionData.error.name
          ? actionData.error.name[0]
          : actionData.error.exercises
          ? actionData.error.exercises[0]
          : "Something went wrong",
        variant: "destructive",
      });
    }
  }, [actionData?.error]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GoBack />
          Create <span className="text-accent">Your Own</span> Playlist
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 *:flex *:flex-col *:gap-2"
        >
          <Label>
            Enter Playlist Name
            <Input
              type="text"
              required
              minLength={3}
              name="name"
              placeholder="Playlist Name"
            />
          </Label>
          <Label>
            Enter Playlist Description
            <Input
              type="text"
              name="description"
              placeholder="Playlist Description"
            />
          </Label>
          <Button
            size="sm"
            className="w-fit"
            disabled={navigation.state !== "idle"}
          >
            {navigation.state === "submitting" ? "Creating..." : "Create"}
          </Button>
        </form>
        <div className="">
          <h2 className="text-lg font-semibold">Selected Exercises </h2>
          <div className="px-4 pt-2 grid grid-cols-1 llg:grid-cols-2 gap-4">
            {exercises
              .filter((e) => selected_ref.current.has(e.id))
              .map((e) => (
                <div
                  key={"s" + e.id}
                  className="w-full grid grid-cols-3 place-items-center justify-items-start gap-3 sm:gap-4"
                >
                  <img
                    src={e.imageUrl}
                    alt={e.name}
                    className="w-full max-h-[80px] aspect-[2/1] object-cover rounded-lg"
                  />
                  <p className="capitalize text-sm sm:text-base">{e.name}</p>
                  <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="hover:bg-destructive w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9"
                      onClick={() => removeOrDecrement(e.id)}
                    >
                      <Minus className="size-4 sm:size-6" />
                    </Button>
                    <p className="text-lg font-bold">
                      {selected_ref.current.get(e.id)}
                    </p>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9"
                      disabled={selected_ref.current.get(e.id)! >= 6}
                      onClick={() => addOrIncrement(e.id)}
                    >
                      <Plus className="size-4 sm:size-6" />
                    </Button>
                  </div>
                </div>
              ))}
            {selected_ref.current.size === 0 && (
              <p className="text-muted-foreground justify-self-start">
                No exercises selected
              </p>
            )}
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={keys[0]}
        className="w-full space-y-4"
      >
        <TabsList className="flex flex-wrap h-fit">
          {keys.map((key) => (
            <TabsTrigger
              key={key + "list"}
              value={key}
              className="capitalize"
            >
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        <h2 className="text-lg font-semibold text-foreground/80:">
          Click to select
        </h2>
        {keys.map((key) => (
          <TabsContent
            key={key + "val"}
            value={key}
            className="mt-0 px-4 grid grid-cols-1 grid-cols-2-500px lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center"
          >
            {exercisesByTarget[key]
              .filter((e) => !selected_ref.current.has(e.id))
              .map((e) => (
                <div
                  key={"t" + e.id}
                  onClick={() => {
                    addOrIncrement(e.id);
                  }}
                  className="hover:shadow-accent/30 hover:shadow-lg transition-all "
                >
                  <PlaylistCreateExCard e={e} />
                </div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default CreatePlaylist;
