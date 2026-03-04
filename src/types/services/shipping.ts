export interface CalculateShippingData {
  toZipCode: string;
  productId: string;
  quantity: number;
}

export interface CartShippingItem {
  productId: string;
  quantity: number;
}

export interface CalculateCartShippingData {
  toZipCode: string;
  items: CartShippingItem[];
}

export interface ShippingInformation {
  carrierName: string;
  serviceName: string;
  price: number;
  deliveryTime: number;
  deliveryTimeLabel: string;
}
