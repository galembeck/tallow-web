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
