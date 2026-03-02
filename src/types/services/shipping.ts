export interface CalculateShippingData {
  toZipCode: string;
  productId: string;
  quantity: number;
}

export interface ShippingInformation {
  carrierName: string;
  serviceName: string;
  price: number;
  deliveryTime: number;
  deliveryTimeLabel: string;
}
