import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthTokens, RefreshSession, User } from "../types/auth";
import { refreshSessionsById, usersByEmail, usersById } from "./store";

type AccessPayload = { sub: string; email: string };
type RefreshPayload = { sub: string; sid: string; typ: "refresh" };

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createId = (): string => crypto.randomUUID();

const signAccessToken = (user: User): string => {
  const payload: AccessPayload = { sub: user.id, email: user.email };
  return jwt.sign(payload, env.jwtAccessSecret, {
    algorithm: "HS256",
    expiresIn: env.accessTokenTtlSeconds,
    issuer: env.jwtIssuer,
    audience: env.jwtAudience
  });
};

const signRefreshToken = (userId: string, sessionId: string): string => {
  const payload: RefreshPayload = { sub: userId, sid: sessionId, typ: "refresh" };
  return jwt.sign(payload, env.jwtRefreshSecret, {
    algorithm: "HS256",
    expiresIn: env.refreshTokenTtlSeconds,
    issuer: env.jwtIssuer,
    audience: env.jwtAudience
  });
};

const createSession = (userId: string, refreshToken: string): RefreshSession => {
  const session: RefreshSession = {
    id: createId(),
    userId,
    tokenHash: hashToken(refreshToken),
    revoked: false,
    createdAt: new Date().toISOString()
  };
  refreshSessionsById.set(session.id, session);
  return session;
};

const buildTokens = (user: User): AuthTokens => {
  const placeholderSessionId = createId();
  const refreshToken = signRefreshToken(user.id, placeholderSessionId);
  const session = createSession(user.id, refreshToken);

  const validRefreshToken = signRefreshToken(user.id, session.id);
  session.tokenHash = hashToken(validRefreshToken);
  refreshSessionsById.set(session.id, session);

  return {
    accessToken: signAccessToken(user),
    refreshToken: validRefreshToken
  };
};

export const registerUser = async (email: string, password: string): Promise<AuthTokens> => {
  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    throw new Error("Email already registered");
  }

  const user: User = {
    id: createId(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString()
  };

  usersByEmail.set(user.email, user);
  usersById.set(user.id, user);

  return buildTokens(user);
};

export const loginUser = async (email: string, password: string): Promise<AuthTokens> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = usersByEmail.get(normalizedEmail);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  return buildTokens(user);
};

export const verifyAccessToken = (token: string): AccessPayload => {
  return jwt.verify(token, env.jwtAccessSecret, {
    algorithms: ["HS256"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience
  }) as AccessPayload;
};

export const rotateRefreshToken = (refreshToken: string): AuthTokens => {
  let payload: RefreshPayload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret, {
      algorithms: ["HS256"],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience
    }) as RefreshPayload;
  } catch {
    throw new Error("Invalid refresh token");
  }

  if (payload.typ !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  const session = refreshSessionsById.get(payload.sid);
  if (!session || session.revoked) {
    throw new Error("Refresh token revoked");
  }

  const providedHash = hashToken(refreshToken);
  if (session.tokenHash !== providedHash) {
    session.revoked = true;
    refreshSessionsById.set(session.id, session);
    throw new Error("Refresh token revoked");
  }

  const user = usersById.get(payload.sub);
  if (!user) {
    throw new Error("User not found");
  }

  session.revoked = true;
  const newRefreshSessionId = createId();
  session.replacedBySessionId = newRefreshSessionId;
  refreshSessionsById.set(session.id, session);

  const newRefreshToken = signRefreshToken(user.id, newRefreshSessionId);
  const newSession: RefreshSession = {
    id: newRefreshSessionId,
    userId: user.id,
    tokenHash: hashToken(newRefreshToken),
    revoked: false,
    createdAt: new Date().toISOString()
  };
  refreshSessionsById.set(newSession.id, newSession);

  return {
    accessToken: signAccessToken(user),
    refreshToken: newRefreshToken
  };
};

export const revokeRefreshToken = (refreshToken: string): void => {
  let payload: RefreshPayload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret, {
      algorithms: ["HS256"],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience
    }) as RefreshPayload;
  } catch {
    return;
  }

  if (payload.typ !== "refresh") {
    return;
  }

  const session = refreshSessionsById.get(payload.sid);
  if (!session) {
    return;
  }

  session.revoked = true;
  refreshSessionsById.set(session.id, session);
};

export const getUserProfile = (userId: string): Pick<User, "id" | "email" | "createdAt"> => {
  const user = usersById.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return { id: user.id, email: user.email, createdAt: user.createdAt };
};
