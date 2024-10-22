import { AuthUser } from "@/services/auth.server";
import { commitSession, getSession } from "@/services/session.server";
import db from "@/utils/db.server";
import { createJWT } from "@/utils/jwt/jwt.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { json, redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";

export const schema = z
  .object({
    unit: z.enum(["kgcm", "lbsft"]),
    height: z.number().positive("Height must be greater than 0."), // Positive number for height

    weight: z.number().positive("Weight must be greater than 0."), // Positive number for weight

    age: z
      .number()
      .int()
      .min(5, "Age must be greater than 5.")
      .max(100, "Age must be less than 100 years."), // Positive integer for age
    gender: z.enum(["M", "F", "OTHER"]),
    goalWeight: z.number().positive("Goal weight must be greater than 0."), // Positive integer for goal
    timezone: z.string().refine((zone) => DateTime.now().setZone(zone).isValid),
  })
  // @ts-expect-error
  .refine(
    (data) => {
      let height = data.height;
      let weight = data.weight;
      let goal = data.goalWeight;
      return (
        height >= 50 &&
        height <= 250 &&
        weight >= 30 &&
        weight <= 200 &&
        goal >= 30 &&
        goal <= 200
      );
    },
    (data) => {
      return {
        message:
          data.unit === "kgcm"
            ? {
                height:
                  data.height < 50 || data.height > 250
                    ? "Height must be between 50 and 272 cm."
                    : null,
                weight:
                  data.weight < 30 || data.weight > 200
                    ? "Weight must be between 30 and 200 kg."
                    : null,
                goalWeight:
                  data.goalWeight < 30 || data.goalWeight > 200
                    ? "Goal weight must be between 30 and 200 kg."
                    : null,
              }
            : {
                height:
                  data.height < 50 || data.height > 250
                    ? "Height must be between 1.6 and 8.11 ft"
                    : null,
                weight:
                  data.weight < 30 || data.weight > 200
                    ? "Weight must be between 65 and 441 lbs."
                    : null,
                goalWeight:
                  data.goalWeight < 30 || data.goalWeight > 200
                    ? "Goal Weight must be between 65 and 441 lbs."
                    : null,
              },
        path: ["custom"],
      };
    }
  );

export const resolver = zodResolver(schema);

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
