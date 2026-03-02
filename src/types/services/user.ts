import type { ProfileType } from "../enums/profile-type";

export interface User {
  id: string;

  // Personal Information
  name: string;
  email: string;
  cellphone: string;
  document: string;

  role: ProfileType;

  createdAt: string;
  lastAccessAt?: string;
}

export interface UpdateUserData {
  // Personal Information
  name?: string;
  email?: string;
}
