import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "@/services/auth.server";
import { AuthStrategies } from "@/services/auth_strategies";

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  return authenticator.authenticate(AuthStrategies.GOOGLE, request, {
    successRedirect: "/details",
    failureRedirect: "/login",
  });
};
