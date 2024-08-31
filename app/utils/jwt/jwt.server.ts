import type { AuthUser } from "@/services/auth.server";
import jwt from "jsonwebtoken";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "Session secret missing.");

const SECRET_KEY = process.env.SESSION_SECRET;

// Function to create a JWT
export function createJWT(payload: AuthUser, expiresIn = "1h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Function to verify and parse a JWT
export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as AuthUser;
    return decoded;
  } catch (error: any) {
    return null;
  }
}
