import type { User } from "./user";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData extends Omit<
  User,
  "id" | "createdAt" | "lastAccessAt"
> {
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
