import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { json } from "@remix-run/node";

export default async function getGroup(user: AuthUser) {
  const dbuser = await db.user.findUnique({
    where: { id: user.id },
    select: { groupId: true },
  });
  if (!dbuser) throw json({ error: "User not found" }, { status: 404 });

  const groupId = dbuser.groupId;

  if (!groupId) return { group: null };
  const group = await db.group.findUnique({
    where: { id: groupId },
  });
  return { group };
}
