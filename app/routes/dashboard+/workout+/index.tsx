import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises";
import { capitalizeFirstLetter, groupBy } from "@/utils/general";
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
    secondaryMuscles: e.secondaryMuscles,
  }));
  return json(
    { exercises: filtered }
    // { headers: { "Cache-Control": "public, max-age=600" } }
  );
};
export { clientLoader } from "@/utils/routeCache.client";

const WorkoutPage = () => {
  const { exercises } = useLoaderData<typeof loader>();
  const exercisesByTarget = groupBy(exercises, "target");
  // console.log(exercisesByTarget);
  return (
    <div className="space-y-10">
      {Object.keys(exercisesByTarget).map((key) => (
        <div key={key}>
          <h1 className="text-3xl my-2 font-bold leading-8">
            Exercises for{" "}
            <span className="text-[28px] text-accent underline">
              {key.split(" ").map((w) => capitalizeFirstLetter(w) + " ")}
            </span>
          </h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {exercisesByTarget[key].map((e) => (
              // <li
              // className="flex flex-col items-start drop-shadow-md rounded-lg"
              // key={e.name}
              // >
              //   <img
              //     src={e.imageUrl}
              //     alt={e.name}
              //     className="w-full aspect-[17/9] object-cover rounded-lg"
              //     />
              //   <div className="flex-1">
              //     <h2 className="text-lg font-bold">{e.name.toUpperCase()}</h2>
              //     <p>Target: {e.target}</p>
              //     <p>Equipment: {e.equipment}</p>
              //   </div>
              // </li>
              <li
                className="flex flex-col items-start drop-shadow-md rounded-lg overflow-hidden"
                key={e.name}
              >
                <img
                  src={e.imageUrl}
                  alt={e.name}
                  className="w-full aspect-[17/9] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] p-6 flex flex-col items-start justify-center">
                  <h2 className="text-lg font-bold text-white">
                    {e.name.toUpperCase()}
                  </h2>
                  <p className="text-gray-100">
                    Other muscles:{" "}
                    {e.secondaryMuscles.map(
                      (m, i) =>
                        `${capitalizeFirstLetter(m)}${
                          i === e.secondaryMuscles.length - 1 ? "" : ", "
                        }`
                    )}
                  </p>
                  <p className="text-gray-100">Equipment: {e.equipment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Add your workout components here */}
      {/* ... */}
    </div>
  );
};

export default WorkoutPage;
