import { API } from "@/api/connections/tallow";
import type { AuthResponse, LoginData } from "@/types/services/auth";

export const authModule = {
  async login(data: LoginData): Promise<AuthResponse> {
    return await API.fetch("/auth", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(token: string) {
    return await API.fetch("/auth/revoke", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
