import { authenticator } from "@/services/auth.server";
import { AuthStrategies } from "@/services/auth_strategies";
import { isJWTValid } from "@/utils/auth/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = () => redirect("/login");

export const action = async ({ request }: ActionFunctionArgs) => {
  const valid = await isJWTValid(request);
  if (!valid) {
    await authenticator.logout(request, { redirectTo: "/login" });
  }
  return await authenticator.authenticate(AuthStrategies.GOOGLE, request, {
    successRedirect: "/details",
  });
};
