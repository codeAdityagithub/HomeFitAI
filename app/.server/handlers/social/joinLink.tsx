import { MAX_GROUP_MEMBERS } from "@/lib/constants";
import { AuthUser } from "@/services/auth.server";
import db from "@/utils/db.server";
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";
import invariant from "tiny-invariant";

const EXPIRES = "10m";
const SECRET = process.env.JOINLINK_SECRET;
invariant(SECRET, "JOINLINK_SECRET not provided");

export function createJoinLink(groupId: string): string {
  return jwt.sign({ groupId }, SECRET!, { expiresIn: EXPIRES });
}
export function verifyToken(token: string): string | null {
  try {
    const { groupId } = jwt.verify(token, SECRET!) as any;
    return groupId as string;
  } catch (error) {
    return null;
  }
}
export async function verifyTokenAndJoin(token: string, user: AuthUser) {
  try {
    const { groupId } = jwt.verify(token, SECRET!) as any;
    console.log(groupId);

    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { id: true, members: true },
    });
    if (!group)
      return json({ error: "Group Not Found", message: null }, { status: 404 });

    if (group.members.length > MAX_GROUP_MEMBERS)
      return json(
        {
          error: "Group Capacity is " + MAX_GROUP_MEMBERS + ". Group is full",
          message: null,
        },
        { status: 403 }
      );

    // join the group
    await db.$transaction([
      db.group.update({
        where: { id: group.id },
        data: {
          members: {
            push: {
              id: user.id,
              name: user.username,
              image: user.image,
            },
          },
        },
      }),
      db.user.update({
        where: { id: user.id },
        data: {
          groupId: group.id,
        },
      }),
    ]);

    return json({ message: "Group Joined Succesfully.", error: null });
  } catch (error: any) {
    if (error.message === "jwt expired")
      return json(
        {
          error:
            "The Invite Link has expired. Please ask the sender to send a new link",
          message: null,
        },
        { status: 406 }
      );
    return json(
      { error: "The token provided is invalid", message: null },
      { status: 401 }
    );
  }
}
