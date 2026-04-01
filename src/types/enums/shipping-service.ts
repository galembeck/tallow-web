export const ShippingService = {
  PAC: 1,
  SEDEX: 2,
  JADLOG: 3,
  MINI_ENVIOS: 17,
  LOGGI: 31,
} as const;

export type ShippingService =
  (typeof ShippingService)[keyof typeof ShippingService];

export const ShippingServiceLabel: Record<ShippingService, string> = {
  [ShippingService.PAC]: "PAC",
  [ShippingService.SEDEX]: "SEDEX",
  [ShippingService.JADLOG]: "Jadlog",
  [ShippingService.MINI_ENVIOS]: "Mini Envios",
  [ShippingService.LOGGI]: "Loggi",
};

export function getShippingServiceLabel(category: ShippingService): string {
  return ShippingServiceLabel[category];
}
