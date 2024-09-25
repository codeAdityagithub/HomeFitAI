import { AuthUser } from "@/services/auth.server";
import { commitSession, getSession } from "@/services/session.server";
import { createJWT } from "@/utils/jwt/jwt.server";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload: AuthUser = {
    id: "66d9a75f71c17114b9079ff2",
    image: null,
    timezone: "Asia/Calcutta",
    username: "Aditya 008 test",
  };
  const token = createJWT(payload, "2d");
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  session.set("user", { token });
  //   console.log(session);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
