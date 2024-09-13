import { requireUser } from "@/utils/auth/auth.server";
import exercises from "@/utils/exercises/exercises.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request, { failureRedirect: "/login" });
  return json(
    {
      exercises: exercises.map((e) => ({
        name: e.name,
        met: e.met,
        imageUrl: `https://img.youtube.com/vi/${
          e.videoId.split("?")[0]
        }/sddefault.jpg`,
      })),
    },
    { headers: { "Cache-Control": "max-age=100" } }
  );
};
