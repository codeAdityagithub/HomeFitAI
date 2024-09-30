import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { caloriePerMin } from "@/utils/general";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  return json(
    {
      exercises: exercises.map((e) => ({
        name: e.name,
        id: e.id,
        imageUrl: getImageFromVideoId(e.videoId),
        met: e.met,
        type: e.type,
      })),
    },
    { headers: { "Cache-Control": "max-age=100" } }
  );
};
