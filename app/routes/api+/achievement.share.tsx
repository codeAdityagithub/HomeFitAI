import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { deleteKey } from "@/utils/routeCache.client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { ClientActionFunctionArgs } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request, { failureRedirect: "/login" });

  const achievementId = (await request.formData())
    .get("achievementId")
    ?.toString();

  if (!achievementId) {
    return json({ error: "Invalid Input." }, { status: 403 });
  }

  try {
    await db.$transaction(async (tx) => {
      const dbuser = await tx.user.findUnique({
        where: { id: user.id, groupId: { not: { equals: null } } },
        select: {
          groupId: true,
          achievements: true,
        },
      });

      if (
        !dbuser ||
        !dbuser.groupId ||
        dbuser.achievements.length === 0 ||
        dbuser.achievements.find(
          (a) => a.id === achievementId && a.shared === true
        )
      ) {
        throw new Error("Achievement Doesn't exist of is already shared.");
      }

      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          achievements: {
            updateMany: {
              where: {
                id: achievementId,
                shared: false,
              },
              data: {
                shared: true,
              },
            },
          },
        },
        select: {
          achievements: true,
        },
      });

      const achievement = updatedUser.achievements.find(
        (achievement) =>
          achievement.id === achievementId && achievement.shared === true
      );

      if (!achievement) throw new Error("Invalid Input.");

      await tx.group.update({
        where: {
          id: dbuser.groupId,
        },
        data: {
          messages: {
            push: {
              from: user.id,
              content: {
                title: achievement.title,
                description: achievement.description,
                type: "ACHIEVEMENT",
              },
            },
          },
        },
      });
    });
    return redirect("/dashboard/social/group");
  } catch (error) {
    console.log(error);
    return json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export const clientAction = async ({
  serverAction,
  request,
}: ClientActionFunctionArgs) => {
  deleteKey("/dashboard/social/group");
  return await serverAction();
};

export type ShareAchievementAction = typeof action;
