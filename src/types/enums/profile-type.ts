export const ProfileType = {
  ADMIN: 1,
  CLIENT: 2,
} as const;

export type ProfileType = (typeof ProfileType)[keyof typeof ProfileType];

export function profileTypeLabel(profileType: number | string): string {
  return Number(profileType) === ProfileType.ADMIN ? "Administrador" : "Cliente";
}
