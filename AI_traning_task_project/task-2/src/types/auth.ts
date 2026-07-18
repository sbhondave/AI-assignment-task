export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface RefreshSession {
  id: string;
  userId: string;
  tokenHash: string;
  revoked: boolean;
  createdAt: string;
  replacedBySessionId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
