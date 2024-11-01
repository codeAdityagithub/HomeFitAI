import { verifyToken } from "@/.server/handlers/social/joinLink";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { redirect } from "@remix-run/node";

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
    return { error: "Invalid Token, Group Id missing", group: null };

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { name: true, creatorId: true, members: true },
  });

  if (!group) return { error: "Invalid Token, Group Not Found", group: null };
  return { group, error: null };
}
