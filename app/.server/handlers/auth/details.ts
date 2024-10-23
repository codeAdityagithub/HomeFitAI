import { AuthUser } from "@/services/auth.server";
import { commitSession, getSession } from "@/services/session.server";
import db from "@/utils/db.server";
import { resolver, schema } from "@/utils/detailsPage/zodConstants";
import { createJWT } from "@/utils/jwt/jwt.server";
import { json, redirect } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof schema>;

export async function createUserDetails(request: Request, user: AuthUser) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues });
  }
  const session = await getSession(request.headers.get("Cookie"));
  const { timezone, ...stats } = data;
  try {
    const [createdStats, updatedUser] = await db.$transaction([
      db.stats.create({
        data: { ...stats, user: { connect: { id: user.id } }, dailyGoals: {} },
      }),
      db.user.update({
        where: { id: user.id },
        data: { timezone },
      }),
    ]);

    session.set("user", {
      token: createJWT(
        {
          username: user.username,
          id: updatedUser.id,
          timezone: timezone,
          image: updatedUser.image,
        },
        "2d"
      ),
    });
    // session.data
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    console.log(error.message ?? error);
    return { error: "Cannot create Stats for this user." };
  }
}
