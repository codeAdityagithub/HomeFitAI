import { getImageFromVideoId } from "@/lib/utils";
import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
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
        equipment: e.equipment,
      })),
    },
    { headers: { "Cache-Control": "max-age=86400" } }
  );
};
