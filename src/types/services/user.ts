export interface User {
  id: string;

  // Personal Information
  name: string;
  email: string;
  cellphone: string;
  document: string;

  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;

  createdAt: string;
  lastAccessAt?: string;
}

export interface UpdateUserData {
  // Personal Information
  name?: string;
  email?: string;

  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
