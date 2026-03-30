/** biome-ignore-all lint/suspicious/useAwait: required to suppress linting errors */

import { API } from "@/api/connections/tallow";
import type { RegisterData } from "@/types/services/auth";
import type { ProfileType } from "@/types/enums/profile-type";
import type { UpdateUserData, User } from "@/types/services/user";

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

  async getClients(): Promise<User[]> {
    return await API.fetch("/user/admin/clients", {
      method: "GET",
    });
  },

  async getClientById(id: string): Promise<User> {
    return await API.fetch(`/user/admin/clients/${id}`, {
      method: "GET",
    });
  },

  async updateClient(id: string, data: UpdateUserData): Promise<User> {
    return await API.fetch(`/user/admin/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getAdmins(): Promise<User[]> {
    return await API.fetch("/user/admin/admins", {
      method: "GET",
    });
  },

  async getAdminById(id: string): Promise<User> {
    return await API.fetch(`/user/admin/admins/${id}`, {
      method: "GET",
    });
  },

  async updateProfileType(id: string, profileType: ProfileType): Promise<User> {
    return await API.fetch(`/user/admin/${id}/profile`, {
      method: "PUT",
      body: JSON.stringify({ profileType }),
    });
  },
};
