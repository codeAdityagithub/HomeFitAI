import { getImageFromVideoId } from "@/lib/utils";
import db from "@/utils/db.server";
import exercises from "@/utils/exercises/exercises.server";
import { PlaylistId, PLAYLISTS } from "@/utils/exercises/playlists.server";

export const getAllPlaylists = async (userId: string) => {
  const users_playlists = await db.playlist.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      exercises: true,
    },
  });
  const user_playlists_reduced = users_playlists.map((p) => ({
    ...p,
    totalExercises: p.exercises.length,
  }));
  const playlists = {
    beginner: [
      {
        id: "BEGINNER_FULL_BODY",
        name: "Beginner Full Body",
        totalExercises: PLAYLISTS.BEGINNER_FULL_BODY.length,
      },
      {
        id: "BEGINNER_UPPER_BODY",
        name: "Beginner Upper Body",
        totalExercises: PLAYLISTS.BEGINNER_UPPER_BODY.length,
      },
      {
        id: "BEGINNER_LOWER_BODY",
        name: "Beginner Lower Body",
        totalExercises: PLAYLISTS.BEGINNER_LOWER_BODY.length,
      },
    ],
    intermediate: [
      {
        id: "INTERMEDIATE_FULL_BODY",
        name: "Intermediate Full Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_FULL_BODY.length,
      },
      {
        id: "INTERMEDIATE_UPPER_BODY",
        name: "Intermediate Upper Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_UPPER_BODY.length,
      },
      {
        id: "INTERMEDIATE_LOWER_BODY",
        name: "Intermediate Lower Body",
        totalExercises: PLAYLISTS.INTERMEDIATE_LOWER_BODY.length,
      },
    ],
    advanced: [
      {
        id: "ADVANCED_FULL_BODY",
        name: "Advanced Full Body",
        totalExercises: PLAYLISTS.ADVANCED_FULL_BODY.length,
      },
      {
        id: "ADVANCED_UPPER_BODY",
        name: "Advanced Upper Body",
        totalExercises: PLAYLISTS.ADVANCED_UPPER_BODY.length,
      },
      {
        id: "ADVANCED_LOWER_BODY",
        name: "Advanced Lower Body",
        totalExercises: PLAYLISTS.ADVANCED_LOWER_BODY.length,
      },
    ],
  };

  const images = Object.keys(PLAYLISTS)
    .map((p) => ({
      [p]: getImageFromVideoId(
        exercises.find((e) => {
          // @ts-expect-error
          return e.id === PLAYLISTS[p as PlaylistId].at(-4).id;
        })!.videoId
      ),
    }))
    .reduce((acc, obj) => ({ ...acc, ...obj }), {}) as Record<
    PlaylistId,
    string
  >;

  const user_images = user_playlists_reduced.reduce(
    (acc, p) => ({
      ...acc,
      [p.id]:
        p.exercises.length > 0
          ? getImageFromVideoId(
              // @ts-expect-error
              exercises.find((e) => e.id === p.exercises[0].eId).videoId
            )
          : "",
    }),
    {} as Record<string, string>
  );

  const allImages = { ...images, ...user_images };
  return {
    playlists,
    users_playlists: user_playlists_reduced,
    images: allImages,
  };
};
