import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "@/services/auth.server";
import { AuthStrategies } from "@/services/auth_strategies";

export const loader = () => redirect("/login");

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return await authenticator.authenticate(AuthStrategies.GOOGLE, request, {
    successRedirect: "/details",
  });
};
