/**
 * Remediation for V-003/V-004:
 * - Reduce account enumeration signals
 * - Enforce strict JWT verification constraints
 */

import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "./env";

type AccessClaims = JwtPayload & { sub: string; email: string; typ: "access" };
type RefreshClaims = JwtPayload & { sub: string; typ: "refresh" };

// BEFORE:
// - Distinct "Email already registered" responses leaked account existence.
// - verify() did not enforce strict algorithms/issuer/audience/type.

// AFTER:
export const buildPublicAuthFailure = () => ({
  error: "Invalid credentials",
});

export const verifyAccessToken = (token: string): AccessClaims => {
  const payload = jwt.verify(token, env.jwtAccessSecret, {
    algorithms: ["HS256"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  }) as AccessClaims;

  if (payload.typ !== "access") {
    throw new Error("Invalid token type");
  }
  return payload;
};

export const verifyRefreshToken = (token: string): RefreshClaims => {
  const payload = jwt.verify(token, env.jwtRefreshSecret, {
    algorithms: ["HS256"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  }) as RefreshClaims;

  if (payload.typ !== "refresh") {
    throw new Error("Invalid token type");
  }
  return payload;
};
