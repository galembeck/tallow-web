/** biome-ignore-all lint/suspicious/useAwait: required to suppress linting errors */

import { API } from "@/api/connections/tallow";
import type { RegisterData } from "@/types/services/auth";
import type { User } from "@/types/services/user";

export const userModule = {
  async register(data: RegisterData): Promise<User> {
    return API.fetch("/user", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe(token: string): Promise<User> {
    return await API.fetch("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // async updateUserData(data: UpdateUserData): Promise<User> {
  //   return fyno.fetch("/user", {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  // },
};
