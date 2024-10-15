import { authenticator } from "@/services/auth.server";
import { AuthStrategies } from "@/services/auth_strategies";
import { getAuthUser } from "@/utils/auth/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = () => redirect("/login");

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getAuthUser(request);

  if (user) {
    await authenticator.logout(request, { redirectTo: "/login" });
  }
  return await authenticator.authenticate(AuthStrategies.GOOGLE, request, {
    successRedirect: "/details",
  });
};
