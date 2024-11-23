import { requireUser } from "@/utils/auth/auth.server";
import db from "@/utils/db.server";
import { json } from "@remix-run/node";

export default async function createGroup(request: Request) {
  const user = await requireUser(request, { failureRedirect: "/login" });

  const form = await request.formData();

  const groupName = form.get("groupName");

  if (
    !groupName ||
    groupName.toString().length < 3 ||
    groupName.toString().length > 30
  )
    return json(
      {
        error: "Group Name must be between 3-100 characters long.",
        message: null,
      },
      { status: 400 }
    );

  try {
    const groupId = await db.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: groupName.toString(),
          creatorId: user.id,
          members: [{ id: user.id, image: user.image, name: user.username }],
        },
      });
      await db.user.update({
        where: { id: user.id },
        data: {
          groupId: { set: group.id },
        },
      });
      return group.id;
    });
    return { message: "Group Created Succesfully", groupId, error: null };
  } catch (error) {
    return json(
      { error: "Something went wrong", message: null },
      { status: 500 }
    );
  }
}
