import PlaylistCreateExCard from "@/components/playlists/PlaylistCreateExCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { groupBy } from "@/utils/general";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo, useState } from "react";
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
const CreatePlaylist = () => {
  const { exercises } = useLoaderData<typeof loader>();
  const [selectedExercises, setSelectedExercises] = useState([]);

  const exercisesByTarget = useMemo(() => {
    return groupBy(exercises, "target");
  }, [exercises]);
  const keys = useMemo(() => {
    return Object.keys(exercisesByTarget);
  }, [exercisesByTarget]);

  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl font-bold">Create Your Own Playlist</h1>
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
        {keys.map((key) => (
          <TabsContent
            key={key + "val"}
            value={key}
            className="mt-0 grid grid-cols-1 grid-cols-2-500px lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch justify-items-center"
          >
            {exercisesByTarget[key].map((e) => (
              <PlaylistCreateExCard
                key={e.name}
                e={e}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default CreatePlaylist;
