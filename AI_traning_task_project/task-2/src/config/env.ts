const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requireStrongSecret = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`${name} must be set`);
  }

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  const forbiddenMarkers = ["dev-", "change-me", "example", "secret"];
  const hasForbiddenMarker = forbiddenMarkers.some((marker) => lower.includes(marker));
  if (trimmed.length < 32 || hasForbiddenMarker) {
    throw new Error(`${name} must be a strong secret with at least 32 characters`);
  }

  return trimmed;
};

export const env = {
  port: toNumber(process.env.PORT, 3000),
  jwtAccessSecret: requireStrongSecret(process.env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requireStrongSecret(process.env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"),
  jwtIssuer: process.env.JWT_ISSUER?.trim() || "simple-auth-service",
  jwtAudience: process.env.JWT_AUDIENCE?.trim() || "simple-auth-clients",
  accessTokenTtlSeconds: toNumber(process.env.ACCESS_TOKEN_TTL_SECONDS, 900),
  refreshTokenTtlSeconds: toNumber(process.env.REFRESH_TOKEN_TTL_SECONDS, 604800)
};
