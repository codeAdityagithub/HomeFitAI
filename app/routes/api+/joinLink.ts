import {
  createJoinLink,
  verifyToken,
} from "@/.server/handlers/social/joinLink";
import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  try {
    const group = await db.group.findUnique({
      where: { creatorId: user.id },
      select: { id: true, activeToken: true },
    });
    if (!group)
      return json({ error: "Group Not Found", message: null }, { status: 400 });

    if (group.activeToken !== null && verifyToken(group.activeToken)) {
      return json(
        { error: "Already have a Active Join Link", message: null },
        { status: 403 }
      );
    }

    const updated = await db.group.update({
      where: { id: group.id },
      data: {
        activeToken: createJoinLink(group.id),
      },
    });
    return {
      error: null,
      message: "Join Link Created Succesfully. It will be active for 10 mins",
    };
  } catch (error: any) {
    console.log(error?.message);
    return json(
      { error: "Something went wrong", message: null },
      { status: 500 }
    );
  }
};

export type CreateJoinLinkAction = typeof action;
