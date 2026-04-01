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

  async requestPasswordRecovery(email: string) {
    return await API.fetch("/auth/recovery/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async verifyRecoveryToken(email: string, token: string) {
    return await API.fetch("/auth/recovery/verify", {
      method: "POST",
      body: JSON.stringify({ email, token }),
    });
  },

  async resetPassword(email: string, token: string, newPassword: string) {
    return await API.fetch("/auth/recovery/reset", {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword }),
    });
  },
};
