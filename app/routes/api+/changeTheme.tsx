import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { themeCookie } from "@/utils/themeCookie.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const theme: string = await themeCookie.parse(request.headers.get("Cookie"));
  return json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await themeCookie.serialize(
          theme === "light" ? "dark" : "light"
        ),
      },
    }
  );
};
