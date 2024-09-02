import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  const filtered = exercises.map((e) => ({
    name: e.name,
    imageUrl: e.videoId
      ? `https://img.youtube.com/vi/${e.videoId.split("?")[0]}/sddefault.jpg`
      : undefined,
    target: e.target,
    equipment: e.equipment,
  }));
  return json(
    { exercises: filtered }
    // { headers: { "Cache-Control": "public, max-age=600" } }
  );
};
export { clientLoader } from "@/utils/routeCache.client";

const WorkoutPage = () => {
  const { exercises } = useLoaderData<typeof loader>();
  // console.log(exercises);
  return (
    <div>
      <ul className="grid grid-cols-3 gap-8 items-stretch">
        {exercises.map((e) => (
          <li
            className="flex flex-col items-start shadow-sm rounded-lg overflow-hidden"
            key={e.name}
          >
            <img
              src={e.imageUrl}
              alt={e.name}
              className="w-full min-h-[200px] flex-[3] object-cover"
            />
            <div className="flex-[2]">
              <h2 className="text-xl font-bold">{e.name.toUpperCase()}</h2>
              <p>Target: {e.target}</p>
              <p>Equipment: {e.equipment}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Add your workout components here */}
      {/* ... */}
    </div>
  );
};

export default WorkoutPage;
