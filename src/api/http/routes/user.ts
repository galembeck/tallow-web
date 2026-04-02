/** biome-ignore-all lint/suspicious/useAwait: required to suppress linting errors */

import { API } from "@/api/connections/tallow";
import type { RegisterData } from "@/types/services/auth";
import type { ProfileType } from "@/types/enums/profile-type";
import type {
  RegisterAddressData,
  UpdateAddressData,
  UpdateProfileData,
  User,
  UserAddress,
} from "@/types/services/user";

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

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.cellphone !== undefined)
      formData.append("cellphone", data.cellphone);
    if (data.document !== undefined) formData.append("document", data.document);
    if (data.password !== undefined) formData.append("password", data.password);
    if (data.passwordConfirmation !== undefined)
      formData.append("passwordConfirmation", data.passwordConfirmation);
    if (data.receiveEmailOffers !== undefined)
      formData.append("receiveEmailOffers", String(data.receiveEmailOffers));
    if (data.receiveWhatsappOffers !== undefined)
      formData.append(
        "receiveWhatsappOffers",
        String(data.receiveWhatsappOffers),
      );
    if (data.avatar) formData.append("avatar", data.avatar);

    return await API.fetch("/user/me", {
      method: "PUT",
      body: formData,
    });
  },

  async registerAddress(data: RegisterAddressData): Promise<UserAddress> {
    return API.fetch("/user/address", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getUserAddresses(): Promise<UserAddress[]> {
    return await API.fetch("/user/address", {
      method: "GET",
    });
  },

  async getAddressById(addressId: string): Promise<UserAddress> {
    return await API.fetch(`/user/address/${addressId}`, {
      method: "GET",
    });
  },

  async updateAddress(
    addressId: string,
    data: UpdateAddressData,
  ): Promise<UserAddress> {
    return await API.fetch(`/user/address/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(addressId: string): Promise<void> {
    return await API.fetch(`/user/address/${addressId}`, {
      method: "DELETE",
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

  async updateClient(
    id: string,
    data: Pick<UpdateProfileData, "name" | "email">,
  ): Promise<User> {
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
