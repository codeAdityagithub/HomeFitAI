import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { Achievement, Stats } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@remix-run/node";

type profile = {};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const memberId = new URL(request.url).searchParams.get("memberId");
  if (!memberId)
    return json({ error: "Member Id is required" }, { status: 400 });

  try {
    const dbuser = await db.user.findUnique({
      where: { id: user.id },
      select: { groupId: true },
    });
    if (!dbuser || !dbuser.groupId)
      return json({ error: "User or group not found" }, { status: 404 });
    const group = await db.group.findUnique({
      where: { id: dbuser.groupId },
      select: { members: true },
    });
    if (!group) return json({ error: "Group not found" }, { status: 404 });
    const member = group.members.find((m) => m.id === memberId);

    if (!member)
      return json(
        { error: "You can only view profile of members of your own group." },
        { status: 403 }
      );
    const profile = await db.user.findUnique({
      where: { id: memberId },
      select: {
        achievements: true,
        stats: {
          select: {
            currentStreak: true,
            bestStreak: true,
            totalCalories: true,
            createdAt: true,
          },
        },
      },
    });
    if (!profile) return json({ error: "Profile Not Found" }, { status: 404 });

    return json(
      { profile },
      {
        headers: {
          "Cache-Control": "private, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};

export type MemberInfoApiRes = {
  profile: {
    stats: Pick<
      Stats,
      "bestStreak" | "currentStreak" | "totalCalories" | "createdAt"
    >;
    achievements: Achievement[];
  };
};
