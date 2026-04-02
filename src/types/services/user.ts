import type { ProfileType } from "../enums/profile-type";

export interface UserPreferences {
  receiveEmailOffers: boolean;
  receiveWhatsappOffers: boolean;
}

export interface User {
  id: string;

  // Personal Information
  name: string;
  email: string;
  cellphone: string;
  document: string;

  avatarUrl?: string;
  preferences?: UserPreferences;

  profileType: ProfileType;

  createdAt: string;
  lastAccessAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  cellphone?: string;
  document?: string;
  password?: string;
  passwordConfirmation?: string;
  receiveEmailOffers?: boolean;
  receiveWhatsappOffers?: boolean;
  avatar?: File;
}

export interface UserAddress {
  id: string;

  addressTitle: string;

  receiverName: string;
  receiverLastname: string;
  contactCellphone: string;

  zipcode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  createdAt?: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;
}

export type RegisterAddressData = Omit<
  UserAddress,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

export interface UpdateAddressData {
  addressTitle?: string;

  receiverName?: string;
  receiverLastname?: string;
  contactCellphone?: string;

  zipcode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city?: string;
  state?: string;
}
