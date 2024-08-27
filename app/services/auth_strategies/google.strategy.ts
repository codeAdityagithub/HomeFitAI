import { AuthStrategies } from "@/services/auth_strategies";
import type { AuthUser } from "@/services/auth.server";
import { GoogleStrategy } from "remix-auth-google";
import { db } from "@/utils/db.server";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

export const googleStrategy = new GoogleStrategy<AuthUser>(
  {
    clientID,
    clientSecret,
    callbackURL: `${process.env.APP_URL}/auth/${AuthStrategies.GOOGLE}/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Do something with the tokens and profile
    const { email, name, picture } = profile._json;
    const dbuser = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, image: true },
    });
    if (dbuser) return dbuser;

    const newUser = await db.user.create({
      data: { username: name, email, image: picture },
      select: { id: true, email: true, username: true, image: true },
    });

    return newUser;
  }
);
