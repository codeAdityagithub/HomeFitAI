import { verifyToken } from "@/.server/handlers/social/joinLink";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { redirect } from "@remix-run/node";

export type GroupInfoLoader = {
  name: string;
  creator: {
    name: string;
    image: string | null;
    id: string;
  };
  members: number;
};

export default async function (request: Request) {
  const user = await requireUser(request, { failureRedirect: "/login" });

  const dbuser = await db.user.findUnique({
    where: { id: user.id },
    select: { groupId: true },
  });
  if (dbuser && dbuser.groupId) return redirect("../");

  const token = new URL(request.url).searchParams.get("token");

  if (!token) return { error: null, group: null };

  const groupId = verifyToken(token);
  if (!groupId)
    return { error: "Invalid Token, Token has expired", group: null };

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { name: true, creatorId: true, members: true },
  });

  if (!group) return { error: "Invalid Token, Group Not Found", group: null };

  const creator = group.members.find((m) => m.id === group.creatorId)!;

  const group_trimmed: GroupInfoLoader = {
    name: group.name,
    creator: creator,
    members: group.members.length,
  };

  return { group: group_trimmed, error: null };
}
