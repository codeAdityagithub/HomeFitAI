import db from "@/utils/db.server";
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";
import invariant from "tiny-invariant";

const EXPIRES = "10m";
const SECRET = process.env.JOINLINK_SECRET;
invariant(SECRET, "JOINLINK_SECRET not provided");

export function createJoinLink(groupId: string): string {
  return jwt.sign(groupId, SECRET!, { expiresIn: EXPIRES });
}
export function verifyToken(token: string): string | null {
  try {
    const groupId = jwt.verify(token, SECRET!) as string;
    return groupId as string;
  } catch (error) {
    return null;
  }
}
export async function verifyTokenAndJoin(token: string, userId: string) {
  try {
    const groupId = jwt.verify(token, SECRET!) as string;
    console.log(groupId);

    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });
    if (!group) return json({ error: "Group Not Found" }, { status: 404 });

    await db.user.update({
      where: { id: userId },
      data: {
        groupId: group.id,
      },
    });
    return json({ message: "Group Joined Succesfully." });
  } catch (error: any) {
    if (error.message === "jwt expired")
      return json(
        {
          error:
            "The Invite Link has expired. Please ask the sender to send a new link",
        },
        { status: 406 }
      );
    return json({ error: "The token provided is invalid" }, { status: 401 });
  }
}
