import { API } from "@/api/connections/tallow";
import type {
  CalculateCartShippingData,
  CalculateShippingData,
  ShippingInformation,
} from "@/types/services/shipping";

export const shippingModule = {
  async calculate(data: CalculateShippingData): Promise<ShippingInformation[]> {
    return await API.fetch("/shipping/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async calculateFastest(
    data: CalculateShippingData,
  ): Promise<ShippingInformation> {
    return await API.fetch("/shipping/calculate/fastest", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async calculateCart(
    data: CalculateCartShippingData,
  ): Promise<ShippingInformation[]> {
    return await API.fetch("/shipping/calculate/cart", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async calculateFastestCart(
    data: CalculateCartShippingData,
  ): Promise<ShippingInformation> {
    return await API.fetch("/shipping/calculate/cart/fastest", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
