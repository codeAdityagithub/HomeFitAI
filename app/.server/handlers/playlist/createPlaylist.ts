import { PLAYLIST_CONSTANTS } from "@/lib/constants";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";

const playlistSchema = z.object({
  name: z.string().min(3, "Playlist Name must be at least 3 characters long."),
  description: z.string().optional(),
  userId: z.string(),
  exercises: z
    .array(
      z.object({
        eId: z.string(),
        sets: z
          .number()
          .min(PLAYLIST_CONSTANTS.sets.min)
          .max(
            PLAYLIST_CONSTANTS.sets.max,
            `Cannot have more than ${PLAYLIST_CONSTANTS.sets.max} sets`
          ),
      })
    )
    .min(
      PLAYLIST_CONSTANTS.exercises.min,
      `Please select at least ${PLAYLIST_CONSTANTS.exercises.min} exercises`
    )
    .max(
      PLAYLIST_CONSTANTS.exercises.max,
      `Cannot have more than ${PLAYLIST_CONSTANTS.exercises.max} exercises`
    )
    .refine(
      (exs) => exs.every((e) => exercises.some((ex) => ex.id === e.eId)),
      "Invalid exercise selected"
    ),
});

export const createPlaylist = async (props: z.infer<typeof playlistSchema>) => {
  const { data, error } = playlistSchema.safeParse(props);
  if (error)
    return json({ error: error.flatten().fieldErrors }, { status: 403 });

  try {
    const count = await db.playlist.count({ where: { userId: data.userId } });
    if (count >= PLAYLIST_CONSTANTS.max_playlists)
      return json(
        {
          error: `Cannot have more than ${PLAYLIST_CONSTANTS.max_playlists} playlists`,
        },
        { status: 403 }
      );
    const p = await db.playlist.create({
      data: {
        name: data.name,
        description: data.description,
        exercises: data.exercises,
        user: { connect: { id: data.userId } },
      },
    });
    return redirect("/dashboard/playlists/" + p.id);
  } catch (error: any) {
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
