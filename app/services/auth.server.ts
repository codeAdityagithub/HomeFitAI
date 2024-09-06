import { Authenticator } from "remix-auth";
import { sessionStorage } from "@/services/session.server";
import { AuthStrategies } from "@/services/auth_strategies";
import { googleStrategy } from "./auth_strategies/google.strategy";
import { User } from "@prisma/client";

export type AuthUser = Pick<User, "id" | "username" | "image" | "timezone">;

export type AuthStrategy = (typeof AuthStrategies)[keyof typeof AuthStrategies];

export type CookieData = { token: string };

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<CookieData>(sessionStorage);

// Register your strategies below
authenticator.use(googleStrategy, AuthStrategies.GOOGLE);
