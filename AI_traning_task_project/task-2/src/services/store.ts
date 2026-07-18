import { RefreshSession, User } from "../types/auth";

export const usersByEmail = new Map<string, User>();
export const usersById = new Map<string, User>();
export const refreshSessionsById = new Map<string, RefreshSession>();

export const resetStore = (): void => {
  usersByEmail.clear();
  usersById.clear();
  refreshSessionsById.clear();
};
