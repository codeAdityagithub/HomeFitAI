import { authenticator } from "@/services/auth.server";
import { redirect, Session } from "@remix-run/node";
import { verifyJWT } from "../jwt/jwt.server";

export async function requireUser(
  request: Request | Session,
  {
    failureRedirect,
  }: {
    failureRedirect: string;
  }
) {
  const token = await authenticator.isAuthenticated(request);
  if (!token) throw redirect(failureRedirect);
  const user = verifyJWT(token.token);
  if (!user) throw redirect(failureRedirect);
  return user;
}
export async function getAuthUser(request: Request | Session) {
  const token = await authenticator.isAuthenticated(request);
  if (!token) return null;
  const user = verifyJWT(token.token);
  if (!user) return null;
  return user;
}
export async function isJWTValid(request: Request | Session) {
  const token = await authenticator.isAuthenticated(request);
  if (!token) return true;
  const user = verifyJWT(token.token);
  if (!user) return false;
  return true;
}

export async function redirectIfAuth(
  request: Request | Session,
  {
    successRedirect,
  }: {
    successRedirect: string;
  }
) {
  const token = await authenticator.isAuthenticated(request);
  if (!token) return null;

  const user = verifyJWT(token.token);
  if (!user) return null;
  throw redirect(successRedirect);
}
