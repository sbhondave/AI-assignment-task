/**
 * Remediation for V-001 (CRITICAL): Eliminate weak/default JWT secrets.
 */

const toNumber = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// BEFORE:
// jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret"
// jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret"

// AFTER:
const requireStrongSecret = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  if (value.length < 32) {
    throw new Error(`${name} must be at least 32 characters`);
  }
  const lowered = value.toLowerCase();
  if (lowered.includes("dev-") || lowered.includes("change-me")) {
    throw new Error(`${name} appears to be insecure/default-like`);
  }
  return value;
};

export const env = {
  port: toNumber(process.env.PORT, 3000),
  jwtAccessSecret: requireStrongSecret("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requireStrongSecret("JWT_REFRESH_SECRET"),
  jwtIssuer: process.env.JWT_ISSUER || "auth-service",
  jwtAudience: process.env.JWT_AUDIENCE || "auth-clients",
  accessTokenTtlSeconds: toNumber(process.env.ACCESS_TOKEN_TTL_SECONDS, 900),
  refreshTokenTtlSeconds: toNumber(process.env.REFRESH_TOKEN_TTL_SECONDS, 604800),
};
