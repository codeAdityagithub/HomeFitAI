import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { deleteKey } from "@/utils/routeCache.client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { ClientActionFunctionArgs } from "@remix-run/react";
import { z } from "zod";

const reactionSchema = z.object({
  messageId: z.string(),
  reaction: z.enum(["LIKE", "HEART", "CELEBRATE"]),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const formData = await request.formData();
  const messageId = formData.get("messageId")?.toString();
  const reaction = formData.get("reaction")?.toString() as any;

  try {
    if (request.method === "POST") {
      if (!messageId || !reaction)
        return json({ error: "Invalid Input", message: null }, { status: 403 });

      if (!reactionSchema.safeParse({ messageId, reaction }).success)
        return json({ error: "Invalid Input", message: null }, { status: 403 });

      const dbuser = await db.user.findUnique({
        where: { id: user.id },
        select: { groupId: true },
      });

      if (!dbuser || !dbuser.groupId)
        return json(
          { error: "User not found", message: null },
          { status: 404 }
        );
      // console.log(messageId, reaction);
      const group = await db.group.findUnique({
        where: { id: dbuser.groupId },
        select: { messages: true },
      });

      if (!group)
        return json(
          { error: "Group not found", message: null },
          { status: 404 }
        );

      const updatedMessages = group.messages.map((message) => {
        if (message.id === messageId) {
          const hasAlready = message.reactions.find((r) => r.from === user.id);
          return {
            ...message,
            reactions: !hasAlready
              ? [...message.reactions, { from: user.id, type: reaction }]
              : message.reactions.map((r) => {
                  if (r.from === user.id) {
                    return {
                      ...r,
                      type: reaction,
                    };
                  } else {
                    return r;
                  }
                }),
          };
        } else {
          return message;
        }
      });

      await db.group.update({
        where: { id: dbuser.groupId },
        data: {
          messages: {
            set: updatedMessages,
          },
        },
      });
      return { message: "Reaction Added ", error: null };
    } else if (request.method === "DELETE") {
      if (!messageId)
        return json({ error: "Invalid Input", message: null }, { status: 403 });

      const dbuser = await db.user.findUnique({
        where: { id: user.id },
        select: { groupId: true },
      });

      if (!dbuser || !dbuser.groupId)
        return json(
          { error: "User not found", message: null },
          { status: 404 }
        );
      // console.log(messageId, reaction);
      const group = await db.group.findUnique({
        where: { id: dbuser.groupId },
        select: { messages: true },
      });

      if (!group)
        return json(
          { error: "Group not found", message: null },
          { status: 404 }
        );

      const updatedMessages = group.messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            reactions: message.reactions.filter((r) => r.from !== user.id),
          };
        } else {
          return message;
        }
      });

      await db.group.update({
        where: { id: dbuser.groupId },
        data: {
          messages: {
            set: updatedMessages,
          },
        },
      });
      return { message: "Reaction Removed", error: null };
    }
  } catch (error) {
    return json(
      { error: "Something went Wrong", message: null },
      { status: 500 }
    );
  }
};

export const clientAction = async ({
  serverAction,
  request,
}: ClientActionFunctionArgs) => {
  deleteKey("/dashboard/social/group");
  return await serverAction();
};

export type AddReactionAction = typeof action;
