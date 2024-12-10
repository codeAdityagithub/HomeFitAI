import { getDayDiffAbs } from "@/.server/utils";
import { authenticator, AuthUser } from "@/services/auth.server";
import { commitSession, getSession } from "@/services/session.server";
import { redirect, Session } from "@remix-run/node";
import { createJWT, verifyJWT } from "../jwt/jwt.server";

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
export async function refreshSession(
  request: Request,
  user: AuthUser | null
): Promise<Headers> {
  let headers = new Headers();
  // @ts-expect-error

  if (user && user.exp) {
    // @ts-expect-error
    const expDate = new Date(user.exp * 1000);
    const now = new Date();
    const diff = getDayDiffAbs(expDate, now);
    const token = createJWT(
      {
        id: user.id,
        username: user.username,
        timezone: user.timezone,
        image: user.image,
      },
      "2d"
    );
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    session.set("user", { token });
    if (diff < 1) {
      headers.set("Set-Cookie", await commitSession(session));
      console.log("Refreshing user session");
    }
  }
  return headers;
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
