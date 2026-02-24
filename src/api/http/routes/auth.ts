import { API } from "@/api/connections/tallow";
import type { AuthResponse, LoginData } from "@/types/services/auth";

export const authModule = {
  async login(data: LoginData): Promise<AuthResponse> {
    return await API.fetch("/auth", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
